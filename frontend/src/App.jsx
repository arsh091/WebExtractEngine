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
import Cookies from './pages/Cookies';
import Security from './pages/Security';

// Components
import Layout from './components/Layout';
import AuthModal from './components/AuthModal';
import HistoryPage from './pages/HistoryPage';
import ApiDocsPage from './pages/ApiDocsPage';
import SecurityScannerPage from './pages/SecurityScannerPage';
import SiteIntelligence from './pages/SiteIntelligence';
import AdvancedScanner from './components/AdvancedScanner';
import DeepIntelligence from './pages/DeepIntelligence';
import Toast from './components/Toast';

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
    const [view, setView] = useState('home');
    const [notification, setNotification] = useState(null);
    const [pendingUrl, setPendingUrl] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleReExtract = (url) => {
        setPendingUrl(url);
        setView('home');
    };

    return (
        <Router>
            <ScrollToTop />
            <div className="relative min-h-screen bg-[var(--bg-main)] selection:bg-black selection:text-white">
                <Layout
                    onOpenAuth={() => setIsAuthOpen(true)}
                    onOpenHistory={() => setView('history')}
                    onOpenApi={() => setView('api')}
                    onOpenSecurity={() => setView('security')}
                    onOpenIP={() => setView('ip')}
                    onOpenAdvanced={() => setView('advanced-scan')}
                    onOpenDeep={() => setView('deep-intel')}
                >
                    <div className="w-full">
                        {view === 'history' ? (
                            <HistoryPage
                                onBack={() => setView('home')}
                                onReExtract={handleReExtract}
                                onOpenAuth={() => setIsAuthOpen(true)}
                            />
                        ) : view === 'api' ? (
                            <ApiDocsPage onBack={() => setView('home')} />
                        ) : view === 'security' ? (
                            <SecurityScannerPage onBack={() => setView('home')} onOpenAuth={() => setIsAuthOpen(true)} />
                        ) : view === 'ip' ? (
                            <SiteIntelligence onBack={() => setView('home')} onOpenAuth={() => setIsAuthOpen(true)} />
                        ) : view === 'advanced-scan' ? (
                            <AdvancedScanner onBack={() => setView('home')} onOpenAuth={() => setIsAuthOpen(true)} />
                        ) : view === 'deep-intel' ? (
                            <DeepIntelligence onBack={() => setView('home')} onOpenAuth={() => setIsAuthOpen(true)} />
                        ) : (
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <Home
                                            onNotification={showNotification}
                                            onOpenHistory={() => setView('history')}
                                            urlToAutoExtract={pendingUrl}
                                            clearAutoExtract={() => setPendingUrl(null)}
                                            onOpenAuth={() => setIsAuthOpen(true)}
                                        />
                                    }
                                />
                                <Route path="/docs" element={<Docs />} />
                                <Route path="/api-reference" element={<ApiReference />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/cookies" element={<Cookies />} />
                                <Route path="/security" element={<Security />} />
                            </Routes>
                        )}
                    </div>
                </Layout>
            </div>

            <AnimatePresence>
                {isAuthOpen && (
                    <AuthModal onClose={() => setIsAuthOpen(false)} />
                )}
                {notification && (
                    <Toast
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>
        </Router>
    );
}

export default App;
