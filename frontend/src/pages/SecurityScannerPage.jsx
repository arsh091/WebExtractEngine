import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiSearch, FiCheckCircle, FiAlertTriangle, FiArrowLeft, FiLock, FiAlertCircle, FiActivity, FiGlobe, FiCommand, FiInfo, FiServer, FiExternalLink } from 'react-icons/fi';
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
            setError(err.response?.data?.error || 'Security analysis service is currently unavailable');
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
        if (!grade) return 'text-[var(--text-secondary)]';
        if (grade.startsWith('A')) return 'text-emerald-600';
        if (grade.startsWith('B')) return 'text-blue-600';
        if (grade.startsWith('C')) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-32 font-sans"
        >
            {/* Header */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--primary-blue)] mb-8 hover:-translate-x-1 transition-all group"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Home
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-[10px] font-black uppercase tracking-widest mb-6">
                            <FiShield className="w-3.5 h-3.5" /> Security Analysis
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Website <span className="text-[var(--primary-blue)]">Security</span> Scan
                        </h2>
                        <p className="text-[var(--text-secondary)] text-lg font-bold leading-relaxed opacity-60">
                            Perform a comprehensive analysis of website infrastructure, SSL configuration, and security headers to identify potential vulnerabilities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="max-w-4xl mx-auto mb-20">
                <form onSubmit={handleScan} className="relative">
                    <div className="bg-white p-2 rounded-2xl border border-[var(--border-color)] shadow-xl flex flex-col md:flex-row items-center gap-2 overflow-hidden">
                        <div className="flex-1 flex items-center px-6 w-full">
                            <FiSearch className="text-[var(--text-secondary)] opacity-30 text-xl" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-4 py-6 bg-transparent text-[var(--text-primary)] font-bold placeholder-[var(--text-secondary)]/30 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="pro-button pro-button-primary px-12 py-5 w-full md:w-auto h-full min-h-[64px] text-sm whitespace-nowrap active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Analyzing...
                                </div>
                            ) : 'Run Analysis'}
                        </button>
                    </div>
                </form>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center text-red-500 text-[10px] font-black uppercase tracking-widest"
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
                        className="text-center py-32 bg-white rounded-[3rem] border border-[var(--border-color)] shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-6 text-[var(--primary-blue)] shadow-sm">
                            <FiLock size={24} />
                        </div>
                        <h3 className="text-[var(--text-primary)] text-2xl font-black mb-2 uppercase tracking-tight">System Ready</h3>
                        <p className="text-[var(--text-secondary)] text-base font-bold opacity-40 max-w-sm mx-auto">
                            Enter a destination URL above to initialize a security integrity scan.
                        </p>
                    </motion.div>
                )}

                {scanResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="pro-card p-12 text-center bg-white border border-[var(--border-color)]">
                                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-10 opacity-30">Security Grade</p>
                                <div className={`text-9xl font-black tracking-tighter mb-6 leading-none ${getGradeColor(scanResult.grade)}`}>
                                    {scanResult.grade}
                                </div>
                                <div className="text-[var(--text-primary)] text-5xl font-black mb-1">
                                    {scanResult.securityScore}<span className="text-xl text-[var(--text-secondary)] opacity-30 font-bold">/100</span>
                                </div>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">Global Safety Score</p>
                            </div>

                            <div className="pro-card p-10 bg-white border border-[var(--border-color)]">
                                <h3 className="text-sm font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-tight">
                                    <FiCheckCircle className="text-emerald-500" /> SSL Certificate
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Status', val: scanResult.ssl.valid ? 'Active' : 'Expired', color: scanResult.ssl.valid ? 'text-emerald-600' : 'text-red-500' },
                                        { label: 'Expires', val: new Date(scanResult.ssl.validTo).toLocaleDateString(), color: 'text-[var(--text-primary)]' },
                                        { label: 'Remaining', val: `${scanResult.ssl.daysRemaining} Days`, color: 'text-[var(--primary-blue)]' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{item.label}</span>
                                            <span className={`text-[11px] font-black ${item.color}`}>{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="pro-card p-10 md:p-16 bg-white border border-[var(--border-color)]">
                                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-12 flex items-center gap-4 uppercase tracking-tight leading-none">
                                    <FiAlertTriangle className="text-amber-500" /> Critical Findings
                                </h3>
                                <div className="space-y-8">
                                    {scanResult.vulnerabilities.map((vuln, i) => {
                                        const style = getSeverityStyles(vuln.severity);
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={i}
                                                className="p-8 bg-[var(--bg-secondary)] rounded-[2rem] border border-transparent hover:border-[var(--border-color)] hover:bg-white hover:shadow-2xl transition-all duration-300"
                                            >
                                                <div className="flex items-start justify-between gap-6 mb-8">
                                                    <div>
                                                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black mb-4 inline-block uppercase tracking-widest ${style.bg} ${style.text} border ${style.border}`}>
                                                            {vuln.severity}
                                                        </span>
                                                        <h4 className="text-[var(--text-primary)] font-black text-2xl tracking-tight uppercase leading-none">{vuln.type}</h4>
                                                    </div>
                                                    <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center ${style.text} border ${style.border} text-xl shadow-sm`}>
                                                        {style.icon}
                                                    </div>
                                                </div>
                                                <p className="text-[var(--text-secondary)] text-lg font-bold mb-10 leading-relaxed opacity-60 tracking-tight">{vuln.description}</p>
                                                <div className="pt-8 border-t border-[var(--border-color)]">
                                                    <p className="text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-widest mb-4 opacity-40">Remediation Guide</p>
                                                    <div className="bg-white p-6 rounded-2xl border border-[var(--border-color)] font-bold text-xs text-[var(--text-primary)] leading-relaxed shadow-sm">
                                                        {vuln.remediation}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    {scanResult.vulnerabilities.length === 0 && (
                                        <div className="text-center py-20 px-10 bg-emerald-50/50 border border-emerald-100 rounded-[3rem]">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-md border border-emerald-100">
                                                <FiCheckCircle className="text-emerald-500 text-3xl" />
                                            </div>
                                            <h4 className="text-emerald-900 font-black text-3xl tracking-tight uppercase">Safe Configuration</h4>
                                            <p className="text-emerald-700 font-bold text-base mt-4 opacity-70">No critical vulnerabilities detected on this domain.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pro-card p-10 md:p-16 bg-white border border-[var(--border-color)]">
                                <h3 className="text-2xl font-black text-[var(--text-primary)] mb-12 flex items-center gap-4 uppercase tracking-tight leading-none">
                                    <FiActivity className="text-[var(--primary-blue)]" /> Security Headers
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(scanResult.headers).map(([name, data]) => (
                                        <div key={name} className="p-8 bg-[var(--bg-secondary)] rounded-2xl border border-transparent transition-all hover:bg-white hover:shadow-2xl hover:border-[var(--border-color)]">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-[9px] font-black text-[var(--text-secondary)] truncate pr-4 opacity-40 uppercase tracking-widest">{name}</span>
                                                <div className={`w-3 h-3 rounded-full ${data.present ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`}></div>
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${data.present ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {data.present ? 'Verified' : 'Missing Requirement'}
                                            </p>
                                            {data.present && data.value && (
                                                <div className="mt-6 p-4 bg-white/50 rounded-xl text-[9px] font-bold text-[var(--text-secondary)] break-all border border-[var(--border-color)]/30 leading-normal font-mono opacity-60">
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
