import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiTrash2, FiHeart, FiRefreshCw, FiClock, FiGrid, FiArrowLeft, FiSearch, FiCode, FiX, FiMail, FiActivity, FiDatabase, FiCheck, FiCpu, FiFileText, FiPhone, FiCopy, FiLayers, FiZap, FiTarget, FiInfo, FiServer } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HistoryPage = ({ onReExtract, onBack }) => {
    const { token, user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0 });
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [copied, setCopied] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHistory();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, token, search]);

    const fetchHistory = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/history?page=${page}&limit=10&search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.data);
            setTotalPages(res.data.pagination.pages);
            setStats({ total: res.data.pagination.total });
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteExtraction = async (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(history.filter(h => h.id !== id));
            setStats(prev => ({ total: prev.total - 1 }));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const toggleFavorite = async (e, id) => {
        e.stopPropagation();
        try {
            const res = await axios.patch(
                `${API_URL}/history/${id}/favorite`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHistory(history.map(h =>
                h.id === id ? { ...h, isFavorite: res.data.isFavorite } : h
            ));
        } catch (error) {
            console.error('Favorite toggle failed:', error);
        }
    };

    const clearAllHistory = async () => {
        if (!confirm('Are you sure you want to clear your entire history? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory([]);
            setStats({ total: 0 });
        } catch (error) {
            console.error('Clear failed:', error);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    if (loading && page === 1 && !search) {
        return (
            <div className="flex flex-col items-center justify-center py-60 font-sans gap-10">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-50 border-t-[var(--primary-blue)] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--primary-blue)]">
                        <FiServer />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Loading History</p>
                    <p className="text-xs font-medium text-[var(--text-secondary)] mt-2 opacity-50">Please wait while we fetch your records...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-32 font-sans"
        >
            {/* Header */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--primary-blue)] mb-8 hover:-translate-x-1 transition-all group"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Home
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-[10px] font-black uppercase tracking-widest mb-6">
                            <FiDatabase className="w-3.5 h-3.5" /> Data Vault
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Extraction <span className="text-[var(--primary-blue)]">History</span>
                        </h2>
                        <div className="flex flex-wrap items-center gap-6 mt-8">
                            <div className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                <FiLayers /> {stats.total} Total Records
                            </div>
                            {history.length > 0 && (
                                <button
                                    onClick={clearAllHistory}
                                    className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:text-red-700 transition-colors py-2 group"
                                >
                                    <FiTrash2 /> Clear Vault
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative w-full md:w-[450px]">
                        <div className="relative bg-white rounded-2xl border border-[var(--border-color)] shadow-xl overflow-hidden focus-within:border-[var(--primary-blue)] transition-all">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xl opacity-30" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search records by URL..."
                                className="w-full pl-16 pr-6 py-5 bg-transparent text-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="bg-white rounded-[3rem] px-12 py-32 border border-[var(--border-color)] text-center flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 text-[var(--primary-blue)] shadow-sm">
                        <FiDatabase size={32} />
                    </div>
                    <h3 className="text-[var(--text-primary)] text-3xl font-black mb-3 tracking-tight uppercase">Records Empty</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm mx-auto text-lg font-bold leading-relaxed opacity-50 mb-10">
                        We couldn't find any extraction logs in your history. Start by submitting a URL to our engine.
                    </p>
                    <button
                        onClick={onBack}
                        className="pro-button pro-button-primary px-16 py-5 shadow-xl active:scale-[0.98]"
                    >
                        Start Extraction
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative pro-card p-8 bg-white border border-[var(--border-color)] cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/10 transition-colors"></div>

                                <div className="flex items-start justify-between gap-6 relative z-10">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]/30 flex items-center justify-center p-3 group-hover:bg-white group-hover:shadow-lg transition-all shrink-0">
                                                {item.data?.companyInfo?.favicon ? (
                                                    <img src={item.data.companyInfo.favicon} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <FiTarget size={24} className="text-[var(--primary-blue)] opacity-40" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[var(--text-primary)] font-black text-xl truncate group-hover:text-[var(--primary-blue)] transition-colors tracking-tight uppercase">
                                                    {item.data?.companyInfo?.name || (item.url ? new URL(item.url).hostname : 'Target Domain')}
                                                </h4>
                                                <p className="text-[var(--text-secondary)] text-[10px] font-bold truncate opacity-40 mt-1 uppercase tracking-widest">{item.url}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg text-[9px] font-black text-[var(--text-secondary)] uppercase border border-[var(--border-color)]/20 group-hover:bg-white transition-colors">
                                                <FiClock className="text-[var(--primary-blue)]" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg text-[9px] font-black text-emerald-700 uppercase border border-emerald-100 group-hover:bg-white transition-colors">
                                                <FiCheck className="text-emerald-500" />
                                                Success
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={(e) => toggleFavorite(e, item.id)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-[var(--bg-secondary)] border ${item.isFavorite
                                                ? 'text-pink-500 border-pink-100 bg-pink-50 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                                : 'text-[var(--text-secondary)] opacity-30 border-transparent hover:text-pink-500 hover:bg-white hover:border-pink-200'
                                                }`}
                                        >
                                            <FiHeart className={item.isFavorite ? 'fill-current' : ''} size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onReExtract(item.url); }}
                                            className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-secondary)] opacity-30 flex items-center justify-center hover:text-[var(--primary-blue)] hover:bg-white hover:border-[var(--primary-blue)]/20 hover:opacity-100 transition-all"
                                        >
                                            <FiRefreshCw size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => deleteExtraction(e, item.id)}
                                            className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-transparent text-[var(--text-secondary)] opacity-30 flex items-center justify-center hover:text-red-500 hover:bg-white hover:border-red-200 hover:opacity-100 transition-all"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Summary Grid */}
                                <div className="grid grid-cols-3 gap-4 mt-10 relative z-10">
                                    {[
                                        { value: item.count?.phones || 0, icon: FiPhone, text: 'Phones' },
                                        { value: item.count?.emails || 0, icon: FiMail, text: 'Emails' },
                                        { value: (item.count?.addresses || 0) + (item.count?.social || 0), icon: FiInfo, text: 'Points' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-[var(--border-color)] group-hover:shadow-lg transition-all flex flex-col items-center">
                                            <div className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-1 select-none">{stat.value}</div>
                                            <span className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] opacity-30">{stat.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination Control */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-24">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-8 py-4 bg-white border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-black disabled:opacity-20 transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-12 h-12 rounded-xl text-xs font-black transition-all ${page === p
                                    ? 'bg-black text-white shadow-xl'
                                    : 'bg-white text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-black'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-8 py-4 bg-white border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-black hover:border-black disabled:opacity-20 transition-all shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Detailed View Overlay */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 bg-white/40 backdrop-blur-[40px] z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white border border-[var(--border-color)] rounded-[3rem] p-10 md:p-16 w-full max-w-6xl my-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]/30 flex items-center justify-center p-5 shadow-inner">
                                        {selectedItem.data?.companyInfo?.favicon ? (
                                            <img src={selectedItem.data.companyInfo.favicon} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            <FiGrid size={40} className="text-[var(--primary-blue)] opacity-20" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-3 tracking-tighter uppercase leading-none">
                                            {selectedItem.data?.companyInfo?.name || 'Record Summary'}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] font-black text-[10px] opacity-40 tracking-[0.3em] uppercase">{selectedItem.url}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center hover:bg-[var(--primary-blue)] transition-all active:scale-95 shadow-xl"
                                >
                                    <FiX size={28} />
                                </button>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-16">
                                {/* Primary Data */}
                                <div className="flex-1 space-y-12">
                                    <section>
                                        <h4 className="text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <FiPhone size={12} />
                                            </div>
                                            Phone Records
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedItem.data?.phones?.length > 0 ? (
                                                selectedItem.data.phones.map((p, i) => (
                                                    <div key={i} className="group relative bg-[var(--bg-secondary)] rounded-2xl p-6 border border-transparent hover:border-[var(--border-color)] hover:bg-white transition-all hover:shadow-xl">
                                                        <div className="font-black text-sm text-[var(--text-primary)] tracking-tight">
                                                            {p}
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(p, `p-${i}`)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-black hover:border-black transition-all"
                                                        >
                                                            {copied === `p-${i}` ? <FiCheck className="text-emerald-500" /> : <FiCopy size={16} />}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-2 py-12 bg-[var(--bg-secondary)]/50 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-[10px] font-black uppercase tracking-widest opacity-20">
                                                    No contacts found
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                                                <FiMail size={12} />
                                            </div>
                                            Email Addresses
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedItem.data?.emails?.length > 0 ? (
                                                selectedItem.data.emails.map((e, i) => (
                                                    <div key={i} className="group relative bg-[var(--bg-secondary)] rounded-2xl p-6 border border-transparent hover:border-[var(--border-color)] hover:bg-white transition-all hover:shadow-xl">
                                                        <div className="font-black text-sm text-[var(--text-primary)] tracking-tight break-all">
                                                            {e}
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(e, `e-${i}`)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[var(--border-color)]/30 text-[var(--text-secondary)] hover:text-black hover:border-black transition-all"
                                                        >
                                                            {copied === `e-${i}` ? <FiCheck className="text-emerald-500" /> : <FiCopy size={16} />}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-2 py-12 bg-[var(--bg-secondary)]/50 rounded-2xl border border-dashed border-[var(--border-color)] text-center text-[10px] font-black uppercase tracking-widest opacity-20">
                                                    No emails found
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                {/* Sidebar Meta */}
                                <div className="lg:w-80 space-y-10">
                                    <section className="pro-card p-10 bg-white border border-[var(--border-color)]">
                                        <h4 className="text-[10px] font-black text-[var(--text-primary)] mb-8 uppercase tracking-[0.2em] opacity-40">Extraction Details</h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Category', val: selectedItem.data?.companyInfo?.industry || 'General' },
                                                { label: 'Created On', val: new Date(selectedItem.createdAt).toLocaleDateString() },
                                                { label: 'Version', val: 'v3.0' },
                                            ].map((meta, i) => (
                                                <div key={i} className="flex justify-between items-center bg-[var(--bg-secondary)] p-5 rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">{meta.label}</span>
                                                    <span className="text-[11px] font-black text-[var(--text-primary)] tracking-tight">{meta.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="bg-black rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px]"></div>
                                        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-10 relative z-10">Social Profiles</h4>
                                        <div className="grid grid-cols-2 gap-3 relative z-10">
                                            {selectedItem.data?.socialMedia && Object.entries(selectedItem.data.socialMedia).map(([platform, val]) => (
                                                val ? (
                                                    <div key={platform} className="bg-white/5 p-4 rounded-2xl border border-white/10 text-[9px] font-black text-white uppercase flex flex-col items-center gap-3 hover:bg-white hover:text-black transition-all cursor-default group/soc">
                                                        <span className="text-[var(--primary-blue)] group-hover/soc:text-black">{platform}</span>
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                    </div>
                                                ) : null
                                            ))}
                                            {(!selectedItem.data?.socialMedia || Object.values(selectedItem.data.socialMedia || {}).every(v => !v)) &&
                                                <div className="col-span-2 py-10 text-center border border-dashed border-white/10 rounded-2xl">
                                                    <p className="text-white/10 text-[10px] font-black uppercase tracking-widest">No data detected</p>
                                                </div>
                                            }
                                        </div>
                                    </section>

                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[var(--primary-blue)] transition-all active:scale-[0.98]"
                                    >
                                        Close View
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HistoryPage;
