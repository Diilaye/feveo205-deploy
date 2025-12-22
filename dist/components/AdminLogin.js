import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';
const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });
    const { error, isLoading, clearError } = useAdminAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (clearError)
            clearError();
        setLoginError(null);
        setIsSubmitting(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    motDePasse: formData.motDePasse
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la connexion administrateur');
            }
            console.log("log data.token");
            console.log(data.data.token);
            if (data.success && data.data?.token) {
                // Stocker le token et les informations de l'administrateur
                localStorage.setItem('adminAuthToken', data.data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.data.utilisateur));
                // Rediriger selon le rôle
                const userRole = data.data.utilisateur?.role;
                if (userRole === 'coordinateur') {
                    navigate('/coordinateur/dashboard');
                }
                else {
                    navigate('/admin/dashboard');
                }
                return true;
            }
            else {
                throw new Error(data.message || 'Connexion échouée');
            }
        }
        catch (error) {
            console.error('Erreur de connexion:', error);
            setLoginError(error.message || 'Erreur lors de la connexion');
            return false;
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-gray-100", children: [_jsxs("div", { className: "hidden md:flex md:w-1/2 bg-[url('/images/bg1.jpg')] bg-cover bg-center relative", children: [_jsx("div", { className: "absolute inset-0 bg-blue-900 opacity-90" }), _jsxs("div", { className: "relative flex flex-col justify-center items-start p-16 w-full max-w-2xl ml-auto", children: [_jsxs("div", { className: "flex items-center mb-10", children: [_jsx("div", { className: "p-3 bg-primary-600 rounded-lg shadow-lg", children: _jsx(Shield, { className: "w-10 h-10 text-white" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("span", { className: "text-2xl font-light text-white", children: "FEVEO" }), _jsx("span", { className: "text-2xl font-bold text-white", children: "2050" })] })] }), _jsxs("h1", { className: "text-4xl font-bold mb-6 leading-tight text-white", children: [_jsx("span", { className: "text-orange-300", children: "Portail" }), " d'Administration ", _jsx("br", {}), "S\u00E9curis\u00E9"] }), _jsx("div", { className: "w-20 h-1.5 bg-orange-500 rounded-full mb-8" }), _jsx("p", { className: "text-blue-100 text-lg mb-10 leading-relaxed max-w-lg", children: "Acc\u00E8s exclusif aux fonctionnalit\u00E9s de gestion. Ce portail vous permet de g\u00E9rer l'ensemble des donn\u00E9es et param\u00E8tres du syst\u00E8me FEVEO 2050." }), _jsxs("div", { className: "bg-green-500 p-6 rounded-xl shadow-xl", children: [_jsx("p", { className: "text-sm text-white leading-relaxed italic", children: "\"La gestion efficace des donn\u00E9es est la cl\u00E9 du succ\u00E8s d'un syst\u00E8me d'investissement durable et transparent pour les communaut\u00E9s du S\u00E9n\u00E9gal.\"" }), _jsxs("div", { className: "mt-4 flex items-center", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white", children: "AD" }), _jsxs("div", { className: "ml-2", children: [_jsx("p", { className: "text-sm font-medium text-white", children: "Abdoulaye Diop" }), _jsx("p", { className: "text-xs text-green-200", children: "Directeur Ex\u00E9cutif" })] })] })] })] })] }), _jsx("div", { className: "w-full md:w-1/2 flex items-center justify-center p-6 md:p-16", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "flex flex-col items-center md:items-start justify-center md:hidden mb-12", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-primary-600 rounded-lg shadow-lg", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("span", { className: "text-xl font-light text-gray-900", children: "FEVEO" }), _jsx("span", { className: "text-xl font-bold text-gray-900", children: "2050" })] })] }), _jsx("h2", { className: "mt-6 text-2xl font-bold text-center text-gray-900", children: "Portail d'Administration" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200", children: [_jsxs("div", { className: "px-10 pt-10 pb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Connexion s\u00E9curis\u00E9e" }), _jsx("p", { className: "text-gray-600", children: "Acc\u00E9dez \u00E0 votre espace d'administration" })] }), _jsx("div", { className: "w-full h-px bg-gray-200" }), _jsxs("div", { className: "px-10 py-10", children: [(error || loginError) && (_jsx("div", { className: "mb-8 bg-red-50 border border-red-200 rounded-lg overflow-hidden", children: _jsxs("div", { className: "p-4 flex items-start", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700 font-medium", children: loginError || error }) })] }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-7", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Adresse email" }), _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" }) }), _jsx("input", { type: "email", name: "email", id: "email", required: true, value: formData.email, onChange: handleInputChange, className: "block w-full pl-12 pr-4 py-3.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white shadow-sm transition-all duration-200", placeholder: "administrateur@feveo2050.sn" })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Mot de passe" }), _jsx("button", { type: "button", className: "text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors duration-200", children: "Mot de passe oubli\u00E9?" })] }), _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" }) }), _jsx("input", { type: showPassword ? 'text' : 'password', name: "motDePasse", id: "password", required: true, value: formData.motDePasse, onChange: handleInputChange, className: "block w-full pl-12 pr-12 py-3.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white shadow-sm transition-all duration-200", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("div", { className: "absolute inset-y-0 right-0 pr-4 flex items-center", children: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200", children: showPassword ?
                                                                            _jsx(EyeOff, { className: "h-5 w-5", "aria-hidden": "true" }) :
                                                                            _jsx(Eye, { className: "h-5 w-5", "aria-hidden": "true" }) }) })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-600", children: "Rester connect\u00E9 pendant 30 jours" })] }), _jsx("div", { className: "pt-2", children: _jsx("button", { type: "submit", disabled: isLoading || isSubmitting, className: "w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg", children: isLoading || isSubmitting ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" })) : (_jsxs(_Fragment, { children: [_jsx(Shield, { className: "w-5 h-5 mr-2" }), _jsx("span", { children: "Connexion s\u00E9curis\u00E9e" })] })) }) })] }), _jsx("div", { className: "mt-8 pt-6 border-t border-gray-200 text-center", children: _jsxs("p", { className: "text-xs text-gray-500", children: ["En vous connectant, vous acceptez les ", _jsx("a", { href: "#", className: "text-orange-500 hover:underline", children: "Conditions d'utilisation" }), " et la ", _jsx("a", { href: "#", className: "text-orange-500 hover:underline", children: "Politique de confidentialit\u00E9" }), "."] }) })] })] }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsxs("button", { onClick: () => navigate('/'), className: "inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-all duration-200", children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Retourner \u00E0 l'accueil"] }) })] }) })] }));
};
export default AdminLogin;
//# sourceMappingURL=AdminLogin.js.map