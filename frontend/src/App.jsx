import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Docs from './pages/Docs';
import ApiReference from './pages/ApiReference';
import Community from './pages/Community';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Security from './pages/Security';

// Components
import Layout from './components/Layout';
import HistorySidebar from './components/HistorySidebar';

// Hooks
import { useHistory } from './hooks/useHistory';

// Scroll to top component
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const { history, addToHistory, clearHistory } = useHistory();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <Router>
            <ScrollToTop />
            <Layout onOpenHistory={() => setIsHistoryOpen(true)}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                onOpenHistory={() => setIsHistoryOpen(true)}
                                addToHistory={addToHistory}
                                isHistoryOpen={isHistoryOpen}
                            />
                        }
                    />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/api-reference" element={<ApiReference />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/security" element={<Security />} />
                </Routes>
            </Layout>

            <HistorySidebar
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onSelect={(url) => {
                    // Logic to handle selection from history on home page
                    window.location.href = `/?url=${encodeURIComponent(url)}`;
                }}
                onClear={clearHistory}
            />
        </Router>
    );
}

export default App;
