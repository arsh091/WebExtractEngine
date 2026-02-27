import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiExternalLink, FiClock, FiFileText } from 'react-icons/fi';

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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-[210] border-l border-[var(--border-color)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-[var(--primary-blue)] rounded-lg">
                                    <FiClock size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Recent Activity</h2>
                                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest opacity-60">Extraction History</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]"
                                aria-label="Close history"
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {history.length > 0 ? (
                                <div className="space-y-4">
                                    {history.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group p-5 bg-white border border-[var(--border-color)] rounded-2xl hover:border-[var(--primary-blue)]/50 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                            onClick={() => {
                                                onSelect(item.url);
                                                onClose();
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 text-[var(--primary-blue)] text-sm font-bold truncate flex-1">
                                                    <FiExternalLink className="shrink-0" />
                                                    <span className="truncate">{item.url}</span>
                                                </div>
                                                <span className="text-[10px] text-[var(--text-secondary)] font-bold flex items-center gap-1.5 whitespace-nowrap opacity-60">
                                                    <FiClock />
                                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className="flex gap-5 text-[11px] font-medium text-[var(--text-secondary)]">
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] rounded-lg">
                                                    <FiFileText size={10} />
                                                    <b className="text-[var(--text-primary)] font-bold">{item.data.phones?.length || 0}</b> P
                                                </span>
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] rounded-lg">
                                                    <FiFileText size={10} />
                                                    <b className="text-[var(--text-primary)] font-bold">{item.data.emails?.length || 0}</b> E
                                                </span>
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] rounded-lg">
                                                    <FiFileText size={10} />
                                                    <b className="text-[var(--text-primary)] font-bold">{item.data.addresses?.length || 0}</b> A
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                    <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center mb-6 text-[var(--text-secondary)] opacity-30">
                                        <FiClock size={40} />
                                    </div>
                                    <p className="text-[var(--text-primary)] font-bold mb-2">No History Found</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed opacity-60">Your recent extractions will be cached here for quick access.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {history.length > 0 && (
                            <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                                <button
                                    onClick={onClear}
                                    className="w-full py-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                >
                                    <FiTrash2 />
                                    Clear All History
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
