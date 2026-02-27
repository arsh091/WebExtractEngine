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
        <div className="w-full max-w-7xl mx-auto font-sans px-6">
            {/* Header */}
            {!processing && results.length === 0 && (
                <div className="text-center mb-20 pt-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <FiLayers /> Enterprise Batch Protocol
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter mb-6 uppercase italic">
                        Batch <span className="text-[var(--primary-blue)]">Processing</span> Engine
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-3xl mx-auto text-xl font-medium leading-relaxed opacity-60">
                        Scale your intel acquisition. Deploy up to 20 parallel extraction nodes simultaneously for high-throughput data harvesting.
                    </p>
                </div>
            )}

            {/* URL Input Area */}
            {!processing && results.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pro-card p-10 md:p-16 bg-white border border-[var(--border-color)] shadow-2xl rounded-[3rem] relative overflow-hidden group"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 relative z-10">
                        <div>
                            <h3 className="text-[var(--text-primary)] text-3xl font-black uppercase tracking-tight italic mb-2">Target Acquisition Queue</h3>
                            <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{urls.filter(u => u.trim()).length} / 20 NODES ACTIVE</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <label className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-3 px-8 py-4 
                bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group shadow-sm">
                                <FiUpload size={16} />
                                Import Dataset
                                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
                            </label>
                            <button
                                onClick={addUrl}
                                disabled={urls.length >= 20}
                                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] 
                  text-[var(--text-primary)] rounded-2xl hover:bg-white transition-all text-[10px] font-black uppercase tracking-[0.2em]
                  disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                                <FiPlus size={16} /> Append Node
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-6 mb-12 relative z-10 custom-scrollbar-pro">
                        {urls.map((url, index) => (
                            <div key={index} className="url-row flex gap-4 group/row">
                                <div className="flex-1 relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-black text-[10px] tracking-widest opacity-30">
                                        NODE_{index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                        placeholder="HTTPS://TARGET-INFRASTRUCTURE.COM"
                                        className="w-full pl-24 pr-8 py-5 bg-[var(--bg-secondary)] border border-transparent 
                        rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none 
                        focus:border-[var(--primary-blue)]/30 focus:bg-white transition-all text-sm font-bold uppercase tracking-tight shadow-inner"
                                    />
                                </div>
                                <button
                                    onClick={() => removeUrl(index)}
                                    className="p-5 text-red-500/30 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover/row:opacity-100 border border-transparent hover:border-red-100"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={startBulkProcessing}
                        className="pro-button-primary w-full py-8 flex items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/30 rounded-3xl active:scale-[0.98] transition-transform"
                    >
                        <FiPlay size={24} /> Execute Master Batch Sequence
                    </button>
                </motion.div>
            )}

            {/* Progress & Live Logs */}
            {processing && (
                <div className="pro-card p-12 md:p-20 bg-black text-white shadow-2xl rounded-[4rem] border-none overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-[0.03] pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-10">
                            <div>
                                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-6">Processing Batch</h3>
                                <div className="flex items-center gap-4 text-[var(--primary-blue)] text-xs font-black uppercase tracking-[0.3em]">
                                    <div className="w-2 h-2 bg-[var(--primary-blue)] rounded-full animate-ping"></div>
                                    Current Channel: <span className="text-white/60 truncate max-w-xs">{currentUrl || 'Initializing Protocol...'}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-8xl font-black text-[var(--primary-blue)] leading-none tracking-tighter tabular-nums italic">{Math.round(progress)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-16 relative border border-white/10 p-1">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[var(--primary-blue)] via-blue-400 to-[var(--primary-blue)] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                        </div>

                        {/* Mini Results Log */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 space-y-4 max-h-80 overflow-y-auto border border-white/10 custom-scrollbar-pro">
                            {results.length === 0 && (
                                <div className="flex items-center justify-center py-20 gap-4 text-white/30">
                                    <FiRefreshCw className="animate-spin" size={20} />
                                    <span className="uppercase font-black text-[10px] tracking-[0.4em]">Establishing Secure Uplinks...</span>
                                </div>
                            )}
                            {results.map((res, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="flex gap-6 border-b border-white/5 pb-4 last:border-0 items-center"
                                >
                                    <div className={`w-3 h-3 rounded-full ${res.status === 'success' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}></div>
                                    <span className={`font-black uppercase tracking-[0.2em] w-20 text-[10px] ${res.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {res.status === 'success' ? 'VALID' : 'ERROR'}
                                    </span>
                                    <span className="text-white/50 text-xs font-bold truncate flex-1 uppercase tracking-wider">{res.url.replace(/https?:\/\//, '')}</span>
                                    {res.status === 'success' && (
                                        <span className="text-[var(--primary-blue)] font-black text-[10px] uppercase tracking-[0.2em] bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                                            {res.data.phones.length + res.data.emails.length} NODES
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            {summary && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12"
                >
                    {[
                        { label: 'Validated', value: summary.successful, color: 'text-emerald-600', icon: FiCheckCircle, bg: 'bg-emerald-50' },
                        { label: 'Rejected', value: summary.failed, color: 'text-red-600', icon: FiAlertCircle, bg: 'bg-red-50' },
                        { label: 'Comm Nodes', value: summary.totalPhones, color: 'text-blue-600', icon: FiActivity, bg: 'bg-blue-50' },
                        { label: 'Intel Gateways', value: summary.totalEmails, color: 'text-indigo-600', icon: FiGlobe, bg: 'bg-indigo-50' },
                        { label: 'Digital Sync', value: results.filter(r => r.status === 'success' && r.data.socialMedia).length, color: 'text-sky-600', icon: FiSearch, bg: 'bg-sky-50' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-[2rem] p-8 border border-transparent shadow-xl flex flex-col items-center justify-center text-center`}>
                            <p className={`text-4xl font-black ${stat.color} mb-2 italic tracking-tighter`}>{stat.value}</p>
                            <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Final Results Table */}
            {results.length > 0 && !processing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pro-card bg-white border border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-hidden mb-32"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-between p-12 border-b border-[var(--border-color)] gap-8 bg-[var(--bg-secondary)]/30 backdrop-blur-sm">
                        <div>
                            <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight uppercase italic mb-2">Extraction Summary</h3>
                            <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{results.length} INDEPENDENT DOMAINS PROCESSED</p>
                        </div>
                        <div className="flex gap-4 w-full lg:w-auto">
                            <button
                                onClick={() => { setResults([]); setUrls(['']); setSummary(null); }}
                                className="flex-1 lg:flex-none px-8 py-4 bg-white text-[var(--text-secondary)] font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-red-500 hover:border-red-500 border border-[var(--border-color)] transition-all shadow-sm"
                            >
                                Purge Session
                            </button>
                            <button
                                onClick={exportAllToCSV}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-black text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--primary-blue)] transition-all shadow-2xl shadow-blue-600/20"
                            >
                                <FiDownload size={18} /> Export Master CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                                    <th className="p-8 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Master Asset</th>
                                    <th className="p-8 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Layer Sync</th>
                                    <th className="p-8 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-center">Data Points</th>
                                    <th className="p-8 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-center">Integrity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {results.map((result, i) => (
                                    <tr key={i} className="hover:bg-[var(--bg-secondary)]/30 transition-colors group/tr">
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[var(--border-color)] shadow-sm group-hover/tr:bg-[var(--primary-blue)] group-hover/tr:text-white transition-all">
                                                    <FiGlobe size={20} />
                                                </div>
                                                <div className="max-w-[200px] md:max-w-md">
                                                    <p className="text-[var(--text-primary)] font-black uppercase tracking-tight truncate leading-tight italic">
                                                        {result.url.replace(/https?:\/\/(www\.)?/, '')}
                                                    </p>
                                                    <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-widest opacity-60 mt-1">
                                                        {result.data?.companyInfo?.name || 'GENERIC INFRASTRUCTURE'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-wrap gap-2">
                                                {result.data?.socialMedia && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-sky-50 text-sky-600 text-[9px] font-black uppercase tracking-widest border border-sky-100">SOCIAL_LAYER</span>
                                                )}
                                                {result.data?.companyInfo && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest border border-indigo-100">CORP_LAYER</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center justify-center gap-6">
                                                <div className="text-center">
                                                    <p className="text-[var(--text-primary)] font-black text-xl italic leading-none tabular-nums">{result.data?.phones?.length || 0}</p>
                                                    <p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] opacity-40 mt-2">Comm</p>
                                                </div>
                                                <div className="w-px h-8 bg-[var(--border-color)]"></div>
                                                <div className="text-center">
                                                    <p className="text-[var(--text-primary)] font-black text-xl italic leading-none tabular-nums">{result.data?.emails?.length || 0}</p>
                                                    <p className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] opacity-40 mt-2">Intel</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center justify-center">
                                                {result.status === 'success' ? (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shadow-sm">
                                                        <FiCheckCircle size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-2xl border border-red-100 shadow-sm">
                                                        <FiAlertCircle size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Error</span>
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
