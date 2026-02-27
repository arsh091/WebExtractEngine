import { motion } from 'framer-motion';
import { FiBook, FiCode, FiZap, FiShield, FiCpu, FiCommand, FiActivity, FiLayers } from 'react-icons/fi';

const Docs = () => {
    const sections = [
        {
            title: "Quick Start",
            icon: <FiZap />,
            content: "Initiate extraction by submitting a target domain. Our engine performs immediate DOM analysis before scaling to dynamic browser instantiation if necessary."
        },
        {
            title: "Advanced Scrutiny",
            icon: <FiCpu />,
            content: "We utilize proprietary identification algorithms optimized for detecting high-value data points across international standards with ultra-low false-positive rates."
        },
        {
            title: "Compliance Node",
            icon: <FiShield />,
            content: "Operations are performed in alignment with standard rate limitations and ethical scraping protocols to maintain target infrastructure integrity."
        }
    ];

    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-12">
                    <div className="p-8 bg-black rounded-[2.5rem] text-white text-5xl shadow-2xl group hover:bg-[var(--primary-blue)] transition-all duration-500 w-fit">
                        <FiBook className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <FiCommand className="text-[var(--primary-blue)]" />
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-40 italic">Interface Procedures & Manuals</span>
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-black text-[var(--text-primary)] tracking-tight uppercase leading-none italic">
                            Operational <span className="text-[var(--primary-blue)]">Docs</span>
                        </h1>
                    </div>
                </div>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-5xl leading-relaxed opacity-60">
                    Master the WebExtract interface and infrastructure. Learn how to configure your
                    environment for maximum throughput, stealth bypass, and high-fidelity intelligence gathering.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-12 bg-white rounded-[3.5rem] border-2 border-[var(--border-color)] hover:border-[var(--primary-blue)]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-4xl text-[var(--primary-blue)] mb-10 bg-[var(--bg-secondary)] p-5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                            {section.icon}
                        </div>
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] mb-6 uppercase tracking-[0.3em] italic">
                            {section.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed opacity-60 italic">
                            {section.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="max-w-none space-y-20">
                <section className="bg-white rounded-[4rem] p-16 border-2 border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl text-[var(--primary-blue)] shadow-sm">
                            <FiLayers size={32} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">
                            Technical <span className="text-[var(--primary-blue)]">Architecture</span>
                        </h2>
                    </div>

                    <p className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed mb-16 opacity-60 max-w-5xl relative z-10">
                        The infrastructure leverages a dual-stack configuration. For high-speed parsing, we utilize a
                        highly optimized Node.js core. For dynamic content handling, we fallback to a virtualized Chromium
                        environment with automated proxy rotation and fingerprint randomization.
                    </p>

                    <div className="relative group/code z-10">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-blue)] to-blue-400 rounded-[2.5rem] blur opacity-20 group-hover/code:opacity-40 transition duration-1000"></div>
                        <div className="relative p-12 bg-black rounded-[2.5rem] border border-white/10 font-mono text-sm text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-x-auto">
                            <div className="absolute top-8 right-10 flex gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                            </div>
                            <div className="flex items-center gap-4 mb-8 opacity-30 text-[10px] uppercase font-black tracking-[0.4em]">
                                <FiActivity /> Handshake Protocol Example
                            </div>
                            <div className="space-y-2">
                                <p><span className="text-blue-400 font-bold">const</span> engine = <span className="text-emerald-400 font-bold">new</span> WebExtractEngine({'{'}</p>
                                <p className="pl-8">auth: <span className="text-amber-300 italic">'managed-handshake-key'</span>,</p>
                                <p className="pl-8">concurrency: <span className="text-indigo-400 font-black">25</span>,</p>
                                <p className="pl-8">stealth: <span className="text-purple-400 font-black">true</span>,</p>
                                <p className="pl-8">resolution: <span className="text-amber-300 italic">'deep-intelligence-scan'</span></p>
                                <p>{'}'});</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] hover:border-[var(--primary-blue)]/30 transition-all">
                            <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] mb-4 opacity-40 italic">Network Layer</h4>
                            <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed opacity-60">Full TLS 1.3 support with automated peer identity verification and encrypted data transit across all nodes.</p>
                        </div>
                        <div className="p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] hover:border-[var(--primary-blue)]/30 transition-all">
                            <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] mb-4 opacity-40 italic">Data Mutation</h4>
                            <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed opacity-60">Automated normalization of unstructured DOM elements into crytographically signed JSON objects.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Docs;
