import { Globe, Building2, MapPin, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyHeader = ({ data }) => {
    const info = data?.companyInfo;
    if (!info) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pro-card p-8 md:p-12 relative overflow-hidden bg-white border border-[var(--border-color)] group"
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                {/* Logo / Initial */}
                <div className="relative shrink-0">
                    <div className="w-28 h-28 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center p-6 shadow-sm group-hover:scale-105 transition-all duration-500">
                        {info.logo ? (
                            <img src={info.logo} alt={info.name} className="w-full h-full object-contain" />
                        ) : (
                            <Building2 className="w-10 h-10 text-[var(--primary-blue)] opacity-70" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-none">
                            {info.name || 'Company Profile'}
                        </h1>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mx-auto md:mx-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-700 leading-none">Verified Match</span>
                        </div>
                    </div>

                    <p className="text-[var(--text-secondary)] text-base font-medium leading-relaxed max-w-3xl mb-8">
                        {info.description || 'Enterprise data profile mapped. Contact information and digital footprint extracted.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {info.website && (
                            <a
                                href={info.website}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] hover:bg-white transition-all group/link shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 group-hover/link:bg-blue-100 transition-all">
                                    <Globe className="w-5 h-5 text-[var(--primary-blue)]" />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Domain</p>
                                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{info.website.replace(/^https?:\/\//, '')}</p>
                                </div>
                            </a>
                        )}

                        {info.location && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-transparent shadow-sm">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                    <MapPin className="w-5 h-5 text-[var(--primary-blue)]" />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Location</p>
                                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{info.location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CompanyHeader;
