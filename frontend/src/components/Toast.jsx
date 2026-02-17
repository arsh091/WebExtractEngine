import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

const Toast = ({ message, type = 'success', onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed top-20 md:top-24 left-4 right-4 md:left-auto md:right-6 z-[101] flex justify-center md:block"
        >
            <div className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border backdrop-blur-xl w-full max-w-sm md:max-w-md ${type === 'success'
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}>
                {type === 'success' ? (
                    <HiCheckCircle className="text-2xl shrink-0" />
                ) : (
                    <HiExclamationCircle className="text-2xl shrink-0" />
                )}
                <p className="font-medium whitespace-nowrap">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <HiX className="text-xl" />
                </button>
            </div>
        </motion.div>
    );
};

export default Toast;
