import { useEffect } from 'react';

export const useKeyboardShortcuts = (handlers) => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl/Cmd + K: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                handlers.focusInput?.();
            }

            // Ctrl/Cmd + Enter: Submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handlers.submit?.();
            }

            // Escape: Clear/Reset
            if (e.key === 'Escape') {
                handlers.clear?.();
            }

            // Ctrl/Cmd + D: Toggle dark mode (or T for theme)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                handlers.toggleTheme?.();
            }

            // Ctrl/Cmd + H: Toggle History
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                handlers.toggleHistory?.();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handlers]);
};
