import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
const ProfileSettings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [notification, setNotification] = useState(null);
    const [profileData, setProfileData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: ''
    });
    const [passwordData, setPasswordData] = useState({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
    });
    useEffect(() => {
        fetchProfile();
    }, []);
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);
    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${API_URL}/coordinateur/profil`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                const { nom, prenom, email, telephone } = response.data.data;
                setProfileData({ nom, prenom, email, telephone });
            }
        }
        catch (error) {
            showNotification('error', 'Erreur lors du chargement du profil');
        }
        finally {
            setLoadingProfile(false);
        }
    };
    const showNotification = (type, message) => {
        setNotification({ type, message });
    };
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.put(`${API_URL}/coordinateur/profil`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                showNotification('success', 'Profil modifié avec succès');
                // Mettre à jour le nom dans le localStorage si modifié
                const storedUser = localStorage.getItem('adminData');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    userData.nom = profileData.nom;
                    userData.prenom = profileData.prenom;
                    localStorage.setItem('adminData', JSON.stringify(userData));
                }
            }
        }
        catch (error) {
            showNotification('error', error.response?.data?.message || 'Erreur lors de la modification du profil');
        }
        finally {
            setLoading(false);
        }
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (passwordData.nouveauMotDePasse !== passwordData.confirmationMotDePasse) {
            showNotification('error', 'Les mots de passe ne correspondent pas');
            return;
        }
        if (passwordData.nouveauMotDePasse.length < 8) {
            showNotification('error', 'Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.put(`${API_URL}/coordinateur/profil/mot-de-passe`, passwordData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                showNotification('success', 'Mot de passe modifié avec succès');
                setPasswordData({
                    ancienMotDePasse: '',
                    nouveauMotDePasse: '',
                    confirmationMotDePasse: ''
                });
            }
        }
        catch (error) {
            showNotification('error', error.response?.data?.message || 'Erreur lors de la modification du mot de passe');
        }
        finally {
            setLoading(false);
        }
    };
    if (loadingProfile) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [notification && (_jsxs("div", { className: `fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'}`, children: [notification.type === 'success' ? (_jsx(CheckCircle, { className: "w-5 h-5" })) : (_jsx(AlertCircle, { className: "w-5 h-5" })), _jsx("span", { children: notification.message })] })), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-6", children: "Param\u00E8tres du syst\u00E8me" }), _jsxs("div", { className: "flex gap-4 mb-6 border-b border-gray-200", children: [_jsxs("button", { onClick: () => setActiveSection('profile'), className: `flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeSection === 'profile'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'}`, children: [_jsx(User, { className: "w-5 h-5" }), "Informations du profil"] }), _jsxs("button", { onClick: () => setActiveSection('password'), className: `flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeSection === 'password'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'}`, children: [_jsx(Lock, { className: "w-5 h-5" }), "Modifier le mot de passe"] })] }), activeSection === 'profile' && (_jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("form", { onSubmit: handleProfileSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: profileData.prenom, onChange: (e) => setProfileData({ ...profileData, prenom: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom" }), _jsx("input", { type: "text", value: profileData.nom, onChange: (e) => setProfileData({ ...profileData, nom: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", value: profileData.email, onChange: (e) => setProfileData({ ...profileData, email: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: profileData.telephone, onChange: (e) => setProfileData({ ...profileData, telephone: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", required: true })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: "flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), "Enregistrement..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-5 h-5" }), "Enregistrer les modifications"] })) }) })] }) })), activeSection === 'password' && (_jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("form", { onSubmit: handlePasswordSubmit, children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ancien mot de passe" }), _jsx("input", { type: "password", value: passwordData.ancienMotDePasse, onChange: (e) => setPasswordData({
                                                ...passwordData,
                                                ancienMotDePasse: e.target.value
                                            }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nouveau mot de passe" }), _jsx("input", { type: "password", value: passwordData.nouveauMotDePasse, onChange: (e) => setPasswordData({
                                                ...passwordData,
                                                nouveauMotDePasse: e.target.value
                                            }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", minLength: 8, required: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Le mot de passe doit contenir au moins 8 caract\u00E8res" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirmer le nouveau mot de passe" }), _jsx("input", { type: "password", value: passwordData.confirmationMotDePasse, onChange: (e) => setPasswordData({
                                                ...passwordData,
                                                confirmationMotDePasse: e.target.value
                                            }), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent", minLength: 8, required: true })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: "flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), "Modification..."] })) : (_jsxs(_Fragment, { children: [_jsx(Lock, { className: "w-5 h-5" }), "Modifier le mot de passe"] })) }) })] }) }))] }));
};
export default ProfileSettings;
//# sourceMappingURL=ProfileSettings.js.map