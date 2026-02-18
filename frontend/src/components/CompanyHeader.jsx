import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiGlobe, FiInfo } from 'react-icons/fi';

const CompanyHeader = ({ companyInfo, url }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
    }, [companyInfo]);

    if (!companyInfo?.name && !companyInfo?.title) return null;

    return (
        <div ref={cardRef} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 
      backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-6 font-sans">

            <div className="flex items-center gap-4">
                {/* Logo / Favicon */}
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/5">
                    {companyInfo.favicon ? (
                        <img
                            src={companyInfo.favicon}
                            alt="favicon"
                            className="w-10 h-10 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <FiGlobe className="text-3xl text-blue-400" />
                    )}
                </div>

                {/* Company Details */}
                <div className="flex-1 min-w-0">
                    {companyInfo.name && (
                        <h2 className="text-2xl font-bold text-white truncate leading-tight tracking-tight italic">
                            {companyInfo.name}.
                        </h2>
                    )}
                    {companyInfo.title && companyInfo.title !== companyInfo.name && (
                        <p className="text-gray-400 text-sm truncate mt-1">
                            {companyInfo.title}
                        </p>
                    )}
                    {companyInfo.description && (
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2 leading-relaxed opacity-80">
                            {companyInfo.description}
                        </p>
                    )}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 text-xs mt-3 px-3 py-1 bg-white/5 rounded-full hover:bg-white/10 transition-all inline-flex items-center gap-1.5 border border-white/5"
                    >
                        <FiGlobe className="text-[10px]" /> {getSafeHostname(url)}
                    </a>
                </div>
            </div>

            {/* Theme Color Indicator */}
            {companyInfo.themeColor && (
                <div className="mt-4 flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full border border-white/20 animate-pulse"
                        style={{ backgroundColor: companyInfo.themeColor }}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Brand Color: {companyInfo.themeColor}</span>
                </div>
            )}
        </div>
    );
};

const getSafeHostname = (url) => {
    try {
        if (!url) return 'Unknown Host';
        return new URL(url).hostname;
    } catch (e) {
        return url || 'Unknown Host';
    }
};

export default CompanyHeader;
