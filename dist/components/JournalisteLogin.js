import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Newspaper, AlertCircle } from 'lucide-react';
import axios from 'axios';
const JournalisteLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            const response = await axios.post(`${API_URL}/journaliste/login`, formData);
            if (response.data.success) {
                // Sauvegarder le token
                localStorage.setItem('journaliste_token', response.data.token);
                localStorage.setItem('journaliste_user', JSON.stringify(response.data.journaliste));
                // Rediriger vers le dashboard
                navigate('/journaliste/dashboard');
            }
        }
        catch (err) {
            console.error('Erreur de connexion:', err);
            setError(err.response?.data?.message || 'Erreur de connexion');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center", children: _jsx(Newspaper, { className: "w-8 h-8 text-white" }) }) }), _jsx("h2", { className: "text-3xl font-bold text-neutral-900 mb-2", children: "Espace Journaliste" }), _jsx("p", { className: "text-neutral-600", children: "Connectez-vous pour g\u00E9rer vos articles" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8", children: [error && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-red-700", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-neutral-700 mb-2", children: "Adresse email" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-neutral-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: formData.email, onChange: handleChange, className: "block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "votreemail@feveo2050.sn" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "motDePasse", className: "block text-sm font-medium text-neutral-700 mb-2", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-neutral-400" }) }), _jsx("input", { id: "motDePasse", name: "motDePasse", type: "password", required: true, value: formData.motDePasse, onChange: handleChange, className: "block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200", children: loading ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Connexion en cours..."] })) : ('Se connecter') })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { onClick: () => navigate('/'), className: "text-sm text-accent-600 hover:text-accent-700 font-medium", children: "\u2190 Retour \u00E0 l'accueil" }) })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("p", { className: "text-sm text-neutral-600", children: "Besoin d'aide ? Contactez l'administrateur" }) })] }) }));
};
export default JournalisteLogin;
//# sourceMappingURL=JournalisteLogin.js.map