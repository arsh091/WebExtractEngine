import { motion } from 'framer-motion';
import { FiBook, FiCode, FiZap, FiShield, FiCpu } from 'react-icons/fi';

const Docs = () => {
    const sections = [
        {
            title: "Quick Start",
            icon: <FiZap />,
            content: "To begin extracting data, simply enter the target URL into the dashboard. Our engine will prioritize a fast scrape using direct DOM analysis before falling back to deep browser emulation if required."
        },
        {
            title: "Advanced Extraction",
            icon: <FiCpu />,
            content: "The engine utilizes greedy regex patterns specifically tuned for high precision in finding emails, phone numbers, and physical addresses across varying international standards."
        },
        {
            title: "Security & Ethics",
            icon: <FiShield />,
            content: "We implement standard rate limiting and respect 'robots.txt' instructions to ensure that extraction processes are performed responsibly and without taxing target server resources."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-500 text-3xl">
                        <FiBook />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                        Documentation
                    </h1>
                </div>
                <p className="text-xl text-gray-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                    Welcome to the WebExtract AI knowledge base. Learn how to maximize the efficiency
                    of your data intelligence workflows.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-primary-500/30 transition-all group"
                    >
                        <div className="text-2xl text-primary-500 mb-6 group-hover:scale-110 transition-transform origin-left">
                            {section.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 italic uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                            {section.content}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                        <FiCode className="text-primary-500" /> Technical Architecture
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                        Our hybrid engine architecture switches between a high-efficiency Node.js stack for static
                        DOM parsing and a Chromium-based browser environment for JavaScript-heavy single-page applications (SPAs).
                    </p>
                    <div className="mt-8 p-6 bg-black rounded-2xl border border-white/10 font-mono text-sm text-green-400 shadow-2xl overflow-x-auto">
                        <span className="text-pink-500">const</span> engine = <span className="text-blue-400">new</span> WebExtractAI({'{'} <br />
                        &nbsp;&nbsp;mode: <span className="text-orange-400">'hybrid'</span>, <br />
                        &nbsp;&nbsp;intelligence: <span className="text-orange-400">'deep-scan'</span>, <br />
                        &nbsp;&nbsp;concurrency: <span className="text-pink-500">true</span> <br />
                        {'}'});
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Docs;
