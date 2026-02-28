import { useState, useEffect } from 'react';
import { FiGlobe, FiMonitor, FiShield, FiCopy, FiMapPin, FiActivity, FiArrowLeft, FiCheck, FiCpu, FiServer, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const IPIntelligence = ({ onBack }) => {
    const [ipData, setIpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchIPData();
    }, []);

    const fetchIPData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/security/ip`);
            const data = await response.json();

            if (data.success) {
                setIpData(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch IP data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyIP = () => {
        if (!ipData) return;
        navigator.clipboard.writeText(ipData.ip);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRiskConfig = (level) => {
        if (level === 'LOW') return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: <FiShield /> };
        if (level === 'MEDIUM') return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: <FiActivity /> };
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: <FiAlertCircle /> };
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-64 gap-12 font-sans">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-50 border-t-[var(--primary-blue)] rounded-full animate-spin"></div>
                    <FiServer className="absolute inset-0 m-auto text-[var(--primary-blue)] text-3xl animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-[var(--text-primary)]">Resolving Network Path</p>
                    <p className="text-sm font-medium text-[var(--text-secondary)] mt-3 opacity-60">Gathering secure infrastructure metrics...</p>
                </div>
            </div>
        );
    }

    if (!ipData) return null;

    const risk = getRiskConfig(ipData.security.riskLevel);

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
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--primary-blue)] mb-8 hover:-translate-x-1 transition-all group"
                >
                    <FiArrowLeft className="w-4 h-4" /> Return to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-xs font-semibold mb-6">
                            <FiServer size={14} /> Network Intelligence
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Connection <span className="text-[var(--primary-blue)]">Metrics</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed opacity-60">
                            Real-time analysis of your network routing, provider intelligence, and security parameters.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* IP Address Card */}
                <div className="pro-card p-10 md:p-14 md:col-span-12 relative overflow-hidden group bg-white border border-[var(--border-color)]">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 opacity-40">Your Public IP Address</p>
                            <p className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums leading-none">{ipData.ip}</p>
                        </div>
                        <button
                            onClick={copyIP}
                            className="bg-black text-white px-10 py-5 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary-blue)] transition-all active:scale-95 shadow-2xl"
                        >
                            {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy size={16} />}
                            {copied ? 'IP Copied' : 'Copy Network Address'}
                        </button>
                    </div>
                </div>

                {/* Location Card */}
                <div className="pro-card p-10 md:col-span-6 group bg-white border border-[var(--border-color)]">
                    <h3 className="text-[10px] font-black text-[var(--text-primary)] mb-10 uppercase tracking-[0.2em] opacity-40 flex items-center gap-3">
                        <FiMapPin className="text-[var(--primary-blue)]" /> Geographic Information
                    </h3>
                    {ipData.location ? (
                        <div className="space-y-3">
                            {[
                                { label: 'Country', val: `${ipData.location.countryName} (${ipData.location.country})` },
                                { label: 'Region', val: ipData.location.region },
                                { label: 'City', val: ipData.location.city },
                                { label: 'Timezone', val: ipData.location.timezone },
                                { label: 'Coordinates', val: `${ipData.location.coordinates.latitude.toFixed(4)}, ${ipData.location.coordinates.longitude.toFixed(4)}` },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] hover:bg-white transition-all group/row">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{item.label}</span>
                                    <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-[var(--primary-blue)] transition-colors">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-color)]">
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-30">Location data unavailable</p>
                        </div>
                    )}
                </div>

                {/* Device Info Card */}
                <div className="pro-card p-10 md:col-span-6 group bg-white border border-[var(--border-color)]">
                    <h3 className="text-[10px] font-black text-[var(--text-primary)] mb-10 uppercase tracking-[0.2em] opacity-40 flex items-center gap-3">
                        <FiMonitor className="text-blue-500" /> Device Context
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Browser', val: `${ipData.device.browser} ${ipData.device.browserVersion}` },
                            { label: 'Operating System', val: `${ipData.device.os} ${ipData.device.osVersion}` },
                            { label: 'Device Type', val: ipData.device.device },
                            { label: 'Network Provider', val: ipData.isp },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-5 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] hover:bg-white transition-all group/row">
                                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{item.label}</span>
                                <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-[var(--primary-blue)] transition-colors truncate max-w-[200px]">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Analysis Card */}
                <div className={`pro-card p-10 md:p-14 ${risk.bg} ${risk.border} md:col-span-12 relative overflow-hidden group border-none shadow-2xl`}>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="flex-1">
                            <h3 className={`text-2xl md:text-4xl font-black mb-6 flex items-center gap-4 uppercase tracking-tighter ${risk.text}`}>
                                <FiLock /> Security Analysis
                            </h3>
                            <p className="text-[var(--text-secondary)] text-lg font-bold leading-relaxed max-w-2xl opacity-60">
                                Comprehensive fingerprinting of your network layer for transparency and data safety verification.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                                <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/20 shadow-sm group-hover:shadow-md transition-all">
                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Connection Method</span>
                                    <span className={`text-xs font-black ${ipData.security.isProxy ? 'text-orange-600' : 'text-emerald-600'} uppercase tracking-tighter`}>
                                        {ipData.security.isProxy ? 'Proxy Tunnel Detected' : 'Direct Gateway'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/20 shadow-sm group-hover:shadow-md transition-all">
                                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">VPN Status</span>
                                    <span className={`text-xs font-black ${ipData.security.isVPN ? 'text-orange-600' : 'text-emerald-600'} uppercase tracking-tighter`}>
                                        {ipData.security.isVPN ? 'VPN/Encrypted Tunnel' : 'Native ISP Route'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 w-full lg:w-auto">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-[var(--border-color)]/20 text-center shadow-xl flex-1 lg:flex-none lg:w-48 group/stat hover:bg-black transition-all">
                                <p className={`text-5xl font-black ${risk.text} group-hover/stat:text-white leading-none mb-3`}>{ipData.security.riskLevel}</p>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] group-hover/stat:text-white/40 uppercase tracking-widest">Risk Level</p>
                            </div>
                            <div className="bg-white p-10 rounded-[2.5rem] border border-[var(--border-color)]/20 text-center shadow-xl flex-1 lg:flex-none lg:w-48 group/stat hover:bg-black transition-all">
                                <p className={`text-5xl font-black ${risk.text} group-hover/stat:text-white leading-none mb-3`}>{ipData.security.riskScore}<span className="text-sm opacity-30 ml-1">/100</span></p>
                                <p className="text-[10px] font-black text-[var(--text-secondary)] group-hover/stat:text-white/40 uppercase tracking-widest">Trust Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default IPIntelligence;
