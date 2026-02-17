import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
    FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
    FaYoutube, FaTelegram, FaPinterest, FaTiktok,
    FaWhatsapp
} from 'react-icons/fa';
import { FiShare2, FiExternalLink } from 'react-icons/fi';

const PLATFORMS = {
    facebook: { icon: FaFacebook, color: '#1877F2', label: 'Facebook' },
    instagram: { icon: FaInstagram, color: '#E4405F', label: 'Instagram' },
    twitter: { icon: FaTwitter, color: '#1DA1F2', label: 'Twitter / X' },
    linkedin: { icon: FaLinkedin, color: '#0A66C2', label: 'LinkedIn' },
    youtube: { icon: FaYoutube, color: '#FF0000', label: 'YouTube' },
    telegram: { icon: FaTelegram, color: '#26A5E4', label: 'Telegram' },
    pinterest: { icon: FaPinterest, color: '#E60023', label: 'Pinterest' },
    tiktok: { icon: FaTiktok, color: '#010101', label: 'TikTok' }
};

const SocialMediaCard = ({ socialMedia, onNotification }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(
            cardRef.current.querySelectorAll('.social-item'),
            { opacity: 0, scale: 0.8, y: 10 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)' }
        );
    }, [socialMedia]);

    const hasAnySocial = Object.entries(socialMedia || {})
        .some(([key, val]) => key !== 'whatsapp' && val);
    const hasWhatsApp = socialMedia?.whatsapp?.length > 0;

    if (!hasAnySocial && !hasWhatsApp) return null;

    const copyLink = (link, platform) => {
        navigator.clipboard.writeText(link);
        onNotification(`${platform} link copied!`, 'success');
    };

    return (
        <div ref={cardRef} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter flex items-center gap-3">
                    Digital Presence.
                </h3>
                <span className="bg-primary-500/10 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-500/20">
                    {Object.values(socialMedia || {}).filter(v => v && (!Array.isArray(v) || v.length > 0)).length} Channels Found
                </span>
            </div>

            {/* Social Platform Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Object.entries(PLATFORMS).map(([platform, config]) => {
                    const link = socialMedia?.[platform];
                    if (!link) return null;

                    const Icon = config.icon;

                    return (
                        <div key={platform} className="social-item group">
                            <div
                                className="h-full bg-gray-50 dark:bg-white/5 rounded-3xl p-5 hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary-500/20 cursor-pointer"
                                onClick={() => copyLink(link, config.label)}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-white dark:bg-black/20 rounded-xl shadow-sm">
                                        <Icon style={{ color: config.color }} className="text-xl" />
                                    </div>
                                    <span className="text-gray-900 dark:text-white text-xs font-black uppercase tracking-widest truncate">
                                        {config.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 dark:text-slate-500 text-[10px] hover:text-primary-500 font-mono truncate"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {link.replace(/https?:\/\/(www\.)?/, '')}
                                    </a>
                                    <FiExternalLink className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* WhatsApp Section */}
            {hasWhatsApp && (
                <div className="border-t border-gray-100 dark:border-white/5 pt-8">
                    <h4 className="text-green-500 font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg"><FaWhatsapp className="text-lg" /></div>
                        Verified WhatsApp Channels ({socialMedia.whatsapp.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {socialMedia.whatsapp.map((wa, i) => (
                            <div key={i}
                                className="flex items-center justify-between p-5 bg-green-500/5 dark:bg-white/5 
                  rounded-3xl hover:bg-green-500/10 dark:hover:bg-white/10 transition-all group cursor-pointer border border-transparent hover:border-green-500/20"
                                onClick={() => copyLink(wa.number, 'WhatsApp')}
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <FaWhatsapp className="text-green-500 text-2xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-gray-900 dark:text-white font-bold tracking-tight italic">{wa.number}</p>
                                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-mono truncate">{wa.waLink.replace('https://', '')}</p>
                                    </div>
                                </div>
                                <a
                                    href={wa.waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95 flex-shrink-0 ml-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Chat →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialMediaCard;
