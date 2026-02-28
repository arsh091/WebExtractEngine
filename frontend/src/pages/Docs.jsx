import { motion } from 'framer-motion';
import { FiBook, FiCode, FiZap, FiShield, FiCpu, FiCommand, FiActivity, FiLayers, FiServer, FiDatabase, FiSettings } from 'react-icons/fi';

const Docs = () => {
    const sections = [
        {
            title: "Getting Started",
            icon: <FiZap />,
            content: "Learn how to initiate your first extraction. Our engine handles DOM analysis and dynamic rendering automatically for high-fidelity results."
        },
        {
            title: "Analysis Engine",
            icon: <FiCpu />,
            content: "Utilize our proprietary algorithms designed to identify key data points with high accuracy and minimal configuration."
        },
        {
            title: "Infrastructure",
            icon: <FiShield />,
            content: "Our system operates with built-in rate limiting and ethical collection protocols to ensure reliability and platform integrity."
        }
    ];

    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-32"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-16">
                    <div className="p-10 bg-black rounded-[3rem] text-white text-5xl shadow-2xl shrink-0">
                        <FiBook />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                            <FiSettings /> Platform Documentation
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            User <span className="text-[var(--primary-blue)]">Guides</span>
                        </h1>
                    </div>
                </div>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-bold max-w-5xl leading-relaxed opacity-50">
                    Comprehensive resources to help you master the WebExtract interface. Learn to configure your environment for reliable data ingestion and analysis.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-40">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="pro-card p-12 bg-white border border-[var(--border-color)] hover:border-[var(--primary-blue)]/30 hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 text-[var(--primary-blue)] mb-10 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm">
                            {section.icon}
                        </div>
                        <h3 className="text-xs font-black text-[var(--text-primary)] mb-6 uppercase tracking-widest">
                            {section.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-lg font-bold leading-relaxed opacity-50 group-hover:opacity-70 transition-opacity">
                            {section.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-24">
                <section className="bg-white rounded-[4rem] p-16 md:p-32 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row items-center gap-10 mb-16 relative z-10">
                        <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl text-[var(--primary-blue)] shadow-sm border border-[var(--border-color)]/20 group-hover:bg-black group-hover:text-white transition-all">
                            <FiLayers size={40} />
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none text-center md:text-left">
                            Technical <span className="text-[var(--primary-blue)]">Stack</span>
                        </h2>
                    </div>

                    <p className="text-[var(--text-secondary)] text-xl font-bold leading-relaxed mb-20 opacity-50 max-w-5xl relative z-10 text-center md:text-left">
                        Our core engine utilizes an optimized Node.js architecture for high-speed parsing. For complex dynamic interactions, we employ virtualized environments with automated resource rotation to maintain high success rates.
                    </p>

                    <div className="relative group/code z-10">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-blue)] to-blue-400 rounded-[3rem] blur opacity-10 group-hover/code:opacity-20 transition duration-1000"></div>
                        <div className="relative p-12 bg-black rounded-[3rem] border border-white/10 font-mono text-sm text-white shadow-2xl overflow-x-auto">
                            <div className="absolute top-8 right-10 flex gap-3">
                                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                            </div>
                            <div className="flex items-center gap-4 mb-10 opacity-30 text-[10px] uppercase font-black tracking-widest">
                                <FiActivity /> Implementation Sample
                            </div>
                            <div className="space-y-3 font-mono">
                                <p><span className="text-blue-400">const</span> extraction = <span className="text-purple-400">new</span> <span className="text-emerald-400">WebExtract</span>({'{'}</p>
                                <p className="pl-8">apiKey: <span className="text-amber-200">'YOUR_SECRET_TOKEN'</span>,</p>
                                <p className="pl-8">mode: <span className="text-amber-200">'high-fidelity'</span>,</p>
                                <p className="pl-8">waitFor: <span className="text-blue-300">3000</span>,</p>
                                <p className="pl-8">cleanData: <span className="text-emerald-400">true</span></p>
                                <p>{'}'});</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="p-10 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]/20 hover:border-[var(--primary-blue)]/30 transition-all hover:bg-white hover:shadow-xl">
                            <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 opacity-40 flex items-center gap-3">
                                <FiServer className="text-[var(--primary-blue)]" /> Secure Transit
                            </h4>
                            <p className="text-[var(--text-secondary)] text-sm font-bold leading-relaxed opacity-50">Fully encrypted data pipelines with TLS 1.3 support for secure transit across all extraction nodes.</p>
                        </div>
                        <div className="p-10 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]/20 hover:border-[var(--primary-blue)]/30 transition-all hover:bg-white hover:shadow-xl">
                            <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-6 opacity-40 flex items-center gap-3">
                                <FiDatabase className="text-[var(--primary-blue)]" /> Data Structuring
                            </h4>
                            <p className="text-[var(--text-secondary)] text-sm font-bold leading-relaxed opacity-50">Automated conversion of unstructured web elements into clean, standardized JSON objects ready for integration.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Docs;
