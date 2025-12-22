import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
//import AdminLoginPage from '../pages/admin/AdminLoginPage';
//import AdminDashboard from '../pages/admin/AdminDashboard';
import WalletLogin from '../components/WalletLogin';
import WalletDashboard from '../features/wallet/WalletDashboard';
import GIEDashboard from '../components/GIEDashboard';
import Investir from '../Investir';
import Adhesion from '../Adhesion';
import About from '../About';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import PaymentErrorPage from '../pages/PaymentErrorPage';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import GIEDetails from '../components/GIEDetails';
import CoordinateurDashboard from '../components/CoordinateurDashboard';
import FAQ from '../pages/FAQ';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ActualitesPage from '../pages/ActualitesPage';
import JournalisteLogin from '../components/JournalisteLogin';
import JournalisteDashboard from '../components/JournalisteDashboard';
import ArticleEditor from '../components/ArticleEditor';
const AppRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/gies/:id", element: _jsx(GIEDetails, {}) }), _jsx(Route, { path: "/coordinateur/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/coordinateur/dashboard", element: _jsx(CoordinateurDashboard, {}) }), _jsx(Route, { path: "/journaliste/login", element: _jsx(JournalisteLogin, {}) }), _jsx(Route, { path: "/journaliste/dashboard", element: _jsx(JournalisteDashboard, {}) }), _jsx(Route, { path: "/journaliste/articles/nouveau", element: _jsx(ArticleEditor, {}) }), _jsx(Route, { path: "/journaliste/articles/editer/:id", element: _jsx(ArticleEditor, {}) }), _jsx(Route, { path: "/wallet/login", element: _jsx(WalletLogin, {}) }), _jsx(Route, { path: "/wallet/dashboard", element: _jsx(WalletDashboard, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPasswordPage, {}) }), _jsx(Route, { path: "/reset-password/:token", element: _jsx(ResetPasswordPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(GIEDashboard, {}) }), _jsx(Route, { path: "/investir", element: _jsx(Investir, {}) }), _jsx(Route, { path: "/adhesion", element: _jsx(Adhesion, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/faq", element: _jsx(FAQ, {}) }), _jsx(Route, { path: "/actualites", element: _jsx(ActualitesPage, {}) }), _jsx(Route, { path: "/payment/success", element: _jsx(PaymentSuccessPage, {}) }), _jsx(Route, { path: "/payment/error", element: _jsx(PaymentErrorPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Home, {}) })] }));
};
export default AppRoutes;
//# sourceMappingURL=AppRoutes.js.map