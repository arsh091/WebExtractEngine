import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiMessageSquare, FiUsers, FiHeart, FiActivity, FiGlobe, FiCpu, FiAward, FiArrowRight } from 'react-icons/fi';

const Community = () => {
    return (
        <div className="container mx-auto px-6 py-40 max-w-7xl font-sans">
            <div className="text-center mb-32 space-y-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-blue-50 text-[var(--primary-blue)] rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100"
                >
                    <FiAward className="text-sm" /> Developer Ecosystem
                </motion.div>
                <h1 className="text-5xl md:text-9xl font-black text-[var(--text-primary)] tracking-tight leading-none uppercase">
                    Join Our <br /><span className="text-[var(--primary-blue)]">Community</span>
                </h1>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-bold max-w-4xl mx-auto leading-relaxed opacity-50">
                    Connect with a global network of data architects and engineers building the future of structured information extraction.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32">
                <div className="p-14 md:p-20 bg-black text-white rounded-[4rem] relative overflow-hidden group shadow-2xl flex flex-col justify-between border-none">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-[var(--primary-blue)] flex items-center justify-center text-white mb-10 shadow-lg">
                            <FiGithub size={36} />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-tighter leading-tight">
                            Open Source <br />Repositories
                        </h3>
                        <p className="text-white/40 mb-14 text-xl leading-relaxed font-bold max-w-lg">
                            Contribute to our primary extraction engines, SDKs, and enterprise modules. Development is open to everyone.
                        </p>
                        <button className="pro-button pro-button-primary bg-white text-black hover:bg-[var(--primary-blue)] hover:text-white px-12 py-6">
                            Browse GitHub
                        </button>
                    </div>
                    <div className="mt-20 flex flex-wrap items-center gap-16 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-white text-5xl font-black tracking-tighter">12.5K+</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-4">Stars across ecosystem</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-5xl font-black tracking-tighter">1,400+</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-4">Active Contributors</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                </div>

                <div className="p-14 md:p-20 bg-white text-[var(--text-primary)] rounded-[4rem] border border-[var(--border-color)] relative overflow-hidden group shadow-xl flex flex-col justify-between hover:border-[var(--primary-blue)]/30 transition-all">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-black flex items-center justify-center text-white mb-10 shadow-lg group-hover:bg-[var(--primary-blue)] transition-colors">
                            <FiMessageSquare size={36} />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-tighter leading-tight">
                            Developer <br />Community
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-14 text-xl leading-relaxed font-bold opacity-40 max-w-lg">
                            The central hub for real-time collaboration. Discuss architecture, share solutions, and get direct support.
                        </p>
                        <button className="pro-button pro-button-primary px-12 py-6">
                            Join Discord
                        </button>
                    </div>
                    <div className="mt-20 flex flex-wrap items-center gap-16 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[var(--text-primary)] text-5xl font-black tracking-tighter">45K+</span>
                            <span className="text-[10px] font-black text-[var(--text-secondary)]/30 uppercase tracking-widest mt-4">Active Members</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--text-primary)] text-5xl font-black tracking-tighter">24/7</span>
                            <span className="text-[10px] font-black text-[var(--text-secondary)]/30 uppercase tracking-widest mt-4">Community Support</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-Stat4 gap-8">
                {[
                    { title: "Weekly Sprints", icon: <FiActivity />, val: "22+", bg: "bg-blue-50", color: "text-blue-600" },
                    { title: "Platform Reach", icon: <FiGlobe />, val: "150k+", bg: "bg-blue-50", color: "text-blue-600" },
                    { title: "Developer Base", icon: <FiUsers />, val: "8.5k", bg: "bg-blue-50", color: "text-blue-600" },
                    { title: "Twitter Feed", icon: <FiTwitter />, val: "@WebExtract", bg: "bg-blue-50", color: "text-blue-600" }
                ].map((stat, i) => (
                    <div key={i} className="pro-card p-12 bg-white border border-[var(--border-color)] rounded-[3rem] flex flex-col justify-between hover:shadow-2xl transition-all group relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[var(--primary-blue)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-black group-hover:text-white transition-all`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest opacity-30 mb-4 block">{stat.title}</span>
                            <span className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{stat.val}</span>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .grid-cols-Stat4 {
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                }
                @media (max-width: 1024px) {
                    .grid-cols-Stat4 {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }
                @media (max-width: 640px) {
                    .grid-cols-Stat4 {
                        grid-template-columns: repeat(1, minmax(0, 1fr));
                    }
                }
            `}</style>
        </div>
    );
};

export default Community;
