import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from '../components/Hero';
import ExtractorForm from '../components/ExtractorForm';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';

import { useExtractor } from '../hooks/useExtractor';
import { useHistory } from '../hooks/useHistory';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const Home = ({ onOpenHistory, addToHistory, isHistoryOpen }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading, data, error, extractData, resetData } = useExtractor();
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);
    const inputRef = useRef(null);

    // Auto-extract if URL param exists
    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam && inputRef.current && !loading && !data) {
            inputRef.current.value = urlParam;
            handleExtract(urlParam);
            // Clear param after starting extraction to avoid loops
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, loading, data]);

    // Initialize progress simulation when loading
    useEffect(() => {
        let interval;
        if (loading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 800);
        } else {
            setProgress(100);
            const timer = setTimeout(() => setProgress(0), 1000);
            return () => clearTimeout(timer);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Success handling
    useEffect(() => {
        if (data && !loading) {
            setTimeout(() => {
                const element = document.getElementById('results-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [data, loading]);

    const handleExtract = async (url) => {
        try {
            const result = await extractData(url);
            addToHistory(url, result.data);
            showNotification('Extraction complete!', 'success');
        } catch (err) {
            showNotification(err.message || 'Analysis failed', 'error');
        }
    };

    const handleReset = () => {
        resetData();
        showNotification('Workspace cleared', 'success');
    };

    const showNotification = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        focusInput: () => inputRef.current?.focus(),
        submit: () => {
            if (document.activeElement !== inputRef.current && inputRef.current?.value) {
                handleExtract(inputRef.current.value);
            }
        },
        clear: handleReset,
        toggleHistory: onOpenHistory
    });

    return (
        <main className="relative">
            <Hero />

            <div className="container mx-auto px-4 -mt-20 relative z-10 pb-32">
                <ExtractorForm
                    onExtract={handleExtract}
                    onReset={handleReset}
                    loading={loading}
                    inputRef={inputRef}
                />

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-12"
                        >
                            <ProgressBar progress={progress} />
                            <LoadingSpinner />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div id="results-section">
                    <AnimatePresence mode="wait">
                        {data && !loading && (
                            <ResultsDisplay
                                data={data}
                                onNotification={showNotification}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto text-center mt-12 p-6 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/40 rounded-2xl text-red-600 dark:text-red-400 shadow-xl"
                        >
                            <p className="font-bold text-lg mb-2 text-red-500">EXTRACTION ERROR</p>
                            <p className="opacity-80 font-medium">{error}</p>
                            <button
                                onClick={() => handleExtract(inputRef.current?.value)}
                                className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all text-sm"
                            >
                                RETRY ANALYSIS
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            {/* Shortcuts Help - Keyboard visible only */}
            <div className="fixed bottom-6 left-6 hidden lg:flex flex-col gap-2 pointer-events-none opacity-20 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 dark:text-slate-500">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-slate-300 font-sans">CTRL + K</kbd>
                    FOCUS SEARCH
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 dark:text-slate-500">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-slate-300 font-sans">CTRL + D</kbd>
                    TOGGLE THEME
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 dark:text-slate-500">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-slate-300 font-sans">CTRL + H</kbd>
                    VIEW HISTORY
                </div>
            </div>
        </main>
    );
};

export default Home;
