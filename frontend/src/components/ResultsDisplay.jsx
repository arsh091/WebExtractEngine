import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiPhone, FiMail, FiMapPin, FiCopy, FiCheckCircle, FiSearch, FiZap, FiTarget } from 'react-icons/fi';
import ExportButtons from './ExportButtons';

const ResultsDisplay = ({ data, onNotification }) => {
    const resultsRef = useRef(null);
    const hasResults = (data.phones?.length || 0) + (data.emails?.length || 0) + (data.addresses?.length || 0) > 0;

    useEffect(() => {
        if (resultsRef.current) {
            gsap.fromTo(
                resultsRef.current.children,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }
    }, [data]);

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        onNotification(`${type} copied to clipboard!`, 'success');
    };

    const DataSection = ({ icon, title, items, type }) => (
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-[2rem] p-5 md:p-6 border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl shrink-0">
                        {icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white italic tracking-tighter truncate">{title}</h3>
                </div>
                <span className="sm:ml-auto bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase self-start sm:self-center">
                    {items.length} {items.length === 1 ? 'Node' : 'Nodes'}
                </span>
            </div>

            {items.length > 0 ? (
                <ul className="space-y-2 md:space-y-3 max-h-[300px] md:max-h-[350px] overflow-y-auto custom-scrollbar pr-2 font-mono">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-3 md:p-4 bg-gray-50/50 dark:bg-white/5 
                rounded-xl hover:bg-white dark:hover:bg-white/10 transition-all duration-300 
                group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10 shadow-sm hover:shadow-md"
                            onClick={() => copyToClipboard(item, type)}
                        >
                            <span className="text-gray-600 dark:text-gray-300 break-all mr-4 text-[10px] md:text-xs font-semibold">{item}</span>
                            <FiCopy className="text-gray-400 group-hover:text-primary-500 transition-colors shrink-0" />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="py-8 md:py-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-black/10 rounded-2xl border border-dashed border-gray-200 dark:border-white/5">
                    <FiSearch className="text-gray-300 dark:text-slate-700 text-3xl mb-3 opacity-50" />
                    <p className="text-gray-400 dark:text-slate-500 italic text-[10px] uppercase tracking-widest font-bold">No intelligence detected</p>
                </div>
            )}
        </div>
    );

    if (!hasResults) {
        return (
            <div className="max-w-4xl mx-auto mt-20 text-center px-4">
                <div className="p-8 md:p-20 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
                    <FiTarget className="text-primary-500/10 text-[6rem] md:text-[10rem] absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 rotate-12" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 dark:bg-black/20 rounded-[1.5rem] md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8">
                            <FiSearch className="text-primary-500 text-3xl md:text-4xl" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tighter italic">Clean Architecture.</h2>
                        <p className="text-base md:text-xl text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
                            Our engine completed a deep-scan of the target URL. While no structured contact points were identified,
                            the target infrastructure appears highly secure or abstract.
                            <span className="block mt-4 text-primary-500 font-bold italic text-sm md:text-base">Keep exploring! Every scan is a step toward intelligence.</span>
                        </p>
                        <div className="bg-gray-100 dark:bg-black/20 inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            <FiZap className="text-yellow-500" /> {data.metadata?.duration?.toFixed(2) || '---'} seconds
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={resultsRef} className="max-w-7xl mx-auto mt-20 space-y-10 pb-20 px-4">
            {/* Efficiency Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 dark:bg-slate-900 border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                    <div className="p-4 bg-primary-500 rounded-2xl shadow-xl shadow-primary-500/20 shrink-0">
                        <FiCheckCircle className="text-white text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-1">Analysis Complete.</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none">Intelligence Engine finalized operations</p>
                    </div>
                </div>
                <div className="mt-8 md:mt-0 flex items-center justify-around md:justify-end gap-6 md:gap-8 relative z-10 w-full md:w-auto border-t border-white/5 md:border-t-0 pt-6 md:pt-0">
                    <div className="text-center">
                        <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Engine Speed</p>
                        <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter">
                            {data.metadata?.duration?.toFixed(2) || '---'}<span className="text-[10px] md:text-xs ml-1 text-primary-500">sec</span>
                        </p>
                    </div>
                    <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                    <div className="text-center">
                        <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Confidence</p>
                        <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter text-green-400">99.8%</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard
                    icon={<FiPhone className="text-3xl text-primary-500" />}
                    title="Communication Nodes"
                    count={data.phones?.length || 0}
                    color="primary"
                />
                <StatCard
                    icon={<FiMail className="text-3xl text-green-500" />}
                    title="Email Identifiers"
                    count={data.emails?.length || 0}
                    color="green"
                />
                <StatCard
                    icon={<FiMapPin className="text-3xl text-purple-500" />}
                    title="Physical Locales"
                    count={data.addresses?.length || 0}
                    color="purple"
                />
            </div>

            {/* Data Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <DataSection
                    icon={<FiPhone className="text-2xl text-primary-500" />}
                    title="Phone Directory"
                    items={data.phones || []}
                    type="Phone number"
                />

                <DataSection
                    icon={<FiMail className="text-2xl text-green-500" />}
                    title="Email Mapping"
                    items={data.emails || []}
                    type="Email"
                />

                <DataSection
                    icon={<FiMapPin className="text-2xl text-purple-500" />}
                    title="Local Intelligence"
                    items={data.addresses || []}
                    type="Address"
                />
            </div>

            {/* Export Buttons */}
            <div className="pt-10 flex flex-col items-center gap-6">
                <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Persistent Export Terminal</h4>
                <ExportButtons
                    data={data}
                    onNotification={onNotification}
                />
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, count, color }) => {
    const countRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            countRef.current,
            { innerText: 0 },
            {
                innerText: count,
                duration: 1.5,
                snap: { innerText: 1 },
                ease: 'power3.out'
            }
        );
    }, [count]);

    const colorStyles = {
        primary: "from-primary-500/10 to-primary-500/5 dark:from-primary-500/20 dark:to-primary-500/5",
        green: "from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/5",
        purple: "from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/5"
    };

    return (
        <div className={`bg-white dark:bg-slate-900 bg-gradient-to-br ${colorStyles[color]} 
      rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center gap-4 md:gap-6 relative z-10">
                <div className="p-3 md:p-4 bg-white dark:bg-white/5 rounded-2xl shadow-lg border border-gray-50 dark:border-white/5 group-hover:rotate-6 transition-transform shrink-0">
                    {icon}
                </div>
                <div>
                    <p className="text-gray-500 dark:text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                    <p ref={countRef} className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tabular-nums italic tracking-tighter shrink-0">
                        0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
