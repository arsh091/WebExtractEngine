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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 md:p-14 w-full max-w-lg relative overflow-hidden"
            >
                {/* Accent Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-blue)]/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary-blue)]/5 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-blue)] text-white flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:rotate-12">
                                {mode === 'login' ? <FiDatabase size={24} /> : <FiShield size={24} />}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium opacity-60">
                            Access the enterprise extraction engine
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-xl hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-all active:scale-90 text-[var(--text-secondary)]"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <AnimatePresence mode="wait">
                        {mode === 'register' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block tracking-tight">Full Name</label>
                                <div className="relative group">
                                    <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--primary-blue)]" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                        className="pro-input pl-14 py-4.5"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block tracking-tight">Email Address</label>
                        <div className="relative group">
                            <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--primary-blue)]" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="name@company.com"
                                required
                                className="pro-input pl-14 py-4.5"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] mb-2 block tracking-tight">Password</label>
                        <div className="relative group">
                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--primary-blue)]" />
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="pro-input pl-14 py-4.5"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3"
                            >
                                <FiAlertCircle className="shrink-0 size-5" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        className="pro-button pro-button-primary w-full py-5 text-base font-extrabold shadow-xl mt-4 active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {mode === 'login' ? 'Login to Portal' : 'Register Account'}
                                <FiArrowRight size={18} />
                            </span>
                        )}
                    </button>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-color)]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs font-bold">
                            <span className="bg-[var(--bg-main)] px-4 text-[var(--text-secondary)] opacity-40 italic">or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full pro-button pro-button-secondary py-4 text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google Account
                    </button>
                </form>

                <p className="text-center text-[var(--text-secondary)] text-sm font-bold mt-10">
                    {mode === 'login' ? "New to the platform?" : "Already have an account?"}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-[var(--primary-blue)] hover:underline ml-2 transition-colors font-extrabold"
                    >
                        {mode === 'login' ? 'Create Account' : 'Back to Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default AuthModal;
