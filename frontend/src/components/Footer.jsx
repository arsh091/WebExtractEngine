import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-20 mt-20 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
                    <div className="space-y-4">
                        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                            WebExtract AI
                        </Link>
                        <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">
                            Industry-leading data extraction powered by advanced pattern recognition
                            and headless browsing technology. Trusted by developers globally.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="text-sm text-gray-500 dark:text-slate-500 space-y-2">
                            <li><Link to="/docs" className="hover:text-primary-500 transition-colors">Documentation</Link></li>
                            <li><Link to="/api-reference" className="hover:text-primary-500 transition-colors">API Reference</Link></li>
                            <li><Link to="/community" className="hover:text-primary-500 transition-colors">Community</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs">System Status</h4>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-xs">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-gray-500 font-medium">All Systems Operational</span>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-600 uppercase tracking-tighter">
                            Last Checked: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div className="pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <p className="text-gray-400 dark:text-slate-600 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em]">
                        &copy; 2026 WEB EXTRACT ENGINE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-gray-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-primary-500 transition-colors">Terms</Link>
                        <Link to="/security" className="hover:text-primary-500 transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
