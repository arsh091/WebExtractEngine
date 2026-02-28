import { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
    Menu, X, Database, LogOut,
    User, Shield, Activity, Terminal, Globe, Cpu, Atom, LayoutGrid, Sun, Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = ({ onOpenHistory, onOpenAuth, onOpenApi, onOpenSecurity, onOpenIP, onOpenAdvanced }) => {
    const navRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useContext(ThemeContext);

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
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 opacity-0 -translate-y-4 ${scrolled ? 'py-4 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-color)] shadow-sm' : 'py-8 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-[var(--primary-blue)] rounded-xl shadow-lg group-hover:bg-[var(--primary-blue)] dark:group-hover:bg-white transition-all duration-500 group-hover:rotate-6">
                        <LayoutGrid className="text-white dark:text-black w-5 h-5 transition-colors" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                        Web<span className="text-[var(--primary-blue)]">Extract</span>
                    </span>
                </Link>

                {/* Desktop Nav - Centered */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={link.onClick}
                            className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--primary-blue)] transition-all group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all outline-none bg-[var(--bg-main)] shadow-sm"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <button
                                    onClick={onOpenHistory}
                                    className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all outline-none bg-[var(--bg-main)] font-semibold text-sm flex items-center gap-2 shadow-sm"
                                    title="Extraction History"
                                >
                                    <Database size={16} /> Vault
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-3 rounded-xl border border-[var(--border-color)] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all outline-none bg-[var(--bg-main)] shadow-sm"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onOpenAuth}
                                className="pro-button pro-button-primary !py-2.5 !px-6 text-sm font-semibold"
                            >
                                Get Started
                            </button>
                        )}
                    </div>

                    <button
                        className="lg:hidden p-3 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] outline-none bg-[var(--bg-main)]"
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
                        className="lg:hidden overflow-hidden bg-[var(--bg-main)] border-b border-[var(--border-color)] shadow-2xl"
                    >
                        <div className="p-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => { link.onClick(); setIsMenuOpen(false); }}
                                    className="text-sm font-semibold text-[var(--text-primary)] text-left hover:text-[var(--primary-blue)] transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}
                            {!user && (
                                <button
                                    onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                                    className="pro-button pro-button-primary w-full text-center py-3 text-sm font-semibold"
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
