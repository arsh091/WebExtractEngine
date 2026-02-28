import { Link } from 'react-router-dom';
import { Database, Shield, Globe, Terminal, Cpu, LayoutGrid, Activity } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-32 bg-white border-t border-[var(--border-color)] relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="space-y-8 col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 flex items-center justify-center bg-black rounded-xl text-white">
                                <LayoutGrid size={20} />
                            </div>
                            <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                                Web<span className="text-[var(--primary-blue)]">Extract</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                            The industry standard for fast, reliable, and secure web data extraction. Gather actionable insights in seconds.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-semibold text-[var(--text-primary)]">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/docs" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all">Documentation</Link></li>
                            <li><Link to="/api" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all">API Reference</Link></li>
                            <li><Link to="/security" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all">Security</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-semibold text-[var(--text-primary)]">Status</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-white border border-[var(--border-color)] rounded-xl shadow-sm">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-xs text-[var(--text-secondary)] font-semibold">All Systems Operational</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white border border-[var(--border-color)] rounded-xl shadow-sm">
                                <Activity className="text-[var(--primary-blue)]" size={14} />
                                <span className="text-xs text-[var(--text-secondary)] font-semibold">99.9% Uptime</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-semibold text-[var(--text-primary)]">Contact</h4>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Support@webextract.com</p>
                        <p className="text-xs font-medium text-[var(--text-secondary)]">24/7 Priority Support included in all enterprise plans.</p>
                    </div>
                </div>

                <div className="pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[var(--text-secondary)] text-sm font-medium">
                        &copy; 2026 WebExtract Inc. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-[var(--text-secondary)] text-sm font-medium">
                        <Link to="/privacy" className="hover:text-[var(--primary-blue)] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[var(--primary-blue)] transition-colors">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-[var(--primary-blue)] transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
