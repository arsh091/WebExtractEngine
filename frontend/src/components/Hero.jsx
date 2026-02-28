import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BadgeCheck, ArrowRight, Play, Search, Zap, Shield, Database, LayoutGrid, Cpu, Globe } from 'lucide-react';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-badge', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power4.out'
            });

            gsap.from('.hero-title', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                delay: 0.1,
                ease: 'power4.out'
            });

            gsap.from('.hero-subtitle', {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power4.out',
                clearProps: "all"
            });

            gsap.from('.hero-actions', {
                y: 20,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power4.out'
            });

            gsap.from('.hero-stats', {
                y: 20,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: 'power4.out'
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative min-h-[75vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden px-4">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 flex justify-center overflow-hidden pointer-events-none">
                <div className="w-[1200px] h-[800px] bg-blue-50/50 rounded-full blur-[150px] -translate-y-1/2 opacity-60"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-blue)]/5 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Badge */}
                <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 cursor-default group transition-all duration-300 hover:bg-blue-100">
                    <Database className="w-4 h-4 text-[var(--primary-blue)]" />
                    <span className="text-xs font-semibold text-[var(--primary-blue)]">
                        Enterprise Data Extraction Platform
                    </span>
                </div>

                {/* Title */}
                <h1 className="hero-title text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-[var(--text-primary)] mb-8 leading-[1.1]">
                    Reliable <span className="text-[var(--primary-blue)]">Web Data</span><br className="hidden md:block" />
                    At Your Fingertips
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-12">
                    An industry-standard web extraction platform for gathering accurate contact information,
                    social profiles, and organizational data. Fast, reliable, and professional.
                </p>

                {/* Actions */}
                <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="pro-button pro-button-primary px-8 py-3.5 text-base shadow-sm hover:shadow-md">
                        Start Extracting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="pro-button pro-button-secondary px-8 py-3.5 text-base gap-3">
                        <Play className="w-4 h-4" />
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Platform Stats Row */}
            <div className="hero-stats mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-[var(--border-color)] w-full max-w-5xl mx-auto">
                {[
                    { label: '99.9% Accuracy', icon: Shield, desc: 'Verified Results' },
                    { label: 'Cloud-Native', icon: Database, desc: 'Scalable Processing' },
                    { label: 'Real-time Extraction', icon: Zap, desc: 'Lightning Fast' },
                    { label: 'Deep Search', icon: Search, desc: 'Comprehensive Coverage' }
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-3 group cursor-default">
                        <div className="p-3 bg-blue-50 text-[var(--primary-blue)] rounded-xl transition-all duration-300 group-hover:bg-[var(--primary-blue)] group-hover:text-white">
                            <stat.icon size={20} />
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-sm font-semibold text-[var(--text-primary)] block mb-1">{stat.label}</span>
                            <span className="text-xs text-[var(--text-secondary)] block px-2">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
