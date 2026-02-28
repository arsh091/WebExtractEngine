import { motion } from 'framer-motion';
import { FiGlobe, FiCornerDownRight, FiHash, FiActivity, FiCpu, FiTerminal, FiLayers, FiCode, FiArrowRight } from 'react-icons/fi';

const ApiReference = () => {
    const endpoints = [
        {
            method: 'GET',
            path: '/api/v1/extract',
            desc: 'Primary endpoint for structured data extraction. Requires a valid API Authorization token in the request headers.',
            params: 'Query Parameters:\n - url: string (required)\n - fields: string (optional, e.g., "phones,emails")'
        },
        {
            method: 'POST',
            path: '/api/v1/bulk',
            desc: 'High-throughput batch processing. Supports concurrent analysis for up to 50 target URLs.',
            params: 'Payload JSON:\n{ "urls": ["domain-a.com", "domain-b.com"] }'
        },
        {
            method: 'GET',
            path: '/api/v1/usage',
            desc: 'Retrieve real-time metrics for API consumption, throughput, and available extraction credits.',
            params: 'Auth-Headers-Only'
        },
        {
            method: 'GET',
            path: '/api/health',
            desc: 'System health status. Verifies connectivity to the extraction clusters and infrastructure nodes.',
            params: 'No-Params'
        }
    ];

    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-32"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-16">
                    <div className="p-10 bg-black rounded-[3rem] text-white text-5xl shadow-2xl shrink-0">
                        <FiTerminal />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
                            <FiCode /> REST API Documentation
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                            Developer <span className="text-[var(--primary-blue)]">Reference</span>
                        </h1>
                    </div>
                </div>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-bold max-w-5xl leading-relaxed opacity-50">
                    Comprehensive integration documentation for developers building automated data workflows on the WebExtract infrastructure.
                </p>
            </motion.div>

            <div className="space-y-12">
                {endpoints.map((endpoint, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="pro-card p-12 bg-white border border-[var(--border-color)] hover:border-[var(--primary-blue)]/20 shadow-xl overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative z-10">
                            <div className="flex items-center flex-wrap gap-8">
                                <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl ${endpoint.method === 'POST' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-[var(--primary-blue)] border border-blue-100'
                                    }`}>
                                    {endpoint.method}
                                </span >
                                <h2 className="text-2xl md:text-5xl font-mono font-black text-[var(--text-primary)] tracking-tight break-all">
                                    {endpoint.path}
                                </h2>
                            </div>
                        </div>

                        <p className="text-lg text-[var(--text-secondary)] mb-14 max-w-5xl font-bold opacity-50 leading-relaxed pr-12">
                            {endpoint.desc}
                        </p>

                        <div className="space-y-10 relative z-10">
                            <div className="flex items-center gap-5 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-40">
                                <FiLayers /> Request Parameters
                            </div>
                            <div className="relative group/code">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-blue)] to-blue-400 rounded-[2.5rem] blur opacity-5 group-hover/code:opacity-20 transition duration-1000"></div>
                                <pre className="p-10 bg-black rounded-[2.5rem] font-mono text-sm text-white/80 overflow-x-auto shadow-2xl relative border border-white/10 leading-relaxed">
                                    <div className="absolute top-8 right-10 flex gap-3 opacity-20">
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                    </div>
                                    {endpoint.params}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-14 pt-12 border-t border-[var(--border-color)]/20 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="flex items-center gap-5 text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-widest opacity-60">
                                <FiCornerDownRight className="text-xl" />
                                <span>Status 200: Successful Operation</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse delay-75 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse delay-150 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ApiReference;
