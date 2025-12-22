import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { gieService } from '../services/gieService';
const GestionGIEsEnAttente = () => {
    const [giesEnAttente, setGiesEnAttente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationLoading, setValidationLoading] = useState(null);
    const [paiementData, setPaiementData] = useState({});
    useEffect(() => {
        chargerGIEsEnAttente();
    }, []);
    const chargerGIEsEnAttente = async () => {
        try {
            setLoading(true);
            const response = await gieService.getGIEsEnAttentePaiement();
            setGiesEnAttente(response.data);
            setError(null);
        }
        catch (err) {
            setError(err.message || 'Erreur lors du chargement des GIEs en attente');
        }
        finally {
            setLoading(false);
        }
    };
    const handlePaiementDataChange = (gieId, field, value) => {
        setPaiementData(prev => ({
            ...prev,
            [gieId]: {
                ...prev[gieId],
                [field]: value
            }
        }));
    };
    const validerPaiement = async (gieId) => {
        try {
            setValidationLoading(gieId);
            const data = paiementData[gieId] || {
                montantPaye: 50000,
                referenceTransaction: '',
                methodePaiement: 'virement'
            };
            await gieService.validerPaiementGIE(gieId, data);
            // Recharger la liste
            await chargerGIEsEnAttente();
            // Nettoyer les données de paiement
            setPaiementData(prev => {
                const newData = { ...prev };
                delete newData[gieId];
                return newData;
            });
        }
        catch (err) {
            setError(err.message || 'Erreur lors de la validation du paiement');
        }
        finally {
            setValidationLoading(null);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
    };
    if (loading) {
        return (_jsxs("div", { className: "flex justify-center items-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" }), _jsx("span", { className: "ml-2", children: "Chargement des GIEs en attente..." })] }));
    }
    if (error) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: _jsx("div", { className: "flex", children: _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-red-800", children: "Erreur" }), _jsx("div", { className: "mt-2 text-sm text-red-700", children: error }), _jsx("button", { onClick: chargerGIEsEnAttente, className: "mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200", children: "R\u00E9essayer" })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900", children: ["GIEs en attente de paiement (", giesEnAttente.length, ")"] }), _jsx("button", { onClick: chargerGIEsEnAttente, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700", children: "Actualiser" })] }), giesEnAttente.length === 0 ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-500", children: "Aucun GIE en attente de paiement" }) })) : (_jsx("div", { className: "grid gap-6", children: giesEnAttente.map((gie) => {
                    const currentPaiementData = paiementData[gie._id] || {
                        montantPaye: 50000,
                        referenceTransaction: '',
                        methodePaiement: 'virement'
                    };
                    return (_jsx("div", { className: "bg-white border rounded-lg shadow-sm p-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: gie.nomGIE }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Pr\u00E9sidente:" }), " ", gie.presidenteNom] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "T\u00E9l\u00E9phone:" }), " ", gie.presidenteTelephone || gie.contact?.telephone || 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Adresse:" }), " ", typeof gie.adresse === 'string'
                                                            ? gie.adresse
                                                            : `${gie.adresse?.commune || ''}, ${gie.adresse?.departement || ''}, ${gie.adresse?.region || ''}`] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Membres:" }), " ", gie.nombreMembres || 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Secteur:" }), " ", gie.secteurActivite || gie.activites?.join(', ') || 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Objectifs:" }), " ", gie.objectifs?.join(', ') || 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Besoins financement:" }), " ", gie.besoinsFinancement ? formatMontant(gie.besoinsFinancement) : 'N/A'] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Date d'enregistrement:" }), " ", formatDate(gie.dateCreation)] })] }), _jsx("div", { className: "mt-3", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800", children: "En attente de paiement" }) }), gie.description && (_jsxs("div", { className: "mt-3", children: [_jsx("span", { className: "font-medium text-sm", children: "Description:" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: gie.description })] }))] }), _jsxs("div", { className: "border-l pl-6", children: [_jsx("h4", { className: "text-md font-semibold text-gray-900 mb-3", children: "Validation du paiement" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Montant pay\u00E9 (FCFA)" }), _jsx("input", { type: "number", value: currentPaiementData.montantPaye, onChange: (e) => handlePaiementDataChange(gie._id, 'montantPaye', parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "R\u00E9f\u00E9rence transaction" }), _jsx("input", { type: "text", value: currentPaiementData.referenceTransaction, onChange: (e) => handlePaiementDataChange(gie._id, 'referenceTransaction', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", placeholder: "Ex: TXN123456" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "M\u00E9thode de paiement" }), _jsxs("select", { value: currentPaiementData.methodePaiement, onChange: (e) => handlePaiementDataChange(gie._id, 'methodePaiement', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500", children: [_jsx("option", { value: "virement", children: "Virement bancaire" }), _jsx("option", { value: "mobile_money", children: "Mobile Money" }), _jsx("option", { value: "especes", children: "Esp\u00E8ces" }), _jsx("option", { value: "cheque", children: "Ch\u00E8que" })] })] }), _jsx("button", { onClick: () => validerPaiement(gie._id), disabled: validationLoading === gie._id, className: `w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${validationLoading === gie._id ? 'opacity-50 cursor-not-allowed' : ''}`, children: validationLoading === gie._id ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Validation..."] })) : ('Valider le paiement') })] }), gie.adhesion && (_jsxs("div", { className: "mt-4 p-3 bg-gray-50 rounded", children: [_jsx("h5", { className: "text-sm font-medium text-gray-700 mb-2", children: "Informations adh\u00E9sion" }), _jsxs("div", { className: "text-xs text-gray-600 space-y-1", children: [_jsxs("div", { children: ["Montant adh\u00E9sion: ", formatMontant(gie.adhesion.montantAdhesion)] }), _jsxs("div", { children: ["Statut validation: ", gie.adhesion.validation.statut] }), _jsxs("div", { children: ["Statut paiement: ", gie.adhesion.paiement.statut] })] })] }))] })] }) }, gie._id));
                }) }))] }));
};
export default GestionGIEsEnAttente;
//# sourceMappingURL=GestionGIEsEnAttente.js.map