import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import Hero from '../components/Hero';
import ExtractorForm from '../components/ExtractorForm';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import BulkProcessor from '../components/BulkProcessor';

import { useExtractor } from '../hooks/useExtractor';
import { useHistory } from '../hooks/useHistory';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const Home = ({ onOpenHistory, addToHistory, isHistoryOpen }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { loading, data, error, extractData, resetData } = useExtractor();
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('single');
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

            <div className="container mx-auto px-4 md:px-6 -mt-10 md:-mt-20 relative z-10 pb-20 md:pb-32">
                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] p-1.5 flex gap-1.5 border border-white/5 shadow-2xl">
                        <button
                            onClick={() => setActiveTab('single')}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${activeTab === 'single'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <FiSearch className="text-sm" /> Single Intelligence
                        </button>
                        <button
                            onClick={() => setActiveTab('bulk')}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2 ${activeTab === 'bulk'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <FiRefreshCw className="text-sm" /> Matrix Batch
                        </button>
                    </div>
                </div>

                {activeTab === 'single' ? (
                    <>
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
                    </>
                ) : (
                    <BulkProcessor onNotification={showNotification} />
                )}

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
