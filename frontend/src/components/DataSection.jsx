import { motion } from 'framer-motion';
import { HiClipboardCopy, HiOutlineBriefcase } from 'react-icons/hi';

const DataSection = ({ title, icon, data, emptyMessage, onCopy }) => {
    return (
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl overflow-hidden">
            <div className="bg-slate-700/30 px-6 py-4 flex items-center justify-between border-b border-slate-700/30">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-white font-bold">{title}</h3>
                </div>
                <span className="bg-primary-500/20 text-primary-400 text-xs font-bold px-2 py-1 rounded-full">
                    {data.length} found
                </span>
            </div>

            <div className="p-4">
                {data.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {data.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group flex items-center justify-between bg-appDark/30 hover:bg-appDark/50 p-3 rounded-xl border border-transparent hover:border-slate-600/50 transition-all"
                            >
                                <span className="text-slate-300 font-medium truncate flex-1 mr-4">{item}</span>
                                <button
                                    onClick={() => onCopy(item)}
                                    className="p-2 text-slate-500 hover:text-primary-400 hover:rotate-[360deg] transition-all duration-500"
                                    title="Copy to clipboard"
                                >
                                    <HiClipboardCopy className="text-xl" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="text-slate-600 text-4xl mb-3 opacity-20">
                            {icon}
                        </div>
                        <p className="text-slate-500 italic">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataSection;
