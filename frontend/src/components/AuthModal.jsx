import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX, FiUser, FiMail, FiLock, FiArrowRight, FiAlertCircle, FiDatabase, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = ({ onClose }) => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            onClose();
        } catch (err) {
            console.error("Auth Error Detail:", err);
            const message = err.response?.data?.error || err.message || 'Authentication failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[30px] z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.98, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white border-2 border-[var(--border-color)] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] rounded-[3.5rem] p-10 md:p-14 w-full max-w-xl relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-50"></div>

                <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
                                {mode === 'login' ? <FiDatabase size={18} /> : <FiShield size={18} />}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-40 italic">Global Identity Node</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic leading-none">
                            {mode === 'login' ? 'Interface <span className="text-[var(--primary-blue)]">Auth</span>' : 'Register <span className="text-[var(--primary-blue)]">Node</span>'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-black hover:text-white hover:border-black transition-all active:scale-90">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <AnimatePresence mode="wait">
                        {mode === 'register' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-3 block italic opacity-40">Full Identity Name</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-20 group-focus-within:text-[var(--primary-blue)] transition-colors" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="TARGET NAME"
                                        required
                                        className="w-full pl-14 pr-6 py-6 bg-[var(--bg-secondary)] border-2 border-transparent 
                        rounded-2xl text-[var(--text-primary)] font-black text-xs placeholder-[var(--text-secondary)]/20 focus:outline-none focus:border-[var(--primary-blue)]/20 focus:bg-white transition-all uppercase tracking-widest"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-3 block italic opacity-40">Communication Endpoint (Email)</label>
                        <div className="relative group">
                            <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-20 group-focus-within:text-[var(--primary-blue)] transition-colors" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="YOU@INFRA.COM"
                                required
                                className="w-full pl-14 pr-6 py-6 bg-[var(--bg-secondary)] border-2 border-transparent 
                  rounded-2xl text-[var(--text-primary)] font-black text-xs placeholder-[var(--text-secondary)]/20 focus:outline-none focus:border-[var(--primary-blue)]/20 focus:bg-white transition-all uppercase tracking-widest"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-3 block italic opacity-40">Security Hash (Password)</label>
                        <div className="relative group">
                            <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-20 group-focus-within:text-[var(--primary-blue)] transition-colors" />
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-14 pr-6 py-6 bg-[var(--bg-secondary)] border-2 border-transparent 
                  rounded-2xl text-[var(--text-primary)] font-black text-xs placeholder-[var(--text-secondary)]/20 focus:outline-none focus:border-[var(--primary-blue)]/20 focus:bg-white transition-all uppercase tracking-widest"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-red-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 italic"
                            >
                                <FiAlertCircle className="shrink-0 text-lg" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-7 bg-black text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-[2rem] hover:bg-[var(--primary-blue)] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl active:scale-[0.98] mt-6 flex items-center justify-center gap-4 italic"
                    >
                        {loading ? 'Initializing...' : (mode === 'login' ? 'Initiate Link' : 'Register Protocol')}
                        {!loading && <FiArrowRight className="text-lg" />}
                    </button>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] italic">
                            <span className="bg-white px-6 text-[var(--text-secondary)] opacity-30">Third-Party Handshake</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        className="w-full py-6 bg-white border-2 border-[var(--border-color)] text-[var(--text-primary)] font-black uppercase tracking-[0.2em] text-[10px] rounded-[2rem] hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center gap-4 shadow-sm italic active:scale-95"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google Framework Login
                    </button>
                </form>

                <p className="text-center text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] mt-12 italic opacity-40">
                    {mode === 'login' ? "NULL_ACCOUNT? " : "ACCOUNT_EXISTS? "}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-[var(--primary-blue)] hover:text-black font-black transition-colors ml-2"
                    >
                        {mode === 'login' ? 'REGISTER_NODE' : 'BACK_TO_SYNC'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthModal;
