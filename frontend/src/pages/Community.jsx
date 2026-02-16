import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiMessageSquare, FiUsers, FiHeart, FiStar, FiActivity } from 'react-icons/fi';

const Community = () => {
    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl">
            <div className="text-center mb-20 space-y-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 text-pink-500 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                >
                    <FiHeart /> Open Source & Proud
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
                    Join the Collective.
                </h1>
                <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Connecting developers, data scientists, and intelligence enthusiasts globally.
                    Together, we build the future of the decentralized web.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-10 bg-gray-900 text-white rounded-[2rem] relative overflow-hidden group shadow-2xl">
                    <FiGithub className="absolute -bottom-10 -right-10 text-[15rem] opacity-5 group-hover:rotate-12 transition-transform duration-700" />
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-3 italic">
                        <FiGithub /> Developer Hub
                    </h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Contribute to our core engine or explore our suite of community-driven plugins on GitHub.
                    </p>
                    <button className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-primary-500 hover:text-white transition-all">
                        EXPLORE REPOSITORIES
                    </button>
                    <div className="mt-10 flex items-center gap-6 text-slate-500 font-mono text-xs">
                        <span className="flex items-center gap-2"><FiStar className="text-yellow-500" /> 12.4k Stars</span>
                        <span className="flex items-center gap-2"><FiUsers /> 1.2k Contributors</span>
                    </div>
                </div>

                <div className="p-10 bg-primary-500 text-white rounded-[2rem] relative overflow-hidden group shadow-2xl">
                    <FiMessageSquare className="absolute -bottom-10 -right-10 text-[15rem] opacity-10 group-hover:-rotate-12 transition-transform duration-700" />
                    <h3 className="text-3xl font-black mb-4 flex items-center gap-3 italic">
                        <FiMessageSquare /> Core Chat
                    </h3>
                    <p className="text-white/80 mb-8 leading-relaxed">
                        Join our Discord for real-time support, feature requests, and early access to experimental releases.
                    </p>
                    <button className="px-8 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all">
                        JOIN THE DISCORD
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Weekly Sprints", icon: <FiActivity />, val: "15+" },
                    { title: "Total Users", icon: <FiUsers />, val: "50k+" },
                    { title: "Twitter Base", icon: <FiTwitter />, val: "22k" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-black/50 text-primary-500 rounded-xl">
                                {stat.icon}
                            </div>
                            <span className="text-sm font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{stat.title}</span>
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-white">{stat.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
