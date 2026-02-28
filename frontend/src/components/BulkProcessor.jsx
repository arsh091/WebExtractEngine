import { useState, useRef, useEffect } from 'react';
import {
    FiUpload, FiX, FiPlus, FiPlay, FiDownload, FiCheckCircle,
    FiAlertCircle, FiGlobe, FiRefreshCw, FiArrowRight, FiActivity, FiLayers, FiSearch, FiDatabase
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BulkProcessor = ({ onNotification }) => {
    const [urls, setUrls] = useState(['']);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [summary, setSummary] = useState(null);

    const addUrl = () => {
        if (urls.length < 20) {
            setUrls([...urls, '']);
        }
    };

    const removeUrl = (index) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls.length > 0 ? newUrls : ['']);
    };

    const updateUrl = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const fileUrls = text.split('\n')
                .map(url => url.trim())
                .filter(url => url.startsWith('http'))
                .filter((v, i, a) => a.indexOf(v) === i);

            if (fileUrls.length > 20) {
                onNotification('Limit reached: 20 URLs maximum. Selecting first 20.', 'warning');
                setUrls(fileUrls.slice(0, 20));
            } else if (fileUrls.length > 0) {
                setUrls(fileUrls);
                onNotification(`Successfully imported ${fileUrls.length} URLs.`, 'success');
            } else {
                onNotification('No valid URLs found in file.', 'error');
            }
        };
        reader.readAsText(file);
    };

    const startBulkProcessing = async () => {
        const validUrls = urls.filter(url => url.trim().startsWith('http'));

        if (validUrls.length === 0) {
            onNotification('Please enter at least one valid URL.', 'error');
            return;
        }

        setProcessing(true);
        setProgress(0);
        setResults([]);
        setSummary(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ urls: validUrls })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim().startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.trim().slice(6));

                            if (data.type === 'progress') {
                                setProgress(data.percentage);
                                setCurrentUrl(data.url);
                                if (data.result) {
                                    setResults(prev => [...prev, data.result]);
                                }
                            } else if (data.type === 'complete') {
                                setSummary(data.summary);
                                setProgress(100);
                                onNotification('Bulk processing complete', 'success');
                            }
                        } catch (e) {
                            console.error('Parsing error:', e);
                        }
                    }
                }
            }

        } catch (error) {
            onNotification('Processing failed: ' + error.message, 'error');
        } finally {
            setProcessing(false);
        }
    };

    const exportAllToCSV = () => {
        let csv = 'URL,Status,Company,Phones,Emails,Addresses,Facebook,Instagram,Twitter,LinkedIn,YouTube,WhatsApp\n';

        results.forEach(result => {
            const d = result.data || {};
            const safe = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;

            csv += [
                safe(result.url),
                safe(result.status),
                safe(d.companyInfo?.name || ''),
                safe(d.phones?.join('; ') || ''),
                safe(d.emails?.join('; ') || ''),
                safe(d.addresses?.join('; ') || ''),
                safe(d.socialMedia?.facebook || ''),
                safe(d.socialMedia?.instagram || ''),
                safe(d.socialMedia?.twitter || ''),
                safe(d.socialMedia?.linkedin || ''),
                safe(d.socialMedia?.youtube || ''),
                safe(d.socialMedia?.whatsapp?.map(w => w.number).join('; ') || ''),
            ].join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bulk-extraction-${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        onNotification('Data exported to CSV', 'success');
    };

    return (
        <div className="w-full max-w-7xl mx-auto font-sans">
            {/* Header */}
            {!processing && results.length === 0 && (
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-xs font-semibold mb-6">
                        <FiLayers className="w-3.5 h-3.5" /> Cluster Mode
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
                        Bulk <span className="text-[var(--primary-blue)]">Extraction</span> Cluster
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
                        Scale your data gathering. Process up to 20 URLs simultaneously with high-speed parallel extraction nodes.
                    </p>
                </div>
            )}

            {/* URL Input Area */}
            {!processing && results.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pro-card p-8 md:p-12 bg-white border border-[var(--border-color)] overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                        <div>
                            <h3 className="text-[var(--text-primary)] text-2xl font-bold mb-1">Target Queue</h3>
                            <p className="text-[var(--text-secondary)] text-sm font-medium">{urls.filter(u => u.trim()).length} / 20 active nodes</p>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <label className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 
                bg-white border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all text-sm font-semibold shadow-sm">
                                <FiUpload size={16} />
                                Import File
                                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
                            </label>
                            <button
                                onClick={addUrl}
                                disabled={urls.length >= 20}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[var(--border-color)] 
                  text-[var(--text-primary)] rounded-xl hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all text-sm font-semibold
                  disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                                <FiPlus size={16} /> Add Node
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 mb-10 custom-scrollbar-pro">
                        {urls.map((url, index) => (
                            <div key={index} className="flex gap-3 group">
                                <div className="flex-1 relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-bold text-[10px] tracking-wider opacity-40">
                                        NODE {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full pl-20 pr-5 py-4 bg-[var(--bg-secondary)] border border-transparent 
                        rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none 
                        focus:ring-2 focus:ring-[var(--primary-blue)]/10 focus:bg-white transition-all text-sm font-semibold shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => removeUrl(index)}
                                    className="p-4 text-[var(--text-secondary)] rounded-xl hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={startBulkProcessing}
                        className="pro-button pro-button-primary w-full py-4 text-base font-bold shadow-lg"
                    >
                        <FiPlay size={18} /> Run Cluster Extraction
                    </button>
                </motion.div>
            )}

            {/* Progress & Live Logs */}
            {processing && (
                <div className="pro-card p-10 md:p-16 bg-[var(--text-primary)] text-white shadow-2xl border-none overflow-hidden relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.05] pointer-events-none"></div>

                    <div className="relative z-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                            <div>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Processing Cluster</h3>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-[var(--primary-blue)] text-sm font-semibold">
                                    <div className="w-2 h-2 bg-[var(--primary-blue)] rounded-full animate-pulse shadow-[0_0_10px_var(--primary-blue)]"></div>
                                    Active: <span className="text-white/60 truncate max-w-[200px] md:max-w-xs">{currentUrl || 'Initializing...'}</span>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <span className="text-6xl md:text-7xl font-bold text-[var(--primary-blue)] tabular-nums">{Math.round(progress)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-12">
                            <motion.div
                                className="h-full bg-[var(--primary-blue)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>

                        {/* Results Log */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 space-y-3 max-h-72 overflow-y-auto border border-white/10 custom-scrollbar-pro">
                            {results.length === 0 && (
                                <div className="flex items-center justify-center py-12 gap-3 text-white/30">
                                    <FiRefreshCw className="animate-spin" size={18} />
                                    <span className="text-xs font-semibold tracking-wider">ESTABLISHING CONNECTIONS...</span>
                                </div>
                            )}
                            {results.map((res, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="flex gap-4 border-b border-white/5 pb-3 last:border-0 items-center"
                                >
                                    <div className={`w-2 h-2 rounded-full ${res.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                    <span className={`font-bold text-[10px] w-14 ${res.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {res.status.toUpperCase()}
                                    </span>
                                    <span className="text-white/50 text-xs font-medium truncate flex-1">{res.url.replace(/https?:\/\//, '')}</span>
                                    {res.status === 'success' && (
                                        <span className="text-[var(--primary-blue)] font-bold text-[10px] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                            {res.data.phones.length + res.data.emails.length} DATA POINTS
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            {summary && !processing && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                    {[
                        { label: 'Validated', value: summary.successful, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Failed', value: summary.failed, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Phones', value: summary.totalPhones, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Emails', value: summary.totalEmails, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Social', value: results.filter(r => r.status === 'success' && r.data.socialMedia).length, color: 'text-sky-600', bg: 'bg-sky-50' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-2xl p-6 border border-transparent shadow-sm flex flex-col items-center justify-center text-center`}>
                            <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider opacity-60">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Final Results Table */}
            {results.length > 0 && !processing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pro-card bg-white border border-[var(--border-color)] overflow-hidden mb-16"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between p-8 border-b border-[var(--border-color)] gap-6 bg-[var(--bg-secondary)]/30 backdrop-blur-sm">
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Extraction Summary</h3>
                            <p className="text-[var(--text-secondary)] text-sm font-medium">{results.length} domains processed</p>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <button
                                onClick={() => { setResults([]); setUrls(['']); setSummary(null); }}
                                className="flex-1 lg:flex-none px-6 py-2.5 bg-white text-[var(--text-secondary)] font-semibold rounded-xl text-sm border border-[var(--border-color)] hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                            >
                                Clear Results
                            </button>
                            <button
                                onClick={exportAllToCSV}
                                className="pro-button pro-button-primary flex-1 lg:flex-none"
                            >
                                <FiDownload size={16} /> Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                                    <th className="px-8 py-4 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider opacity-60">Domain Asset</th>
                                    <th className="px-8 py-4 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider opacity-60">Data Layers</th>
                                    <th className="px-8 py-4 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider opacity-60 text-center">Results</th>
                                    <th className="px-8 py-4 text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider opacity-60 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {results.map((result, i) => (
                                    <tr key={i} className="hover:bg-[var(--bg-secondary)]/30 transition-colors group/tr">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[var(--border-color)] shadow-sm group-hover/tr:bg-[var(--primary-blue)] group-hover/tr:text-white transition-all">
                                                    <FiGlobe size={18} />
                                                </div>
                                                <div className="max-w-[150px] md:max-w-xs overflow-hidden">
                                                    <p className="text-[var(--text-primary)] font-bold truncate leading-tight">
                                                        {result.url.replace(/https?:\/\/(www\.)?/, '')}
                                                    </p>
                                                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold truncate opacity-60 mt-0.5">
                                                        {result.data?.companyInfo?.name || 'Standard Site'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {result.data?.socialMedia && (
                                                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 text-[9px] font-bold border border-sky-100">SOCIAL</span>
                                                )}
                                                {result.data?.companyInfo && (
                                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-bold border border-indigo-100">COMPANY</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-[var(--text-primary)] font-bold text-base leading-none tabular-nums">{result.data?.phones?.length || 0}</p>
                                                    <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase opacity-40 mt-1">Phone</p>
                                                </div>
                                                <div className="w-px h-6 bg-[var(--border-color)]"></div>
                                                <div className="text-center">
                                                    <p className="text-[var(--text-primary)] font-bold text-base leading-none tabular-nums">{result.data?.emails?.length || 0}</p>
                                                    <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase opacity-40 mt-1">Mail</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center">
                                                {result.status === 'success' ? (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shadow-sm">
                                                        <FiCheckCircle size={12} />
                                                        <span className="text-[10px] font-bold uppercase">Success</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100 shadow-sm">
                                                        <FiAlertCircle size={12} />
                                                        <span className="text-[10px] font-bold uppercase">Error</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BulkProcessor;
