import { useEffect, useRef, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { HiLightningBolt, HiMenuAlt3 } from 'react-icons/hi';
import { FiMoon, FiSun, FiClock, FiX } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = ({ onOpenHistory }) => {
    const logoRef = useRef(null);
    const navRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        gsap.fromTo(logoRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
        );

        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled) {
                navRef.current?.classList.add('bg-white/80', 'dark:bg-appDark/80', 'backdrop-blur-md', 'shadow-xl', 'py-3');
                navRef.current?.classList.remove('py-4');
            } else {
                navRef.current?.classList.remove('bg-white/80', 'dark:bg-appDark/80', 'backdrop-blur-md', 'shadow-xl', 'py-3');
                navRef.current?.classList.add('py-4');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 py-4 px-6 md:px-12 flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-gray-900 border-b border-gray-100'}`}
            >
                <Link to="/" ref={logoRef} className="flex items-center space-x-2 cursor-pointer group">
                    <div className="p-2 bg-primary-500 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary-500/20">
                        <HiLightningBolt className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">
                        Web<span className="text-primary-500">Extract</span>
                    </span>
                </Link>

                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="hidden lg:flex items-center space-x-6 mr-4 text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                        <Link to="/api-reference" className="hover:text-primary-500 transition-colors uppercase">API</Link>
                        <Link to="/community" className="hover:text-primary-500 transition-colors uppercase">Community</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenHistory}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-transparent"
                        >
                            <FiClock className="text-xl" />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-transparent"
                        >
                            {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
                        </button>

                        <Link to="/docs" className="hidden sm:block bg-primary-500 hover:bg-primary-600 px-6 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-500/25">
                            Docs
                        </Link>

                        <button
                            className="lg:hidden p-2.5 rounded-xl bg-gray-900 text-white shadow-lg"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FiX size={20} /> : <HiMenuAlt3 size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[55] bg-white dark:bg-appDark p-8 pt-32 lg:hidden"
                    >
                        <div className="flex flex-col space-y-8 text-center">
                            <Link to="/docs" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic text-gray-900 dark:text-white uppercase tracking-tighter">Documentation</Link>
                            <Link to="/api-reference" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic text-gray-900 dark:text-white uppercase tracking-tighter">API Reference</Link>
                            <Link to="/community" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic text-gray-900 dark:text-white uppercase tracking-tighter">Community Hub</Link>
                            <div className="pt-12 flex flex-col items-center gap-6">
                                <Link to="/privacy" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Privacy Policy</Link>
                                <Link to="/terms" onClick={() => setIsMenuOpen(false)} className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Terms of Service</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
