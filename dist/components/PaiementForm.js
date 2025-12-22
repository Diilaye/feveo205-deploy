import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, RefreshCw } from 'lucide-react';
const PaiementForm = ({ montant, typePaiement, entiteId, typeEntite, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [payeur, setPayeur] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        email: ''
    });
    const [methodePaiement, setMethodePaiement] = useState('wave');
    const [accepterConditions, setAccepterConditions] = useState(false);
    // Pré-remplir avec les données utilisateur si disponibles
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setPayeur({
                nom: user.nom || '',
                prenom: user.prenom || '',
                telephone: user.telephone || '',
                email: user.email || ''
            });
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accepterConditions) {
            onError?.('Vous devez accepter les conditions de paiement');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://api.feveo2025.sn/api/paiements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    montant,
                    typePaiement,
                    entiteId,
                    typeEntite,
                    payeur,
                    methodePaiement,
                    metadonnees: {
                        source: 'frontend_feveo'
                    }
                })
            });
            const data = await response.json();
            if (data.success) {
                if (data.data.urlPaiement) {
                    // Rediriger vers la page de paiement Wave
                    window.location.href = data.data.urlPaiement;
                }
                else {
                    onSuccess?.(data.data.paiement);
                }
            }
            else {
                onError?.(data.message || 'Erreur lors de la création du paiement');
            }
        }
        catch (error) {
            onError?.('Erreur de connexion au serveur');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto bg-white rounded-xl shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(CreditCard, { className: "h-6 w-6 text-blue-600 mr-2" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Paiement s\u00E9curis\u00E9" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-4 mb-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600", children: "Montant \u00E0 payer:" }), _jsxs("span", { className: "text-2xl font-bold text-blue-600", children: [montant.toLocaleString(), " XOF"] })] }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: ["Type: ", typePaiement.replace('_', ' ')] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "M\u00E9thode de paiement" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: "wave", checked: methodePaiement === 'wave', onChange: (e) => setMethodePaiement(e.target.value), className: "mr-2" }), _jsx("span", { className: "text-sm", children: "Wave Money" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: "orange_money", checked: methodePaiement === 'orange_money', onChange: (e) => setMethodePaiement(e.target.value), className: "mr-2" }), _jsx("span", { className: "text-sm", children: "Orange Money" })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", value: "free_money", checked: methodePaiement === 'free_money', onChange: (e) => setMethodePaiement(e.target.value), className: "mr-2" }), _jsx("span", { className: "text-sm", children: "Free Money" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", required: true, value: payeur.prenom, onChange: (e) => setPayeur({ ...payeur, prenom: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsx("input", { type: "text", required: true, value: payeur.nom, onChange: (e) => setPayeur({ ...payeur, nom: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", required: true, placeholder: "77 123 45 67", value: payeur.telephone, onChange: (e) => setPayeur({ ...payeur, telephone: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", required: true, value: payeur.email, onChange: (e) => setPayeur({ ...payeur, email: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex items-start", children: [_jsx("input", { type: "checkbox", id: "conditions", checked: accepterConditions, onChange: (e) => setAccepterConditions(e.target.checked), className: "mt-1 mr-2" }), _jsx("label", { htmlFor: "conditions", className: "text-sm text-gray-600", children: "J'accepte les conditions de paiement et autorise le pr\u00E9l\u00E8vement du montant indiqu\u00E9" })] }), _jsx("button", { type: "submit", disabled: loading || !accepterConditions, className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center", children: loading ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "animate-spin h-4 w-4 mr-2" }), "Traitement..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "h-4 w-4 mr-2" }), "Payer ", montant.toLocaleString(), " XOF"] })) })] }), _jsx("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }), "Paiement s\u00E9curis\u00E9 par Wave"] }) })] }));
};
export default PaiementForm;
//# sourceMappingURL=PaiementForm.js.map