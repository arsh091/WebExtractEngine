import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiX, FiCheck, FiDatabase } from 'react-icons/fi';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-10 right-10 left-10 md:left-auto md:w-[480px] z-[120]"
                >
                    <div className="bg-white border-2 border-[var(--border-color)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-start gap-8 relative z-10">
                            <div className="p-5 bg-black text-white rounded-[1.5rem] shrink-0 shadow-2xl group-hover:bg-[var(--primary-blue)] transition-colors duration-500">
                                <FiDatabase size={28} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <FiShield className="text-[var(--primary-blue)] text-xs" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-40 italic">Compliance Node v2</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">Privacy Handshake</h3>
                                    </div>
                                    <button onClick={() => setIsVisible(false)} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl transition-all text-[var(--text-secondary)] hover:bg-black hover:text-white shrink-0">
                                        <FiX size={18} />
                                    </button>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-10 font-bold italic opacity-60 uppercase tracking-tight">
                                    We utilize persistent tokens to improve your extraction experience and ensure system infrastructure security. Protocol authorized by your continued presence.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 bg-black text-white font-black py-5 px-8 rounded-2xl transition-all shadow-2xl active:scale-95 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 italic hover:bg-[var(--primary-blue)]"
                                    >
                                        <FiCheck size={16} /> Accept Handshake
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="px-8 py-5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-2xl hover:bg-white hover:shadow-xl transition-all font-black text-[10px] uppercase tracking-[0.3em] border border-[var(--border-color)] italic"
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
