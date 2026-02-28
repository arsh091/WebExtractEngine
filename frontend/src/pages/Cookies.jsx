import { motion } from 'framer-motion';
import { FiDatabase, FiSettings, FiCheck, FiInfo, FiShield } from 'react-icons/fi';

const Cookies = () => {
    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
            >
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-24">
                    <div className="p-10 bg-black rounded-[3rem] text-white text-5xl shadow-2xl shrink-0">
                        <FiDatabase />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                            <FiSettings /> Optimized Experience v2.0
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            Cookie <span className="text-[var(--primary-blue)]">Policy</span>
                        </h1>
                    </div>
                </div>

                {/* Info Box */}
                <div className="p-12 bg-blue-50/50 border border-blue-100 rounded-[3rem] mb-32 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="p-5 bg-white rounded-2xl shadow-sm border border-blue-100 text-[var(--primary-blue)] group-hover:bg-black group-hover:text-white transition-all duration-500">
                        <FiInfo size={32} />
                    </div>
                    <p className="text-lg text-[var(--text-primary)] font-bold leading-relaxed opacity-70">
                        We use essential cookies and similar technologies to ensure the platform functions correctly and to remember your preferences for a more personalized experience.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { title: "Essential", text: "Required for basic site functionality, such as security, account authentication, and session management.", icon: FiShield },
                        { title: "Preference", text: "Allowing us to remember your settings and display choices, such as theme preference and dashboard layout.", icon: FiSettings },
                        { title: "Performance", text: "Anonymous telemetry that helps us understand engine performance and identify potential technical bottlenecks.", icon: FiDatabase }
                    ].map((item, idx) => (
                        <div key={idx} className="group p-10 bg-white rounded-[3rem] border border-[var(--border-color)] hover:border-[var(--primary-blue)]/20 hover:shadow-2xl transition-all duration-500">
                            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white transition-all">
                                <item.icon size={24} className="text-[var(--primary-blue)] group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">{item.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-bold opacity-50">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="space-y-12">
                    {[
                        { num: "01", title: "Managing Cookies", text: "You can manage or disable cookies through your browser settings. Please note that disabling essential cookies may impact the performance and functionality of the extraction engine." },
                        { num: "02", title: "Data Privacy", text: "Our cookies do not store personally identifiable information. Any telemetry gathered is anonymous and used strictly for infrastructure optimization." }
                    ].map((section, idx) => (
                        <section key={idx} className="group flex flex-col md:flex-row gap-16 p-12 bg-[var(--bg-secondary)] rounded-[3rem] border border-transparent hover:border-[var(--border-color)] hover:bg-white hover:shadow-2xl transition-all duration-500">
                            <div className="text-7xl md:text-9xl font-black text-[var(--primary-blue)] opacity-5 group-hover:opacity-10 transition-opacity duration-500 leading-none select-none">
                                {section.num}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-8 flex items-center gap-5">
                                    <div className="w-2.5 h-2.5 bg-black rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>
                                    {section.title}
                                </h2>
                                <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-bold opacity-50 max-w-4xl">
                                    {section.text}
                                </p>
                            </div>
                        </section>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Cookies;
