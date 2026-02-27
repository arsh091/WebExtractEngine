import { useState, useRef, useEffect } from 'react';
import {
    FiShield, FiGlobe, FiServer, FiLock, FiActivity,
    FiLayout, FiCpu, FiHash, FiZap, FiTarget, FiArrowLeft, FiMonitor, FiMapPin, FiSearch, FiCode, FiArrowRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedScanner = ({ onBack }) => {
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
        <div className="flex items-center justify-between py-5 border-b border-[var(--border-color)]/50 last:border-0 group">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Icon size={16} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40 italic">{label}</span>
            </div>
            <span className="text-[11px] font-black text-[var(--text-primary)] truncate max-w-[200px] uppercase tracking-tight italic">{value || 'NOT_FOUND'}</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-10 font-sans"
        >
            {/* Header Section */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-blue)] mb-12 hover:translate-x-[-8px] transition-all group"
                >
                    <FiArrowLeft className="group-hover:scale-125 transition-transform" /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl">
                                <FiCpu size={24} />
                            </div>
                            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Deep Infrastructure Diagnostics</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 italic">Security <span className="text-[var(--primary-blue)]">Intelligence</span></h2>
                        <p className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed opacity-60">Deep technical audit and infrastructure mapping. Identify technologies, network configurations, and security orientations.</p>
                    </div>
                </div>
            </div>

            {/* Target Entry */}
            <div className="max-w-5xl mx-auto mb-24">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative pro-card p-1 bg-white rounded-[3rem] shadow-2xl flex items-center overflow-hidden border border-[var(--border-color)]">
                        <FiSearch className="ml-10 text-[var(--text-secondary)] text-2xl opacity-30" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="TARGET INFRASTRUCTURE (HTTPS://...)"
                            className="w-full pl-6 pr-10 py-10 bg-transparent text-xl font-black text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none uppercase tracking-tight"
                            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                        />
                        <button
                            onClick={handleScan}
                            disabled={loading}
                            className="mr-4 px-12 py-7 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center gap-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Analysing...
                                </>
                            ) : (
                                <>
                                    Initiate Audit <FiArrowRight />
                                </>
                            )}
                        </button>
                    </div>
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
                            <p className="text-lg font-black text-[var(--text-primary)] uppercase tracking-[0.3em] italic">Technical Audit in Progress</p>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mt-3 opacity-40">Mapping Infrastructure Nodes... 84%</p>
                        </div>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Network Infrastructure Node */}
                            <div className="bg-white rounded-[3rem] p-12 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                                <h3 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic opacity-40">
                                    <FiGlobe className="text-[var(--primary-blue)]" /> Infrastructure Node
                                </h3>

                                <div className="space-y-1">
                                    <DataRow icon={FiCpu} label="IP ADDRESS" value={result.websiteIP?.primaryIP} />
                                    <DataRow icon={FiHash} label="TOTAL IPS" value={result.websiteIP?.totalIPs} />
                                    <DataRow icon={FiTarget} label="SERVER REGION" value={result.serverLocation?.countryName} />
                                    <DataRow icon={FiMonitor} label="PROVIDER (ISP)" value={result.serverLocation?.isp} />
                                </div>

                                <div className="mt-10 pt-10 border-t border-[var(--border-color)]/50">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-8 opacity-40 italic">Geospatial Coordinate Matrix</p>
                                    <div className="p-10 bg-[var(--bg-secondary)] rounded-[2rem] relative border-2 border-[var(--border-color)]/30 overflow-hidden flex flex-col items-center justify-center group/coord hover:border-[var(--primary-blue)]/30 transition-all duration-500">
                                        <p className="text-3xl font-black text-[var(--text-primary)] tracking-tight italic tabular-nums">
                                            {result.serverLocation?.coordinates?.latitude?.toFixed(4) || '0.0000'}, {result.serverLocation?.coordinates?.longitude?.toFixed(4) || '0.0000'}
                                        </p>
                                        <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mt-4 block opacity-30">Nodes Authenticated</span>
                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--primary-blue)] opacity-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Security Vector Grid */}
                            <div className="bg-white rounded-[3rem] p-12 border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
                                <h3 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] mb-10 italic opacity-40">
                                    <FiShield className="text-emerald-500" /> Security Posture Assessment
                                </h3>
                                <div className="space-y-1">
                                    <DataRow icon={FiLock} label="TLS/SSL PROTOCOL" value={result.sslDetails?.tlsVersion} />
                                    <DataRow icon={FiShield} label="WAF FORTIFICATION" value={result.firewall?.type || 'Standard'} />
                                    <DataRow icon={FiServer} label="SERVER ARCHETYPE" value={result.serverInfo?.serverType} />
                                    <DataRow icon={FiZap} label="RESPONSE LATENCY" value={`${result.performance?.responseTime || 0} ms`} />
                                </div>

                                <div className="mt-10 pt-10 border-t border-[var(--border-color)]/50">
                                    <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-8 opacity-40 italic">Resolved Access Ports</p>
                                    <div className="flex flex-wrap gap-3">
                                        {result.openPorts?.open?.map(port => (
                                            <span key={port} className="px-5 py-3 bg-blue-50/50 border-2 border-blue-100 text-[var(--primary-blue)] font-black text-[10px] rounded-xl uppercase tracking-tighter italic">
                                                Port {port}: VERIFIED
                                            </span>
                                        )) || (
                                                <span className="text-[var(--text-secondary)] italic text-[10px] font-black uppercase tracking-[0.3em] opacity-30 p-4 border-2 border-dashed border-[var(--border-color)] w-full text-center rounded-2xl">
                                                    No Public Ports Exposed
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance & Tech */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Intelligence Clusters */}
                            <div className="bg-black text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group border-none">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full"></div>
                                <h3 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] mb-10 italic opacity-40">
                                    <FiZap className="text-[var(--primary-blue)]" /> Core Technology Matrix
                                </h3>
                                <div className="space-y-10">
                                    <div>
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-8 italic">Detected Components</p>
                                        <div className="flex flex-wrap gap-3 relative z-10">
                                            {Object.values(result.technologies || {}).flat().slice(0, 15).map((tech, i) => (
                                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase rounded-xl hover:bg-[var(--primary-blue)] hover:border-transparent transition-all cursor-default italic">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 relative z-10">
                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center group/stat hover:bg-white transition-all duration-500 overflow-hidden">
                                            <p className="text-4xl font-black text-white group-hover/stat:text-black transition-colors leading-none italic tabular-nums">{result.performance?.responseTime || 0}</p>
                                            <span className="text-[8px] font-black text-white/30 group-hover/stat:text-black/30 uppercase tracking-[0.3em] mt-3 block italic transition-colors">LATENCY MS</span>
                                        </div>
                                        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center group/stat hover:bg-white transition-all duration-500 overflow-hidden">
                                            <p className="text-4xl font-black text-white group-hover/stat:text-black transition-colors leading-none italic tabular-nums">{((result.performance?.contentSize || 0) / 1024).toFixed(0)}</p>
                                            <span className="text-[8px] font-black text-white/30 group-hover/stat:text-black/30 uppercase tracking-[0.3em] mt-3 block italic transition-colors">PAYLOAD KB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DNS Records */}
                        <div className="lg:col-span-12 bg-white border-2 border-[var(--border-color)] rounded-[4rem] p-16 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h3 className="flex items-center gap-6 text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-16 uppercase italic">
                                <FiLayout className="text-[var(--primary-blue)]" /> Authority Node Handshake Logs
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                                {['MX', 'TXT', 'NS'].map(type => (
                                    <div key={type} className="space-y-8">
                                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] flex items-center gap-4 italic opacity-40">
                                            <div className="w-2 h-2 bg-[var(--primary-blue)] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                            {type} RECORDS
                                        </p>
                                        <div className="space-y-4">
                                            {(result.dnsRecords?.[type.toLowerCase()] || []).slice(0, 5).map((rec, i) => (
                                                <div key={i} className="p-6 bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] hover:bg-white hover:shadow-xl transition-all rounded-2xl text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-tight italic truncate shadow-sm">
                                                    {typeof rec === 'object' ? rec.exchange || JSON.stringify(rec).substring(0, 70) : rec.substring(0, 70)}
                                                </div>
                                            )) || (
                                                    <div className="p-10 border-2 border-dashed border-[var(--border-color)] rounded-[2rem] text-center">
                                                        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-20">NO_RECORDS_FOUND</p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdvancedScanner;
