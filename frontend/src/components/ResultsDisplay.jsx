import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Activity, CheckCircle, Database } from 'lucide-react';
import CompanyHeader from './CompanyHeader';
import SocialMediaCard from './SocialMediaCard';
import ExportButtons from './ExportButtons';

const DataSection = ({ title, icon: Icon, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="pro-card p-8 bg-white border border-[var(--border-color)] h-full shadow-xl hover:shadow-2xl transition-all duration-500"
        >
            <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)] group-hover:bg-black transition-colors">
                    <Icon className="w-6 h-6 text-[var(--primary-blue)]" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{title}</h3>
                    <p className="text-[var(--text-secondary)] text-xs font-semibold">{items.length} Records Found</p>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--primary-blue)]/10 transition-all group/item"
                    >
                        <div className="w-2 h-2 rounded-full bg-[var(--primary-blue)]/20 group-hover/item:bg-[var(--primary-blue)] transition-all"></div>
                        <span className="text-[var(--text-secondary)] text-[13px] font-bold break-all group-hover:text-[var(--text-primary)] transition-colors">{item}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ResultsDisplay = ({ data, onNotification }) => {
    if (!data) return null;

    return (
        <div className="w-full max-w-7xl mx-auto py-24 px-6 font-sans">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
                <div className="max-w-2xl text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-600">Successfully Extracted</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        Data <span className="text-[var(--primary-blue)]">Results</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg">Extraction complete. Here are the contact details and information found on the target website.</p>
                </div>

                <div className="flex items-center gap-10 px-8 py-5 bg-white border border-[var(--border-color)] rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-center relative z-10">
                        <p className="text-3xl font-bold text-[var(--text-primary)]">{(data.phones?.length || 0) + (data.emails?.length || 0) + (data.addresses?.length || 0)}</p>
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">Total Points</p>
                    </div>
                    <div className="w-px h-10 bg-[var(--border-color)] relative z-10"></div>
                    <div className="text-center relative z-10">
                        <p className="text-3xl font-bold text-[var(--primary-blue)]">{(data.companyInfo ? 1 : 0) + Object.keys(data.socialMedia || {}).filter(k => data.socialMedia[k]?.length).length}</p>
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">Company Info</p>
                    </div>
                </div>
            </div>

            <div className="space-y-16">
                {/* Profile Section */}
                {data.companyInfo && (
                    <div className="pro-card p-1 bg-[var(--bg-secondary)] overflow-hidden">
                        <CompanyHeader data={data} />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DataSection
                        title="Phone Numbers"
                        icon={Phone}
                        items={data.phones}
                    />
                    <DataSection
                        title="Email Addresses"
                        icon={Mail}
                        items={data.emails}
                    />
                    <DataSection
                        title="Locations"
                        icon={MapPin}
                        items={data.addresses}
                    />
                </div>

                {/* Digital Footprint Section */}
                {data.socialMedia && <SocialMediaCard data={data} />}

                {/* Technical Footprint / Export */}
                <div className="pro-card p-10 bg-white border border-[var(--border-color)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 text-center lg:text-left">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                                <Database className="w-5 h-5 text-[var(--primary-blue)]" />
                                <span className="text-sm font-semibold text-[var(--primary-blue)]">Export Options</span>
                            </div>
                            <h4 className="text-2xl font-bold mb-2">Download Extracted Data</h4>
                            <p className="text-[var(--text-secondary)] text-sm">Save your results for later use in CSV, JSON, or PDF formats.</p>
                        </div>

                        <div className="w-full lg:w-auto">
                            <ExportButtons data={data} onNotification={onNotification} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
