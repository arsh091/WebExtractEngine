import { motion } from 'framer-motion';
import {
    Facebook, Instagram, Twitter, Linkedin,
    Youtube, MessageCircle, Share2, ExternalLink, Globe
} from 'lucide-react';

const SocialMediaCard = ({ data, onNotification }) => {
    const social = data?.socialMedia;
    if (!social || Object.values(social).every(v => !v)) return null;

    const platforms = [
        { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
        { id: 'twitter', icon: Twitter, label: 'Twitter / X', color: 'text-slate-900', bg: 'bg-slate-50', border: 'border-slate-100' },
        { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
        { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
        { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    ];

    const copyToClipboard = (url, label) => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        onNotification(`${label} URL copied to clipboard`, 'success');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[var(--primary-blue)] rounded-full"></div>
                <div className="text-left">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Social Profiles</h3>
                    <p className="text-sm font-semibold text-[var(--text-secondary)]">Discovered online presence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                    let urlValue = social[platform.id];

                    // Specific handling for WhatsApp array of objects
                    if (platform.id === 'whatsapp' && Array.isArray(urlValue) && urlValue.length > 0) {
                        const waObj = urlValue[0];
                        return (
                            <motion.div
                                key={platform.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pro-card p-6 bg-white border border-[var(--border-color)] flex flex-col justify-between hover:shadow-md transition-all group/node"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-xl ${platform.bg} border ${platform.border} flex items-center justify-center group-hover/node:scale-105 transition-transform duration-300`}>
                                        <platform.icon className={`w-6 h-6 ${platform.color}`} />
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(waObj.waLink, platform.label)}
                                        className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all"
                                        title="Copy Link"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4 text-left">
                                    <div>
                                        <h4 className="text-[var(--text-primary)] font-bold tracking-tight">{platform.label}</h4>
                                        <p className="text-[var(--text-secondary)] text-sm truncate">{waObj.number}</p>
                                    </div>

                                    <a
                                        href={waObj.waLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-all group/btn"
                                    >
                                        Chat Now
                                        <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    }

                    if (!urlValue || urlValue.length === 0) return null;

                    // If it's an array for standard links, take the first valid link found
                    if (Array.isArray(urlValue)) {
                        urlValue = urlValue[0];
                    }
                    if (typeof urlValue !== 'string') return null;

                    return (
                        <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pro-card p-6 bg-white border border-[var(--border-color)] flex flex-col justify-between hover:shadow-md transition-all group/node"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-12 h-12 rounded-xl ${platform.bg} border ${platform.border} flex items-center justify-center group-hover/node:scale-105 transition-transform duration-300`}>
                                    <platform.icon className={`w-6 h-6 ${platform.color}`} />
                                </div>
                                <button
                                    onClick={() => copyToClipboard(urlValue, platform.label)}
                                    className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-all"
                                    title="Copy Link"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-4 text-left">
                                <div>
                                    <h4 className="text-[var(--text-primary)] font-bold tracking-tight">{platform.label}</h4>
                                    <p className="text-[var(--text-secondary)] text-sm truncate">{urlValue.replace(/^https?:\/\/(www\.)?/, '')}</p>
                                </div>

                                <a
                                    href={urlValue}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-all group/btn"
                                >
                                    View Profile
                                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialMediaCard;
