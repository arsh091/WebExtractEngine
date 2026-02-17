import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiExternalLink, FiClock } from 'react-icons/fi';

const HistorySidebar = ({ isOpen, onClose, history, onSelect, onClear }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-slate-800 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiClock className="text-2xl text-primary-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-colors"
                                aria-label="Close history"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {history.length > 0 ? (
                                <div className="space-y-3">
                                    {history.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="group p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 hover:border-primary-500/50 transition-all cursor-pointer"
                                            onClick={() => {
                                                onSelect(item.url);
                                                onClose();
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2 text-primary-500 text-sm font-medium truncate flex-1">
                                                    <FiExternalLink className="shrink-0" />
                                                    <span className="truncate">{item.url}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1 whitespace-nowrap">
                                                    <FiClock />
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className="flex gap-4 text-[11px] text-gray-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <b className="text-gray-700 dark:text-slate-300">{item.data.phones?.length || 0}</b> Phones
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <b className="text-gray-700 dark:text-slate-300">{item.data.emails?.length || 0}</b> Emails
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <b className="text-gray-700 dark:text-slate-300">{item.data.addresses?.length || 0}</b> Addresses
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <FiClock className="text-6xl mb-4 text-gray-300" />
                                    <p className="text-gray-500 font-medium">No history yet</p>
                                    <p className="text-xs max-w-[200px] mt-2 leading-relaxed">Your extracted data will appear here for quick access.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {history.length > 0 && (
                            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                                <button
                                    onClick={onClear}
                                    className="w-full py-3 flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 font-medium"
                                >
                                    <FiTrash2 />
                                    Clear History
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HistorySidebar;
