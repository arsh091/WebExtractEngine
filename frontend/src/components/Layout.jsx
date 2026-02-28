import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

const Layout = ({ children, onOpenHistory, onOpenAuth, onOpenApi, onOpenSecurity, onOpenIP, onOpenAdvanced, onOpenDeep }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-500 overflow-x-hidden">
            <Navbar
                onOpenHistory={onOpenHistory}
                onOpenAuth={onOpenAuth}
                onOpenApi={onOpenApi}
                onOpenSecurity={onOpenSecurity}
                onOpenIP={onOpenIP}
                onOpenAdvanced={onOpenAdvanced}
                onOpenDeep={onOpenDeep}
            />
            <main className="relative">
                {children}
            </main>
            <Footer />
            <CookieBanner />
        </div>
    );
};

export default Layout;
