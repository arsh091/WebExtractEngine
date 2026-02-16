import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ProgressBar = ({ progress }) => {
    const barRef = useRef(null);

    useEffect(() => {
        gsap.to(barRef.current, {
            width: `${progress}%`,
            duration: 0.5,
            ease: 'power2.out'
        });
    }, [progress]);

    return (
        <div className="w-full max-w-xl mx-auto mt-6">
            <div className="flex justify-between mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <span>Analysis Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div
                    ref={barRef}
                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    style={{ width: '0%' }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
