import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
const ActivityLogsView = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('list');
    // Filtres
    const [roleFilter, setRoleFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const getToken = () => localStorage.getItem('adminAuthToken');
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = { limit: 50, page: currentPage };
            if (roleFilter)
                params.role = roleFilter;
            if (actionFilter)
                params.action = actionFilter;
            const response = await axios.get(roleFilter || actionFilter ? `${API_URL}/logs/filter` : `${API_URL}/logs/recent`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                params
            });
            setLogs(response.data.data);
            if (response.data.pagination) {
                setTotalPages(response.data.pagination.pages);
            }
        }
        catch (error) {
            console.error('Erreur chargement logs:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/logs/stats`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStats(response.data.data);
        }
        catch (error) {
            console.error('Erreur chargement stats:', error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (view === 'list') {
            fetchLogs();
        }
        else {
            fetchStats();
        }
    }, [view, currentPage, roleFilter, actionFilter]);
    const getActionIcon = (action) => {
        const icons = {
            'login': '🔐',
            'logout': '🚪',
            'login_failed': '❌',
            'consultation_dashboard': '📊',
            'consultation_gie': '📋',
            'consultation_gie_details': '👁️',
            'activation_gie': '✅',
            'desactivation_gie': '🚫',
            'creation_gie': '➕',
            'modification_gie': '✏️',
            'suppression_gie': '🗑️',
            'export_donnees': '📥'
        };
        return icons[action] || '📝';
    };
    const getStatusBadge = (statut) => {
        const colors = {
            'succes': 'bg-green-100 text-green-800',
            'echec': 'bg-red-100 text-red-800',
            'erreur': 'bg-yellow-100 text-yellow-800'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800';
    };
    const getRoleBadge = (role) => {
        const colors = {
            'admin': 'bg-purple-100 text-purple-800',
            'coordinateur': 'bg-blue-100 text-blue-800',
            'moderateur': 'bg-indigo-100 text-indigo-800',
            'operateur': 'bg-cyan-100 text-cyan-800',
            'gie_president': 'bg-teal-100 text-teal-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Journal d'Activit\u00E9" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setView('list'), className: `px-4 py-2 rounded-lg ${view === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700'}`, children: "\uD83D\uDCCB Liste" }), _jsx("button", { onClick: () => setView('stats'), className: `px-4 py-2 rounded-lg ${view === 'stats'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700'}`, children: "\uD83D\uDCCA Statistiques" })] })] }), view === 'list' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white p-4 rounded-lg shadow", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "R\u00F4le" }), _jsxs("select", { value: roleFilter, onChange: (e) => {
                                                setRoleFilter(e.target.value);
                                                setCurrentPage(1);
                                            }, className: "w-full border border-gray-300 rounded-lg px-3 py-2", children: [_jsx("option", { value: "", children: "Tous les r\u00F4les" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "coordinateur", children: "Coordinateur" }), _jsx("option", { value: "moderateur", children: "Mod\u00E9rateur" }), _jsx("option", { value: "operateur", children: "Op\u00E9rateur" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Action" }), _jsxs("select", { value: actionFilter, onChange: (e) => {
                                                setActionFilter(e.target.value);
                                                setCurrentPage(1);
                                            }, className: "w-full border border-gray-300 rounded-lg px-3 py-2", children: [_jsx("option", { value: "", children: "Toutes les actions" }), _jsx("option", { value: "login", children: "Connexion" }), _jsx("option", { value: "logout", children: "D\u00E9connexion" }), _jsx("option", { value: "consultation_gie", children: "Consultation GIE" }), _jsx("option", { value: "activation_gie", children: "Activation GIE" }), _jsx("option", { value: "creation_gie", children: "Cr\u00E9ation GIE" })] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: () => {
                                            setRoleFilter('');
                                            setActionFilter('');
                                            setCurrentPage(1);
                                        }, className: "w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300", children: "R\u00E9initialiser" }) })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [loading ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "Chargement..." })) : logs.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500", children: "Aucune activit\u00E9 enregistr\u00E9e" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Date/Heure" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Utilisateur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "R\u00F4le" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Action" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Description" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "IP" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: logs.map((log) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: new Date(log.dateCreation).toLocaleString('fr-FR') }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: log.utilisateurNom }), _jsx("div", { className: "text-sm text-gray-500", children: log.utilisateurEmail })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${getRoleBadge(log.utilisateurRole)}`, children: log.utilisateurRole }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: [_jsx("span", { className: "mr-2", children: getActionIcon(log.action) }), log.action] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900 max-w-md truncate", children: log.description }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${getStatusBadge(log.statut)}`, children: log.statut }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: log.ipAddress || '-' })] }, log._id))) })] }) })), totalPages > 1 && (_jsxs("div", { className: "bg-gray-50 px-6 py-4 flex items-center justify-between border-t", children: [_jsx("button", { onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-4 py-2 bg-white border rounded-lg disabled:opacity-50", children: "Pr\u00E9c\u00E9dent" }), _jsxs("span", { className: "text-sm text-gray-700", children: ["Page ", currentPage, " sur ", totalPages] }), _jsx("button", { onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-4 py-2 bg-white border rounded-lg disabled:opacity-50", children: "Suivant" })] }))] })] })), view === 'stats' && stats && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Activit\u00E9s Totales" }), _jsx("p", { className: "text-4xl font-bold text-blue-600", children: stats.totalActivites }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Sur les 30 derniers jours" })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Top Actions" }), _jsx("div", { className: "space-y-2", children: stats.actionsParType.slice(0, 5).map((action) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm text-gray-700", children: [getActionIcon(action._id), " ", action._id] }), _jsx("span", { className: "font-semibold text-blue-600", children: action.count })] }, action._id))) })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow lg:col-span-2", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Activit\u00E9s par R\u00F4le" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: stats.activitesParRole.map((role) => (_jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-xs ${getRoleBadge(role._id)}`, children: role._id }), _jsx("p", { className: "text-2xl font-bold mt-2", children: role.count })] }, role._id))) })] })] }))] }));
};
export default ActivityLogsView;
//# sourceMappingURL=ActivityLogsView.js.map