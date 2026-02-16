import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiHash, FiUnlock, FiLock } from 'react-icons/fi';

const Security = () => {
    const protocols = [
        { title: "TLS 1.3 Encryption", desc: "All connections between our engine and target sites are secured via bank-grade TLS 1.3 encryption protocols.", icon: <FiLock /> },
        { title: "Sandboxed Browsing", desc: "Chromium instances used for deep scraping are fully sandboxed, ensuring zero-day vulnerabilities in targets cannot affect our core stability.", icon: <FiCpu /> },
        { title: "Stateless Extraction", desc: "Our extraction processes are stateless; we do not cache your sensitive results after the response is finalized.", icon: <FiHash /> }
    ];

    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-20 text-center"
            >
                <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/20">
                    <FiShield className="text-white text-4xl" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-8">
                    Hardened Security.
                </h1>
                <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto italic">
                    Infrastructure designed to protect your intelligence workflows with enterprise-grade safeguards.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {protocols.map((p, i) => (
                    <div key={i} className="p-8 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="text-3xl text-primary-500 mb-6">{p.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">{p.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border border-white/10">
                <FiUnlock className="absolute top-1/2 -right-20 -translate-y-1/2 text-[25rem] opacity-5 -rotate-12" />
                <div className="max-w-xl relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Vulnerability Disclosure.</h2>
                    <p className="text-slate-400 mb-10 text-lg">
                        We welcome reports from security researchers. If you identify a potential vulnerability in our
                        extraction engine or infrastructure, please contact our security team immediately.
                    </p>
                    <a
                        href="mailto:zubairrazasiddiqui@gmail.com?subject=Security Vulnerability Report - WebExtract AI"
                        className="inline-block px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-primary-500 hover:text-white transition-all tracking-widest uppercase text-xs shadow-xl text-center"
                    >
                        Contact Security Team
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Security;
