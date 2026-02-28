import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiCopy, FiKey, FiZap, FiTerminal, FiDatabase, FiArrowLeft, FiCode, FiLayers, FiActivity, FiCheck, FiCpu, FiGlobe, FiCommand, FiShield, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CODE_EXAMPLES = {
    javascript: `// Initialize extraction
const response = await fetch(
  'https://webextract.pro/api/v1/extract?url=https://example.com',
  {
    headers: { 'x-api-key': 'your_access_token' }
  }
);

const data = await response.json();
console.log('Extraction Data:', data.data);`,

    python: `# Python Extraction Example
import requests

endpoint = 'https://webextract.pro/api/v1/extract'
params = {'url': 'https://example.com'}
headers = {'x-api-key': 'your_access_token'}

res = requests.get(endpoint, params=params, headers=headers)
print(res.json())`,

    curl: `# cURL Command
curl -X GET \
  "https://webextract.pro/api/v1/extract?url=https://example.com" \
  -H "x-api-key: your_access_token"`,
};

const ApiDocsPage = ({ onBack }) => {
    const { user, token } = useAuth();
    const [activeLang, setActiveLang] = useState('javascript');
    const [copied, setCopied] = useState('');
    const [apiKey, setApiKey] = useState(user?.apiKey || '');
    const [loading, setLoading] = useState(false);
    const [usage, setUsage] = useState(null);

    useEffect(() => {
        if (user?.apiKey) {
            setApiKey(user.apiKey);
            fetchUsage();
        }
    }, [user]);

    const fetchUsage = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.get(`${API_URL}/v1/usage`, {
                headers: { 'x-api-key': user.apiKey }
            });
            setUsage(res.data.usage);
        } catch (e) {
            console.error('Usage retrieval failed');
        }
    };

    const generateKey = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/apikeys/generate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApiKey(res.data.apiKey);
        } catch (err) {
            console.error('Key generation failed');
        } finally {
            setLoading(false);
        }
    };

    const revokeKey = async () => {
        if (!token || !confirm('Are you sure you want to revoke this API key? This will disable all existing integrations using this key.')) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.delete(`${API_URL}/apikeys/revoke`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApiKey('');
            setUsage(null);
        } catch (err) {
            console.error('Revocation failed');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[var(--primary-blue)] text-[10px] font-black uppercase tracking-widest mb-6">
                            <FiCommand className="w-3.5 h-3.5" /> API Documentation
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight mb-6 uppercase">
                            Developer <span className="text-[var(--primary-blue)]">Integration</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] text-xl font-bold leading-relaxed opacity-60">
                            Build powerful applications using our high-performance data extraction engine. Scalable infrastructure designed for modern engineering teams.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Credentials & limits */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="pro-card p-10 bg-white border border-[var(--border-color)]">
                        <h3 className="text-sm font-black text-[var(--text-primary)] mb-10 flex items-center gap-3 uppercase tracking-tight">
                            <FiKey className="text-[var(--primary-blue)]" /> API Credentials
                        </h3>

                        {apiKey ? (
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 font-mono text-xs text-[var(--text-primary)] break-all pr-14 shadow-inner font-bold">
                                        {apiKey}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(apiKey, 'key')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white rounded-xl transition-all shadow-sm"
                                    >
                                        {copied === 'key' ? <FiCheck className="text-emerald-500" /> : <FiCopy size={16} className="text-[var(--text-secondary)] opacity-40 hover:opacity-100" />}
                                    </button>
                                </div>

                                <div className="pt-8 border-t border-[var(--border-color)] space-y-5">
                                    <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-xl border border-transparent">
                                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Current Plan</span>
                                        <span className="text-xs font-black text-[var(--primary-blue)] uppercase">{user?.plan || 'Standard'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-xl border border-transparent">
                                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Usage</span>
                                        <span className="text-xs font-black text-[var(--text-primary)]">{usage?.total || 0} / {user?.plan === 'pro' ? '5,000' : '500'}</span>
                                    </div>
                                    <button
                                        onClick={revokeKey}
                                        disabled={loading}
                                        className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100 mt-6 active:scale-95"
                                    >
                                        Revoke Key
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-8 text-[var(--primary-blue)] shadow-sm">
                                    <FiKey size={24} />
                                </div>
                                <p className="text-[var(--text-secondary)] text-sm font-bold mb-10 leading-relaxed opacity-60">
                                    Generate a secure API access token to begin integrating our extraction services into your production environment.
                                </p>
                                <button
                                    onClick={generateKey}
                                    disabled={loading || !token}
                                    className="pro-button pro-button-primary w-full py-5 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-[0.98]"
                                >
                                    {loading ? 'Initializing...' : 'Generate Access Token'}
                                </button>
                                {!token && <p className="text-[10px] text-red-500 font-bold mt-6 uppercase tracking-widest">Authentication Required</p>}
                            </div>
                        )}
                    </div>

                    <div className="pro-card p-10 bg-white border border-[var(--border-color)]">
                        <h3 className="text-sm font-black text-[var(--text-primary)] mb-10 flex items-center gap-3 uppercase tracking-tight">
                            <FiTrendingUp className="text-emerald-500" /> Account Limits
                        </h3>
                        <div className="space-y-4">
                            <div className="p-8 rounded-[2rem] bg-black text-white flex flex-col items-center justify-center text-center shadow-xl">
                                <p className="text-4xl font-black tracking-tighter">{user?.plan === 'pro' ? '5,000' : '500'}</p>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Requests Per Month</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-[var(--bg-secondary)] flex flex-col items-center justify-center text-center border border-transparent hover:border-[var(--border-color)] transition-all">
                                <p className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">{user?.plan === 'pro' ? '25' : '5'}</p>
                                <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mt-2 opacity-50">Concurrency Limit</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="pro-card p-10 md:p-16 bg-white border border-[var(--border-color)] shadow-sm">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] mb-12 flex items-center gap-4 uppercase tracking-tight leading-none">
                            <FiTerminal className="text-[var(--primary-blue)]" /> Core Endpoints
                        </h3>

                        <div className="space-y-16">
                            {/* Extract Endpoint */}
                            <div>
                                <div className="flex flex-wrap items-center gap-5 mb-8">
                                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest">GET</span>
                                    <code className="text-[var(--text-primary)] font-mono text-xl font-bold bg-[var(--bg-secondary)] px-4 py-1.5 rounded-xl border border-[var(--border-color)]/30">/v1/extract</code>
                                    <span className="ml-auto text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">Extraction Service</span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-lg font-bold mb-10 leading-relaxed opacity-60 max-w-2xl">
                                    Analyze a target website to extract multi-dimensional intelligence including corporate identity, contacts, and social signals.
                                </p>
                                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] p-10 space-y-6">
                                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Required Parameters</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/20 shadow-sm">
                                            <span className="text-[var(--primary-blue)] font-mono font-bold text-sm">url</span>
                                            <span className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">String</span>
                                        </div>
                                        <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/20 shadow-sm opacity-60">
                                            <span className="text-[var(--text-primary)] font-mono font-bold text-sm">mode</span>
                                            <span className="text-[9px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">Optional</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-[var(--border-color)] opacity-20"></div>

                            {/* Scan Endpoint */}
                            <div>
                                <div className="flex flex-wrap items-center gap-5 mb-8">
                                    <span className="px-3 py-1.5 bg-blue-50 text-[var(--primary-blue)] border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest">POST</span>
                                    <code className="text-[var(--text-primary)] font-mono text-xl font-bold bg-[var(--bg-secondary)] px-4 py-1.5 rounded-xl border border-[var(--border-color)]/30">/v1/scan</code>
                                    <span className="ml-auto text-[10px] font-black text-[var(--text-secondary)] opacity-30 uppercase tracking-widest">Security Service</span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-lg font-bold mb-10 leading-relaxed opacity-60 max-w-2xl">
                                    Perform an automated security audit of a domain's technical infrastructure, SSL status, and header compliance policies.
                                </p>
                                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] p-10 space-y-6">
                                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">Request Schema</h4>
                                    <div className="p-6 bg-white rounded-2xl border border-[var(--border-color)]/20 shadow-sm">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--border-color)]/10">
                                            <span className="text-[var(--primary-blue)] font-mono font-bold text-sm">url</span>
                                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Required</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 lowercase">{"{ \"url\": \"https://example.com\" }"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Examples */}
                    <div className="pro-card bg-white border border-[var(--border-color)] overflow-hidden shadow-2xl">
                        <div className="flex flex-wrap gap-3 p-6 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]/30">
                            {Object.keys(CODE_EXAMPLES).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl border-2 ${activeLang === lang
                                        ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                        : 'bg-white text-[var(--text-secondary)] border-transparent hover:border-[var(--border-color)] opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="relative p-6 bg-white">
                            <pre className="p-10 text-[var(--text-primary)] text-sm font-mono overflow-x-auto leading-relaxed bg-[var(--bg-secondary)] rounded-[2rem] border border-[var(--border-color)]/30 shadow-inner custom-scrollbar-pro">
                                {CODE_EXAMPLES[activeLang]}
                                <div className="mt-8 text-[10px] font-bold text-[var(--text-secondary)]/30 italic uppercase">// Implementation Guide v3.0</div>
                            </pre>
                            <button
                                onClick={() => copyToClipboard(CODE_EXAMPLES[activeLang], 'code')}
                                className="absolute top-12 right-12 w-12 h-12 rounded-2xl bg-white border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-black hover:text-white transition-all shadow-xl active:scale-90"
                            >
                                {copied === 'code' ? <FiCheck className="text-emerald-500" /> : <FiCopy size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Enterprise CTA */}
                    <div className="p-10 md:p-16 bg-black text-white rounded-[3rem] flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-5 mb-6 justify-center lg:justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-blue)] flex items-center justify-center text-white shadow-lg">
                                    <FiGlobe size={28} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tight leading-none">Enterprise Infrastructure</h3>
                            </div>
                            <p className="text-white/40 text-xl font-bold leading-relaxed max-w-xl">
                                Scale your extraction pipelines with custom rate limits, dedicated clusters, and priority technical support.
                            </p>
                        </div>
                        <button className="pro-button pro-button-primary relative z-10 px-12 py-6 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[var(--primary-blue)] hover:text-white transition-all shadow-2xl active:scale-95">
                            Contact Solutions
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ApiDocsPage;
