import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiShield, FiGlobe, FiServer, FiLock, FiActivity, FiZap,
    FiTarget, FiArrowLeft, FiMonitor, FiSearch, FiCpu, FiGrid,
    FiCommand, FiLayers, FiDatabase, FiExternalLink, FiLayout
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const DeepIntelligence = ({ onBack, onOpenAuth }) => {
    const { user, token } = useAuth();
    const isAuthenticated = !!user;
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const resultsRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleDeepScan = async () => {
        if (!url) return;
        setLoading(true);
        setResult(null);

        try {
            // Step 1: Standard extraction
            const response = await fetch(`${API_URL}/extract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            if (data.success) {
                // Step 2: Advanced architectural scan
                const deepResponse = await fetch(`${API_URL}/security/advanced-scan`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });
                const deepData = await deepResponse.json();

                setResult({
                    ...data.data,
                    ...deepData.data
                });

                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500);
            }
        } catch (error) {
            console.error('Deep scan failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const MetricCard = ({ icon: Icon, label, value, color = "var(--primary-blue)" }) => (
        <div className="p-6 bg-white dark:bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl group hover:-translate-y-1 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={18} style={{ color }} />
            </div>
            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 opacity-50">{label}</p>
            <p className="text-sm font-black text-[var(--text-primary)] truncate">{isAuthenticated ? (value || 'N/A') : '••••••••'}</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[var(--bg-main)] font-sans pb-32 pt-20"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Minimal Header */}
                <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-[10px] font-black text-[var(--primary-blue)] mb-6 uppercase tracking-widest hover:opacity-70 transition-all"
                        >
                            <FiArrowLeft className="w-3 h-3" /> return to node
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-4">
                            Deep <span className="text-[var(--primary-blue)]">Intelligence</span>
                        </h1>
                        <p className="text-sm font-bold text-[var(--text-secondary)] opacity-50 max-w-xl">
                            High-fidelity extraction engine with visual verification, tech stack fingerprinting, and security audit protocols.
                        </p>
                    </div>

                    {/* Status Console Style */}
                    <div className="flex items-center gap-6 px-10 py-6 bg-white dark:bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">Core Engine Active</span>
                        </div>
                        <div className="w-px h-10 bg-[var(--border-color)]"></div>
                        <div className="flex items-center gap-3">
                            <FiDatabase className="text-[var(--primary-blue)]" />
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">v4.0.0 SCRAPER</span>
                        </div>
                    </div>
                </div>

                {/* Search / Scan Panel */}
                <div className="max-w-4xl mx-auto mb-32">
                    <div className="premium-search-box p-3 bg-white dark:bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border_color)] shadow-2xl flex flex-col md:flex-row items-center gap-3 transition-all duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
                        <div className="flex-1 flex items-center px-8 w-full">
                            <FiSearch className="text-[var(--primary-blue)] text-xl" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="ENTER TARGET URL FOR DEEP ANALYSIS..."
                                className="w-full px-6 py-8 bg-transparent text-[var(--text-primary)] font-black placeholder-[var(--text-secondary)]/30 focus:outline-none uppercase tracking-tight text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleDeepScan()}
                            />
                        </div>
                        <button
                            onClick={handleDeepScan}
                            disabled={loading}
                            className="w-full md:w-auto px-16 py-8 bg-[var(--primary-blue)] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    PROBING...
                                </>
                            ) : (
                                <>
                                    DEEP SCAN <FiZap size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading && !result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-4xl mx-auto mb-32 p-20 bg-white dark:bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[4rem] shadow-2xl flex flex-col items-center text-center overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary-blue)] to-transparent animate-shimmer"></div>

                            <div className="relative mb-12">
                                <div className="w-24 h-24 border-4 border-blue-50 dark:border-blue-900 border-t-[var(--primary-blue)] rounded-full animate-spin"></div>
                                <FiActivity className="absolute inset-0 m-auto text-[var(--primary-blue)] text-3xl animate-pulse" />
                            </div>

                            <h3 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4">
                                Probing <span className="text-[var(--primary-blue)]">Infrastructure</span>
                            </h3>
                            <p className="text-sm font-bold text-[var(--text-secondary)] opacity-50 mb-10 max-w-sm">
                                Resolving global host configuration, analyzing SSL handshake, and mapping deployment architecture...
                            </p>

                            <div className="w-full max-w-xs h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[var(--primary-blue)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 10, ease: "easeOut" }}
                                />
                            </div>
                            <p className="mt-4 text-[9px] font-black text-[var(--primary-blue)] uppercase tracking-[0.3em] opacity-40">NODE SYNC IN PROGRESS</p>
                        </motion.div>
                    )}

                    {result && (
                        <div ref={resultsRef} className="space-y-16">
                            {/* Visual Snapshot & High-Level State */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Screenshot Box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="lg:col-span-8 pro-card bg-black rounded-[3.5rem] p-1 shadow-2xl overflow-hidden relative group"
                                >
                                    <div className="absolute top-8 left-8 z-10 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">LIVE SNAPSHOT</span>
                                    </div>
                                    <div className="relative aspect-video rounded-[3.4rem] overflow-hidden bg-[var(--bg-secondary)] border border-white/5">
                                        {result.screenshot ? (
                                            <img src={result.screenshot} alt="Visual Verification" className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-[3000ms]" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-white/10 uppercase tracking-[0.5em]">
                                                <FiMonitor size={80} className="mb-8" />
                                                SNAPSHOT NOT CAPTURED
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
                                    </div>
                                </motion.div>

                                {/* Quick Intel Metrics */}
                                <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                                    <MetricCard icon={FiGlobe} label="Server IP" value={result.websiteIP?.primaryIP} />
                                    <MetricCard icon={FiTarget} label="Location" value={result.serverLocation?.countryName} color="#10b981" />
                                    <MetricCard icon={FiLock} label="Security Protocol" value={result.sslDetails?.tlsVersion} color="#f59e0b" />
                                    <MetricCard icon={FiActivity} label="Latency (TTFB)" value={`${result.performance?.responseTime || 0}ms`} color="#6366f1" />
                                </div>
                            </div>

                            {/* Deep Extraction Grids */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Technical Profile */}
                                <div className="pro-card p-12 bg-white border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                                    <h3 className="flex items-center gap-4 text-sm font-black text-[var(--text-primary)] mb-12 uppercase tracking-tight">
                                        <FiCpu className="text-[var(--primary-blue)]" /> Technical Profile
                                    </h3>
                                    <div className="space-y-8">
                                        {result.technologies && Object.entries(result.technologies).some(([_, list]) => list?.length > 0) ? (
                                            Object.entries(result.technologies).map(([cat, list]) => (
                                                list && list.length > 0 && (
                                                    <div key={cat}>
                                                        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 opacity-40">{cat}</p>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            {list.map((t, idx) => (
                                                                <span key={idx} className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-primary)] rounded-lg uppercase tracking-tight">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <div className="py-20 text-center opacity-30 italic text-sm">No high-level technical headers discovered.</div>
                                        )}
                                    </div>
                                </div>

                                {/* DNS & Infrastructure */}
                                <div className="pro-card p-12 bg-[var(--bg-secondary)] border-none shadow-xl relative overflow-hidden group">
                                    <h3 className="flex items-center gap-4 text-sm font-black text-[var(--text-primary)] mb-12 uppercase tracking-tight">
                                        <FiLayers className="text-orange-500" /> DNS Infrastructure
                                    </h3>
                                    <div className="space-y-8">
                                        {['MX', 'TXT'].map(type => (
                                            <div key={type}>
                                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 opacity-40">{type} Records</p>
                                                <div className="space-y-3">
                                                    {(result.dnsRecords?.[type.toLowerCase()] || []).slice(0, 3).map((v, i) => (
                                                        <div key={i} className="p-4 bg-white/50 border border-white rounded-2xl text-[10px] font-mono text-[var(--text-primary)] truncate">
                                                            {typeof v === 'string' ? v : JSON.stringify(v)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Firewall & Risk */}
                                <div className="pro-card p-12 bg-black text-white border-none shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700">
                                        <FiShield size={100} />
                                    </div>
                                    <h3 className="flex items-center gap-4 text-sm font-black text-white/40 mb-12 uppercase tracking-tight relative z-10">
                                        <FiShield className="text-emerald-500" /> Security Posture
                                    </h3>

                                    <div className="space-y-12 relative z-10">
                                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Protocol Hygiene</p>
                                            <p className="text-2xl font-black">{result.sslDetails?.issuer || 'Self-Signed'}</p>
                                            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black tracking-widest">
                                                VERIFIED
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Ports</p>
                                                <p className="text-xl font-black">{result.openPorts?.open?.length || 0}</p>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Firewall</p>
                                                <p className="text-xl font-black">{result.firewall?.detected ? 'WAF' : 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Standard Extraction Evidence (Bottom) */}
                            <div className="p-16 bg-blue-50/50 dark:bg-blue-500/5 rounded-[4rem] border border-blue-100 dark:border-blue-500/10 flex flex-col md:flex-row items-center gap-12">
                                <div className="w-24 h-24 bg-white dark:bg-black rounded-3xl border border-blue-100 flex items-center justify-center shrink-0 shadow-xl">
                                    <FiLayout className="text-[var(--primary-blue)] text-4xl" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">Extraction Handshake Complete</h4>
                                    <p className="text-xs font-bold text-[var(--text-secondary)] opacity-60 leading-relaxed uppercase tracking-wider">
                                        Detected {result.phones?.length || 0} phone numbers and {result.emails?.length || 0} email contact points during deep crawl.
                                    </p>
                                </div>
                                <button
                                    onClick={() => onBack()}
                                    className="px-10 py-5 bg-white border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                                >
                                    Export Full Report
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {!isAuthenticated && !result && !loading && (
                    <div className="mt-20 p-20 bg-amber-50 rounded-[4rem] border border-amber-100 text-center max-w-4xl mx-auto">
                        <FiLock size={48} className="mx-auto text-amber-500 mb-8" />
                        <h3 className="text-4xl font-black text-amber-900 uppercase tracking-tight mb-6">Deep Access <span className="opacity-40">Restricted</span></h3>
                        <p className="text-lg font-bold text-amber-900/60 mb-10 max-w-lg mx-auto leading-relaxed">
                            Visual verification and deep infrastructure fingerprinting are premium features. Authenticate to unlock global data extraction nodes.
                        </p>
                        <button
                            onClick={onOpenAuth}
                            className="px-16 py-6 bg-amber-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all"
                        >
                            Sign In to Access Deep Intelligence
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DeepIntelligence;
