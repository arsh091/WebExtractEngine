import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiTrash2, FiHeart, FiRefreshCw, FiClock, FiGrid, FiArrowLeft, FiSearch, FiCode, FiX, FiMail, FiActivity, FiDatabase, FiCheck, FiCpu, FiFileText } from 'react-icons/fi';
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
        if (!confirm('Permanently purge entire extraction history? This action cannot be reversed.')) return;
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
                        <FiDatabase />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.3em] italic">Accessing Intelligence Vault</p>
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mt-3 opacity-40">Decrypting Storage Layers...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 pb-32 pt-10 font-sans"
        >
            {/* Header */}
            <div className="mb-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-blue)] mb-12 hover:translate-x-[-8px] transition-all group"
                >
                    <FiArrowLeft className="group-hover:scale-125 transition-transform" /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl">
                                <FiDatabase size={24} />
                            </div>
                            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Central Knowledge Repository</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 italic">Extraction <span className="text-[var(--primary-blue)]">Vault</span></h2>
                        <div className="flex items-center gap-6 mt-8">
                            <div className="px-6 py-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-sm">
                                <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">{stats.total} TOTAL PAYLOADS</span>
                            </div>
                            {history.length > 0 && (
                                <button
                                    onClick={clearAllHistory}
                                    className="flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-700 transition-colors py-3 group"
                                >
                                    <FiTrash2 className="group-hover:scale-110 transition-transform" /> Purge Archival Data
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative w-full md:w-[450px] group">
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center">
                            <FiSearch className="absolute left-8 text-[var(--text-secondary)] text-xl opacity-30" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="FILTER BY TARGET URI..."
                                className="w-full pl-16 pr-10 py-8 bg-white border-2 border-[var(--border-color)] rounded-[2.5rem] text-[10px] font-black text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--primary-blue)]/30 transition-all uppercase tracking-[0.2em] shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="bg-white rounded-[4rem] px-12 py-40 border border-dashed border-[var(--border-color)] text-center flex flex-col items-center shadow-2xl">
                    <div className="w-24 h-24 rounded-[2rem] bg-[var(--bg-secondary)] flex items-center justify-center mb-10 text-[var(--text-secondary)] opacity-20 shadow-inner">
                        <FiCpu size={40} />
                    </div>
                    <h3 className="text-[var(--text-primary)] text-3xl font-black uppercase tracking-tight mb-4 italic">No Datasets Found</h3>
                    <p className="text-[var(--text-secondary)] max-w-sm mx-auto text-lg font-medium leading-relaxed opacity-50 mb-12 uppercase tracking-widest text-[10px]">Your archival repository is currently empty.</p>
                    <button
                        onClick={onBack}
                        className="px-12 py-7 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-95"
                    >
                        Initiate Master Scan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <AnimatePresence mode="popLayout">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-white rounded-[3.5rem] p-10 border border-[var(--border-color)] hover:border-[var(--primary-blue)]/30 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] cursor-pointer overflow-hidden"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start justify-between gap-8 relative z-10">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center p-3 group-hover:bg-white group-hover:shadow-2xl transition-all overflow-hidden shrink-0 shadow-inner">
                                                {item.data?.companyInfo?.favicon ? (
                                                    <img src={item.data.companyInfo.favicon} alt="" className="w-full h-full object-contain" />
                                                ) : (
                                                    <FiGrid size={24} className="text-[var(--text-secondary)] opacity-10" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[var(--text-primary)] font-black text-2xl tracking-tighter truncate group-hover:text-[var(--primary-blue)] transition-all uppercase italic">
                                                    {item.data?.companyInfo?.name || (item.url ? new URL(item.url).hostname : 'Node_Unknown')}
                                                </h4>
                                                <p className="text-[var(--text-secondary)] text-[10px] font-black truncate opacity-30 tracking-[0.1em] mt-1">{item.url}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-8">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-xl text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border border-[var(--border-color)]/50 group-hover:bg-white transition-colors">
                                                <FiClock className="text-[var(--primary-blue)]" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-xl text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border border-[var(--border-color)]/50 group-hover:bg-white transition-colors">
                                                <FiActivity className="text-emerald-500" />
                                                L-EXTRACT V2
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 shrink-0">
                                        <button
                                            onClick={(e) => toggleFavorite(e, item.id)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-[var(--bg-secondary)] border shadow-sm ${item.isFavorite
                                                ? 'text-pink-500 border-pink-100 bg-pink-50/50 shadow-inner'
                                                : 'text-[var(--text-secondary)]/30 border-[var(--border-color)] hover:text-pink-500 hover:bg-white hover:border-pink-500/20'
                                                }`}
                                        >
                                            <FiHeart className={item.isFavorite ? 'fill-current' : ''} size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onReExtract(item.url); }}
                                            className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]/30 flex items-center justify-center hover:text-[var(--primary-blue)] hover:bg-white hover:border-[var(--primary-blue)] transition-all shadow-sm"
                                        >
                                            <FiRefreshCw size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => deleteExtraction(e, item.id)}
                                            className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]/30 flex items-center justify-center hover:text-red-500 hover:bg-white hover:border-red-500 transition-all shadow-sm"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Multi-Stat Data Points */}
                                <div className="grid grid-cols-3 gap-6 mt-12 relative z-10">
                                    {[
                                        { value: item.count?.phones || 0, color: 'text-[var(--primary-blue)]', text: 'Comm' },
                                        { value: item.count?.emails || 0, color: 'text-blue-500', text: 'Intel' },
                                        { value: (item.count?.addresses || 0) + (item.count?.social || 0), color: 'text-slate-400', text: 'Signals' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border-color)]/30 flex flex-col items-center group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                                            <span className={`text-4xl font-black tracking-tighter italic ${stat.color}`}>{stat.value}</span>
                                            <span className="text-[8px] text-[var(--text-secondary)] font-black uppercase tracking-[0.3em] mt-3 opacity-30">{stat.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-10 mt-24">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-10 py-5 bg-white border-2 border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)]/30 disabled:opacity-30 transition-all shadow-xl active:scale-95"
                    >
                        Previous Frame
                    </button>
                    <div className="flex gap-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-14 h-14 rounded-2xl text-[10px] font-black uppercase transition-all shadow-2xl ${page === p
                                    ? 'bg-black text-white scale-110'
                                    : 'bg-white text-[var(--text-secondary)] border-2 border-[var(--border-color)] hover:border-[var(--text-primary)]'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-10 py-5 bg-white border-2 border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)]/30 disabled:opacity-30 transition-all shadow-xl active:scale-95"
                    >
                        Next Frame
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 bg-white/40 backdrop-blur-[30px] z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 10 }}
                            className="bg-white border-2 border-[var(--border-color)] rounded-[4rem] p-16 w-full max-w-6xl max-h-[92vh] overflow-y-auto custom-scrollbar-pro shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] relative"
                        >
                            <div className="flex justify-between items-start mb-16">
                                <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] flex items-center justify-center p-5 shadow-inner">
                                        {selectedItem.data?.companyInfo?.favicon ? (
                                            <img src={selectedItem.data.companyInfo.favicon} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            <FiGrid size={40} className="text-[var(--text-secondary)] opacity-10" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-4 italic">
                                            {selectedItem.data?.companyInfo?.name || 'Inert Node Results'}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] font-black text-xs opacity-30 tracking-[0.4em] uppercase">{selectedItem.url}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-16 h-16 rounded-[2rem] bg-black text-white flex items-center justify-center hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-90"
                                >
                                    <FiX size={32} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                {/* Left Column: Data Grid */}
                                <div className="lg:col-span-8 space-y-12">
                                    <section className="bg-[var(--bg-secondary)] rounded-[3rem] p-12 border border-[var(--border-color)]">
                                        <h4 className="text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-[0.4em] mb-10 flex items-center gap-4 italic opacity-60">
                                            <div className="w-1.5 h-1.5 bg-[var(--primary-blue)] rounded-full animate-pulse"></div>
                                            Communication Channels
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedItem.data?.phones?.length > 0 ? (
                                                selectedItem.data.phones.map((p, i) => (
                                                    <div key={i} className="group relative">
                                                        <div className="font-black text-xs text-[var(--text-primary)] bg-white p-7 rounded-2xl border border-[var(--border-color)] pr-16 shadow-sm hover:shadow-xl transition-all italic">
                                                            {p}
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(p, `p-${i}`)}
                                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/30 hover:text-[var(--primary-blue)] p-2 transition-colors"
                                                        >
                                                            {copied === `p-${i}` ? <FiCheck className="text-emerald-500" /> : <FiCopy size={18} />}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : <div className="col-span-2 text-center py-10 text-[10px] font-black uppercase tracking-widest opacity-20 italic">No communication nodes detected</div>}
                                        </div>
                                    </section>

                                    <section className="bg-[var(--bg-secondary)] rounded-[3rem] p-12 border border-[var(--border-color)]">
                                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4 italic opacity-60">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            Intelligence Endpoints
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedItem.data?.emails?.length > 0 ? (
                                                selectedItem.data.emails.map((e, i) => (
                                                    <div key={i} className="group relative">
                                                        <div className="font-black text-xs text-[var(--text-primary)] bg-white p-7 rounded-2xl border border-[var(--border-color)] pr-16 break-all shadow-sm hover:shadow-xl transition-all italic uppercase">
                                                            {e}
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(e, `e-${i}`)}
                                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/30 hover:text-[var(--primary-blue)] p-2 transition-colors"
                                                        >
                                                            {copied === `e-${i}` ? <FiCheck className="text-emerald-500" /> : <FiCopy size={18} />}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : <div className="col-span-2 text-center py-10 text-[10px] font-black uppercase tracking-widest opacity-20 italic">No intelligence nodes detected</div>}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Meta & Insights */}
                                <div className="lg:col-span-4 space-y-10">
                                    <section className="bg-white rounded-[3.5rem] p-12 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500 opacity-20"></div>
                                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-10 italic">Metadata Profiling</h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Domain Core', val: selectedItem.data?.companyInfo?.industry || 'Unknown Sector' },
                                                { label: 'Temporal Sync', val: new Date(selectedItem.createdAt).toLocaleDateString() },
                                                { label: 'Integrity Node', val: 'Enterprise V2.5' },
                                            ].map((meta, i) => (
                                                <div key={i} className="flex justify-between items-center bg-[var(--bg-secondary)] p-6 rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                                    <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 italic">{meta.label}</span>
                                                    <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight italic">{meta.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="bg-black rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full"></div>
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-10 italic">Layer Sync: Social</h4>
                                        <div className="grid grid-cols-2 gap-4 relative z-10">
                                            {selectedItem.data?.socialMedia && Object.entries(selectedItem.data.socialMedia).map(([platform, val]) => (
                                                val ? (
                                                    <div key={platform} className="bg-white/5 p-5 rounded-2xl border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.3em] flex flex-col items-center gap-3 hover:bg-white/10 transition-all cursor-default">
                                                        <span className="text-[var(--primary-blue)]">{platform}</span>
                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    </div>
                                                ) : null
                                            ))}
                                            {(!selectedItem.data?.socialMedia || Object.values(selectedItem.data.socialMedia || {}).every(v => !v)) &&
                                                <div className="col-span-2 py-10 text-center">
                                                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] italic leading-relaxed">No social identity signals resolved.</p>
                                                </div>
                                            }
                                        </div>
                                    </section>

                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-full py-7 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-[var(--primary-blue)] transition-all active:scale-[0.98] mt-4"
                                    >
                                        Seal Data Frame
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
