import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        // Validation basique de l'email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Veuillez entrer une adresse email valide.');
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/password-reset/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(true);
            }
            else {
                setError(data.message || 'Une erreur est survenue. Veuillez réessayer.');
            }
        }
        catch (err) {
            console.error('Erreur lors de la demande de réinitialisation:', err);
            setError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
        }
        finally {
            setIsLoading(false);
        }
    };
    // Affichage du succès
    if (success) {
        return (_jsx("div", { className: "forgot-password-container", children: _jsx("div", { className: "forgot-password-card", children: _jsxs("div", { className: "forgot-password-success", children: [_jsx("div", { className: "success-icon", children: "\uD83D\uDCE7" }), _jsx("h1", { children: "Email envoy\u00E9 !" }), _jsxs("p", { children: ["Si un compte existe avec l'adresse ", _jsx("strong", { children: email }), ", vous recevrez un email avec un lien pour r\u00E9initialiser votre mot de passe."] }), _jsxs("p", { className: "success-note", children: ["Le lien sera valide pendant ", _jsx("strong", { children: "1 heure" }), "."] }), _jsxs("div", { className: "success-actions", children: [_jsx("button", { onClick: () => navigate('/wallet/login'), className: "btn-primary", children: "Retour \u00E0 la connexion" }), _jsx("button", { onClick: () => {
                                        setSuccess(false);
                                        setEmail('');
                                    }, className: "btn-secondary", children: "Envoyer un autre email" })] }), _jsxs("div", { className: "success-help", children: [_jsx("p", { children: "Vous n'avez pas re\u00E7u l'email ?" }), _jsxs("ul", { children: [_jsx("li", { children: "V\u00E9rifiez votre dossier spam/courrier ind\u00E9sirable" }), _jsx("li", { children: "Assurez-vous d'avoir entr\u00E9 la bonne adresse email" }), _jsx("li", { children: "Attendez quelques minutes, l'envoi peut prendre du temps" })] })] })] }) }) }));
    }
    // Formulaire de demande
    return (_jsx("div", { className: "forgot-password-container", children: _jsxs("div", { className: "forgot-password-card", children: [_jsxs("div", { className: "forgot-password-header", children: [_jsx("h1", { children: "Mot de passe oubli\u00E9 ?" }), _jsx("p", { children: "Pas de panique ! Entrez votre adresse email et nous vous enverrons un lien pour r\u00E9initialiser votre mot de passe." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "forgot-password-form", children: [error && (_jsxs("div", { className: "alert alert-error", children: [_jsx("span", { className: "alert-icon", children: "\u26A0\uFE0F" }), _jsx("span", { children: error })] })), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Adresse email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "form-input", placeholder: "votre.email@exemple.com", autoFocus: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "btn-submit", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "spinner-small" }), _jsx("span", { children: "Envoi en cours..." })] })) : ('Envoyer le lien de réinitialisation') })] }), _jsx("div", { className: "forgot-password-footer", children: _jsxs("p", { children: ["Vous vous souvenez de votre mot de passe ?", ' ', _jsx("button", { type: "button", onClick: () => navigate('/wallet/login'), className: "link-button", children: "Se connecter" })] }) }), _jsxs("div", { className: "forgot-password-help", children: [_jsx("p", { className: "help-title", children: "Besoin d'aide ?" }), _jsxs("p", { children: ["Si vous n'arrivez pas \u00E0 r\u00E9initialiser votre mot de passe, contactez notre support :", ' ', _jsx("a", { href: "mailto:support@feveo2050.sn", children: "support@feveo2050.sn" })] })] })] }) }));
};
export default ForgotPasswordPage;
//# sourceMappingURL=ForgotPasswordPage.js.map