import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

const Layout = ({ children, onOpenHistory, onOpenAuth }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'dark bg-appDark' : 'bg-white'}`}>
            <Navbar onOpenHistory={onOpenHistory} onOpenAuth={onOpenAuth} />
            <div className="pt-20">
                {children}
            </div>
            <Footer />
            <CookieBanner />
        </div>
    );
};

export default Layout;
