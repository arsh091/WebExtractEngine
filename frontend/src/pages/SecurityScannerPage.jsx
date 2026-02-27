import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiSearch, FiCheckCircle, FiAlertTriangle, FiArrowLeft, FiLock, FiAlertCircle, FiActivity, FiCpu } from 'react-icons/fi';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SecurityScannerPage = ({ onBack }) => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (e) => {
        e?.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setScanResult(null);

        try {
            const res = await axios.post(`${API_URL}/security/scan`, { url });
            if (res.data.success) {
                setScanResult(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Security infrastructure unavailable');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyles = (sev) => {
        switch (sev) {
            case 'CRITICAL': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: <FiAlertCircle /> };
            case 'HIGH': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: <FiAlertTriangle /> };
            case 'MEDIUM': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: <FiActivity /> };
            default: return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: <FiShield /> };
        }
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-emerald-600';
        if (grade.startsWith('B')) return 'text-blue-600';
        if (grade.startsWith('C')) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-10 font-sans"
        >
            {/* Header Area */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-blue)] mb-12 hover:translate-x-[-8px] transition-transform group"
                >
                    <FiArrowLeft className="group-hover:scale-125 transition-transform" /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl">
                                <FiShield size={24} />
                            </div>
                            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Postural Integrity Check</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 italic">Infrastructure <span className="text-[var(--primary-blue)]">Audit</span></h2>
                        <p className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed opacity-60">Analyze target endpoints for SSL compliance, header fortification, and architectural vulnerabilities.</p>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="max-w-5xl mx-auto mb-24">
                <form onSubmit={handleScan} className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative pro-card p-1 bg-white rounded-[3rem] shadow-2xl flex items-center overflow-hidden border border-[var(--border-color)]">
                        <FiSearch className="ml-10 text-[var(--text-secondary)] text-2xl opacity-30" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="TARGET DOMAIN (HTTPS://...)"
                            className="w-full pl-6 pr-10 py-10 bg-transparent text-xl font-black text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none uppercase tracking-tight"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="mr-4 px-12 py-7 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center gap-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    Initiate Audit <FiArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center text-red-500 text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <FiAlertCircle className="inline mr-2" /> {error}
                    </motion.p>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!scanResult && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-32 bg-[var(--bg-secondary)]/50 rounded-[4rem] border border-dashed border-[var(--border-color)]"
                    >
                        <div className="w-24 h-24 rounded-[2rem] bg-white border border-[var(--border-color)] flex items-center justify-center mx-auto mb-10 text-[var(--text-secondary)] shadow-xl opacity-30">
                            <FiLock size={40} />
                        </div>
                        <h3 className="text-[var(--text-primary)] text-xl font-black uppercase tracking-widest mb-4">Node Offline</h3>
                        <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm font-medium leading-relaxed opacity-50 uppercase tracking-widest">
                            Provide an authorized endpoint to initiate postural assessment protocol.
                        </p>
                    </motion.div>
                )}

                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                    >
                        {/* Summary Block */}
                        <div className="lg:col-span-4 space-y-10">
                            <div className="bg-white rounded-[3.5rem] p-16 border border-[var(--border-color)] text-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--primary-blue)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.4em] mb-10 opacity-40 italic">Assurance Rating</h3>
                                <div className={`text-[12rem] font-black italic tracking-tighter mb-4 leading-none ${getGradeColor(scanResult.grade)}`}>
                                    {scanResult.grade}
                                </div>
                                <div className="text-[var(--text-primary)] text-5xl font-black tracking-tighter mb-4 italic">
                                    {scanResult.securityScore}<span className="text-[var(--text-secondary)] opacity-20">/100</span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Integrity Score</p>
                            </div>

                            <div className="bg-white rounded-[3rem] p-12 border border-[var(--border-color)] shadow-xl">
                                <h3 className="text-[var(--text-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 italic">
                                    <FiCheckCircle className="text-emerald-500" /> Layer Sync: SSL
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Validity', val: scanResult.ssl.valid ? 'Verified' : 'Bypassed', color: scanResult.ssl.valid ? 'text-emerald-600' : 'text-red-500' },
                                        { label: 'Expiration', val: new Date(scanResult.ssl.validTo).toLocaleDateString(), color: 'text-[var(--text-primary)]' },
                                        { label: 'Life Cycle', val: `${scanResult.ssl.daysRemaining} Rem.`, color: 'text-[var(--primary-blue)]' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                            <span className="text-[var(--text-secondary)] uppercase tracking-[0.3em] font-black text-[9px] opacity-40">{item.label}</span>
                                            <span className={`font-black text-[11px] uppercase tracking-tight italic ${item.color}`}>{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details Block */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-white rounded-[4rem] p-16 border border-[var(--border-color)] shadow-2xl">
                                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-12 flex items-center gap-5 uppercase italic">
                                    <FiAlertTriangle className="text-amber-500" /> Vulnerability Assessment
                                </h3>
                                <div className="space-y-8">
                                    {scanResult.vulnerabilities.map((vuln, i) => {
                                        const style = getSeverityStyles(vuln.severity);
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={i}
                                                className="p-10 bg-[var(--bg-secondary)]/30 rounded-[2.5rem] border border-[var(--border-color)] group hover:bg-white hover:shadow-2xl transition-all duration-500"
                                            >
                                                <div className="flex items-start justify-between gap-8 mb-6">
                                                    <div>
                                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] mb-4 inline-block ${style.bg} ${style.text} border ${style.border} shadow-sm`}>
                                                            {vuln.severity} PRIORITY
                                                        </span>
                                                        <h4 className="text-[var(--text-primary)] font-black text-2xl tracking-tighter uppercase italic">{vuln.type}</h4>
                                                    </div>
                                                    <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center ${style.text} border ${style.border} text-2xl shadow-inner`}>
                                                        {style.icon}
                                                    </div>
                                                </div>
                                                <p className="text-[var(--text-secondary)] text-base font-medium mb-8 leading-relaxed opacity-70 italic">{vuln.description}</p>
                                                <div className="pt-8 border-t border-[var(--border-color)]/50">
                                                    <p className="text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-[0.4em] mb-4 italic">Remediation Protocol</p>
                                                    <p className="text-black/80 text-xs font-bold bg-white p-6 rounded-2xl border border-[var(--border-color)] font-mono leading-loose shadow-inner">
                                                        {vuln.remediation}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    {scanResult.vulnerabilities.length === 0 && (
                                        <div className="text-center py-24 px-12 bg-emerald-50 rounded-[3rem] border border-emerald-100 shadow-inner">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-emerald-100">
                                                <FiCheckCircle className="text-emerald-500 text-4xl" />
                                            </div>
                                            <p className="text-emerald-900 font-black text-2xl uppercase tracking-tighter italic">Zero Threats Detected</p>
                                            <p className="text-emerald-700/50 text-[10px] font-black mt-4 uppercase tracking-[0.4em]">Postural integrity at 100%</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-16 border border-[var(--border-color)] shadow-2xl">
                                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-12 flex items-center gap-5 uppercase italic">
                                    <FiActivity className="text-[var(--primary-blue)]" /> Header Security Matrix
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {Object.entries(scanResult.headers).map(([name, data]) => (
                                        <div key={name} className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-transparent transition-all hover:bg-white hover:shadow-xl hover:border-[var(--border-color)] group">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 truncate pr-6 italic">{name}</span>
                                                <div className={`w-3 h-3 rounded-full ${data.present ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} transition-transform group-hover:scale-125`}></div>
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${data.present ? 'text-[var(--primary-blue)]' : 'text-red-500/60'}`}>
                                                {data.present ? 'VERIFIED_OK' : 'NULL_TARGET_HEADER'}
                                            </p>
                                            {data.present && data.value && (
                                                <div className="mt-6 p-4 bg-white/50 rounded-xl text-[9px] font-bold text-[var(--text-secondary)] break-all border border-[var(--border-color)]/30 leading-loose italic opacity-60">
                                                    {data.value}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SecurityScannerPage;
