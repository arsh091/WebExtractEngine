import { FiDownload } from 'react-icons/fi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { AiOutlineFileText } from 'react-icons/ai';

const ExportButtons = ({ data, onNotification }) => {
    const downloadJSON = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted-data.json';
        link.click();
        onNotification('JSON file downloaded!', 'success');
    };

    const downloadCSV = () => {
        let csv = 'Type,Value\n';

        data.phones?.forEach(phone => {
            csv += `Phone,${phone}\n`;
        });

        data.emails?.forEach(email => {
            csv += `Email,${email}\n`;
        });

        data.addresses?.forEach(address => {
            csv += `Address,"${address.replace(/"/g, '""')}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted-data.csv';
        link.click();
        onNotification('CSV file downloaded!', 'success');
    };

    const copyAll = () => {
        let text = '=== EXTRACTED DATA ===\n\n';

        text += '📞 PHONE NUMBERS:\n';
        data.phones?.forEach(phone => text += `- ${phone}\n`);

        text += '\n✉️ EMAIL ADDRESSES:\n';
        data.emails?.forEach(email => text += `- ${email}\n`);

        text += '\n📍 PHYSICAL ADDRESSES:\n';
        data.addresses?.forEach(address => text += `- ${address}\n`);

        navigator.clipboard.writeText(text);
        onNotification('All data copied to clipboard!', 'success');
    };

    return (
        <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 
          hover:bg-green-700 text-white rounded-xl 
          transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/10"
            >
                <SiMicrosoftexcel />
                Export as CSV
            </button>

            <button
                onClick={downloadJSON}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 
          hover:bg-primary-700 text-white rounded-xl 
          transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/10"
            >
                <FiDownload />
                Export as JSON
            </button>

            <button
                onClick={copyAll}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 
          hover:bg-purple-700 text-white rounded-xl 
          transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/10"
            >
                <AiOutlineFileText />
                Copy All
            </button>
        </div>
    );
};

export default ExportButtons;
