import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, CreditCard, Eye } from 'lucide-react';
const PaiementList = ({ utilisateurId, filtres }) => {
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPaiement, setSelectedPaiement] = useState(null);
    useEffect(() => {
        chargerPaiements();
    }, [page, filtres]);
    const chargerPaiements = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: page.toString(),
                limite: '10'
            });
            if (filtres?.statut)
                params.append('statut', filtres.statut);
            if (filtres?.typePaiement)
                params.append('typePaiement', filtres.typePaiement);
            if (filtres?.dateDebut)
                params.append('dateDebut', filtres.dateDebut);
            if (filtres?.dateFin)
                params.append('dateFin', filtres.dateFin);
            const response = await fetch(`https://api.feveo2025.sn/api/paiements?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setPaiements(data.data.paiements);
                setTotalPages(data.data.pagination.pages);
            }
            else {
                setError(data.message);
            }
        }
        catch (err) {
            setError('Erreur lors du chargement des paiements');
        }
        finally {
            setLoading(false);
        }
    };
    const verifierStatut = async (paiementId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://api.feveo2025.sn/api/paiements/${paiementId}/verifier-statut`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                // Actualiser la liste
                chargerPaiements();
            }
        }
        catch (err) {
            console.error('Erreur vérification statut:', err);
        }
    };
    const annulerPaiement = async (paiementId) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce paiement ?')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://api.feveo2025.sn/api/paiements/${paiementId}/annuler`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                chargerPaiements();
            }
            else {
                alert(data.message);
            }
        }
        catch (err) {
            alert('Erreur lors de l\'annulation');
        }
    };
    const getStatutIcon = (statut) => {
        switch (statut) {
            case 'reussi':
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
            case 'echoue':
                return _jsx(XCircle, { className: "h-5 w-5 text-red-500" });
            case 'en_cours':
                return _jsx(Clock, { className: "h-5 w-5 text-blue-500" });
            case 'en_attente':
                return _jsx(AlertCircle, { className: "h-5 w-5 text-yellow-500" });
            case 'annule':
                return _jsx(XCircle, { className: "h-5 w-5 text-gray-500" });
            default:
                return _jsx(AlertCircle, { className: "h-5 w-5 text-gray-400" });
        }
    };
    const getStatutLabel = (statut) => {
        const labels = {
            'en_attente': 'En attente',
            'en_cours': 'En cours',
            'reussi': 'Réussi',
            'echoue': 'Échoué',
            'annule': 'Annulé',
            'rembourse': 'Remboursé'
        };
        return labels[statut] || statut;
    };
    const getStatutColor = (statut) => {
        const colors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'en_cours': 'bg-blue-100 text-blue-800',
            'reussi': 'bg-green-100 text-green-800',
            'echoue': 'bg-red-100 text-red-800',
            'annule': 'bg-gray-100 text-gray-800',
            'rembourse': 'bg-purple-100 text-purple-800'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800';
    };
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-8", children: [_jsx(RefreshCw, { className: "animate-spin h-6 w-6 mr-2" }), "Chargement des paiements..."] }));
    }
    if (error) {
        return (_jsxs("div", { className: "text-center p-8", children: [_jsx(XCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), _jsx("p", { className: "text-red-600", children: error }), _jsx("button", { onClick: chargerPaiements, className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "R\u00E9essayer" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Historique des paiements" }), _jsxs("button", { onClick: chargerPaiements, className: "flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-1" }), "Actualiser"] })] }), _jsx("div", { className: "bg-white shadow overflow-hidden sm:rounded-md", children: paiements.length === 0 ? (_jsxs("div", { className: "text-center p-8", children: [_jsx(CreditCard, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Aucun paiement trouv\u00E9" })] })) : (_jsx("ul", { className: "divide-y divide-gray-200", children: paiements.map((paiement) => (_jsxs("li", { className: "p-4 hover:bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center", children: [getStatutIcon(paiement.statut), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: paiement.referencePaiement }), _jsxs("p", { className: "text-sm text-gray-500", children: [paiement.payeur.prenom, " ", paiement.payeur.nom] })] })] }), _jsxs("div", { className: "mt-2 sm:flex sm:justify-between", children: [_jsxs("div", { className: "sm:flex", children: [_jsxs("p", { className: "flex items-center text-sm text-gray-500", children: [paiement.montant.toLocaleString(), " ", paiement.devise] }), _jsx("p", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6", children: paiement.typePaiement.replace('_', ' ') })] }), _jsx("div", { className: "mt-2 flex items-center text-sm text-gray-500 sm:mt-0", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(paiement.statut)}`, children: getStatutLabel(paiement.statut) }) })] })] }), _jsxs("div", { className: "ml-4 flex items-center space-x-2", children: [_jsx("button", { onClick: () => setSelectedPaiement(paiement), className: "text-blue-600 hover:text-blue-900", children: _jsx(Eye, { className: "h-4 w-4" }) }), paiement.methodePaiement === 'wave' && ['en_cours', 'en_attente'].includes(paiement.statut) && (_jsx("button", { onClick: () => verifierStatut(paiement._id), className: "text-blue-600 hover:text-blue-900", children: _jsx(RefreshCw, { className: "h-4 w-4" }) })), ['en_attente', 'en_cours'].includes(paiement.statut) && (_jsx("button", { onClick: () => annulerPaiement(paiement._id), className: "text-red-600 hover:text-red-900", children: _jsx(XCircle, { className: "h-4 w-4" }) }))] })] }), _jsxs("div", { className: "mt-2 text-xs text-gray-500", children: ["Cr\u00E9\u00E9 le ", new Date(paiement.dateCreation).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(paiement.dateCreation).toLocaleTimeString('fr-FR'), paiement.datePaiement && (_jsxs("span", { children: [" \u2022 Pay\u00E9 le ", new Date(paiement.datePaiement).toLocaleDateString('fr-FR')] }))] })] }, paiement._id))) })) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("button", { onClick: () => setPage(Math.max(1, page - 1)), disabled: page === 1, className: "px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50", children: "Pr\u00E9c\u00E9dent" }), _jsxs("span", { className: "text-sm text-gray-700", children: ["Page ", page, " sur ", totalPages] }), _jsx("button", { onClick: () => setPage(Math.min(totalPages, page + 1)), disabled: page === totalPages, className: "px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50", children: "Suivant" })] })), selectedPaiement && (_jsx("div", { className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50", children: _jsx("div", { className: "relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white", children: _jsxs("div", { className: "mt-3", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "D\u00E9tails du paiement" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "R\u00E9f\u00E9rence" }), _jsx("p", { className: "text-sm", children: selectedPaiement.referencePaiement })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Montant" }), _jsxs("p", { className: "text-sm", children: [selectedPaiement.montant.toLocaleString(), " ", selectedPaiement.devise] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Statut" }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(selectedPaiement.statut)}`, children: getStatutLabel(selectedPaiement.statut) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Payeur" }), _jsxs("p", { className: "text-sm", children: [selectedPaiement.payeur.prenom, " ", selectedPaiement.payeur.nom] }), _jsx("p", { className: "text-xs text-gray-500", children: selectedPaiement.payeur.email }), _jsx("p", { className: "text-xs text-gray-500", children: selectedPaiement.payeur.telephone })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "M\u00E9thode" }), _jsx("p", { className: "text-sm", children: selectedPaiement.methodePaiement })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: () => setSelectedPaiement(null), className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400", children: "Fermer" }) })] }) }) }))] }));
};
export default PaiementList;
//# sourceMappingURL=PaiementList.js.map