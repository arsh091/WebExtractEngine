import { useState, useEffect } from 'react';

export const useHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('extraction-history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
                setHistory([]);
            }
        }
    }, []);

    const addToHistory = (url, data) => {
        const newEntry = {
            id: Date.now(),
            url,
            data,
            timestamp: new Date().toISOString()
        };

        const updated = [newEntry, ...history.filter(item => item.url !== url)].slice(0, 10);
        setHistory(updated);
        localStorage.setItem('extraction-history', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('extraction-history');
    };

    const removeFromHistory = (id) => {
        const updated = history.filter(item => item.id !== id);
        setHistory(updated);
        localStorage.setItem('extraction-history', JSON.stringify(updated));
    };

    return { history, addToHistory, clearHistory, removeFromHistory };
};
