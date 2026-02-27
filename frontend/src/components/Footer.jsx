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
                            <span className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tighter uppercase italic">
                                Web<span className="text-[var(--primary-blue)]">Extract</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium opacity-60">
                            Enterprise-grade intelligence extraction nodes.
                            Engineered for high-throughput information retrieval
                            and infrastructural integrity.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-black text-[var(--text-primary)] uppercase tracking-[0.3em] text-[10px] opacity-40">Operational</h4>
                        <ul className="space-y-4">
                            <li><Link to="/docs" className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all flex items-center gap-2">Documentation</Link></li>
                            <li><Link to="/api" className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all flex items-center gap-2">API Reference</Link></li>
                            <li><Link to="/security" className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all flex items-center gap-2">Engine Security</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-black text-[var(--text-primary)] uppercase tracking-[0.3em] text-[10px] opacity-40">Network</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]/30">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/20"></span>
                                <span className="text-[10px] text-[var(--text-primary)] font-black uppercase tracking-widest">Nodes: Online</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]/30">
                                <Activity className="text-[var(--primary-blue)]" size={12} />
                                <span className="text-[10px] text-[var(--text-primary)] font-black uppercase tracking-widest">99.9% Efficiency</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h4 className="font-black text-[var(--text-primary)] uppercase tracking-[0.3em] text-[10px] opacity-40">Contact</h4>
                        <p className="text-sm font-bold text-[var(--text-primary)] tracking-tight">zubairrazasiddiqui@gmail.com</p>
                        <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest opacity-40 italic">Infrastructural Support: 24/7</p>
                    </div>
                </div>

                <div className="pt-12 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                        &copy; 2026 WEBEXTRACT AI. GLOBAL DATA PROTOCOL. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                        <Link to="/privacy" className="hover:text-[var(--primary-blue)] transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-[var(--primary-blue)] transition-colors">Terms</Link>
                        <Link to="/cookies" className="hover:text-[var(--primary-blue)] transition-colors">Nodes</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
