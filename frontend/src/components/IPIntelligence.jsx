import { useState, useEffect } from 'react';
import { FiGlobe, FiMonitor, FiShield, FiCopy, FiMapPin, FiActivity, FiArrowLeft, FiCheck, FiCpu } from 'react-icons/fi';
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
            <div className="flex flex-col items-center justify-center py-60 gap-10">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-50 border-t-[var(--primary-blue)] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[var(--primary-blue)] rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-lg font-black text-[var(--text-primary)] uppercase tracking-[0.2em] italic">Resolving Network Node</p>
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mt-3 opacity-40">Authentication Sequence 77%</p>
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
            className="max-w-7xl mx-auto px-6 pb-32 pt-10 font-sans"
        >
            {/* Header Area */}
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
                                <FiGlobe size={24} />
                            </div>
                            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Global Infrastructure Awareness</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 italic">Interface <span className="text-[var(--primary-blue)]">Intelligence</span></h2>
                        <p className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed opacity-60">Real-time identification of client node parameters, geospatial coordinates, and network routing integrity.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* IP Address Card */}
                <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-[var(--border-color)] shadow-2xl md:col-span-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
                        <div>
                            <h3 className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40 italic">Assigned IPv4 Node</h3>
                            <p className="text-5xl md:text-[10rem] font-black text-[var(--text-primary)] tracking-tighter tabular-nums leading-none italic">{ipData.ip}</p>
                        </div>
                        <button
                            onClick={copyIP}
                            className="bg-black text-white px-10 py-6 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--primary-blue)] transition-all active:scale-95 shadow-2xl"
                        >
                            {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                            {copied ? 'Copied to Buffer' : 'Copy Node IP'}
                        </button>
                    </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-[var(--border-color)] shadow-xl md:col-span-6 group hover:shadow-2xl transition-all duration-500">
                    <h3 className="text-[var(--text-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 italic opacity-40">
                        <FiMapPin className="text-emerald-500" /> Geospatial Coordinate Sync
                    </h3>
                    {ipData.location ? (
                        <div className="space-y-4">
                            {[
                                { label: 'Nation State', val: `${ipData.location.countryName} (${ipData.location.country})` },
                                { label: 'Admin Region', val: ipData.location.region },
                                { label: 'Operational City', val: ipData.location.city },
                                { label: 'Temporal Zone', val: ipData.location.timezone },
                                { label: 'GPS Vertices', val: `${ipData.location.coordinates.latitude.toFixed(4)}, ${ipData.location.coordinates.longitude.toFixed(4)}` },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">{item.label}</span>
                                    <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-color)]">
                            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">Geodata Obfuscated</p>
                        </div>
                    )}
                </div>

                {/* Device Info Card */}
                <div className="bg-white rounded-[2.5rem] p-12 border border-[var(--border-color)] shadow-xl md:col-span-6 group hover:shadow-2xl transition-all duration-500">
                    <h3 className="text-[var(--text-primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4 italic opacity-40">
                        <FiMonitor className="text-[var(--primary-blue)]" /> client Hardware Fingerprint
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Agent Interface', val: `${ipData.device.browser} ${ipData.device.browserVersion}` },
                            { label: 'Kernel Platform', val: `${ipData.device.os} ${ipData.device.osVersion}` },
                            { label: 'Architecture', val: ipData.device.device },
                            { label: 'Uplink Provider', val: ipData.isp },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-6 bg-[var(--bg-secondary)] rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">{item.label}</span>
                                <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight italic truncate max-w-[200px]">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Analysis Card */}
                <div className={`rounded-[3rem] p-16 border ${risk.bg} ${risk.border} md:col-span-12 shadow-2xl relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 opacity-20"></div>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16 relative z-10">
                        <div className="flex-1">
                            <h3 className={`text-4xl font-black tracking-tighter uppercase italic mb-6 flex items-center gap-5 ${risk.text}`}>
                                <FiShield /> Network Posture Assessment
                            </h3>
                            <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed max-w-2xl opacity-70">
                                Comprehensive analysis of the connection fingerprint. We evaluate network layer anonymity,
                                infrastructure consistency, and hardware orientation to determine the master risk profile.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">Network Masking</span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${ipData.security.isProxy ? 'text-orange-600' : 'text-emerald-600'}`}>
                                        {ipData.security.isProxy ? '⚠️ Proxy Detected' : 'Verified Direct'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40">Cryptographic VPN</span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${ipData.security.isVPN ? 'text-orange-600' : 'text-emerald-600'}`}>
                                        {ipData.security.isVPN ? '⚠️ VPN Active' : 'Native ISP'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 w-full lg:w-auto">
                            <div className="bg-white p-12 rounded-[2.5rem] border border-[var(--border-color)] text-center shadow-xl flex-1 lg:flex-none lg:w-52">
                                <p className={`text-6xl font-black tracking-tighter italic ${risk.text}`}>{ipData.security.riskLevel}</p>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-4 opacity-40">Profile</p>
                            </div>
                            <div className="bg-white p-12 rounded-[2.5rem] border border-[var(--border-color)] text-center shadow-xl flex-1 lg:flex-none lg:w-52">
                                <p className={`text-6xl font-black tracking-tighter italic ${risk.text}`}>{ipData.security.riskScore}<span className="text-xl text-[var(--text-secondary)]/30 font-black ml-1">/100</span></p>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-4 opacity-40">Confidence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default IPIntelligence;
