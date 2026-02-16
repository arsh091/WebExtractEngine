import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiX } from 'react-icons/fi';

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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[100]"
                >
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 shadow-2xl rounded-3xl p-6 backdrop-blur-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl shrink-0">
                                <FiShield size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 italic">Cookie Settings</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                                    We use cookies to enhance your intelligence workflows and analyze our system traffic.
                                    By clicking "Accept", you agree to our processing protocols.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 text-sm uppercase tracking-widest"
                                    >
                                        Accept All
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all font-bold text-xs uppercase"
                                    >
                                        Decline
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
