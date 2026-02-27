import { useEffect, useRef } from 'react';
import { FiActivity } from 'react-icons/fi';

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 mb-16">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FiActivity className="text-[var(--primary-blue)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-blue)] italic">Real-Time Extraction Progress</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[var(--text-primary)] italic tabular-nums leading-none tracking-tighter">{progress}</span>
                    <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">% Completed</span>
                </div>
            </div>

            <div className="h-4 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border-2 border-[var(--border-color)] relative p-0.5 shadow-inner">
                <div
                    className="h-full bg-black rounded-full transition-all duration-700 ease-out relative shadow-2xl"
                    style={{ width: `${progress}%` }}
                >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                    {/* Animated Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-[var(--border-color)]/50 shadow-sm">
                <div className="flex gap-3">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="relative">
                            <div className={`w-3 h-3 rounded-full transition-all duration-700 ${progress > (i * 20) ? 'bg-[var(--primary-blue)] shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-[var(--border-color)]'}`}></div>
                            {progress > (i * 20) && (
                                <div className="absolute inset-0 rounded-full border border-[var(--primary-blue)] animate-ping opacity-20"></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] italic opacity-40">Scanning Global Network Clusters...</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-[var(--primary-blue)] rounded-full animate-pulse"></div>
                        <div className="w-1 h-3 bg-[var(--primary-blue)] rounded-full animate-pulse delay-75"></div>
                        <div className="w-1 h-3 bg-[var(--primary-blue)] rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
