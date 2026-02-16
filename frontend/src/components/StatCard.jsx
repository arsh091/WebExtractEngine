import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, count }) => {
    const [displayCount, setDisplayCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = count;
        if (start === end) return;

        let duration = 0.5;
        let increment = end / (duration * 60);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayCount(end);
                clearInterval(timer);
            } else {
                setDisplayCount(Math.floor(start));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [count]);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center text-center group transition-all hover:bg-slate-800/60"
        >
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
            <span className="text-4xl font-bold text-white tabular-nums">{displayCount}</span>
        </motion.div>
    );
};

export default StatCard;
