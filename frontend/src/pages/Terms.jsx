import { motion } from 'framer-motion';
import { FiFileText, FiAlertCircle, FiShield, FiActivity, FiX } from 'react-icons/fi';

const Terms = () => {
    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-none"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-20">
                    <div className="p-8 bg-black rounded-[2.5rem] text-white text-5xl shadow-2xl group hover:bg-[var(--primary-blue)] transition-all duration-500 w-fit shrink-0">
                        <FiFileText className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <FiShield className="text-[var(--primary-blue)]" />
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-1 block opacity-40 italic">Legal Framework v3.0</span>
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-black text-[var(--text-primary)] tracking-tight uppercase leading-none italic">
                            Service <span className="text-[var(--primary-blue)]">Terms</span>
                        </h1>
                    </div>
                </div>

                <div className="p-12 bg-amber-50 border-2 border-amber-100 rounded-[3rem] mb-24 flex flex-col md:flex-row gap-8 items-start shadow-xl shadow-amber-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="p-4 bg-amber-100/50 rounded-2xl">
                        <FiAlertCircle className="text-amber-600 shrink-0" size={32} />
                    </div>
                    <p className="text-lg text-amber-900 font-bold leading-relaxed italic opacity-80 uppercase tracking-tight">
                        OPERATOR NOTICE: By utilizing the WebExtract interface, you explicitly agree to maintain
                        compliance with all jurisdictional regulations regarding automated data retrieval and intellectual property protection protocols.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {[
                        { num: "01", title: "Operating Constraints", text: "The system is prohibited for use against resources that explicitly restrict automated access via robots.txt or site-specific terms. It is the operator's responsibility to verify extraction rights before initializing a sequence in our engine." },
                        { num: "02", title: "Restricted Nodes", text: "Targeting government databases, classified information stores, or unauthorized private endpoints is strictly forbidden. The engine is tuned for public-domain information retrieval only; any violation results in immediate node termination." },
                        { num: "03", title: "System Fidelity", text: "Service is provided on an elite 'as-is' basis. While we maintain a high success rate, extraction fidelity may be impacted by advanced anti-bot measures, biometric challenges, or rate-limiting protocols on target servers." },
                        { num: "04", title: "Liability Limitation", text: "WebExtract remains a platform for technical facilitation. We assume no liability for the misuse of extracted intelligence or any jurisdictional disputes arising from the application of our automated research tools." }
                    ].map((section, idx) => (
                        <div key={idx} className="group p-12 bg-white rounded-[3.5rem] border-2 border-[var(--border-color)] hover:border-[var(--primary-blue)]/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-6 mb-8 group-hover:translate-x-2 transition-transform duration-500">
                                <span className="text-4xl font-black text-[var(--primary-blue)] italic opacity-40 leading-none">{section.num}</span>
                                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter italic">{section.title}</h2>
                            </div>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium opacity-60 italic group-hover:opacity-100 transition-opacity">
                                {section.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-16 bg-black text-white rounded-[4rem] text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <FiActivity size={32} className="text-[var(--primary-blue)]" />
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic">End-User Handshake</h3>
                        </div>
                        <p className="max-w-3xl mx-auto text-xl font-medium opacity-40 leading-relaxed mb-12 italic uppercase tracking-tighter">
                            By proceeding, you acknowledge that you are an authorized operator and agree to the
                            Terms of Service defined above. Unauthorized use may trigger a breach protocol.
                        </p>
                        <button className="px-16 py-8 bg-[var(--primary-blue)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95">
                            Verify Identity and Accept
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
