import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiCopy, FiKey, FiCode, FiZap, FiRefreshCw, FiExternalLink, FiTerminal, FiDatabase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CODE_EXAMPLES = {
    javascript: `// JavaScript Fetch Example
const response = await fetch(
  'https://webextractengine.onrender.com/api/v1/extract?url=https://example.com',
  {
    headers: {
      'x-api-key': 'wxe_live_your_api_key_here'
    }
  }
);

const data = await response.json();
const { phones, emails, company } = data.data;
console.log('Intelligence Gathering Complete:', { phones, emails, company });`,

    python: `# Python Requests Example
import requests

api_url = 'https://webextractengine.onrender.com/api/v1/extract'
params = {'url': 'https://example.com'}
headers = {'x-api-key': 'wxe_live_your_api_key_here'}

response = requests.get(api_url, params=params, headers=headers)
data = response.json()

if data['success']:
    print(f"Found {data['data']['count']['phones']} phone nodes")
    print(f"Emails: {data['data']['emails']}")`,

    curl: `# cURL Terminal Example
curl -X GET \\
  "https://webextractengine.onrender.com/api/v1/extract?url=https://example.com" \\
  -H "x-api-key: wxe_live_your_api_key_here"`,
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
            console.error('Usage sync failed');
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
            onNotification?.('Secret Key Generated Successfully', 'success');
        } catch (err) {
            console.error('Key generation failed');
        } finally {
            setLoading(false);
        }
    };

    const revokeKey = async () => {
        if (!token || !confirm('Permanently revoke these credentials? Active integrations will fail.')) return;
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 pb-32"
        >
            {/* Hero Header */}
            <div className="text-center mb-16 pt-10 relative">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest group"
                >
                    <FiTerminal className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Return to Base
                </button>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
                    <FiZap className="text-blue-500 animate-pulse" />
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Digital Interface v1.0</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-6">Developer API.</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    Scale your Intelligence Gathering. Integrate our proprietary extraction engine
                    directly into your enterprise systems via secure API nodes.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: API Key & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                        <h2 className="text-xl font-black text-white italic tracking-tighter mb-6 flex items-center gap-3">
                            <FiKey className="text-blue-500" /> API Access Key
                        </h2>

                        {apiKey ? (
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-xs text-blue-400 break-all pr-12">
                                        {apiKey}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(apiKey, 'key')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <FiCopy />
                                    </button>
                                </div>
                                {copied === 'key' && <p className="text-[9px] font-black text-green-500 uppercase tracking-widest text-center">Node Key Copied to Buffer</p>}

                                <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Level</span>
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{user?.plan || 'Free Tier'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage Cycles</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{usage?.total || 0} Total</span>
                                    </div>
                                    <button
                                        onClick={revokeKey}
                                        disabled={loading}
                                        className="w-full py-3 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all border border-red-500/10"
                                    >
                                        Revoke Node Access
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-slate-500 text-xs mb-6">No active API nodes detected. Initialize access to begin integration.</p>
                                <button
                                    onClick={generateKey}
                                    disabled={loading || !token}
                                    className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {loading ? 'Initializing...' : 'Generate Access Key'}
                                </button>
                                {!token && <p className="text-[8px] text-red-500 font-bold uppercase mt-4">Authentication Required</p>}
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4">Enterprise Quotas</h3>
                        <div className="space-y-4 text-[10px] font-bold">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-slate-500 mb-1 uppercase tracking-widest text-[9px]">Rate Limit</p>
                                <p className="text-white text-base font-black italic tracking-tighter">{user?.plan === 'pro' ? '1,000' : '100'} <span className="text-xs font-normal not-italic text-slate-500">req / day</span></p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-slate-500 mb-1 uppercase tracking-widest text-[9px]">Concurrency</p>
                                <p className="text-white text-base font-black italic tracking-tighter">{user?.plan === 'pro' ? '10' : '1'} <span className="text-xs font-normal not-italic text-slate-500">Async Workers</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Documentation & Code */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Endpoints */}
                    <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5">
                        <h2 className="text-2xl font-black text-white italic tracking-tighter mb-8 flex items-center gap-3">
                            <FiTerminal className="text-purple-500" /> Digital Endpoints
                        </h2>

                        <div className="space-y-8">
                            {/* Extract v1 */}
                            <div className="group">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[9px] font-black tracking-widest uppercase">GET</span>
                                    <code className="text-white font-mono text-sm">/api/v1/extract</code>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">Initialize deep analysis on a single target URL. Returns phone, email, and company intelligence.</p>
                                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                                    <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Query Parameters</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-blue-400">url</span>
                                            <span className="text-slate-500 italic">string (required)</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-blue-400">fields</span>
                                            <span className="text-slate-500 italic">string (options: phones,emails,social)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-white/5"></div>

                            {/* Bulk v1 */}
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[9px] font-black tracking-widest uppercase">POST</span>
                                    <code className="text-white font-mono text-sm">/api/v1/bulk</code>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">Matrix Batch processing for up to 10 URLs in a single payload. Ideal for high-scale harvesting.</p>
                                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                                    <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">JSON Body</h4>
                                    <code className="text-purple-400 text-[11px] font-mono">{`{ "urls": ["https://site-a.com", "https://site-b.com"] }`}</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Implementation Examples */}
                    <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden">
                        <div className="flex border-b border-white/5 p-2 bg-white/5">
                            {Object.keys(CODE_EXAMPLES).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl ${activeLang === lang
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                        : 'text-slate-500 hover:text-white'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <pre className="p-8 text-blue-400 text-xs font-mono overflow-x-auto leading-relaxed scrollbar-hide">
                                {CODE_EXAMPLES[activeLang]}
                            </pre>
                            <button
                                onClick={() => copyToClipboard(CODE_EXAMPLES[activeLang], 'code')}
                                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <FiCopy />
                            </button>
                            {copied === 'code' && (
                                <div className="absolute top-12 right-12 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">Copied</div>
                            )}
                        </div>
                    </div>

                    {/* Support Call */}
                    <div className="p-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-[3rem] flex flex-col items-center text-center">
                        <FiDatabase className="text-4xl text-white/50 mb-6" />
                        <h3 className="text-3xl font-black text-white italic tracking-tighter mb-4">Enterprise Scale Needed?</h3>
                        <p className="text-white/70 text-sm max-w-sm mb-8 font-medium">Connect with our data architecture team for custom quotas, dedicated proxies, and priority bandwidth.</p>
                        <button className="px-10 py-4 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
                            Upgrade to Enterprise Pro
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ApiDocsPage;
