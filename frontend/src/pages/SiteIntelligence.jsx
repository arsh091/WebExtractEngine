import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiServer, FiLock, FiActivity, FiArrowLeft, FiSearch, FiCode, FiArrowRight, FiCommand, FiGrid, FiLayers, FiShield, FiFileText, FiAlertCircle, FiDatabase, FiCheck, FiCopy, FiTerminal, FiShieldOff, FiTarget } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SiteIntelligence = ({ onBack, onOpenAuth }) => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'parsed'
    const [copied, setCopied] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setData(null);

        try {
            const response = await axios.post(`${API_URL}/extract/site-info`, { url });
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.error || 'Failed to fetch information');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const parsedRobots = useMemo(() => {
        if (!data?.robots || data.robots.includes('not found')) return [];
        const lines = data.robots.split('\n');
        const sections = [];
        let currentSection = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            if (trimmed.toLowerCase().startsWith('user-agent:')) {
                const agent = trimmed.split(':')[1].trim();
                currentSection = { agent, rules: [] };
                sections.push(currentSection);
            } else if (currentSection && trimmed.includes(':')) {
                const [type, ...value] = trimmed.split(':');
                currentSection.rules.push({
                    type: type.trim(),
                    value: value.join(':').trim()
                });
            }
        });
        return sections;
    }, [data?.robots]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-32 font-sans"
        >
            {/* Header Area */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--primary-blue)] mb-8 hover:-translate-x-1 transition-all group"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Home
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-[10px] font-black uppercase tracking-widest mb-6">
                            <FiGlobe size={14} /> Domain Intelligence
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Infrastructure <span className="text-[var(--primary-blue)]">Metrics</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-lg font-bold leading-relaxed opacity-60">
                            Professional-grade extraction of public infrastructure data, IP routing, and robots.txt permission directives.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto mb-20 px-0">
                <form onSubmit={handleSearch} className="relative">
                    <div className="bg-white dark:bg-[var(--card-bg)] p-2 rounded-2xl border border-[var(--border-color)] shadow-xl flex flex-col md:flex-row items-center gap-2 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-[var(--primary-blue)]/5">
                        <div className="flex-1 flex items-center px-6 w-full">
                            <FiSearch className="text-[var(--text-secondary)] opacity-30 text-xl shrink-0" />
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
                            className="bg-[var(--primary-blue)] text-white px-12 py-5 rounded-xl font-black uppercase tracking-widest text-xs h-full min-h-[64px] flex items-center justify-center gap-4 hover:bg-[var(--primary-blue-dark)] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Resolving...
                                </>
                            ) : (
                                <>
                                    Lookup Infrastructure
                                    <FiArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 py-3 rounded-xl border border-red-100"
                    >
                        <FiAlertCircle className="inline mr-2" /> {error}
                    </motion.p>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!data && !loading && (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-white dark:bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-8 text-[var(--primary-blue)] shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <FiServer size={32} className="relative z-10" />
                        </div>
                        <h3 className="text-[var(--text-primary)] text-3xl font-black mb-3 uppercase tracking-tight">System Node Standby</h3>
                        <p className="text-[var(--text-secondary)] text-lg font-bold opacity-40 max-w-sm mx-auto">
                            Initial handshake required. Please provide a destination target.
                        </p>
                    </motion.div>
                )}

                {data && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`space-y-12 ${!isAuthenticated ? 'blur-[10px] select-none pointer-events-none opacity-40 transition-all duration-700' : 'transition-all duration-700'}`}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Left Side: Quick Stats & Geolocation */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Global IP & Location Card */}
                                <div className="pro-card p-1 bg-gradient-to-br from-[var(--primary-blue)] to-blue-700 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                                    <div className="bg-black dark:bg-[#0a0a0a] rounded-[2.3rem] p-10 relative overflow-hidden">
                                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/40 transition-all duration-1000"></div>

                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-12 opacity-80">Primary Node Resolution</p>

                                            <div className="mb-12">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Address</span>
                                                </div>
                                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-widest tabular-nums leading-none">
                                                    {isAuthenticated ? (data.websiteIP?.primaryIP || data.ip) : 'XX.XXX.XXX.XXX'}
                                                </h3>
                                            </div>

                                            {data.serverLocation && (
                                                <div className="space-y-6 pt-6 border-t border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                                            <FiTarget size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Geolocation</p>
                                                            <p className="text-sm font-bold text-white">{data.serverLocation.city}, {data.serverLocation.countryName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                                            <FiActivity size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Coordinates</p>
                                                            <p className="text-sm font-mono text-white/80">{data.serverLocation.coordinates.latitude.toFixed(4)}, {data.serverLocation.coordinates.longitude.toFixed(4)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => copyToClipboard(data.websiteIP?.primaryIP || data.ip)}
                                                className="w-full mt-10 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                                                {copied ? 'Copied' : 'Copy Network Identifier'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Security & SSL Meta */}
                                <div className="p-10 bg-white dark:bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm">
                                    <h3 className="text-sm font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-tight">
                                        <FiShield className="text-[var(--primary-blue)]" /> Secure Protocol Details
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'TLS Version', val: data.sslDetails?.tlsVersion, icon: <FiLock className="text-blue-500" /> },
                                            { label: 'Cipher Suite', val: data.sslDetails?.cipherSuite, icon: <FiCheck className="text-emerald-500" /> },
                                            { label: 'Latency', val: data.performance?.responseTime + 'ms', icon: <FiActivity className="text-amber-500" /> },
                                            { label: 'Firewall', val: data.firewall?.detected ? data.firewall.type : 'None Detected', icon: <FiShield className="text-indigo-500" /> },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all group/item overflow-hidden">
                                                <div className="flex items-center gap-3">
                                                    <span className="opacity-40">{item.icon}</span>
                                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{item.label}</span>
                                                </div>
                                                <span className="text-[11px] font-black text-[var(--text-primary)] truncate max-w-[150px]">{isAuthenticated ? (item.val || 'N/A') : 'PROTECTED'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technologies Detected */}
                                {data.technologies && (
                                    <div className="p-10 bg-white dark:bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm">
                                        <h3 className="text-sm font-black text-[var(--text-primary)] mb-8 flex items-center gap-3 uppercase tracking-tight">
                                            <FiGrid className="text-[var(--primary-blue)]" /> Core Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(data.technologies).map(([category, list]) =>
                                                list && list.length > 0 ? list.map((tech, idx) => (
                                                    <span key={`${category}-${idx}`} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-[var(--primary-blue)] text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100/30">
                                                        {tech}
                                                    </span>
                                                )) : null
                                            )}
                                            {(!data.technologies.backend?.length && !data.technologies.frontend?.length) &&
                                                <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 italic">Undisclosed deployment headers</p>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Analysis Views */}
                            <div className="lg:col-span-8 space-y-10">
                                {/* DNS Records Section */}
                                <div className="bg-white dark:bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] shadow-sm p-10">
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                                            <FiLayers size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">DNS Records Mapping</h3>
                                            <p className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40 mt-1">Infrastructure route discovery</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {['MX', 'TXT', 'NS'].map(type => (
                                            <div key={type} className="space-y-6">
                                                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] w-fit">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{type} Config</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {data.dnsRecords?.[type.toLowerCase()]?.length > 0 ? (
                                                        data.dnsRecords[type.toLowerCase()].map((rec, i) => (
                                                            <div key={i} className="p-4 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]/30 rounded-xl text-[10px] font-bold text-[var(--text-secondary)] break-all font-mono">
                                                                {typeof rec === 'object' ? (rec.exchange || rec.host || JSON.stringify(rec)) : rec}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 border border-dashed border-[var(--border-color)] rounded-xl text-center opacity-30">
                                                            <span className="text-[9px] font-black uppercase">None</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Robots.txt Analysis */}
                                <div className="bg-white dark:bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-color)] shadow-xl overflow-hidden group">
                                    <div className="px-10 py-8 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-[#0a0a0a]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <FiCode size={24} />
                                            </div>
                                            <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Robots.txt Directives</h3>
                                        </div>

                                        <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border-color)]">
                                            <button
                                                onClick={() => setViewMode('parsed')}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'parsed' ? 'bg-white dark:bg-[var(--primary-blue)] text-[var(--primary-blue)] dark:text-white shadow-xl border border-[var(--border-color)]/20' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100'}`}
                                            >
                                                Visual Flow
                                            </button>
                                            <button
                                                onClick={() => setViewMode('raw')}
                                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'raw' ? 'bg-white dark:bg-[var(--primary-blue)] text-[var(--primary-blue)] dark:text-white shadow-xl border border-[var(--border-color)]/20' : 'text-[var(--text-secondary)] opacity-40 hover:opacity-100'}`}
                                            >
                                                Raw Buffer
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10">
                                        <AnimatePresence mode="wait">
                                            {viewMode === 'raw' ? (
                                                <motion.div key="raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                                                    <button
                                                        onClick={() => copyToClipboard(data.robots)}
                                                        className="absolute top-4 right-4 p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all z-10"
                                                    >
                                                        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                                                    </button>
                                                    <div className="p-10 bg-black text-[#5ecc5e] font-mono text-xs leading-relaxed overflow-auto max-h-[500px] custom-scrollbar-pro rounded-[2rem] shadow-inner border border-white/5">
                                                        <pre className="whitespace-pre-wrap font-bold">
                                                            {isAuthenticated ? data.robots : 'USER-AGENT: * \nDISALLOW: /RESTRICTED_PROTOCOL_ACTIVE'}
                                                        </pre>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div key="parsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 max-h-[500px] overflow-auto pr-4 custom-scrollbar-pro">
                                                    {parsedRobots.length > 0 ? parsedRobots.map((section, idx) => (
                                                        <div key={idx} className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                                            <div className="flex items-center gap-4 mb-8">
                                                                <div className="w-10 h-10 bg-[var(--primary-blue)] text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                                                                    <FiTerminal />
                                                                </div>
                                                                <p className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">Agent: <span className="text-[var(--primary-blue)]">{section.agent}</span></p>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {section.rules.map((rule, ridx) => (
                                                                    <div key={ridx} className="flex items-center gap-4 p-4 bg-white dark:bg-black/20 rounded-2xl border border-[var(--border-color)]/50 transition-all">
                                                                        <div className={`p-2 rounded-lg ${rule.type.toLowerCase().includes('disallow') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                                            {rule.type.toLowerCase().includes('disallow') ? <FiShieldOff size={14} /> : <FiShield size={14} />}
                                                                        </div>
                                                                        <div className="truncate">
                                                                            <p className="text-[8px] font-black uppercase opacity-30 tracking-widest">{rule.type}</p>
                                                                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{rule.value}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="text-center py-20 px-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-[3rem]">
                                                            <FiAlertCircle className="mx-auto text-amber-500 mb-6" size={48} />
                                                            <h4 className="text-[var(--text-primary)] font-black text-2xl tracking-tight uppercase">Structure Undefined</h4>
                                                            <p className="text-[var(--text-secondary)] font-bold text-base mt-2 opacity-50">Standard handshake complete, but robots.txt returned no active directives.</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Security Compliance Footer */}
                                <div className="p-10 bg-blue-50/50 dark:bg-blue-500/5 rounded-[2.5rem] border border-blue-100 dark:border-blue-500/10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-sm">
                                    <div className="w-20 h-20 bg-white dark:bg-black rounded-3xl border border-blue-100 flex items-center justify-center shrink-0 shadow-lg">
                                        <FiShield className="text-[var(--primary-blue)] text-4xl" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-4 opacity-50">Compliance Protocol V4</p>
                                        <p className="text-[11px] font-bold text-[var(--text-primary)] opacity-70 leading-relaxed uppercase tracking-wider">
                                            authorized gateway resolve completed. all infrastructure metrics are extracted via professional DNS and server handshake cycles. data is verified against public routing tables.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Status Ticker */}
            <div className="fixed bottom-8 right-8 hidden lg:flex items-center gap-6 bg-white/90 dark:bg-[var(--bg-main)]/90 backdrop-blur-md px-6 py-4 border border-[var(--border-color)] shadow-2xl rounded-2xl z-[80] transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    </div>
                    <span className="text-sm font-black text-[var(--text-primary)] tracking-tight">NODE: ONLINE</span>
                </div>
                <div className="w-px h-4 bg-[var(--border-color)]"></div>
                <div className="flex items-center gap-3 text-[var(--primary-blue)]">
                    <FiDatabase size={16} />
                    <span className="text-sm font-bold opacity-60">SYSTEM READY</span>
                </div>
            </div>
        </motion.div>
    );
};

export default SiteIntelligence;
