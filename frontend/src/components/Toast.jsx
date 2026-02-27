import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX, FiActivity, FiInfo, FiDatabase, FiBell } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed top-24 right-6 z-[1000] w-full max-w-sm pointer-events-none"
        >
            <div className={`pointer-events-auto relative overflow-hidden flex items-center gap-5 px-6 py-6 rounded-[2rem] shadow-2xl border-2 bg-white transition-all ${type === 'success'
                ? 'border-emerald-100/50'
                : 'border-red-100/50'
                }`}>

                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-all ${type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {type === 'success' ? (
                        <FiCheckCircle size={24} className="animate-pulse" />
                    ) : (
                        <FiAlertCircle size={24} className="animate-bounce" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 opacity-40">
                        {type === 'success' ? <FiDatabase size={10} /> : <FiActivity size={10} />}
                        <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] italic">
                            {type === 'success' ? 'Protocol Sync' : 'Infrastructure Alert'}
                        </p>
                    </div>
                    <p className={`font-black text-sm uppercase italic tracking-tight leading-tight ${type === 'success' ? 'text-[var(--text-primary)]' : 'text-red-700'}`}>
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl transition-all text-[var(--text-secondary)] hover:bg-black hover:text-white shrink-0"
                >
                    <FiX size={16} />
                </button>

                {/* Animated Progress Bar */}
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 4, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
                />
            </div>
        </motion.div>
    );
};

export default Toast;
