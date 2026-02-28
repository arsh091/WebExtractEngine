import { motion } from 'framer-motion';
import { FiLock, FiEye, FiCheckCircle, FiShield, FiActivity, FiGlobe, FiLayers, FiShieldOff, FiSearch, FiFileText } from 'react-icons/fi';

const Privacy = () => {
    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-24">
                    <div className="p-10 bg-black rounded-[3rem] text-white text-5xl shadow-2xl shrink-0">
                        <FiShield />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                            <FiLock className="animate-pulse" /> Updated: February 2026
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            Privacy <span className="text-[var(--primary-blue)]">Policy</span>
                        </h1>
                    </div>
                </div>

                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-5xl leading-relaxed opacity-60 mb-32">
                    Transparency and security are at the core of our operations. This policy outlines how we handle data and ensure the privacy of our users and their extraction activities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="pro-card p-16 bg-white border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <FiEye className="text-[var(--primary-blue)] text-4xl mb-12 bg-blue-50 p-6 rounded-[2rem] w-fit group-hover:bg-black group-hover:text-white transition-all duration-500" />
                        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6">Data Persistence</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-bold opacity-50">
                            Extraction results are stored securely in your private vault. We do not persist raw captured content
                            beyond your authorized session requirements.
                        </p>
                    </div>
                    <div className="pro-card p-16 bg-white border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <FiCheckCircle className="text-[var(--primary-blue)] text-4xl mb-12 bg-blue-50 p-6 rounded-[2rem] w-fit group-hover:bg-black group-hover:text-white transition-all duration-500" />
                        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6">No Data Monetization</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-bold opacity-50">
                            We never sell or profile your extracted datasets. Your research intelligence belongs exclusively to you
                            and is protected by enterprise-grade encryption.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    {[
                        { num: "01", title: "Information Collection", text: "We collect minimal telemetry to ensure the reliability of our extraction engine. This includes system performance metrics and error logs. Your specific search queries and results are private and isolated to your account." },
                        { num: "02", title: "Security Protocols", text: "All data transmissions are protected by high-standard TLS encryption. We regularly audit our infrastructure to identify and mitigate potential vulnerabilities, ensuring a safe environment for your data." },
                        { num: "03", title: "User Control", text: "You have complete control over your extraction history. You can purge your records at any time, which permanently deletes all associated data from our servers." }
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

export default Privacy;
