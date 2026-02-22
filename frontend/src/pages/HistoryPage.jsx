import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiTrash2, FiHeart, FiRefreshCw, FiClock, FiGrid, FiArrowLeft, FiSearch, FiCode } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HistoryPage = ({ onReExtract, onBack }) => {
    const { token, user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ total: 0 });

    useEffect(() => {
        fetchHistory();
    }, [page, token]);

    const fetchHistory = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/history?page=${page}&limit=10`, {
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

    const deleteExtraction = async (id) => {
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

    const toggleFavorite = async (id) => {
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
        if (!confirm('Clear all extraction intelligence? This cannot be undone.')) return;
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

    if (loading && page === 1) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-white/5 border-b-purple-500 animate-spin-reverse"></div>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-8 animate-pulse">Syncing Database...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 pb-32"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:scale-105 transition-all"
                    >
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter">Extraction Vault.</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Operator: {user?.name || 'Anonymous'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stats.total} Records Found</span>
                        </div>
                    </div>
                </div>

                {history.length > 0 && (
                    <button
                        onClick={clearAllHistory}
                        className="group flex items-center gap-3 px-6 py-3.5 bg-red-500/10 
              text-red-500 rounded-2xl hover:bg-red-500/20 transition-all border border-red-500/10 text-[10px] font-black uppercase tracking-widest"
                    >
                        <FiTrash2 className="group-hover:rotate-12 transition-transform" /> Purge Matrix Archive
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <div className="bg-slate-900/50 backdrop-blur-2xl rounded-[3rem] p-32 border border-white/5 text-center flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                        <FiCode className="text-3xl text-slate-600" />
                    </div>
                    <p className="text-white text-2xl font-black italic tracking-tighter mb-2">Vault is Empty.</p>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">Your extraction intelligence has not been synchronized yet. Process a target to begin.</p>
                    <button
                        onClick={onBack}
                        className="mt-8 px-10 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                    >
                        Start Extraction
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-slate-900/50 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/5 hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                                                {item.data?.companyInfo?.favicon ? (
                                                    <img src={item.data.companyInfo.favicon} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <FiGrid className="text-slate-500" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-black text-lg italic tracking-tighter truncate group-hover:text-blue-400 transition-colors">
                                                    {item.data?.companyInfo?.name || (item.url ? new URL(item.url).hostname : 'Unknown Target')}
                                                </p>
                                                <p className="text-slate-600 text-[10px] font-mono truncate">{item.url}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4 text-slate-500">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                <FiClock className="text-blue-500" />
                                                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                <FiCode className="text-purple-500" />
                                                {item.type || 'single'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => toggleFavorite(item.id)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${item.isFavorite
                                                ? 'text-pink-500 bg-pink-500/10 border-pink-500/20'
                                                : 'text-slate-600 bg-white/5 border-white/10 hover:text-white hover:border-white/20'
                                                }`}
                                        >
                                            <FiHeart className={item.isFavorite ? 'fill-current' : ''} />
                                        </button>
                                        <button
                                            onClick={() => onReExtract(item.url)}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-600 flex items-center justify-center hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all"
                                            title="Initialize Re-Extraction"
                                        >
                                            <FiRefreshCw />
                                        </button>
                                        <button
                                            onClick={() => deleteExtraction(item.id)}
                                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-600 flex items-center justify-center hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                {/* Multi-Stat Data Points */}
                                <div className="grid grid-cols-3 gap-2 mt-6">
                                    {[
                                        { label: 'Phones', value: item.count?.phones || 0, color: 'text-blue-400' },
                                        { label: 'Emails', value: item.count?.emails || 0, color: 'text-cyan-400' },
                                        { label: 'Nodes', value: item.count?.addresses || 0, color: 'text-purple-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-black/20 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
                                            <span className={`text-xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</span>
                                            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Futuristic Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                    >
                        Prev Node
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${page === p
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                    : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                    >
                        Next Node
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default HistoryPage;
