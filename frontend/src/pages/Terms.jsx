import { motion } from 'framer-motion';
import { FiFileText, FiAlertCircle } from 'react-icons/fi';

const Terms = () => {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter max-w-none"
            >
                <div className="flex items-center gap-4 mb-8 not-prose">
                    <div className="p-3 bg-gray-900 text-white rounded-2xl">
                        <FiFileText size={32} />
                    </div>
                    <h1 className="text-5xl m-0 font-black text-gray-900 dark:text-white tracking-tighter">Terms of Service</h1>
                </div>

                <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl mb-12 flex gap-4 not-prose">
                    <FiAlertCircle className="text-orange-500 shrink-0 mt-1" />
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium m-0 leading-relaxed">
                        IMPORTANT: By using WebExtract AI, you agree to comply with all local and international laws regarding
                        data harvesting and privacy.
                    </p>
                </div>

                <h2 className="text-2xl mt-12 mb-6 italic uppercase tracking-widest text-primary-500">1. Usage Guidelines</h2>
                <p>
                    Users are prohibited from using this tool to extract data from websites that explicitly forbid automated
                    access in their robots.txt or terms of service. You are solely responsible for obtaining the necessary
                    permissions before performing large-scale extractions.
                </p>

                <h2 className="text-2xl mt-12 mb-6 italic uppercase tracking-widest text-primary-500">2. Prohibited Content</h2>
                <p>
                    Our engine may not be used to target government portals, sensitive personal data stores, or sites
                    that contain non-public, password-protected information without explicit authorization.
                </p>

                <h2 className="text-2xl mt-12 mb-6 italic uppercase tracking-widest text-primary-500">3. Service Availability</h2>
                <p>
                    While we strive for 100% uptime, WebExtract AI provides services on an "as-is" basis. We do not
                    guarantee the success of extraction for all target sites due to varying security measures (WAFs,
                    CAPTCHAs, and anti-bot systems).
                </p>

                <h2 className="text-2xl mt-12 mb-6 italic uppercase tracking-widest text-primary-500">4. Limitation of Liability</h2>
                <p>
                    WebExtract AI is a technical instrument. We are not liable for any misuse of the tool or any
                    damages resulting from the use of data harvested through our engine.
                </p>
            </motion.div>
        </div>
    );
};

export default Terms;
