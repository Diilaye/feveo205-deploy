import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import PaiementList from '../components/PaiementList';
import { CreditCard, Filter, Calendar, DollarSign } from 'lucide-react';
const HistoriquePaiements = () => {
    const [filtres, setFiltres] = useState({
        statut: '',
        typePaiement: '',
        dateDebut: '',
        dateFin: ''
    });
    const [afficherFiltres, setAfficherFiltres] = useState(false);
    const handleFiltreChange = (champ, valeur) => {
        setFiltres(prev => ({
            ...prev,
            [champ]: valeur
        }));
    };
    const resetFiltres = () => {
        setFiltres({
            statut: '',
            typePaiement: '',
            dateDebut: '',
            dateFin: ''
        });
    };
    const statutOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'en_attente', label: 'En attente' },
        { value: 'en_cours', label: 'En cours' },
        { value: 'reussi', label: 'Réussi' },
        { value: 'echoue', label: 'Échoué' },
        { value: 'annule', label: 'Annulé' },
        { value: 'rembourse', label: 'Remboursé' }
    ];
    const typePaiementOptions = [
        { value: '', label: 'Tous les types' },
        { value: 'adhesion_gie', label: 'Adhésion GIE' },
        { value: 'investissement', label: 'Investissement' },
        { value: 'cotisation', label: 'Cotisation' },
        { value: 'service', label: 'Service' },
        { value: 'autre', label: 'Autre' }
    ];
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center", children: [_jsx(CreditCard, { className: "h-8 w-8 mr-3 text-blue-600" }), "Historique des paiements"] }), _jsx("p", { className: "mt-2 text-gray-600", children: "Consultez et g\u00E9rez tous vos paiements effectu\u00E9s sur la plateforme FEVEO" })] }), _jsxs("button", { onClick: () => setAfficherFiltres(!afficherFiltres), className: "flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), "Filtres"] })] }) }), afficherFiltres && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Filtrer les paiements" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut" }), _jsx("select", { value: filtres.statut, onChange: (e) => handleFiltreChange('statut', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: statutOptions.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type de paiement" }), _jsx("select", { value: filtres.typePaiement, onChange: (e) => handleFiltreChange('typePaiement', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", children: typePaiementOptions.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date de d\u00E9but" }), _jsx("input", { type: "date", value: filtres.dateDebut, onChange: (e) => handleFiltreChange('dateDebut', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date de fin" }), _jsx("input", { type: "date", value: filtres.dateFin, onChange: (e) => handleFiltreChange('dateFin', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "flex justify-end mt-4 space-x-3", children: [_jsx("button", { onClick: resetFiltres, className: "px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50", children: "R\u00E9initialiser" }), _jsx("button", { onClick: () => setAfficherFiltres(false), className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Appliquer les filtres" })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-md", children: _jsx(DollarSign, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Paiements r\u00E9ussis" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: "0 XOF" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-md", children: _jsx(Calendar, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Ce mois" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: "0" })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-yellow-100 rounded-md", children: _jsx(CreditCard, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "En attente" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: "0" })] })] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow", children: _jsx(PaiementList, { filtres: filtres }) })] }) }));
};
export default HistoriquePaiements;
//# sourceMappingURL=HistoriquePaiements.js.map