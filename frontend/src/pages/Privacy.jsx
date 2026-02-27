import { motion } from 'framer-motion';
import { FiLock, FiEye, FiCheckCircle, FiShield, FiActivity } from 'react-icons/fi';

const Privacy = () => {
    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-16">
                    <div className="p-8 bg-black rounded-[2.5rem] text-white text-5xl shadow-2xl group hover:bg-[var(--primary-blue)] transition-all duration-500 w-fit shrink-0">
                        <FiShield className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-100 italic">
                            <FiLock className="animate-pulse" /> Final Payload Audit: February 2026
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-black text-[var(--text-primary)] tracking-tight uppercase leading-none italic">
                            Privacy <span className="text-[var(--primary-blue)]">Protocols</span>
                        </h1>
                    </div>
                </div>

                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-5xl leading-relaxed opacity-60 mb-20 italic">
                    At WebExtract, data integrity and operational transparency are the core pillars of our infrastructure.
                    This policy defines the standards for information handling during the extraction cycle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="p-16 bg-white rounded-[4rem] border-2 border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiEye className="text-[var(--primary-blue)] text-4xl mb-12 bg-[var(--bg-secondary)] p-5 rounded-2xl w-fit group-hover:bg-white group-hover:shadow-2xl transition-all duration-500" />
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] mb-6 italic">Volatile Storage Matrix</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-black opacity-60 italic">
                            Information results are stored in volatile session memory. We do not persist raw captured content
                            on our centralized node network beyond the immediate processing window.
                        </p>
                    </div>
                    <div className="p-16 bg-white rounded-[4rem] border-2 border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FiCheckCircle className="text-[var(--primary-blue)] text-4xl mb-12 bg-[var(--bg-secondary)] p-5 rounded-2xl w-fit group-hover:bg-white group-hover:shadow-2xl transition-all duration-500" />
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em] mb-6 italic">Zero Monetization Handshake</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-black opacity-60 italic">
                            WebExtract does not monetize your extracted intelligence. The analytical relationship remains strictly
                            between the authenticated operator and the target resource.
                        </p>
                    </div>
                </div>

                <div className="space-y-20">
                    {[
                        { num: "01", title: "Intelligence Capture", text: "The system collects anonymous telemetry regarding engine health, protocol success rates, and performance metrics. Your specific extracted datasets (Communications, IDs, Locations) are exclusive to your user profile and cryptographically isolated." },
                        { num: "02", title: "Terminal Cache", text: "We utilize standard browser persistence to maintain session tokens, interface preferences, and recent extraction logs. This data is isolated to the local terminal and never traverses the public internet in unencrypted formats." },
                        { num: "03", title: "Direct Handshake", text: "The extraction node establishes a direct handshake with recipient servers using encrypted TLS 1.3 protocols, ensuring no unauthorized interception during the data transmission phase of the intelligence cycle." }
                    ].map((section, idx) => (
                        <section key={idx} className="group flex flex-col md:flex-row gap-12 p-10 hover:bg-white rounded-[3rem] transition-all hover:shadow-xl border-2 border-transparent hover:border-[var(--border-color)]">
                            <div className="text-6xl md:text-8xl font-black text-[var(--primary-blue)] opacity-10 italic group-hover:opacity-100 transition-opacity duration-500 leading-none">
                                {section.num}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6 italic flex items-center gap-4">
                                    <div className="w-2 h-2 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                                    {section.title}
                                </h2>
                                <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-medium opacity-60 max-w-4xl italic">
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

export default Privacy;
