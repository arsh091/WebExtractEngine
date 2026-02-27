import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, Database, LogOut,
    User, Shield, Activity, Terminal, Globe, Cpu, Atom, LayoutGrid
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = ({ onOpenHistory, onOpenAuth, onOpenApi, onOpenSecurity, onOpenIP, onOpenAdvanced }) => {
    const navRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        gsap.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out'
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Infrastructure', onClick: onOpenIP },
        { name: 'Deep Scan', onClick: onOpenAdvanced },
        { name: 'Security', onClick: onOpenSecurity },
        { name: 'API Docs', onClick: onOpenApi },
    ];

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 opacity-0 -translate-y-4 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm' : 'py-8 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 flex items-center justify-center bg-black rounded-xl shadow-lg group-hover:bg-[var(--primary-blue)] transition-all duration-500 group-hover:rotate-6">
                        <LayoutGrid className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] uppercase italic">
                        Web<span className="text-[var(--primary-blue)]">Extract</span>
                    </span>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={link.onClick}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--primary-blue)] transition-all group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <button
                                    onClick={onOpenHistory}
                                    className="p-3 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all outline-none bg-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                                    title="Extraction History"
                                >
                                    <Database size={14} /> Vault
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-3 rounded-xl border border-[var(--border-color)] text-red-500 hover:bg-red-50 transition-all outline-none bg-white"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onOpenAuth}
                                className="pro-button pro-button-primary !py-3 !px-10 text-[10px] shadow-2xl shadow-blue-600/20"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    <button
                        className="lg:hidden p-3 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] outline-none bg-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden bg-white border-b border-[var(--border-color)] shadow-2xl"
                    >
                        <div className="p-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => { link.onClick(); setIsMenuOpen(false); }}
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] text-left hover:text-[var(--primary-blue)] transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}
                            {!user && (
                                <button
                                    onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                                    className="pro-button pro-button-primary w-full text-center py-5 uppercase tracking-[0.4em] text-[10px]"
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
