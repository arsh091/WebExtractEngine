import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

const ExtractorForm = ({ onExtract, onReset, loading, inputRef }) => {
    const [url, setUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        // GSAP animation on mount
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.4 }
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
            // Shake animation
            gsap.to(containerRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4
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
        <div ref={containerRef} className="w-full max-w-4xl mx-auto z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-cyan-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (!isValidUrl) setIsValidUrl(true);
                            }}
                            placeholder="Enter website URL (e.g., https://example.com) • Ctrl + K"
                            className={`w-full px-8 py-5 bg-white dark:bg-slate-900 border-2 
                ${isValidUrl ? 'border-gray-100 dark:border-slate-800 focus:border-primary-500' : 'border-red-500'} 
                rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 
                focus:outline-none focus:ring-4 focus:ring-primary-500/10
                transition-all duration-300 shadow-xl`}
                            disabled={loading}
                            aria-label="Website URL"
                            aria-invalid={!isValidUrl}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 pointer-events-none">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400">CTRL</kbd>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400">K</kbd>
                        </div>
                    </div>
                    {!isValidUrl && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-3 ml-2 font-medium flex items-center gap-2 animate-fade-in">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            Please enter a valid website URL (including https://)
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="flex-[2] bg-primary-500 hover:bg-primary-600 
              text-white font-bold py-5 px-8 rounded-2xl 
              hover:scale-[1.02] active:scale-95 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary-500/25"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span className="tracking-wide">ANALYZING SOURCE...</span>
                            </>
                        ) : (
                            <>
                                <FiSearch className="text-2xl" />
                                <span className="tracking-wide">EXTRACT INTELLIGENCE</span>
                            </>
                        )}
                    </button>

                    {url && (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={loading}
                            className="flex-1 px-8 py-5 bg-gray-100 dark:bg-slate-800 
                text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 
                transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-gray-300 dark:hover:border-slate-600 font-bold"
                        >
                            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                            CLEAR
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ExtractorForm;
