import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LayoutGrid, Terminal, Search, Layers, Activity, Shield, Cpu, Globe, ArrowRight, Database, Command } from 'lucide-react';

import Hero from '../components/Hero';
import ExtractorForm from '../components/ExtractorForm';
import ProgressBar from '../components/ProgressBar';
import ResultsDisplay from '../components/ResultsDisplay';
import BulkProcessor from '../components/BulkProcessor';

const Home = ({ onNotification, urlToAutoExtract, clearAutoExtract }) => {
    const [activeTab, setActiveTab] = useState('single');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [data, setData] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (urlToAutoExtract) {
            handleExtract(urlToAutoExtract);
            clearAutoExtract();
        }
    }, [urlToAutoExtract]);

    const handleExtract = async (url) => {
        setLoading(true);
        setProgress(0);
        setData(null);

        // Simulation for UI feedback
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 5;
            });
        }, 300);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/extract`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            const result = await response.json();

            clearInterval(interval);
            setProgress(100);

            if (!result.success) {
                throw new Error(result.error || 'Extraction failed');
            }

            setTimeout(() => {
                setData(result.data);
                setLoading(false);
                if (onNotification) onNotification('Data extracted successfully', 'success');
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 600);
        } catch (error) {
            clearInterval(interval);
            setLoading(false);
            if (onNotification) onNotification(error.message || 'Extraction failed', 'error');
        }
    };

    const handleReset = () => {
        setData(null);
        setProgress(0);
    };

    return (
        <main className="min-h-screen pt-32 pb-24 relative bg-[var(--bg-main)] overflow-hidden font-sans">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-[var(--primary-blue)]/5 via-transparent to-transparent pointer-events-none"></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Hero />

                {/* Processing Console */}
                <div className="mt-10 md:mt-24">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <div className="flex items-center gap-3 mb-6 opacity-30">
                            <Command size={14} className="text-[var(--primary-blue)]" />
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">Extraction Interface</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-8">
                            Select <span className="text-[var(--primary-blue)]">Operation</span> Mode
                        </h2>

                        {/* Tabs / Switcher */}
                        <div className="inline-flex p-1.5 bg-[var(--bg-main)] rounded-full border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-300">
                            {[
                                { id: 'single', label: 'Single Node', icon: Search },
                                { id: 'bulk', label: 'Cluster Mode', icon: Layers }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-[var(--primary-blue)] text-white shadow-md'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                                        }`}
                                >
                                    <tab.icon size={16} className={activeTab === tab.id ? 'text-[var(--primary-blue)]' : 'text-[var(--text-secondary)] opacity-40'} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'single' ? (
                            <motion.div
                                key="single"
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-24"
                            >
                                <div className="max-w-5xl mx-auto">
                                    <ExtractorForm
                                        onExtract={handleExtract}
                                        onReset={handleReset}
                                        loading={loading}
                                    />
                                </div>

                                {loading && (
                                    <div className="max-w-4xl mx-auto">
                                        <ProgressBar progress={progress} />
                                    </div>
                                )}

                                <div ref={resultsRef} className="scroll-mt-48">
                                    <ResultsDisplay data={data} onNotification={onNotification} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="bulk"
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="max-w-6xl mx-auto"
                            >
                                <BulkProcessor onNotification={onNotification} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Capability Cards */}
                {activeTab === 'single' && !data && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-24 md:mt-48"
                    >
                        {[
                            { icon: Shield, title: "Secure Handshake", desc: "Encryption layer ensures data integrity during live protocol extraction cycle.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { icon: Cpu, title: "Neural Analysis", desc: "Advanced DOM processing identifies high-fidelity information patterns in real-time.", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: Globe, title: "Global Reach", desc: "Distributed proxy network enables access across international nodes with high stealth.", color: "text-indigo-500", bg: "bg-indigo-500/10" }
                        ].map((item, i) => (
                            <div key={i} className="p-10 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-blue)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-8 group-hover:bg-[var(--primary-blue)] group-hover:text-white transition-all duration-500 shadow-sm`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{item.title}</h3>
                                <p className="text-base text-[var(--text-secondary)] leading-relaxed group-hover:opacity-100 transition-opacity">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Status Ticker */}
                <div className="fixed bottom-8 right-8 hidden lg:flex items-center gap-6 bg-[var(--bg-main)]/90 backdrop-blur-sm px-6 py-4 border border-[var(--border-color)] shadow-lg rounded-2xl z-[80] transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">System Online</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[var(--border-color)]"></div>
                    <div className="flex items-center gap-3">
                        <Database size={16} className="text-[var(--primary-blue)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">v2.5.1 Enterprise</span>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
