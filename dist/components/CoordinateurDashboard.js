import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileSettings from './coordinateur/ProfileSettings';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
const CoordinateurDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [gies, setGies] = useState([]);
    const [selectedGie, setSelectedGie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Pagination et recherche
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    // Filtres de recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCommune, setSearchCommune] = useState('');
    const [searchNomPresidente, setSearchNomPresidente] = useState('');
    const [searchPrenomPresidente, setSearchPrenomPresidente] = useState('');
    const [searchTelephonePresidente, setSearchTelephonePresidente] = useState('');
    const [communes, setCommunes] = useState([]);
    // Récupérer le token
    const getToken = () => localStorage.getItem('adminAuthToken');
    // Charger le dashboard
    const fetchDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/coordinateur/dashboard`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStats(response.data.data.statistiques);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement du dashboard');
        }
        finally {
            setLoading(false);
        }
    };
    // Charger la liste des GIE
    const fetchGies = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage
            };
            if (searchTerm)
                params.search = searchTerm;
            if (searchCommune)
                params.commune = searchCommune;
            if (searchNomPresidente)
                params.nomPresidente = searchNomPresidente;
            if (searchPrenomPresidente)
                params.prenomPresidente = searchPrenomPresidente;
            if (searchTelephonePresidente)
                params.telephonePresidente = searchTelephonePresidente;
            const response = await axios.get(`${API_URL}/coordinateur/gies`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                params
            });
            console.log('GIEs reçus:', response.data.data.gies);
            setGies(response.data.data.gies);
            setTotalItems(response.data.data.totalGies);
            setTotalPages(response.data.data.totalPages);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des GIE');
        }
        finally {
            setLoading(false);
        }
    };
    // Charger les communes
    const fetchCommunes = async () => {
        try {
            const response = await axios.get(`${API_URL}/coordinateur/communes`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setCommunes(response.data.data);
        }
        catch (err) {
            console.error('Erreur chargement communes:', err);
        }
    };
    // Voir les détails d'un GIE
    const viewGieDetails = async (id) => {
        setLoading(true);
        setError('');
        try {
            console.log('Chargement détails GIE:', id);
            const response = await axios.get(`${API_URL}/coordinateur/gies/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            console.log('Détails GIE reçus:', response.data.data);
            setSelectedGie(response.data.data);
            setActiveView('details');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
        }
        finally {
            setLoading(false);
        }
    };
    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setSearchCommune('');
        setSearchNomPresidente('');
        setSearchPrenomPresidente('');
        setSearchTelephonePresidente('');
        setCurrentPage(1);
    };
    // Appliquer les filtres
    const applyFilters = () => {
        setCurrentPage(1);
        fetchGies();
    };
    useEffect(() => {
        if (activeView === 'dashboard') {
            fetchDashboard();
        }
        else if (activeView === 'gies') {
            fetchGies();
            fetchCommunes();
        }
    }, [activeView, currentPage]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Espace Coordinateur" }), _jsx("button", { onClick: () => {
                                    localStorage.removeItem('adminAuthToken');
                                    localStorage.removeItem('adminUser');
                                    window.location.href = '/coordinateur/login';
                                }, className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600", children: "D\u00E9connexion" })] }) }) }), _jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveView('dashboard'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeView === 'dashboard'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "\uD83D\uDCCA Tableau de bord" }), _jsx("button", { onClick: () => setActiveView('gies'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeView === 'gies'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "\uD83D\uDCCB Liste des GIE" }), _jsx("button", { onClick: () => setActiveView('settings'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeView === 'settings'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: "\u2699\uFE0F Param\u00E8tres" })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [error && (_jsx("div", { className: "mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded", children: error })), activeView === 'dashboard' && stats && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-6", children: "Statistiques G\u00E9n\u00E9rales" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-blue-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\uD83C\uDFE2" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total GIE" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.gieTotal })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-green-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\u2705" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "GIE Actifs" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.gieActifs })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-gray-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\u23F8\uFE0F" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "GIE Inactifs" }), _jsx("p", { className: "text-2xl font-bold text-gray-600", children: stats.gieInactifs })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-purple-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDC65" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Membres" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: stats.membresTotaux })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-yellow-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCB0" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Investissements" }), _jsxs("p", { className: "text-2xl font-bold text-yellow-600", children: [stats.investissementTotal.toLocaleString(), " FCFA"] })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-indigo-100 rounded-full", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCC8" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Nb Investissements" }), _jsx("p", { className: "text-2xl font-bold text-indigo-600", children: stats.nombreInvestissements })] })] }) })] })] })), activeView === 'gies' && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-6", children: "Liste des GIE (Consultation)" }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow mb-6", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: "Recherche avanc\u00E9e" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Recherche g\u00E9n\u00E9rale" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Nom, identifiant...", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Commune" }), _jsxs("select", { value: searchCommune, onChange: (e) => setSearchCommune(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md", children: [_jsx("option", { value: "", children: "Toutes les communes" }), communes.map((c) => (_jsxs("option", { value: c.commune, children: [c.commune, " (", c.count, ")"] }, c.commune)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom Pr\u00E9sidente" }), _jsx("input", { type: "text", value: searchNomPresidente, onChange: (e) => setSearchNomPresidente(e.target.value), placeholder: "Nom...", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom Pr\u00E9sidente" }), _jsx("input", { type: "text", value: searchPrenomPresidente, onChange: (e) => setSearchPrenomPresidente(e.target.value), placeholder: "Pr\u00E9nom...", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00E9l\u00E9phone Pr\u00E9sidente" }), _jsx("input", { type: "text", value: searchTelephonePresidente, onChange: (e) => setSearchTelephonePresidente(e.target.value), placeholder: "T\u00E9l\u00E9phone...", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] })] }), _jsxs("div", { className: "flex space-x-4 mt-4", children: [_jsx("button", { onClick: applyFilters, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "\uD83D\uDD0D Rechercher" }), _jsx("button", { onClick: resetFilters, className: "px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400", children: "\u21BA R\u00E9initialiser" })] })] }), loading ? (_jsx("div", { className: "text-center py-8", children: "Chargement..." })) : gies.length === 0 ? (_jsx("div", { className: "bg-white rounded-lg shadow p-8 text-center text-gray-500", children: "Aucun GIE trouv\u00E9 avec ces crit\u00E8res de recherche" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Identifiant" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Nom GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Pr\u00E9sidente" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Commune" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: gies.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: gie.identifiant || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: gie.nom || '-' }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: [gie.nomPresidente || '-', " ", gie.prenomPresidente || ''] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: gie.telephonePresidente || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: gie.commune || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: gie.nombreMembres || 0 }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${gie.statutAdhesion === 'validee'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : gie.statutAdhesion === 'en_attente'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-yellow-100 text-yellow-800'}`, children: gie.statutAdhesion || 'N/A' }) }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("button", { onClick: () => viewGieDetails(gie._id), className: "text-blue-600 hover:text-blue-800", children: "\uD83D\uDC41\uFE0F Voir" }) })] }, gie._id))) })] }) }), _jsxs("div", { className: "mt-6 flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Affichage de ", (currentPage - 1) * itemsPerPage + 1, " \u00E0", ' ', Math.min(currentPage * itemsPerPage, totalItems), " sur ", totalItems, " GIE"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-3 py-1 border rounded disabled:opacity-50", children: "\u2190 Pr\u00E9c\u00E9dent" }), _jsxs("span", { className: "px-3 py-1", children: ["Page ", currentPage, " / ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-3 py-1 border rounded disabled:opacity-50", children: "Suivant \u2192" })] })] })] }))] })), activeView === 'details' && selectedGie && selectedGie.gie && (_jsxs("div", { children: [_jsx("button", { onClick: () => setActiveView('gies'), className: "mb-4 text-blue-600 hover:text-blue-800", children: "\u2190 Retour \u00E0 la liste" }), _jsx("div", { className: "bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4", children: "\u2139\uFE0F Mode consultation uniquement - Vous ne pouvez pas modifier ces informations" }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: selectedGie.gie.nom }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Identifiant:" }), " ", selectedGie.gie.identifiant] }), _jsxs("p", { children: [_jsx("strong", { children: "Statut:" }), " ", selectedGie.gie.statut] }), _jsxs("p", { children: [_jsx("strong", { children: "Statut Adh\u00E9sion:" }), _jsx("span", { className: `ml-2 px-2 py-1 rounded-full text-xs ${selectedGie.gie.statutAdhesion === 'actif'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : selectedGie.gie.statutAdhesion === 'inactif'
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : 'bg-yellow-100 text-yellow-800'}`, children: selectedGie.gie.statutAdhesion || 'N/A' })] }), _jsxs("p", { children: [_jsx("strong", { children: "Nombre de membres:" }), " ", selectedGie.gie.nombreMembres] }), _jsxs("p", { children: [_jsx("strong", { children: "Date de cr\u00E9ation:" }), " ", new Date(selectedGie.gie.dateCreation).toLocaleDateString()] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Pr\u00E9sidente" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nom:" }), " ", selectedGie.gie.nomPresidente] }), _jsxs("p", { children: [_jsx("strong", { children: "Pr\u00E9nom:" }), " ", selectedGie.gie.prenomPresidente] }), _jsxs("p", { children: [_jsx("strong", { children: "T\u00E9l\u00E9phone:" }), " ", selectedGie.gie.telephonePresidente] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Localisation" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "R\u00E9gion:" }), " ", selectedGie.gie.region] }), _jsxs("p", { children: [_jsx("strong", { children: "D\u00E9partement:" }), " ", selectedGie.gie.departement] }), _jsxs("p", { children: [_jsx("strong", { children: "Arrondissement:" }), " ", selectedGie.gie.arrondissement] }), _jsxs("p", { children: [_jsx("strong", { children: "Commune:" }), " ", selectedGie.gie.commune] })] })] })] }), selectedGie.gie.membres && selectedGie.gie.membres.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsxs("h3", { className: "font-semibold text-lg mb-3", children: ["Membres du GIE (", selectedGie.gie.membres.length, ")"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Nom" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Pr\u00E9nom" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Fonction" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "CIN" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: selectedGie.gie.membres.map((membre, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: membre.nom || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: membre.prenom || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: membre.fonction || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: membre.telephone || '-' }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: membre.cin || '-' })] }, index))) })] }) })] })), selectedGie.investissements && selectedGie.investissements.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Historique des investissements" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Montant" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: selectedGie.investissements.map((inv) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: new Date(inv.dateCreation).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: [inv.montant.toLocaleString(), " FCFA"] }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${inv.statut === 'completed'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-yellow-100 text-yellow-800'}`, children: inv.statut }) })] }, inv._id))) })] }) })] }))] })] })), activeView === 'settings' && (_jsx("div", { className: "bg-white rounded-lg shadow-sm", children: _jsx(ProfileSettings, {}) }))] })] }));
};
export default CoordinateurDashboard;
//# sourceMappingURL=CoordinateurDashboard.js.map