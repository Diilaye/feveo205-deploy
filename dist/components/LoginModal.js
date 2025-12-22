import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
const LoginModal = ({ isOpen, onClose, onNavigate }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        confirmPassword: ''
    });
    const { login, register, error, isLoading, clearError } = useAuthContext();
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        if (isLoginMode) {
            const success = await login({
                email: formData.email,
                motDePasse: formData.motDePasse
            });
            if (success) {
                onClose();
                if (onNavigate) {
                    onNavigate('dashboard');
                }
            }
        }
        else {
            if (formData.motDePasse !== formData.confirmPassword) {
                return;
            }
            const success = await register({
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                telephone: formData.telephone
            });
            if (success) {
                onClose();
                if (onNavigate) {
                    onNavigate('dashboard');
                }
            }
        }
    };
    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-emerald-800", children: isLoginMode ? 'Connexion' : 'Inscription' }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLoginMode && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", name: "nom", required: true, value: formData.nom, onChange: handleInputChange, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "Votre nom" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", name: "prenom", required: true, value: formData.prenom, onChange: handleInputChange, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "Votre pr\u00E9nom" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", name: "telephone", required: true, value: formData.telephone, onChange: handleInputChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "+221 XX XXX XX XX" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "email", name: "email", required: true, value: formData.email, onChange: handleInputChange, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "votre@email.com" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: showPassword ? 'text' : 'password', name: "motDePasse", required: true, value: formData.motDePasse, onChange: handleInputChange, className: "w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600", children: showPassword ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), !isLoginMode && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirmer le mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: showPassword ? 'text' : 'password', name: "confirmPassword", required: true, value: formData.confirmPassword, onChange: handleInputChange, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), formData.motDePasse !== formData.confirmPassword && formData.confirmPassword && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: "Les mots de passe ne correspondent pas" }))] })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center", children: isLoading ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" })) : (_jsx(_Fragment, { children: isLoginMode ? (_jsxs(_Fragment, { children: [_jsx(LogIn, { className: "w-5 h-5 mr-2" }), "Se connecter"] })) : (_jsxs(_Fragment, { children: [_jsx(UserPlus, { className: "w-5 h-5 mr-2" }), "S'inscrire"] })) })) })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { onClick: () => setIsLoginMode(!isLoginMode), className: "text-emerald-600 hover:text-emerald-800 font-medium", children: isLoginMode
                            ? "Pas encore de compte ? S'inscrire"
                            : "Déjà un compte ? Se connecter" }) })] }) }));
};
export default LoginModal;
//# sourceMappingURL=LoginModal.js.map