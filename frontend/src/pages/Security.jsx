import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiHash, FiUnlock, FiLock, FiActivity, FiLayers } from 'react-icons/fi';

const Security = () => {
    const protocols = [
        { title: "TLS 1.3 ENCRYPTION", desc: "All outbound handshakes between the node cluster and target domains are secured via industry-standard TLS 1.3 encryption protocols.", icon: <FiLock /> },
        { title: "SANDBOXED UNITS", desc: "Chromium instances used for dynamic rendering are fully isolated at the kernel level, mitigating cross-process exploitation risks.", icon: <FiCpu /> },
        { title: "ZERO-PERSISTENCE", desc: "The extraction pipeline is strictly ephemeral; knowledge results are purged from CPU registers immediately after user delivery.", icon: <FiHash /> }
    ];

    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-32 text-center"
            >
                <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl group hover:bg-[var(--primary-blue)] transition-all duration-500">
                    <FiShield className="text-white text-5xl group-hover:rotate-12 transition-transform" />
                </div>
                <h1 className="text-5xl md:text-[9.5rem] font-black text-[var(--text-primary)] tracking-tight mb-10 uppercase italic leading-none">
                    Hardened <br />
                    <span className="text-[var(--primary-blue)]">Security</span>
                </h1>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-5xl mx-auto font-medium leading-relaxed opacity-60 px-4 italic">
                    Enterprise-grade protocols engineered to protect your intelligence workflows with total operational transparency and cryptographic integrity.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
                {protocols.map((p, i) => (
                    <div key={i} className="p-16 bg-white border-2 border-[var(--border-color)] rounded-[4rem] relative overflow-hidden group shadow-2xl transition-all duration-500 hover:border-[var(--primary-blue)]/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-4xl text-[var(--primary-blue)] mb-12 bg-[var(--bg-secondary)] p-5 rounded-2xl w-fit group-hover:bg-white group-hover:shadow-2xl transition-all duration-700">{p.icon}</div>
                        <h3 className="text-[10px] font-black text-[var(--text-primary)] mb-6 uppercase tracking-[0.4em] italic">{p.title}</h3>
                        <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-black opacity-60 italic group-hover:opacity-100 transition-opacity">{p.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-black rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl border-none group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                <div className="max-w-4xl relative z-10">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-[var(--primary-blue)] transition-colors">
                            <FiActivity size={40} className="text-white" />
                        </div>
                        <h2 className="text-4xl md:text-[6rem] font-black mb-0 uppercase tracking-tighter italic leading-none">Vulnerability <span className="text-[var(--primary-blue)]">Bounty</span></h2>
                    </div>
                    <p className="text-white/40 mb-16 text-xl md:text-2xl font-medium leading-relaxed italic max-w-3xl">
                        We prioritize the security of our infrastructure. If you identify a potential vulnerability
                        within the extraction engine, we invite you to participate in our coordinated disclosure program.
                    </p>
                    <a
                        href="mailto:security@webextract.com"
                        className="inline-flex items-center gap-6 px-16 py-8 bg-[var(--primary-blue)] text-white font-black rounded-[2rem] hover:bg-white hover:text-black transition-all tracking-[0.4em] uppercase text-[10px] shadow-2xl active:scale-95 italic"
                    >
                        Contact Integrity Team <FiUnlock size={20} />
                    </a>
                </div>
                <FiUnlock className="absolute -bottom-20 -right-20 text-[35rem] opacity-5 -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
            </div>
        </div>
    );
};

export default Security;
