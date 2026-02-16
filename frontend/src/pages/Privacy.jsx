import { motion } from 'framer-motion';
import { FiLock, FiEye, FiCheckCircle } from 'react-icons/fi';

const Privacy = () => {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter max-w-none"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    <FiLock /> Last Updated: February 17, 2026
                </div>

                <h1 className="text-5xl mb-8">Privacy Policy</h1>

                <p className="lead text-xl text-gray-500 dark:text-slate-400">
                    At WebExtract AI, we prioritize the integrity of your data and the transparency of our processing operations.
                    This policy outlines how we handle information during the extraction lifecycle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 not-prose">
                    <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5">
                        <FiEye className="text-primary-500 text-3xl mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Minimal Retention</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed">
                            Extracted data is stored in your local session only. We do not persist raw scraped content
                            on our centralized infrastructure beyond the immediate processing window.
                        </p>
                    </div>
                    <div className="p-8 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5">
                        <FiCheckCircle className="text-primary-500 text-3xl mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Data Selling</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed">
                            WebExtract AI does not monetize your extracted intelligence. The relationship remains strictly
                            between the user and the target resource.
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-12 mb-6">1. Data Collection</h2>
                <p>
                    The only technical data we collect is anonymous telemetry regarding system health, input URL validity,
                    and engine performance. Your extracted business data (emails, phones, locations) belongs exclusively to you.
                </p>

                <h2 className="text-2xl font-bold mt-12 mb-6">2. Cookies & Local Storage</h2>
                <p>
                    We use standard browser local storage to preserve your theme preferences and your recent extraction
                    history (displayed in the sidebar). This data never leaves your device.
                </p>

                <h2 className="text-2xl font-bold mt-12 mb-6">3. Third-Party Interactions</h2>
                <p>
                    During extraction, our servers act as an intermediary, establishing a direct connection to the
                    recipient website using secure TLS protocols.
                </p>
            </motion.div>
        </div>
    );
};

export default Privacy;
