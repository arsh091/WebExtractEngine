import { useState, useRef, useEffect } from 'react';
import {
    FiShield, FiGlobe, FiServer, FiLock, FiActivity,
    FiLayout, FiCpu, FiHash, FiZap, FiTarget, FiArrowLeft, FiMonitor, FiMapPin, FiSearch, FiCode, FiArrowRight, FiCommand, FiGrid, FiLayers
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdvancedScanner = ({ onBack, onOpenAuth }) => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleScan = async () => {
        if (!url) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/security/advanced-scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            if (data.success) {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Scan failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const DataRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-center justify-between py-5 border-b border-[var(--border-color)]/30 last:border-0 group">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm border border-transparent group-hover:border-black">
                    <Icon size={16} />
                </div>
                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em] opacity-40">{label}</span>
            </div>
            <span className="text-xs font-black text-[var(--text-primary)] truncate max-w-[200px] tracking-tight">{isAuthenticated ? (value || 'Not Detected') : '--- HIDDEN ---'}</span>
        </div>
    );

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
                            <FiCommand className="w-3.5 h-3.5" /> High-Level Audit
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Infrastructure <span className="text-[var(--primary-blue)]">Profiling</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-xl font-bold leading-relaxed opacity-60">
                            Perform a deep architectural analysis of network routes, server configurations, and deployment stacks.
                        </p>
                    </div>
                </div>
            </div>

            {/* Target Entry */}
            <div className="max-w-4xl mx-auto mb-20">
                <div className="bg-white p-2 rounded-2xl border border-[var(--border-color)] shadow-xl flex flex-col md:flex-row items-center gap-2 overflow-hidden">
                    <div className="flex-1 flex items-center px-6 w-full">
                        <FiSearch className="text-[var(--text-secondary)] opacity-30 text-xl" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-6 bg-transparent text-[var(--text-primary)] font-bold placeholder-[var(--text-secondary)]/30 focus:outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                        />
                    </div>
                    <button
                        onClick={handleScan}
                        disabled={loading}
                        className="pro-button pro-button-primary px-12 py-5 w-full md:w-auto h-full min-h-[64px] text-sm whitespace-nowrap active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Extracting...
                            </div>
                        ) : 'Deep Profiling'}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {loading && !result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-40 gap-10"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-blue-50 border-t-[var(--primary-blue)] rounded-full animate-spin"></div>
                            <FiTarget className="absolute inset-0 m-auto text-[var(--primary-blue)] text-4xl animate-pulse" />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Probing Infrastructure</p>
                            <p className="text-base font-bold text-[var(--text-secondary)] mt-2 opacity-40">Resolving global host configuration...</p>
                        </div>
                    </motion.div>
                )}

                {result && (
                    <div className="relative">
                        {!isAuthenticated && (
                            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-center pt-32 pointer-events-none group-hover:pointer-events-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-10 bg-white dark:bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl text-center max-w-lg mx-auto pointer-events-auto sticky top-48"
                                >
                                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 text-[var(--primary-blue)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <FiLock size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-[var(--text-primary)] mb-6 uppercase tracking-tighter">Architecture <span className="text-[var(--primary-blue)]">Locked</span></h3>
                                    <p className="text-[var(--text-secondary)] text-lg font-bold leading-relaxed opacity-60 mb-10">
                                        Clinical infrastructure profiling and deployment stack analysis are reserved for enterprise-tier members. Authenticate to view the full audit.
                                    </p>
                                    <button
                                        onClick={onOpenAuth}
                                        className="w-full pro-button pro-button-primary !py-5 flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest shadow-xl"
                                    >
                                        Sign In to Access Audit
                                        <FiArrowRight size={18} />
                                    </button>
                                    <p className="mt-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-30">
                                        Node Protection Protocol v4.0.0 ACTIVE
                                    </p>
                                </motion.div>
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 ${!isAuthenticated ? 'blur-[10px] select-none pointer-events-none opacity-40 transition-all duration-700' : 'transition-all duration-700'}`}
                        >
                            {/* Summary Column */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="pro-card p-10 bg-white border border-[var(--border-color)] shadow-sm">
                                    <h3 className="flex items-center gap-3 text-sm font-black text-[var(--text-primary)] mb-10 uppercase tracking-tight">
                                        <FiGlobe className="text-[var(--primary-blue)]" /> Hosting Environment
                                    </h3>

                                    <div className="space-y-1">
                                        <DataRow icon={FiCpu} label="IP ADDRESS" value={result.websiteIP?.primaryIP} />
                                        <DataRow icon={FiHash} label="RECORDS" value={`${result.websiteIP?.totalIPs} Found`} />
                                        <DataRow icon={FiTarget} label="COUNTRY" value={result.serverLocation?.countryName} />
                                        <DataRow icon={FiMonitor} label="PROVIDER" value={result.serverLocation?.isp} />
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-[var(--border-color)]/30">
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] mb-6 uppercase tracking-widest opacity-30">Global Coordinates</p>
                                        <div className="p-10 bg-[var(--bg-secondary)] rounded-[2.5rem] border border-transparent flex flex-col items-center justify-center relative overflow-hidden group hover:bg-white hover:border-[var(--border-color)] hover:shadow-2xl transition-all duration-500">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                                            <p className="text-3xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums relative z-10">
                                                {result.serverLocation?.coordinates?.latitude?.toFixed(4) || '0.00'}<span className="text-lg opacity-20 mx-2">/</span>{result.serverLocation?.coordinates?.longitude?.toFixed(4) || '0.00'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-blue-50 rounded-full text-[9px] font-black text-[var(--primary-blue)] uppercase tracking-widest relative z-10 border border-blue-100/50">
                                                <div className="w-1.5 h-1.5 bg-[var(--primary-blue)] rounded-full"></div>
                                                Geo-Sync Verified
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="pro-card p-10 bg-white border border-[var(--border-color)] shadow-sm">
                                    <h3 className="flex items-center gap-3 text-sm font-black text-[var(--text-primary)] mb-10 uppercase tracking-tight">
                                        <FiShield className="text-emerald-500" /> Security Stack
                                    </h3>
                                    <div className="space-y-1">
                                        <DataRow icon={FiLock} label="ENCRYPTION" value={result.sslDetails?.tlsVersion} />
                                        <DataRow icon={FiShield} label="WAF CONFIG" value={result.firewall?.type || 'Standard'} />
                                        <DataRow icon={FiServer} label="SOFT STACK" value={result.serverInfo?.serverType} />
                                        <DataRow icon={FiZap} label="RESPONSE" value={`${result.performance?.responseTime || 0} ms`} />
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-[var(--border-color)]/30">
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] mb-6 uppercase tracking-widest opacity-30">Open Service Interfaces</p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {result.openPorts?.open?.map(port => (
                                                <span key={port} className="px-5 py-2.5 bg-blue-50 border border-blue-100 text-[var(--primary-blue)] font-black text-[10px] rounded-xl hover:bg-black hover:text-white hover:border-black transition-all cursor-default uppercase tracking-widest shadow-sm">
                                                    ID {port}
                                                </span>
                                            )) || (
                                                    <div className="w-full py-12 border-2 border-dashed border-[var(--border-color)]/30 rounded-[2rem] flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-10">
                                                        <FiActivity size={32} className="mb-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">No Public Intrfce</p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Technology Column */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="bg-black rounded-[3rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group border-none">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                                    <h3 className="flex items-center gap-4 text-sm font-black text-white/40 mb-12 relative z-10 uppercase tracking-widest">
                                        <FiGrid className="text-[var(--primary-blue)]" /> Deployment Stack
                                    </h3>
                                    <div className="space-y-12 relative z-10">
                                        <div>
                                            <p className="text-[9px] font-black text-white/20 mb-8 uppercase tracking-[0.2em]">Detected Technologies</p>
                                            <div className="flex flex-wrap gap-3">
                                                {Object.values(result.technologies || {}).flat().slice(0, 12).map((tech, i) => (
                                                    <span key={i} className="px-4 py-2.5 bg-white/5 border border-white/10 text-white/60 text-[10px] font-black rounded-xl hover:bg-white hover:text-black hover:border-white transition-all cursor-default uppercase tracking-tight">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {(Object.values(result.technologies || {}).flat().length === 0) &&
                                                    <div className="text-[10px] font-black text-white/10 uppercase tracking-widest py-10 w-full text-center border border-dashed border-white/10 rounded-2xl">Stack Hidden</div>
                                                }
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center hover:bg-white transition-all duration-500 group/stat shadow-inner">
                                                <div className="text-4xl font-black text-white group-hover/stat:text-black leading-none tracking-tighter mb-4 tabular-nums">{result.performance?.responseTime || 0}</div>
                                                <span className="text-[9px] font-black text-white/20 group-hover/stat:text-black/40 uppercase tracking-widest transition-colors">ms Latency</span>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center hover:bg-white transition-all duration-500 group/stat shadow-inner">
                                                <div className="text-4xl font-black text-white group-hover/stat:text-black leading-none tracking-tighter mb-4 tabular-nums">{((result.performance?.contentSize || 0) / 1024).toFixed(0)}</div>
                                                <span className="text-[9px] font-black text-white/20 group-hover/stat:text-black/40 uppercase tracking-widest transition-colors">KB Weight</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DNS Section */}
                            <div className="lg:col-span-12 pro-card p-10 md:p-20 bg-white border border-[var(--border-color)] shadow-sm">
                                <h3 className="flex items-center gap-4 text-3xl font-black text-[var(--text-primary)] mb-16 uppercase tracking-tight leading-none">
                                    <FiLayers className="text-[var(--primary-blue)]" /> Infrastructure Records
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                                    {['MX', 'TXT', 'NS'].map(type => (
                                        <div key={type} className="space-y-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-10 bg-[var(--primary-blue)] rounded-full"></div>
                                                <p className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-[0.3em] opacity-40">
                                                    {type} Configuration
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                {(result.dnsRecords?.[type.toLowerCase()] || []).length > 0 ? (
                                                    result.dnsRecords[type.toLowerCase()].slice(0, 5).map((rec, i) => (
                                                        <div key={i} className="p-6 bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] hover:bg-white hover:shadow-2xl transition-all duration-300 rounded-[1.5rem] text-[10px] font-bold text-[var(--text-secondary)] truncate font-mono shadow-sm group/dns">
                                                            {typeof rec === 'object' ? rec.exchange || JSON.stringify(rec).substring(0, 70) : rec.substring(0, 70)}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-16 border-2 border-dashed border-[var(--border-color)]/20 rounded-[2rem] text-center flex flex-col items-center justify-center opacity-20">
                                                        <p className="text-[9px] font-black uppercase tracking-widest">Null Configuration</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdvancedScanner;
