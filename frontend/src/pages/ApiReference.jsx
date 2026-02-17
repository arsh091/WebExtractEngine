import { motion } from 'framer-motion';
import { FiGlobe, FiCornerDownRight, FiHash, FiActivity } from 'react-icons/fi';

const ApiReference = () => {
    const endpoints = [
        {
            method: 'POST',
            path: '/api/extract',
            desc: 'Extract structured intelligence from a Target URL.',
            params: '{ "url": "https://example.com" }'
        },
        {
            method: 'GET',
            path: '/api/health',
            desc: 'Retrieve current operational health status of the extraction cluster.',
            params: 'null'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-4">
                    <FiActivity className="text-primary-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-[0.4em] text-primary-500 uppercase">Interactive Reference</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                    API Reference
                </h1>
                <p className="text-lg text-gray-500 dark:text-slate-400">
                    Direct integration guide for high-volume automated data harvesting.
                </p>
            </motion.div>

            <div className="space-y-12">
                {endpoints.map((endpoint, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <FiGlobe size={150} />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                            <div className="flex items-center flex-wrap gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shrink-0 ${endpoint.method === 'POST' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                                    }`}>
                                    {endpoint.method}
                                </span>
                                <h2 className="text-xl md:text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-tight break-all">
                                    {endpoint.path}
                                </h2>
                            </div>
                        </div>

                        <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-2xl">
                            {endpoint.desc}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">
                                <FiHash /> Request Payload (JSON)
                            </div>
                            <pre className="p-4 md:p-6 bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/5 rounded-2xl font-mono text-xs md:text-sm text-gray-700 dark:text-slate-300 overflow-x-auto shadow-inner">
                                {endpoint.params}
                            </pre>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 flex items-center gap-3 text-xs font-bold text-primary-500">
                            <FiCornerDownRight />
                            <span className="uppercase tracking-widest">Standard Response Protocol: 200 OK</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ApiReference;
