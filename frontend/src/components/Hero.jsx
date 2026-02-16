import { useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { FiArrowDown, FiShield, FiZap, FiDatabase } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';

const Hero = () => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(contentRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5 }
            );

            // Floating animation for decorative elements
            gsap.to('.hero-blob', {
                y: '+=20',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.5
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-white dark:bg-appDark transition-colors duration-500">
                <div className="hero-blob absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-[120px]"></div>
                <div className="hero-blob absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px]"></div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
                <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(15,23,42,1)_100%)]"></div>
            </div>

            <div ref={contentRef} className="max-w-4xl mx-auto space-y-8 z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-full border border-primary-500/20 mb-4 scale-animation">
                    <FiZap className="text-primary-500" />
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-bold tracking-wider">NEXT-GEN WEB SCRAPER</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                    Extract Data <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-blue-600 to-cyan-500 drop-shadow-2xl">
                        Instantly.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    Analyze any website and extract phone numbers, emails, and physical addresses
                    using our advanced AI-pattern recognition engine.
                </p>

                <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-60">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm font-semibold">
                        <FiShield className="text-primary-500" />
                        SECURE
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm font-semibold">
                        <FiZap className="text-primary-500" />
                        LIGHTNING FAST
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 text-sm font-semibold">
                        <FiDatabase className="text-primary-500" />
                        HIGH ACCURACY
                    </div>
                </div>

                <div className="pt-12 animate-bounce-slow">
                    <FiArrowDown className="text-primary-500 text-3xl mx-auto opacity-50" />
                </div>
            </div>
        </div>
    );
};

export default Hero;
