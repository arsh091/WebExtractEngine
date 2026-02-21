import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
import AuthModal from './components/AuthModal';
import HistoryPage from './pages/HistoryPage';

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
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [view, setView] = useState('home'); // 'home' or 'history'

    return (
        <Router>
            <ScrollToTop />
            <Layout
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenHistory={() => setView('history')}
            >
                <div className="container mx-auto">
                    {view === 'history' ? (
                        <HistoryPage
                            onBack={() => setView('home')}
                            onReExtract={(url) => {
                                setView('home');
                                window.location.href = `/?url=${encodeURIComponent(url)}`;
                            }}
                        />
                    ) : (
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        onOpenHistory={() => setView('history')}
                                        addToHistory={() => { }} // History handled by DB now
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
                    )}
                </div>
            </Layout>

            <AnimatePresence>
                {isAuthOpen && (
                    <AuthModal onClose={() => setIsAuthOpen(false)} />
                )}
            </AnimatePresence>
        </Router>
    );
}

export default App;
