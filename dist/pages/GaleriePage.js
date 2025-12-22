import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Galerie from '../components/Galerie';
import Footer from '../components/Footer';
const GaleriePage = () => {
    const navigate = useNavigate();
    const handleNavigate = (page) => {
        switch (page) {
            case 'accueil':
                navigate('/');
                break;
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
            case 'galerie':
                navigate('/galerie');
                break;
            default:
                navigate('/');
                break;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx(Header, {}), _jsx("main", { children: _jsx(Galerie, { onNavigate: handleNavigate }) }), _jsx(Footer, {})] }));
};
export default GaleriePage;
//# sourceMappingURL=GaleriePage.js.map