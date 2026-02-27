const StatCard = ({ icon, title, count }) => {
    return (
        <div className="bg-white border border-[var(--border-color)] p-8 rounded-2xl flex flex-col items-center text-center group transition-all hover:bg-[var(--bg-secondary)] hover:shadow-lg hover:-translate-y-1">
            <div className="text-3xl mb-6 transform group-hover:scale-110 transition-transform duration-300 text-[var(--primary-blue)] p-4 bg-blue-50 rounded-2xl">
                {icon}
            </div>
            <h3 className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-60">{title}</h3>
            <span className="text-4xl font-extrabold text-[var(--text-primary)] tabular-nums tracking-tighter">{count}</span>
        </div>
    );
};

export default StatCard;
