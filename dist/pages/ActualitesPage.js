import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import Actualites from '../components/Actualites';
const ActualitesPage = () => {
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
            case 'actualites':
                navigate('/actualites');
                break;
            default:
                navigate('/');
                break;
        }
    };
    return _jsx(Actualites, { onNavigate: handleNavigate });
};
export default ActualitesPage;
//# sourceMappingURL=ActualitesPage.js.map