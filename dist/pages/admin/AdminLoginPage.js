import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from '../../contexts/AdminAuthContext';
import '../../styles/AdminLogin.css';
const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login, error, clearError, isLoading } = useAdminAuthContext();
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const success = await login({ email, motDePasse });
        if (success) {
            navigate('/admin/dashboard');
        }
    };
    return (_jsx("div", { className: "admin-login-container", children: _jsx("div", { className: "admin-login-card", children: _jsxs("form", { onSubmit: handleSubmit, className: "admin-login-form", children: [_jsx("h1", { className: "admin-login-title", children: "Administration FEVEO 2050" }), _jsx("p", { className: "admin-login-subtitle", children: "Connexion au panel administrateur" }), error && (_jsxs("div", { className: "admin-login-error", children: [_jsx("p", { children: error }), _jsx("button", { type: "button", onClick: clearError, className: "admin-login-error-close", children: "\u00D7" })] })), _jsxs("div", { className: "admin-login-field", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email", className: "admin-login-input" })] }), _jsxs("div", { className: "admin-login-field", children: [_jsx("label", { htmlFor: "password", children: "Mot de passe" }), _jsx("input", { id: "password", type: "password", value: motDePasse, onChange: (e) => setMotDePasse(e.target.value), required: true, autoComplete: "current-password", className: "admin-login-input" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "admin-login-button", children: isLoading ? 'Connexion en cours...' : 'Se connecter' })] }) }) }));
};
export default AdminLoginPage;
//# sourceMappingURL=AdminLoginPage.js.map