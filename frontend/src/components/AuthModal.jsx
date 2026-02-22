import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX, FiUser, FiMail, FiLock } from 'react-icons/fi';

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
            const message = err.response?.data?.error || err.message || 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white italic tracking-tighter">
                        {mode === 'login' ? '👋 Welcome Back.' : '🚀 Create Account.'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 block">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 
                    rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 block">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 
                  rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 block">Security Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 
                  rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs font-bold flex items-center gap-2">
                            <FiX className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:scale-[1.02] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 active:scale-95 mt-4"
                    >
                        {loading ? 'Processing Intelligence...' : (mode === 'login' ? 'Authenticate Session' : 'Create Digital Identity')}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-8">
                    {mode === 'login' ? "New to the engine? " : "Existing operator? "}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-blue-500 hover:text-blue-400 font-black transition-colors"
                    >
                        {mode === 'login' ? 'Initialize Signup' : 'Return to Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
