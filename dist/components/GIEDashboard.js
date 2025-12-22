import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Wallet, Package, Users, Activity, TrendingUp, Settings, CreditCard, BarChart3, ExternalLink } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGIE } from '../hooks/useGIE';
const GIEDashboard = () => {
    const { user, isAuthenticated, logout } = useAuthContext();
    const { gies, currentGIE, refreshGIEs, isLoading, error } = useGIE();
    const [activeTab, setActiveTab] = useState('wallet');
    // États pour les données du dashboard
    const [walletData, setWalletData] = useState({
        solde: 2450000,
        partsInvesties: 245,
        rendement: 12.5,
        derniereTransaction: '2024-03-15',
        transactions: [
            {
                id: 1,
                description: 'Vente produits agricoles',
                date: '2024-03-15',
                montant: 150000,
                type: 'Crédit'
            },
            {
                id: 2,
                description: 'Achat semences',
                date: '2024-03-10',
                montant: 50000,
                type: 'Débit'
            },
            {
                id: 3,
                description: 'Rendement investissement',
                date: '2024-03-05',
                montant: 200000,
                type: 'Crédit'
            }
        ]
    });
    const gieData = {
        nom: 'FEVEO-01-01-01-01-001',
        president: 'Fatou Diop',
        poste: 'Présidente'
    };
    useEffect(() => {
        if (isAuthenticated && user) {
            refreshGIEs();
        }
    }, [isAuthenticated, user]);
    // Rediriger si pas authentifié
    if (!isAuthenticated) {
        return (_jsx("div", { className: "min-h-screen bg-neutral-100 flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-lg max-w-md w-full", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-4", children: "Acc\u00E8s restreint" }), _jsx("p", { className: "text-neutral-600 text-center mb-6", children: "Vous devez \u00EAtre connect\u00E9 pour acc\u00E9der au tableau de bord GIE." }), _jsx("button", { onClick: () => window.location.href = '/', className: "w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700", children: "Retour \u00E0 l'accueil" })] }) }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-neutral-100 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" }), _jsx("p", { className: "mt-4 text-neutral-600", children: "Chargement des donn\u00E9es..." })] }) }));
    }
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow-sm px-6 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "F" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-bold text-gray-900", children: "Dashboard GIE" }), _jsx("p", { className: "text-sm text-gray-600", children: gieData.nom })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: gieData.president }), _jsx("p", { className: "text-xs text-gray-500", children: gieData.poste })] }), _jsx("button", { onClick: handleLogout, className: "p-2 text-gray-600 hover:text-red-600 transition-colors", children: _jsx(ExternalLink, { className: "w-5 h-5" }) })] })] }) }), _jsxs("div", { className: "flex", children: [_jsx("div", { className: "w-64 bg-white h-screen shadow-sm", children: _jsxs("nav", { className: "p-4", children: [_jsxs("button", { onClick: () => setActiveTab('wallet'), className: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 bg-orange-500 text-white", children: [_jsx(Wallet, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: "Wallet GIE" })] }), [
                                    { id: 'products', name: 'Produits', icon: Package },
                                    { id: 'activities', name: 'Activités', icon: Activity },
                                    { id: 'members', name: 'Membres', icon: Users },
                                    { id: 'settings', name: 'Paramètres', icon: Settings }
                                ].map((item) => (_jsxs("button", { onClick: () => setActiveTab(item.id), className: "w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-50 transition-colors", children: [_jsx(item.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: item.name })] }, item.id)))] }) }), _jsxs("div", { className: "flex-1 p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Wallet GIE" }), _jsx("p", { className: "text-sm text-gray-600", children: "Derni\u00E8re mise \u00E0 jour: 2024-03-15" })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-blue-900 text-white p-6 rounded-xl relative overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-blue-100 text-sm", children: "Solde Total" }), _jsx(CreditCard, { className: "w-6 h-6 text-blue-200" })] }), _jsx("p", { className: "text-3xl font-bold mb-1", children: "2450000 FCFA" })] }), _jsxs("div", { className: "bg-green-500 text-white p-6 rounded-xl relative overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-green-100 text-sm", children: "Parts Investies" }), _jsx(BarChart3, { className: "w-6 h-6 text-green-200" })] }), _jsx("p", { className: "text-3xl font-bold mb-1", children: "245" })] }), _jsxs("div", { className: "bg-orange-500 text-white p-6 rounded-xl relative overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-orange-100 text-sm", children: "Rendement" }), _jsx(TrendingUp, { className: "w-6 h-6 text-orange-200" })] }), _jsx("p", { className: "text-3xl font-bold mb-1", children: "12.5%" })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Derni\u00E8res Transactions" }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Vente produits agricoles" }), _jsx("p", { className: "text-sm text-gray-500", children: "2024-03-15" })] }), _jsx("div", { className: "font-bold text-lg text-green-600", children: "+150000 FCFA" })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Achat semences" }), _jsx("p", { className: "text-sm text-gray-500", children: "2024-03-10" })] }), _jsx("div", { className: "font-bold text-lg text-red-600", children: "-50000 FCFA" })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Rendement investissement" }), _jsx("p", { className: "text-sm text-gray-500", children: "2024-03-05" })] }), _jsx("div", { className: "font-bold text-lg text-green-600", children: "+200000 FCFA" })] })] }) })] })] })] })] }));
};
export default GIEDashboard;
//# sourceMappingURL=GIEDashboard.js.map