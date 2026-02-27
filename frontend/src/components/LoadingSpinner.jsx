import { FiActivity, FiCpu, FiLoader } from 'react-icons/fi';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center p-32 relative overflow-hidden">
            <div className="relative">
                {/* Main Spinner */}
                <div className="w-24 h-24 rounded-full border-[10px] border-blue-50 border-t-black animate-spin relative z-10 shadow-2xl"></div>

                {/* Secondary Spinner */}
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-b-[var(--primary-blue)] animate-spin-slow opacity-60"></div>

                {/* Center Point */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                </div>
            </div>

            <div className="mt-12 text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FiCpu className="text-[var(--primary-blue)] animate-pulse" />
                    <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase italic">Resolving Neural Node</h3>
                </div>
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-40 animate-shimmer italic">Establishing authorized data handshake...</p>
            </div>

            {/* Matrix Stats */}
            <div className="mt-10 flex gap-4 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-[var(--border-color)]/30">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-3 bg-black/10 rounded-full overflow-hidden"
                    >
                        <div
                            className="w-full h-full bg-black animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSpinner;
