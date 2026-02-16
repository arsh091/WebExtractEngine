import { useState } from 'react';
import { extractDataFromUrl } from '../services/api';

export const useExtractor = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const extractData = async (url) => {
        setLoading(true);
        setError(null);
        const startTime = performance.now();

        try {
            const result = await extractDataFromUrl(url);
            const duration = (performance.now() - startTime) / 1000;
            const enhancedData = {
                ...result.data,
                metadata: { ...result.data.metadata, duration }
            };
            setData(enhancedData);
            return { ...result, data: enhancedData };
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetData = () => {
        setData(null);
        setError(null);
    };

    return { loading, data, error, extractData, resetData };
};
