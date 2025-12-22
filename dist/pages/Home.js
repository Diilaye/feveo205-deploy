import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProgramSection from '../components/ProgramSection';
import Footer from '../components/Footer';
const Home = () => {
    const navigate = useNavigate();
    const handleNavigate = (page) => {
        // Conversion des anciennes pages vers les nouvelles routes
        switch (page) {
            case 'admin-login':
                navigate('/admin/login');
                break;
            case 'admin-dashboard':
                navigate('/admin/dashboard');
                break;
            case 'wallet-login':
                navigate('/wallet/login');
                break;
            case 'wallet-dashboard':
                navigate('/wallet/dashboard');
                break;
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'investir':
                navigate('/investir');
                break;
            case 'adhesion':
                navigate('/adhesion');
                break;
            case 'about':
                navigate('/about');
                break;
            case 'actualites':
                navigate('/actualites');
                break;
            case 'galerie':
                navigate('/galerie');
                break;
            case 'home':
            default:
                navigate('/');
                break;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx(Header, {}), _jsxs("main", { children: [_jsx(HeroSection, { onNavigate: handleNavigate }), _jsx(ProgramSection, {})] }), _jsx(Footer, {})] }));
};
export default Home;
//# sourceMappingURL=Home.js.map