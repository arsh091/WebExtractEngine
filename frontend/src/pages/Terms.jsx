import { motion } from 'framer-motion';
import { FiFileText, FiAlertCircle, FiShield, FiActivity, FiX, FiCheck, FiInfo } from 'react-icons/fi';

const Terms = () => {
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
                        <FiFileText />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                            <FiShield /> Service Standards v4.0
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            Terms of <span className="text-[var(--primary-blue)]">Service</span>
                        </h1>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="p-12 bg-blue-50/50 border border-blue-100 rounded-[3rem] mb-32 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="p-5 bg-white rounded-2xl shadow-sm border border-blue-100 text-[var(--primary-blue)] group-hover:bg-black group-hover:text-white transition-all duration-500">
                        <FiInfo size={32} />
                    </div>
                    <p className="text-lg text-[var(--text-primary)] font-bold leading-relaxed opacity-70">
                        By using the WebExtract platform, you agree to comply with all applicable laws and regulations regarding automated data collection and professional research ethics.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    {[
                        { num: "01", title: "Acceptable Use", text: "Users must adhere to the robots.txt protocols and specific terms of the target websites. Our system is designed for professional research and data gathering within the bounds of public accessibility." },
                        { num: "02", title: "Service Limits", text: "We provide access on a subscription basis. We reserve the right to limit or suspend accounts that engage in activities that threaten the stability of our extraction nodes or violate our fair-use policy." },
                        { num: "03", title: "Data Accuracy", text: "Extraction fidelity is subject to the source material's availability and formatting. We provide data as-is and do not guarantee the absolute accuracy of information retrieved from third-party servers." },
                        { num: "04", title: "Liability", text: "WebExtract acts as a technical intermediary. We are not responsible for the subsequent use of extracted data or any legal implications arising from the user's research activities." }
                    ].map((section, idx) => (
                        <div key={idx} className="group p-12 bg-white rounded-[3rem] border border-[var(--border-color)] hover:border-[var(--primary-blue)]/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-4xl font-black text-[var(--primary-blue)] opacity-10 group-hover:opacity-100 transition-all duration-500 leading-none">{section.num}</span>
                                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{section.title}</h2>
                            </div>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-bold opacity-50">
                                {section.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Agreement Section */}
                <div className="p-16 bg-black text-white rounded-[4rem] text-center relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all">
                            <FiCheck size={40} className="text-[var(--primary-blue)]" />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-tight">Professional Agreement</h3>
                        <p className="max-w-3xl mx-auto text-xl font-bold opacity-40 leading-relaxed mb-12">
                            By proceeding to use WebExtract, you acknowledge that you have read and understood the terms above and agree to use our tools responsibly and ethically.
                        </p>
                        <button className="pro-button pro-button-primary px-16 py-6 shadow-xl active:scale-95 group-hover:translate-y-[-4px] transition-transform">
                            I Accept the Terms
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
