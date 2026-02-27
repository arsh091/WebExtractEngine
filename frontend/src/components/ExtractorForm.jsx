import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, RotateCcw, ShieldCheck, Globe } from 'lucide-react';

const ExtractorForm = ({ onExtract, onReset, loading, inputRef }) => {
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power4.out' }
        );
    }, []);

    const validateUrl = (value) => {
        if (!value) return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e?.preventDefault();

        if (!url || !validateUrl(url)) {
            setIsValidUrl(false);
            gsap.to(containerRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: 'power2.inOut'
            });
            return;
        }

        setIsValidUrl(true);
        onExtract(url);
    };

    const handleClear = () => {
        setUrl('');
        setIsValidUrl(true);
        onReset();
    };

    return (
        <div ref={containerRef} className="w-full max-w-5xl mx-auto z-10 px-6">
            <form onSubmit={handleSubmit} className="pro-card p-10 md:p-14 relative overflow-hidden bg-white shadow-2xl border border-[var(--border-color)]">
                <div className="flex flex-col gap-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-[var(--text-primary)] font-bold text-2xl tracking-tight">Data Extractor</h3>
                                <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">Enter a URL to analyze</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-700">Secure Connection</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (!isValidUrl) setIsValidUrl(true);
                            }}
                            placeholder="Enter Target URL (https://...)"
                            className={`w-full px-6 py-4 bg-[var(--bg-secondary)] border-2 rounded-xl 
                                ${isValidUrl ? 'border-transparent focus:border-[var(--primary-blue)]/50 focus:bg-white' : 'border-red-500/50 bg-red-50 text-red-900'} 
                                text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 font-medium text-lg
                                transition-all duration-300 outline-none`}
                            disabled={loading}
                        />
                        <div className="text-red-500 text-sm mt-3 ml-2 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            Please enter a valid URL including http:// or https://
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="flex-[2] pro-button pro-button-primary !py-4 text-base disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="font-semibold">Extracting Data...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5" />
                                    <span className="font-semibold">Extract Data</span>
                                </div>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={loading}
                            className="flex-1 pro-button pro-button-secondary !py-4 text-base disabled:opacity-50 border-solid"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="font-semibold">Clear</span>
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ExtractorForm;

