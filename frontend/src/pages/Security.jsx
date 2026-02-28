import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiHash, FiUnlock, FiLock, FiActivity, FiLayers, FiShieldOff, FiGlobe, FiDatabase, FiServer, FiCheck } from 'react-icons/fi';

const Security = () => {
    const protocols = [
        { title: "Advanced Encryption", desc: "All data transmissions between our infrastructure and target domains are secured via industry-standard TLS 1.3 encryption protocols.", icon: <FiLock /> },
        { title: "Isolated Processing", desc: "Our extraction nodes run in fully isolated environments at the kernel level, ensuring zero cross-process exploitation risks.", icon: <FiServer /> },
        { title: "Privacy First", desc: "We adhere to a zero-persistence policy for raw extraction data. Results are purged immediately after being delivered to your dashboard.", icon: <FiShield /> }
    ];

    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-32 text-center"
            >
                <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center mx-auto mb-14 shadow-2xl">
                    <FiShield className="text-white text-5xl" />
                </div>
                <h1 className="text-5xl md:text-9xl font-black text-[var(--text-primary)] tracking-tight mb-10 uppercase leading-none">
                    Security <br />
                    <span className="text-[var(--primary-blue)]">Infrastructure</span>
                </h1>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-5xl mx-auto font-bold leading-relaxed opacity-50 px-4">
                    Enterprise-grade protection layers engineered to ensure the integrity of your research and data extraction workflows.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                {protocols.map((p, i) => (
                    <div key={i} className="group p-14 bg-white border border-[var(--border-color)] rounded-[3rem] relative overflow-hidden shadow-xl transition-all duration-500 hover:border-[var(--primary-blue)]/30 hover:shadow-2xl hover:translate-y-[-8px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-20 h-20 text-[var(--primary-blue)] mb-10 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700">{p.icon}</div>
                        <h3 className="text-sm font-black text-[var(--text-primary)] mb-6 uppercase tracking-widest">{p.title}</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-bold opacity-40 group-hover:opacity-60 transition-opacity">{p.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-black rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl border-none group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                <div className="max-w-4xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-14">
                        <div className="p-8 bg-white/10 rounded-3xl border border-white/10 group-hover:bg-[var(--primary-blue)] group-hover:scale-110 transition-all duration-500">
                            <FiActivity size={48} className="text-white" />
                        </div>
                        <h2 className="text-4xl md:text-8xl font-black mb-0 uppercase tracking-tighter leading-none text-center md:text-left">Bug Bounty <br /><span className="text-[var(--primary-blue)]">Program</span></h2>
                    </div>
                    <p className="text-white/40 mb-16 text-xl md:text-3xl font-bold leading-relaxed max-w-3xl text-center md:text-left">
                        We prioritize the security of our infrastructure. If you identify a potential vulnerability, we invite you to participate in our coordinated disclosure program.
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <a
                            href="mailto:security@webextract.com"
                            className="pro-button pro-button-primary px-16 py-7 shadow-2xl active:scale-95 text-center"
                        >
                            Report a Vulnerability
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
