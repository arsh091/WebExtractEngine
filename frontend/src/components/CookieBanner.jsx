import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiX, FiCheck, FiInfo } from 'react-icons/fi';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
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
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-[120]"
                >
                    <div className="pro-card p-8 bg-[var(--bg-main)] border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--primary-blue)]/5 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[var(--primary-blue)]/10 text-[var(--primary-blue)] rounded-xl">
                                        <FiShield size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Cookie Preferences</h3>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] transition-colors"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                We use essential cookies to provide a secure and reliable experience.
                                By continuing to use our platform, you agree to our
                                <a href="/cookies" className="text-[var(--primary-blue)] hover:underline ml-1">Cookie Policy</a>.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 pro-button pro-button-primary py-3 text-sm font-bold"
                                >
                                    <FiCheck size={16} /> Accept All
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="flex-1 pro-button pro-button-secondary py-3 text-sm font-bold"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
