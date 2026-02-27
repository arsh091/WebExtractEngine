import { motion } from 'framer-motion';
import { FiGlobe, FiCornerDownRight, FiHash, FiActivity, FiCpu, FiTerminal, FiLayers } from 'react-icons/fi';

const ApiReference = () => {
    const endpoints = [
        {
            method: 'GET',
            path: '/api/v1/extract',
            desc: 'Primary endpoint for structured intelligence extraction. Requires a valid API Authorization token in Header.',
            params: 'Query Parameters:\n - url: string (required)\n - fields: string (optional, e.g., "phones,emails")'
        },
        {
            method: 'POST',
            path: '/api/v1/bulk',
            desc: 'High-throughput batch processing. Supports concurrent analysis for up to 50 target nodes.',
            params: 'Payload JSON:\n{ "nodes": ["domain-a.com", "domain-b.com"] }'
        },
        {
            method: 'GET',
            path: '/api/v1/usage',
            desc: 'Retrieve real-time metrics for API consumption, throughput, and available telemetry credits.',
            params: 'Auth-Headers-Only'
        },
        {
            method: 'GET',
            path: '/api/health',
            desc: 'Global cluster status. Verifies connectivity to the extraction engines and proxy distribution nodes.',
            params: 'No-Params'
        }
    ];

    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-24"
            >
                <div className="flex flex-col lg:flex-row lg:items-center gap-10 mb-12">
                    <div className="p-8 bg-black rounded-[2.5rem] text-white text-5xl shadow-2xl group hover:bg-[var(--primary-blue)] transition-all duration-500 w-fit shrink-0">
                        <FiTerminal className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <FiActivity className="text-[var(--primary-blue)]" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-[var(--primary-blue)] uppercase opacity-60 italic">Technical Implementation Protocols</span>
                        </div>
                        <h1 className="text-5xl md:text-[8rem] font-black text-[var(--text-primary)] mb-8 tracking-tight uppercase leading-none italic">
                            API <span className="text-[var(--primary-blue)]">Endpoints</span>
                        </h1>
                    </div>
                </div>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] max-w-5xl font-medium leading-relaxed opacity-60 italic">
                    Comprehensive integration documentation for automated infrastructure developers.
                    Build your custom intelligence tooling on the WebExtract planetary engine.
                </p>
            </motion.div>

            <div className="space-y-16">
                {endpoints.map((endpoint, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-12 bg-white rounded-[4rem] border-2 border-[var(--border-color)] shadow-2xl overflow-hidden relative group hover:border-[var(--primary-blue)]/20"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                            <div className="flex items-center flex-wrap gap-6">
                                <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl italic ${endpoint.method === 'POST' ? 'bg-amber-50 text-amber-600 border-2 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100'
                                    }`}>
                                    {endpoint.method}
                                </span >
                                <h2 className="text-3xl md:text-5xl font-mono font-black text-[var(--text-primary)] tracking-tight break-all italic group-hover:text-[var(--primary-blue)] transition-colors">
                                    {endpoint.path}
                                </h2>
                            </div>
                        </div>

                        <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-5xl font-medium opacity-60 leading-relaxed italic pr-12">
                            {endpoint.desc}
                        </p>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-4 text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-30 italic">
                                <FiLayers /> Request Schema Matrix
                            </div>
                            <div className="relative group/code">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary-blue)] to-blue-400 rounded-[2.5rem] blur opacity-10 group-hover/code:opacity-30 transition duration-1000"></div>
                                <pre className="p-10 bg-black rounded-[2.5rem] font-mono text-[13px] text-white/90 overflow-x-auto shadow-2xl relative border border-white/10 leading-relaxed italic">
                                    <div className="absolute top-8 right-10 flex gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-blue-500/20"></div>
                                    </div>
                                    {endpoint.params}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t-2 border-[var(--border-color)]/50 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                            <div className="flex items-center gap-4 text-[10px] font-black text-[var(--primary-blue)] uppercase tracking-[0.4em] italic">
                                <FiCornerDownRight className="text-lg" />
                                <span>STATUS_200: CLUSTER_OPERATIONAL</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ApiReference;
