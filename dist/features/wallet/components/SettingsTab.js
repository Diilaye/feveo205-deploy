import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Users, Package, Shield, AlertTriangle } from 'lucide-react';
import { walletApi } from '../services/walletApi';
const SettingsTab = ({ walletData, formatCurrency }) => {
    const [activeCategory, setActiveCategory] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // État pour les informations de la présidente
    const [profileData, setProfileData] = useState({
        prenom: walletData.gieInfo.presidenteInfo?.prenom || '',
        nom: walletData.gieInfo.presidenteInfo?.nom || '',
        email: walletData.gieInfo.presidenteInfo?.email || '',
        telephone: walletData.gieInfo.presidenteInfo?.telephone || ''
    });
    // État pour les informations du GIE
    const [gieData, setGieData] = useState({
        nom: walletData.gieInfo.nom || '',
        description: walletData.gieInfo.description || ''
    });
    // État pour les sessions actives
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    // Charger les sessions quand on accède à l'onglet sécurité
    React.useEffect(() => {
        if (activeCategory === 'security') {
            loadSessions();
        }
    }, [activeCategory]);
    // Fonction pour charger les sessions
    const loadSessions = async () => {
        setLoadingSessions(true);
        try {
            const data = await walletApi.fetchSessions(walletData.gieInfo.code);
            if (data.success) {
                setSessions(data.sessions || []);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des sessions:', error);
        }
        finally {
            setLoadingSessions(false);
        }
    };
    // Fonction pour déconnecter une session
    const handleDisconnectSession = async (sessionId) => {
        if (!confirm('Êtes-vous sûr de vouloir déconnecter cette session ?')) {
            return;
        }
        try {
            const data = await walletApi.disconnectSession(walletData.gieInfo.code, sessionId);
            if (data.success) {
                setMessage({ type: 'success', text: 'Session déconnectée avec succès' });
                loadSessions(); // Recharger les sessions
            }
            else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de la déconnexion' });
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
    };
    // Fonction pour déconnecter toutes les sessions
    const handleDisconnectAllSessions = async () => {
        if (!confirm('Êtes-vous sûr de vouloir déconnecter toutes les sessions ? Vous serez déconnecté de tous vos appareils.')) {
            return;
        }
        try {
            const data = await walletApi.disconnectAllSessions(walletData.gieInfo.code);
            if (data.success) {
                setMessage({ type: 'success', text: 'Toutes les sessions ont été déconnectées' });
                setTimeout(() => {
                    window.location.href = '/login'; // Rediriger vers la page de connexion
                }, 1500);
            }
            else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de la déconnexion' });
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
    };
    // Fonction pour sauvegarder le profil
    const handleSaveProfile = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`http://localhost:3051/api/wallet/${walletData.gieInfo.code}/presidente`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                // Recharger la page après 1.5 secondes pour refléter les changements
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
        finally {
            setIsLoading(false);
        }
    };
    // Fonction pour sauvegarder les informations du GIE
    const handleSaveGIE = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`http://localhost:3051/api/wallet/${walletData.gieInfo.code}/gie`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gieData)
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Informations du GIE mises à jour avec succès !' });
                // Recharger la page après 1.5 secondes pour refléter les changements
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
            }
        }
        catch (error) {
            console.error('Erreur:', error);
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
        finally {
            setIsLoading(false);
        }
    };
    const categories = [
        { id: 'profile', name: 'Profil', icon: Users, color: 'blue' },
        { id: 'gie', name: 'GIE', icon: Package, color: 'green' },
        { id: 'security', name: 'Sécurité', icon: Shield, color: 'red' },
        { id: 'danger', name: 'Zone dangereuse', icon: AlertTriangle, color: 'red' }
    ];
    const getColorClasses = (color) => {
        const colors = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-600' },
            orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-600' },
            red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' }
        };
        return colors[color] || colors.blue;
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl p-6 text-white", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "Param\u00E8tres" }), _jsx("p", { className: "text-gray-100", children: "G\u00E9rez les param\u00E8tres de votre GIE, wallet et profil utilisateur" })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 h-fit lg:sticky lg:top-4", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Cat\u00E9gories" }), _jsx("nav", { className: "space-y-2", children: categories.map((item) => {
                                        const isActive = activeCategory === item.id;
                                        const colorClass = getColorClasses(item.color);
                                        return (_jsxs("button", { onClick: () => setActiveCategory(item.id), className: `w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${isActive
                                                ? `${colorClass.bg} ${colorClass.text} border ${colorClass.border} shadow-sm font-medium`
                                                : 'text-gray-700 hover:bg-gray-50'}`, children: [_jsx(item.icon, { className: `w-5 h-5 ${isActive ? colorClass.icon : ''}` }), _jsx("span", { children: item.name })] }, item.id));
                                    }) })] }) }), _jsxs("div", { className: "lg:col-span-3", children: [activeCategory === 'profile' && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center", children: [_jsx(Users, { className: "w-5 h-5 mr-2 text-blue-600" }), "Param\u00E8tres du Profil"] }) }), _jsxs("div", { className: "p-6", children: [message && (_jsx("div", { className: `mb-6 p-4 rounded-lg border ${message.type === 'success'
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-red-50 border-red-200 text-red-800'}`, children: _jsx("p", { className: "text-sm font-medium", children: message.text }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: profileData.prenom, onChange: (e) => setProfileData({ ...profileData, prenom: e.target.value }), className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom" }), _jsx("input", { type: "text", value: profileData.nom, onChange: (e) => setProfileData({ ...profileData, nom: e.target.value }), className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: profileData.email, onChange: (e) => setProfileData({ ...profileData, email: e.target.value }), placeholder: "email@exemple.com", className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: profileData.telephone, onChange: (e) => setProfileData({ ...profileData, telephone: e.target.value }), placeholder: "+221 XX XXX XX XX", className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "CNI" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.presidenteInfo?.cni || '', className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fonction" }), _jsx("input", { type: "text", defaultValue: "Pr\u00E9sidente", className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: handleSaveProfile, disabled: isLoading, className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center", children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Enregistrement..."] })) : ('Sauvegarder le Profil') }) })] })] })), activeCategory === 'gie' && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center", children: [_jsx(Package, { className: "w-5 h-5 mr-2 text-green-600" }), "Param\u00E8tres du GIE"] }) }), _jsxs("div", { className: "p-6", children: [message && (_jsx("div", { className: `mb-6 p-4 rounded-lg border ${message.type === 'success'
                                                    ? 'bg-green-50 border-green-200 text-green-800'
                                                    : 'bg-red-50 border-red-200 text-red-800'}`, children: _jsx("p", { className: "text-sm font-medium", children: message.text }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom du GIE" }), _jsx("input", { type: "text", value: gieData.nom, onChange: (e) => setGieData({ ...gieData, nom: e.target.value }), className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Code GIE" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.code, className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description / Objectif" }), _jsx("textarea", { rows: 3, value: gieData.description, onChange: (e) => setGieData({ ...gieData, description: e.target.value }), placeholder: "D\u00E9crivez l'objectif et les activit\u00E9s principales du GIE...", className: "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900", children: "Localisation" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "R\u00E9gion" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.localisation?.region || '', className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.localisation?.departement || '', className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Arrondissement" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.localisation?.arrondissement || '', className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Commune" }), _jsx("input", { type: "text", defaultValue: walletData.gieInfo.localisation?.commune || '', className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] })] }), walletData.gieInfo.localisation?.adresseComplete && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Adresse compl\u00E8te" }), _jsx("textarea", { rows: 2, defaultValue: walletData.gieInfo.localisation.adresseComplete, className: "w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50", disabled: true })] }))] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: handleSaveGIE, disabled: isLoading, className: "bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center", children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Enregistrement..."] })) : ('Sauvegarder le GIE') }) })] })] })), activeCategory === 'security' && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("h3", { className: "text-lg font-bold text-gray-900 flex items-center", children: [_jsx(Shield, { className: "w-5 h-5 mr-2 text-red-600" }), "S\u00E9curit\u00E9"] }) }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "border-t border-gray-200 pt-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h4", { className: "font-medium text-gray-900", children: "Sessions actives" }), loadingSessions && (_jsx("span", { className: "text-sm text-gray-500", children: "Chargement..." }))] }), _jsx("div", { className: "space-y-3", children: sessions.length === 0 && !loadingSessions ? (_jsx("div", { className: "p-4 bg-gray-50 rounded-lg text-center", children: _jsx("p", { className: "text-sm text-gray-600", children: "Aucune session active" }) })) : (sessions.map((session) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "font-medium text-gray-900 flex items-center", children: [session.device, " - ", session.browser, session.current && (_jsx("span", { className: "ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full", children: "Session actuelle" }))] }), _jsxs("p", { className: "text-sm text-gray-600", children: [session.location, " \u2022 ", session.ipAddress] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Derni\u00E8re activit\u00E9 : ", new Date(session.lastActive).toLocaleString('fr-FR')] })] }), !session.current && (_jsx("button", { onClick: () => handleDisconnectSession(session.id), className: "text-red-600 hover:text-red-800 text-sm font-medium ml-4", children: "D\u00E9connecter" }))] }, session.id)))) })] }) }), _jsx("div", { className: "mt-6 flex justify-end space-x-3", children: _jsx("button", { onClick: handleDisconnectAllSessions, disabled: sessions.length === 0, className: "bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed", children: "D\u00E9connecter toutes les sessions" }) })] })] })), activeCategory === 'danger' && (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-red-300", children: [_jsxs("div", { className: "p-6 border-b border-red-200 bg-red-50", children: [_jsxs("h3", { className: "text-lg font-bold text-red-800 flex items-center", children: [_jsx(AlertTriangle, { className: "w-5 h-5 mr-2" }), "Zone Dangereuse"] }), _jsx("p", { className: "text-sm text-red-600 mt-1", children: "Ces actions sont irr\u00E9versibles. Proc\u00E9dez avec prudence." })] }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-medium text-red-900 flex items-center", children: [_jsx(AlertTriangle, { className: "w-4 h-4 mr-2" }), "Supprimer le compte"] }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: "Supprime d\u00E9finitivement votre compte et toutes vos donn\u00E9es. Cette action est irr\u00E9versible." })] }), _jsx("button", { className: "ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap", children: "Supprimer" })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-medium text-orange-900 flex items-center", children: [_jsx(AlertTriangle, { className: "w-4 h-4 mr-2" }), "Quitter le GIE"] }), _jsx("p", { className: "text-sm text-orange-700 mt-1", children: "Quitte le GIE actuel et perd l'acc\u00E8s aux donn\u00E9es partag\u00E9es. Vos investissements seront transf\u00E9r\u00E9s." })] }), _jsx("button", { className: "ml-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap", children: "Quitter" })] })] }) })] }))] })] })] }));
};
export default SettingsTab;
//# sourceMappingURL=SettingsTab.js.map