import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FiUpload, FiX, FiPlus, FiPlay, FiDownload, FiCheckCircle, FiAlertCircle, FiGlobe, FiRefreshCw } from 'react-icons/fi';

const BulkProcessor = ({ onNotification }) => {
    const [urls, setUrls] = useState(['']);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [summary, setSummary] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
        );
    }, []);

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
                .filter((v, i, a) => a.indexOf(v) === i); // deduplicate

            if (fileUrls.length > 20) {
                onNotification('Maximum 20 URLs allowed. Taking first 20.', 'warning');
                setUrls(fileUrls.slice(0, 20));
            } else if (fileUrls.length > 0) {
                setUrls(fileUrls);
                onNotification(`Imported ${fileUrls.length} URLs from file.`, 'success');
            } else {
                onNotification('No valid URLs found in file.', 'error');
            }
        };
        reader.readAsText(file);
    };

    const startBulkProcessing = async () => {
        const validUrls = urls.filter(url => url.trim().startsWith('http'));

        if (validUrls.length === 0) {
            onNotification('Please add at least one valid URL', 'error');
            return;
        }

        setProcessing(true);
        setProgress(0);
        setResults([]);
        setSummary(null);

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';

            const response = await fetch(`${API_URL}/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                                onNotification('Bulk extraction complete!', 'success');
                            }
                        } catch (e) {
                            console.error('SSE Parse Error:', e);
                        }
                    }
                }
            }

        } catch (error) {
            onNotification('Bulk processing failed: ' + error.message, 'error');
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
        link.download = `bulk-intelligence-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        onNotification('CSV exported successfully!', 'success');
    };

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto font-sans">
            {/* Search Header */}
            {!processing && results.length === 0 && (
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                        <FiRefreshCw className="animate-spin-slow" /> Multi-Target Extraction Engine
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4">
                        Bulk Intelligence.
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        Scan up to 20 domains simultaneously. Deep-extract contact nodes, social identities, and corporate profiles across multiple infrastructures in a single session.
                    </p>
                </div>
            )}

            {/* URL Input Area */}
            {!processing && results.length === 0 && (
                <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <h3 className="text-white text-xl font-bold italic tracking-tight">Data Targets ({urls.filter(u => u.trim()).length}/20)</h3>
                        <div className="flex gap-3 w-full md:w-auto">
                            {/* File Upload */}
                            <label className="flex-1 md:flex-none cursor-pointer flex items-center justify-center gap-2 px-6 py-3 
                bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest group">
                                <FiUpload className="group-hover:-translate-y-1 transition-transform" />
                                Upload CSV
                                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
                            </label>
                            <button
                                onClick={addUrl}
                                disabled={urls.length >= 20}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 
                  text-white rounded-2xl hover:bg-blue-700 transition-all text-xs font-bold uppercase tracking-widest
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                            >
                                <FiPlus /> Add Row
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-4 mb-8">
                        {urls.map((url, index) => (
                            <div key={index} className="flex gap-3 group">
                                <div className="flex-1 relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px]">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}.
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => updateUrl(index, e.target.value)}
                                        placeholder="https://example-domain.com"
                                        className="w-full pl-12 pr-6 py-4 bg-black/20 border border-white/5 
                        rounded-2xl text-white placeholder-slate-600 focus:outline-none 
                        focus:border-blue-500/50 transition-all text-sm font-mono"
                                    />
                                </div>
                                <button
                                    onClick={() => removeUrl(index)}
                                    className="p-4 bg-red-500/10 text-red-500 rounded-2xl 
                    hover:bg-red-500/20 transition-all opacity-40 group-hover:opacity-100"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={startBulkProcessing}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:scale-[1.02] transition-all 
              flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95"
                    >
                        <FiPlay className="text-xl" /> Initialize Extraction Sequence
                    </button>
                </div>
            )}

            {/* Progress & Live Logs */}
            {processing && (
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">Processing Batch.</h3>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Target Instance: {currentUrl || 'Establishing connection...'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-4xl font-black text-white italic tabular-nums">{progress}%</span>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 mb-8">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Mini Results Log */}
                    <div className="bg-black/40 rounded-3xl p-6 font-mono text-xs space-y-2 max-h-40 overflow-y-auto custom-scrollbar border border-white/5">
                        {results.map((res, i) => (
                            <div key={i} className="flex gap-4 border-b border-white/5 pb-2 last:border-0">
                                <span className={res.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                                    {res.status === 'success' ? '✔' : '✘'}
                                </span>
                                <span className="text-slate-500 truncate w-40">{res.url}</span>
                                {res.status === 'success' && (
                                    <span className="text-blue-400 italic">
                                        [{res.data.phones.length}p, {res.data.emails.length}e, {res.data.socialMedia ? 's' : ''}]
                                    </span>
                                )}
                            </div>
                        ))}
                        <div className="animate-pulse flex gap-4 text-blue-400/60">
                            <span>→</span>
                            <span>Extracting patterns from {currentUrl}...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Success', value: summary.successful, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { label: 'Failed', value: summary.failed, color: 'text-red-500', bg: 'bg-red-500/10' },
                        { label: 'Phones', value: summary.totalPhones, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Emails', value: summary.totalEmails, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                        { label: 'Sociab', value: summary.successful > 0 ? results.filter(r => r.status === 'success' && r.data.socialMedia).length : 0, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-3xl p-6 border border-white/5 text-center transition-transform hover:scale-105`}>
                            <p className={`text-3xl font-black ${stat.color} italic tracking-tighter`}>{stat.value}</p>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Final Results Table */}
            {results.length > 0 && !processing && (
                <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mb-20">
                    <div className="flex flex-col md:flex-row items-center justify-between p-8 border-b border-white/5 gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter">Extraction Report.</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Intelligence finalized: {results.length} nodes analyzed</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => { setResults([]); setUrls(['']); setSummary(null); }}
                                className="flex-1 md:flex-none px-6 py-3 bg-white/5 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-white/5"
                            >
                                Reset Workshop
                            </button>
                            <button
                                onClick={exportAllToCSV}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-600 
                  text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
                            >
                                <FiDownload /> Export CSV Report
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left font-sans">
                            <thead>
                                <tr className="bg-black/20">
                                    <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">Instance / Website</th>
                                    <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">Company Node</th>
                                    <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest text-center">Nodes</th>
                                    <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest text-center">Digital Path</th>
                                    <th className="p-6 text-gray-500 text-[10px] font-black uppercase tracking-widest">Status Matrix</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {results.map((result, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <FiGlobe className="text-blue-500" />
                                                </div>
                                                <a href={result.url} target="_blank" rel="noopener noreferrer"
                                                    className="text-white font-bold text-sm tracking-tight hover:text-blue-400 transition-colors truncate block max-w-[200px]">
                                                    {result.url.replace(/https?:\/\/(www\.)?/, '')}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-slate-400 text-sm font-medium italic truncate max-w-[150px]">
                                                {result.data?.companyInfo?.name || '- -'}
                                            </p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-white font-black text-xs">{result.data?.phones?.length || 0}</span>
                                                    <span className="text-[8px] text-slate-600 uppercase">ph</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/5 mx-1"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-white font-black text-xs">{result.data?.emails?.length || 0}</span>
                                                    <span className="text-[8px] text-slate-600 uppercase">em</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center flex-wrap gap-1 max-w-[120px] mx-auto">
                                                {result.data?.socialMedia && Object.entries(result.data.socialMedia)
                                                    .filter(([k, v]) => k !== 'whatsapp' && v)
                                                    .map(([platform], idx) => (
                                                        <span key={idx} className="w-2 h-2 rounded-full bg-blue-500" title={platform} />
                                                    ))
                                                }
                                                {result.data?.socialMedia?.whatsapp?.length > 0 && <span className="w-2 h-2 rounded-full bg-green-500" title="WhatsApp" />}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                {result.status === 'success' ? (
                                                    <FiCheckCircle className="text-green-500" />
                                                ) : (
                                                    <FiAlertCircle className="text-red-500" />
                                                )}
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${result.status === 'success' ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    {result.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkProcessor;
