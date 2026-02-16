import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-8">
            <div className="relative w-32 h-32">
                {/* Pulsing Outer Glow */}
                <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-full animate-pulse blur-2xl"></div>

                {/* Animated Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-[3px] border-gray-100 dark:border-slate-800 rounded-full"
                />

                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-[3px] border-transparent border-t-primary-500 rounded-full"
                />

                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-10 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                />

                {/* Orbit Dots */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_10px_rgb(14,165,233)]"></div>
                </motion.div>
            </div>

            <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    DEEP SCANNING <span className="text-primary-500 animate-pulse">...</span>
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm font-medium uppercase tracking-[0.2em] max-w-xs mx-auto">
                    Resolving website nodes and extracting patterns
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
