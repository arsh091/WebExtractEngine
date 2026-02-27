import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiCopy, FiKey, FiZap, FiTerminal, FiDatabase, FiArrowLeft, FiCode, FiLayers, FiActivity, FiCheck, FiCpu, FiGlobe, FiCommand } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CODE_EXAMPLES = {
    javascript: `// GET extraction-v1
const response = await fetch(
  'https://webextract.pro/api/v1/extract?url=https://target.com',
  {
    headers: { 'x-api-key': 'your_access_token' }
  }
);

const data = await response.json();
console.log('Target Intelligence:', data.data);`,

    python: `# Target Intelligence Gathering
import requests

endpoint = 'https://webextract.pro/api/v1/extract'
params = {'url': 'https://target.com'}
headers = {'x-api-key': 'your_access_token'}

res = requests.get(endpoint, params=params, headers=headers)
print(res.json())`,

    curl: `# Terminal Authentication
curl -X GET \\
  "https://webextract.pro/api/v1/extract?url=https://target.com" \\
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
        if (!token || !confirm('Permanently revoke these credentials? Active integrations will be terminated.')) return;
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
            className="max-w-7xl mx-auto px-6 pb-32 pt-10 font-sans"
        >
            {/* Hero Header */}
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
                                <FiCommand size={24} />
                            </div>
                            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Architectural Interface V1</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-6 italic">Developer <span className="text-[var(--primary-blue)]">API Portal</span></h2>
                        <p className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed opacity-60">
                            Build high-performance data pipelines with our enterprise extraction infrastructure.
                            Engineered for cryptographically secure, compliance-first intelligence harvesting.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: API Key & Stats */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white rounded-[3.5rem] p-12 border border-[var(--border-color)] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--primary-blue)]"></div>
                        <h2 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-10 opacity-40 flex items-center gap-4 italic">
                            <FiKey className="text-[var(--primary-blue)]" /> Master Access Credentials
                        </h2>

                        {apiKey ? (
                            <div className="space-y-8">
                                <div className="relative group/key">
                                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 font-mono text-xs text-[var(--text-primary)] break-all pr-16 select-all shadow-inner font-bold tracking-tight">
                                        {apiKey}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(apiKey, 'key')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white hover:bg-black transition-all p-3 bg-white rounded-xl border border-[var(--border-color)] shadow-xl active:scale-95"
                                    >
                                        {copied === 'key' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                                    </button>
                                </div>

                                <div className="pt-10 border-t border-[var(--border-color)] space-y-4">
                                    <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-5 rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                        <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 italic">Active Tier</span>
                                        <span className="text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{user?.plan || 'Standard'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-5 rounded-2xl border border-transparent hover:border-[var(--border-color)] transition-all">
                                        <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 italic">Cycle Capacity</span>
                                        <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">{usage?.total || 0} / {user?.plan === 'pro' ? '5,000' : '500'}</span>
                                    </div>
                                    <button
                                        onClick={revokeKey}
                                        disabled={loading}
                                        className="w-full py-5 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100 flex items-center justify-center gap-3 mt-4"
                                    >
                                        Revoke Access Handshake
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 rounded-[2rem] bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-10 text-[var(--text-secondary)] opacity-20 shadow-inner">
                                    <FiKey size={40} />
                                </div>
                                <p className="text-[var(--text-secondary)] text-sm font-medium mb-12 leading-relaxed opacity-60 uppercase tracking-widest px-8">System requires an authorized developer key to initiate interface handshake.</p>
                                <button
                                    onClick={generateKey}
                                    disabled={loading || !token}
                                    className="w-full py-6 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Initializing...' : 'Establish Connection'}
                                </button>
                                {!token && <p className="text-[9px] text-red-500 font-black uppercase mt-6 tracking-[0.2em]">Authentication Required</p>}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500 opacity-20"></div>
                        <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-10 flex items-center gap-4 italic opacity-40">
                            <FiActivity className="text-emerald-500" /> Infrastructure Quotas
                        </h3>
                        <div className="space-y-6">
                            <div className="p-8 rounded-[2rem] bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-all hover:bg-white hover:shadow-2xl group/limit">
                                <p className="text-[var(--text-secondary)] mb-4 uppercase tracking-[0.4em] text-[8px] font-black opacity-40 italic">Requests per Cycle</p>
                                <p className="text-[var(--text-primary)] text-4xl font-black tracking-tighter italic tabular-nums">{user?.plan === 'pro' ? '5,000' : '500'}<span className="text-[10px] font-black text-[var(--text-secondary)] opacity-20 ml-3 uppercase tracking-widest">Total</span></p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-all hover:bg-white hover:shadow-2xl group/limit">
                                <p className="text-[var(--text-secondary)] mb-4 uppercase tracking-[0.4em] text-[8px] font-black opacity-40 italic">Parallel Channels</p>
                                <p className="text-[var(--text-primary)] text-4xl font-black tracking-tighter italic tabular-nums">{user?.plan === 'pro' ? '25' : '5'}<span className="text-[10px] font-black text-[var(--text-secondary)] opacity-20 ml-3 uppercase tracking-widest">Nodes</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Documentation & Code */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-white rounded-[4rem] p-16 border border-[var(--border-color)] shadow-2xl">
                        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-16 flex items-center gap-5 uppercase italic">
                            <FiTerminal className="text-[var(--primary-blue)]" /> Protocol Endpoints
                        </h2>

                        <div className="space-y-16">
                            {/* Extract v1 */}
                            <div className="group">
                                <div className="flex flex-wrap items-center gap-6 mb-8">
                                    <span className="px-5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase shadow-sm">METHOD_GET</span>
                                    <code className="text-[var(--text-primary)] font-mono text-xl font-black tracking-tight italic">/api/v1/extract</code>
                                    <span className="ml-auto text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-30 italic">Direct Deep Pulse</span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-lg font-medium mb-10 leading-relaxed opacity-60">
                                    Primary node for single-target deep intelligence. Analyzes the target DOM structure
                                    and resolves all identifiable corporate, contact, and social data points in a single reactive stream.
                                </p>
                                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] p-10 border border-[var(--border-color)]/50 shadow-inner">
                                    <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-8 opacity-40 italic">Authorized Parameters</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/30 hover:border-[var(--primary-blue)]/30 transition-all shadow-sm">
                                            <span className="text-[var(--primary-blue)] font-mono font-black text-sm uppercase px-2 tracking-tight">url</span>
                                            <span className="text-[var(--text-secondary)] italic text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Resource URI (REQUIRED)</span>
                                        </div>
                                        <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/30 hover:border-[var(--primary-blue)]/30 transition-all shadow-sm">
                                            <span className="text-[var(--primary-blue)] font-mono font-black text-sm uppercase px-2 tracking-tight">mode</span>
                                            <span className="text-[var(--text-secondary)] italic text-[10px] font-black uppercase tracking-[0.2em] opacity-40">STANDARD | STEALTH_BYPASS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-[var(--border-color)] opacity-30"></div>

                            {/* Audit v1 */}
                            <div className="group">
                                <div className="flex flex-wrap items-center gap-6 mb-8">
                                    <span className="px-5 py-2 bg-blue-50 text-[var(--primary-blue)] border border-blue-100 rounded-xl text-[9px] font-black tracking-[0.3em] uppercase shadow-sm">METHOD_GET</span>
                                    <code className="text-[var(--text-primary)] font-mono text-xl font-black tracking-tight italic">/api/v1/audit</code>
                                    <span className="ml-auto text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-30 italic">Infra Assurance</span>
                                </div>
                                <p className="text-[var(--text-secondary)] text-lg font-medium mb-10 leading-relaxed opacity-60">
                                    Performs comprehensive infrastructure postural analysis. Evaluates secure routing metrics,
                                    SSL/TLS encryption layers, and fortification header compliance.
                                </p>
                                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] p-10 border border-[var(--border-color)]/50 shadow-inner">
                                    <h4 className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] mb-8 opacity-40 italic">Audit Parameters</h4>
                                    <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-[var(--border-color)]/30 hover:border-[var(--primary-blue)]/30 transition-all shadow-sm">
                                        <span className="text-[var(--primary-blue)] font-mono font-black text-sm uppercase px-2 tracking-tight">url</span>
                                        <span className="text-[var(--text-secondary)] italic text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Target FQDN (REQUIRED)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Implementation Examples */}
                    <div className="bg-white rounded-[4rem] border border-[var(--border-color)] overflow-hidden shadow-2xl">
                        <div className="flex border-b border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]/50 gap-3">
                            {Object.keys(CODE_EXAMPLES).map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLang(lang)}
                                    className={`px-10 py-5 text-[9px] font-black uppercase tracking-[0.3em] transition-all rounded-[1.5rem] border ${activeLang === lang
                                        ? 'bg-black text-white shadow-xl border-black active:scale-95'
                                        : 'bg-white text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--primary-blue)] opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        <div className="relative group p-2 bg-white">
                            <pre className="p-12 text-[var(--text-primary)] text-sm font-mono overflow-x-auto leading-loose scrollbar-hide bg-white rounded-[3.5rem] font-bold tracking-tight">
                                {CODE_EXAMPLES[activeLang]}
                            </pre>
                            <button
                                onClick={() => copyToClipboard(CODE_EXAMPLES[activeLang], 'code')}
                                className="absolute top-10 right-10 w-16 h-16 rounded-[2rem] bg-white border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-black hover:text-white hover:shadow-2xl transition-all duration-500 shadow-xl"
                            >
                                {copied === 'code' ? <FiCheck className="text-emerald-500 text-xl" /> : <FiCopy className="text-xl" />}
                            </button>
                        </div>
                    </div>

                    {/* Support Call */}
                    <div className="p-16 bg-black text-white rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left relative overflow-hidden group border-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-5 mb-6 justify-center lg:justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-blue)] flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                                    <FiDatabase size={28} />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tight italic">Enterprise Scaling</h3>
                            </div>
                            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xl">Require custom throughput, dedicated IP pooling, or custom schemas? Configure your private cluster with dedicated resources.</p>
                        </div>
                        <button className="relative z-10 px-12 py-7 bg-[var(--primary-blue)] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-white hover:text-black transition-all shadow-2xl shadow-blue-600/20 active:scale-95 whitespace-nowrap">
                            Contact Infrastructure
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ApiDocsPage;
