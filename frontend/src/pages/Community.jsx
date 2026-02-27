import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiMessageSquare, FiUsers, FiHeart, FiActivity, FiGlobe, FiCpu, FiAward } from 'react-icons/fi';

const Community = () => {
    return (
        <div className="container mx-auto px-6 py-32 max-w-7xl font-sans">
            <div className="text-center mb-32 space-y-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-100 mb-6 italic"
                >
                    <FiAward className="animate-bounce" /> Collaborative Ecosystem
                </motion.div>
                <h1 className="text-5xl md:text-[8rem] font-black text-[var(--text-primary)] tracking-tight uppercase leading-none italic">
                    Connect with <span className="text-[var(--primary-blue)]">Extract</span> Engineers.
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium max-w-4xl mx-auto leading-relaxed opacity-60">
                    Join a global network of specialized data architects. We're building the infrastructure
                    for high-fidelity information extraction at planetary scale.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                <div className="p-16 bg-black text-white rounded-[4rem] relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] min-h-[500px] flex flex-col justify-between border-none">
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--primary-blue)] flex items-center justify-center text-white mb-10 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                            <FiGithub size={32} />
                        </div>
                        <h3 className="text-4xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter italic">
                            Core Repositories
                        </h3>
                        <p className="text-white/40 mb-12 text-lg leading-relaxed font-medium">
                            Contribute to our primary extraction engines, SDKs, and enterprise middleware. Open development starts here.
                        </p>
                        <button className="px-12 py-6 bg-[var(--primary-blue)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95">
                            Browse Repositories
                        </button>
                    </div>
                    <div className="mt-16 flex items-center gap-12 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-white text-5xl font-black italic tracking-tighter">12.5K</span>
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-3">Stars Gained</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-5xl font-black italic tracking-tighter">1,400</span>
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-3">Global Contributors</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                </div>

                <div className="p-16 bg-white text-[var(--text-primary)] rounded-[4rem] border-2 border-[var(--border-color)] relative overflow-hidden group shadow-2xl min-h-[500px] flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-black flex items-center justify-center text-white mb-10 shadow-xl">
                            <FiMessageSquare size={32} />
                        </div>
                        <h3 className="text-4xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter italic">
                            Engineer HQ
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-12 text-lg leading-relaxed font-medium opacity-60">
                            The primary node for real-time collaboration. Discuss architecture, request features, and get production support.
                        </p>
                        <button className="px-12 py-6 bg-black text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--primary-blue)] transition-all shadow-2xl active:scale-95">
                            Join Discord Node
                        </button>
                    </div>
                    <div className="mt-16 flex items-center gap-12 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[var(--text-primary)] text-5xl font-black italic tracking-tighter">45K</span>
                            <span className="text-[9px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.4em] mt-3">Active Channels</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--text-primary)] text-5xl font-black italic tracking-tighter">24/7</span>
                            <span className="text-[9px] font-black text-[var(--text-secondary)]/30 uppercase tracking-[0.4em] mt-3">Expert Monitoring</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                    { title: "Weekly Sprints", icon: <FiActivity />, val: "22+", color: "text-emerald-500", bg: "bg-emerald-50" },
                    { title: "Platform Users", icon: <FiGlobe />, val: "150k+", color: "text-blue-500", bg: "bg-blue-50" },
                    { title: "Developer Base", icon: <FiUsers />, val: "8.5k", color: "text-indigo-500", bg: "bg-indigo-50" },
                    { title: "Twitter Feed", icon: <FiTwitter />, val: "@WebExtract", color: "text-sky-500", bg: "bg-sky-50" }
                ].map((stat, i) => (
                    <div key={i} className="p-10 bg-white border-2 border-[var(--border-color)] rounded-[3rem] flex flex-col justify-between hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-2 h-full bg-[var(--primary-blue)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className={`p-5 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] opacity-40 mb-3 block italic">{stat.title}</span>
                            <span className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">{stat.val}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
