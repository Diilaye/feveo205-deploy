import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css';
const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const API_URL = import.meta.env?.REACT_APP_API_URL || 'http://localhost:3051';
    // Vérifier la validité du token au chargement
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setTokenValid(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/password-reset/verify/${token}`);
                const data = await response.json();
                if (data.success) {
                    setTokenValid(true);
                }
                else {
                    setTokenValid(false);
                    setError(data.message || 'Le lien de réinitialisation est invalide ou a expiré.');
                }
            }
            catch (err) {
                console.error('Erreur lors de la vérification du token:', err);
                setTokenValid(false);
                setError('Erreur de connexion au serveur. Veuillez réessayer.');
            }
        };
        verifyToken();
    }, [token, API_URL]);
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Le mot de passe doit contenir au moins 8 caractères.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Le mot de passe doit contenir au moins une majuscule.';
        }
        if (!/[a-z]/.test(password)) {
            return 'Le mot de passe doit contenir au moins une minuscule.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Le mot de passe doit contenir au moins un chiffre.';
        }
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validation du mot de passe
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        // Vérification de la correspondance
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/password-reset/reset/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                    confirmPassword: confirmPassword
                }),
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                // Redirection après 3 secondes
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
            else {
                setError(data.message || 'Une erreur est survenue lors de la réinitialisation.');
            }
        }
        catch (err) {
            console.error('Erreur lors de la réinitialisation:', err);
            setError('Erreur de connexion au serveur. Veuillez réessayer.');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Affichage pendant la vérification du token
    if (tokenValid === null) {
        return (_jsx("div", { className: "reset-password-container", children: _jsx("div", { className: "reset-password-card", children: _jsxs("div", { className: "reset-password-loading", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "V\u00E9rification du lien..." })] }) }) }));
    }
    // Affichage si le token est invalide
    if (tokenValid === false) {
        return (_jsx("div", { className: "reset-password-container", children: _jsx("div", { className: "reset-password-card", children: _jsxs("div", { className: "reset-password-error-state", children: [_jsx("div", { className: "error-icon", children: "\u26A0\uFE0F" }), _jsx("h1", { children: "Lien invalide ou expir\u00E9" }), _jsx("p", { children: error || 'Le lien de réinitialisation que vous avez utilisé est invalide ou a expiré.' }), _jsx("div", { className: "reset-password-actions", children: _jsx("button", { onClick: () => navigate('/wallet/login'), className: "btn-primary", children: "Retour \u00E0 la connexion" }) }), _jsxs("p", { className: "reset-password-help", children: ["Si vous avez besoin d'aide, contactez-nous \u00E0", ' ', _jsx("a", { href: "mailto:support@feveo2050.sn", children: "support@feveo2050.sn" })] })] }) }) }));
    }
    // Affichage du succès
    if (success) {
        return (_jsx("div", { className: "reset-password-container", children: _jsx("div", { className: "reset-password-card", children: _jsxs("div", { className: "reset-password-success", children: [_jsx("div", { className: "success-icon", children: "\u2713" }), _jsx("h1", { children: "Mot de passe modifi\u00E9 !" }), _jsx("p", { children: "Votre mot de passe a \u00E9t\u00E9 modifi\u00E9 avec succ\u00E8s." }), _jsx("p", { className: "redirect-message", children: "Vous allez \u00EAtre redirig\u00E9 vers la page de connexion dans quelques instants..." }), _jsx("button", { onClick: () => navigate('/wallet/login'), className: "btn-primary", children: "Se connecter maintenant" })] }) }) }));
    }
    // Formulaire de réinitialisation
    return (_jsx("div", { className: "reset-password-container", children: _jsxs("div", { className: "reset-password-card", children: [_jsxs("div", { className: "reset-password-header", children: [_jsx("h1", { children: "D\u00E9finir un nouveau mot de passe" }), _jsx("p", { children: "Choisissez un mot de passe s\u00E9curis\u00E9 pour votre compte FEVEO 2050" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "reset-password-form", children: [error && (_jsxs("div", { className: "alert alert-error", children: [_jsx("span", { className: "alert-icon", children: "\u26A0\uFE0F" }), _jsx("span", { children: error })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "newPassword", children: "Nouveau mot de passe" }), _jsxs("div", { className: "password-input-wrapper", children: [_jsx("input", { id: "newPassword", type: showPassword ? 'text' : 'password', value: newPassword, onChange: (e) => setNewPassword(e.target.value), required: true, className: "form-input", placeholder: "Entrez votre nouveau mot de passe" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "password-toggle", "aria-label": showPassword ? 'Masquer' : 'Afficher', children: showPassword ? '👁️' : '👁️‍🗨️' })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirmer le mot de passe" }), _jsxs("div", { className: "password-input-wrapper", children: [_jsx("input", { id: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, className: "form-input", placeholder: "Confirmez votre mot de passe" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "password-toggle", "aria-label": showConfirmPassword ? 'Masquer' : 'Afficher', children: showConfirmPassword ? '👁️' : '👁️‍🗨️' })] })] }), _jsxs("div", { className: "password-requirements", children: [_jsx("p", { className: "requirements-title", children: "Le mot de passe doit contenir :" }), _jsxs("ul", { children: [_jsx("li", { className: newPassword.length >= 8 ? 'valid' : '', children: "Au moins 8 caract\u00E8res" }), _jsx("li", { className: /[A-Z]/.test(newPassword) ? 'valid' : '', children: "Une lettre majuscule" }), _jsx("li", { className: /[a-z]/.test(newPassword) ? 'valid' : '', children: "Une lettre minuscule" }), _jsx("li", { className: /[0-9]/.test(newPassword) ? 'valid' : '', children: "Un chiffre" })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-submit", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "spinner-small" }), _jsx("span", { children: "Modification en cours..." })] })) : ('Modifier mon mot de passe') })] }), _jsx("div", { className: "reset-password-footer", children: _jsxs("p", { children: ["Vous vous souvenez de votre mot de passe ?", ' ', _jsx("button", { type: "button", onClick: () => navigate('/'), className: "link-button", children: "Se connecter" })] }) })] }) }));
};
export default ResetPasswordPage;
//# sourceMappingURL=ResetPasswordPage.js.map