import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
const PaiementResultat = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paiement, setPaiement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const reference = searchParams.get('ref');
    const statut = searchParams.get('status'); // success, error, cancel
    useEffect(() => {
        if (reference) {
            verifierPaiement();
        }
        else {
            setError('Référence de paiement manquante');
            setLoading(false);
        }
    }, [reference]);
    const verifierPaiement = async () => {
        try {
            const response = await fetch(`https://api.feveo2025.sn/api/paiements/reference/${reference}`);
            const data = await response.json();
            if (data.success) {
                setPaiement(data.data.paiement);
            }
            else {
                setError(data.message);
            }
        }
        catch (err) {
            setError('Erreur lors de la vérification du paiement');
        }
        finally {
            setLoading(false);
        }
    };
    const retourAccueil = () => {
        navigate('/');
    };
    const voirHistorique = () => {
        navigate('/paiements');
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(RefreshCw, { className: "animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "V\u00E9rification du paiement en cours..." })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center", children: [_jsx(XCircle, { className: "h-16 w-16 text-red-500 mx-auto mb-4" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Erreur" }), _jsx("p", { className: "text-gray-600 mb-6", children: error }), _jsx("button", { onClick: retourAccueil, className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700", children: "Retour \u00E0 l'accueil" })] }) }));
    }
    const estReussi = paiement?.statut === 'reussi';
    const estEchoue = paiement?.statut === 'echoue';
    const estAnnule = paiement?.statut === 'annule';
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx("div", { className: "max-w-md w-full bg-white rounded-xl shadow-lg p-8", children: _jsxs("div", { className: "text-center", children: [estReussi && (_jsx(CheckCircle, { className: "h-16 w-16 text-green-500 mx-auto mb-4" })), (estEchoue || estAnnule) && (_jsx(XCircle, { className: "h-16 w-16 text-red-500 mx-auto mb-4" })), !estReussi && !estEchoue && !estAnnule && (_jsx(RefreshCw, { className: "h-16 w-16 text-yellow-500 mx-auto mb-4" })), _jsxs("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: [estReussi && 'Paiement réussi !', estEchoue && 'Paiement échoué', estAnnule && 'Paiement annulé', !estReussi && !estEchoue && !estAnnule && 'Paiement en cours'] }), _jsxs("p", { className: "text-gray-600 mb-6", children: [estReussi && 'Votre paiement a été traité avec succès.', estEchoue && 'Une erreur est survenue lors du traitement de votre paiement.', estAnnule && 'Votre paiement a été annulé.', !estReussi && !estEchoue && !estAnnule && 'Votre paiement est en cours de traitement.'] }), paiement && (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 mb-6 text-left", children: [_jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "D\u00E9tails du paiement" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "R\u00E9f\u00E9rence:" }), _jsx("span", { className: "font-mono", children: paiement.referencePaiement })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Montant:" }), _jsxs("span", { className: "font-semibold", children: [paiement.montant.toLocaleString(), " ", paiement.devise] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Type:" }), _jsx("span", { children: paiement.typePaiement.replace('_', ' ') })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "M\u00E9thode:" }), _jsx("span", { children: paiement.methodePaiement })] }), paiement.datePaiement && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Date de paiement:" }), _jsx("span", { children: new Date(paiement.datePaiement).toLocaleDateString('fr-FR') })] }))] })] })), estReussi && (_jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-6", children: _jsxs("p", { className: "text-green-800 text-sm", children: ["Un email de confirmation vous a \u00E9t\u00E9 envoy\u00E9 \u00E0 ", paiement?.payeur?.email] }) })), estEchoue && paiement?.messageErreur && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: _jsxs("p", { className: "text-red-800 text-sm", children: ["Erreur: ", paiement.messageErreur] }) })), _jsxs("div", { className: "space-y-3", children: [estReussi && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: voirHistorique, className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700", children: "Voir l'historique des paiements" }), _jsx("button", { onClick: retourAccueil, className: "w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300", children: "Retour \u00E0 l'accueil" })] })), (estEchoue || estAnnule) && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => window.location.reload(), className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700", children: "R\u00E9essayer le paiement" }), _jsx("button", { onClick: retourAccueil, className: "w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300", children: "Retour \u00E0 l'accueil" })] })), !estReussi && !estEchoue && !estAnnule && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: verifierPaiement, className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700", children: "V\u00E9rifier \u00E0 nouveau" }), _jsx("button", { onClick: retourAccueil, className: "w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300", children: "Retour \u00E0 l'accueil" })] }))] })] }) }) }));
};
export default PaiementResultat;
//# sourceMappingURL=PaiementResultat.js.map