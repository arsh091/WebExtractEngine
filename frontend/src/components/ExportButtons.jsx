import { FiDownload, FiCopy, FiBox, FiActivity, FiFileText } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';

const ExportButtons = ({ data, onNotification }) => {
    const downloadJSON = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `extraction-data-${new Date().getTime()}.json`;
        link.click();
        onNotification('JSON data exported', 'success');
    };

    const downloadCSV = () => {
        let csv = 'Type,Value,Source\n';

        data.phones?.forEach(phone => {
            csv += `Contact Node,${phone},Web Extract\n`;
        });

        data.emails?.forEach(email => {
            csv += `Email Node,${email},Web Extract\n`;
        });

        data.addresses?.forEach(address => {
            csv += `Location Node,"${address.replace(/"/g, '""')}",Web Extract\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `extraction-report-${new Date().getTime()}.csv`;
        link.click();
        onNotification('CSV report downloaded', 'success');
    };

    const copyAll = () => {
        let text = '=== EXTRACTION SUMMARY ===\n\n';

        if (data.phones?.length) {
            text += 'CONTACT NUMBERS:\n';
            data.phones.forEach(phone => text += `• ${phone}\n`);
        }

        if (data.emails?.length) {
            text += '\nEMAIL ADDRESSES:\n';
            data.emails.forEach(email => text += `• ${email}\n`);
        }

        if (data.addresses?.length) {
            text += '\nPHYSICAL LOCATIONS:\n';
            data.addresses.forEach(address => text += `• ${address}\n`);
        }

        navigator.clipboard.writeText(text);
        onNotification('Summary copied to clipboard', 'success');
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 relative px-4">
            <button
                onClick={downloadCSV}
                className="group w-full md:w-auto flex items-center gap-4 px-8 py-4 bg-[var(--primary-blue)] text-white rounded-xl 
          transition-all duration-300 hover:bg-[var(--primary-blue-dark)] active:scale-95 shadow-md shadow-blue-500/10"
            >
                <SiMicrosoftexcel className="text-xl" />
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Spreadsheet</span>
                    <span className="text-sm font-bold uppercase tracking-tight">Export CSV</span>
                </div>
            </button>

            <button
                onClick={downloadJSON}
                className="group w-full md:w-auto flex items-center gap-4 px-8 py-4 bg-white border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl 
          transition-all duration-300 hover:bg-[var(--bg-secondary)] active:scale-95 shadow-sm"
            >
                <FiBox className="text-xl text-[var(--primary-blue)]" />
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Raw Data</span>
                    <span className="text-sm font-bold uppercase tracking-tight">Export JSON</span>
                </div>
            </button>

            <button
                onClick={copyAll}
                className="group w-full md:w-auto flex items-center gap-4 px-8 py-4 bg-white border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl 
          transition-all duration-300 hover:bg-[var(--bg-secondary)] active:scale-95 shadow-sm"
            >
                <FiCopy className="text-xl" />
                <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Clipboard</span>
                    <span className="text-sm font-bold uppercase tracking-tight">Copy Summary</span>
                </div>
            </button>
        </div>
    );
};

export default ExportButtons;
