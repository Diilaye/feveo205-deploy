import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, Edit, Trash2, Eye, LogOut, User, TrendingUp, Search, Calendar } from 'lucide-react';
import axios from 'axios';
const JournalisteDashboard = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('all');
    const [journaliste, setJournaliste] = useState(null);
    useEffect(() => {
        loadData();
    }, [filterStatut]);
    const loadData = async () => {
        try {
            const token = localStorage.getItem('journaliste_token');
            const user = localStorage.getItem('journaliste_user');
            if (!token) {
                navigate('/journaliste/login');
                return;
            }
            if (user) {
                setJournaliste(JSON.parse(user));
            }
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            // Charger le profil et les stats
            const profileResponse = await axios.get(`${API_URL}/journaliste/profile`, config);
            setStats(profileResponse.data.stats);
            // Charger les articles
            const params = filterStatut !== 'all' ? { statut: filterStatut } : {};
            const articlesResponse = await axios.get(`${API_URL}/articles/mes-articles`, {
                ...config,
                params
            });
            setArticles(articlesResponse.data.articles);
        }
        catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('journaliste_token');
                localStorage.removeItem('journaliste_user');
                navigate('/journaliste/login');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('journaliste_token');
        localStorage.removeItem('journaliste_user');
        navigate('/journaliste/login');
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            return;
        }
        try {
            const token = localStorage.getItem('journaliste_token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051';
            await axios.delete(`${API_URL}/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadData();
        }
        catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de l\'article');
        }
    };
    const filteredArticles = articles.filter(article => article.titre.toLowerCase().includes(searchTerm.toLowerCase()));
    const getStatutBadge = (statut) => {
        const badges = {
            publie: 'bg-green-100 text-green-700',
            brouillon: 'bg-yellow-100 text-yellow-700',
            archive: 'bg-gray-100 text-gray-700'
        };
        return badges[statut] || badges.brouillon;
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-neutral-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-neutral-600", children: "Chargement..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx("header", { className: "bg-white border-b border-neutral-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900", children: "Dashboard Journaliste" }), _jsxs("p", { className: "text-sm text-neutral-600", children: [journaliste?.prenom, " ", journaliste?.nom] })] })] }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-600 transition-colors", children: [_jsx(LogOut, { className: "w-5 h-5" }), "D\u00E9connexion"] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-neutral-600 mb-1", children: "Articles publi\u00E9s" }), _jsx("p", { className: "text-3xl font-bold text-neutral-900", children: stats?.articlesPublies || 0 })] }), _jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-neutral-600 mb-1", children: "Brouillons" }), _jsx("p", { className: "text-3xl font-bold text-neutral-900", children: stats?.brouillons || 0 })] }), _jsx("div", { className: "w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(Edit, { className: "w-6 h-6 text-yellow-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-neutral-600 mb-1", children: "Total vues" }), _jsx("p", { className: "text-3xl font-bold text-neutral-900", children: stats?.totalVues || 0 })] }), _jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "w-6 h-6 text-blue-600" }) })] }) })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 mb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4 justify-between", children: [_jsxs("div", { className: "flex-1 flex gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" }), _jsx("input", { type: "text", placeholder: "Rechercher un article...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent" })] }), _jsxs("select", { value: filterStatut, onChange: (e) => setFilterStatut(e.target.value), className: "px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "publie", children: "Publi\u00E9s" }), _jsx("option", { value: "brouillon", children: "Brouillons" }), _jsx("option", { value: "archive", children: "Archiv\u00E9s" })] })] }), _jsxs("button", { onClick: () => navigate('/journaliste/articles/nouveau'), className: "flex items-center gap-2 px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors whitespace-nowrap", children: [_jsx(PlusCircle, { className: "w-5 h-5" }), "Nouvel article"] })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm overflow-hidden", children: filteredArticles.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "w-16 h-16 text-neutral-300 mx-auto mb-4" }), _jsx("p", { className: "text-neutral-600", children: "Aucun article trouv\u00E9" }), _jsx("button", { onClick: () => navigate('/journaliste/articles/nouveau'), className: "mt-4 text-accent-600 hover:text-accent-700 font-medium", children: "Cr\u00E9er votre premier article" })] })) : (_jsx("div", { className: "divide-y divide-neutral-200", children: filteredArticles.map((article) => (_jsx("div", { className: "p-6 hover:bg-neutral-50 transition-colors", children: _jsxs("div", { className: "flex gap-4", children: [_jsx("img", { src: article.image, alt: article.titre, className: "w-24 h-24 rounded-lg object-cover", onError: (e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/150';
                                            } }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 mb-1", children: article.titre }), _jsx("p", { className: "text-sm text-neutral-600 line-clamp-2", children: article.resume })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatutBadge(article.statut)}`, children: article.statut })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-neutral-500 mb-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Eye, { className: "w-4 h-4" }), article.vues, " vues"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), new Date(article.dateModification).toLocaleDateString('fr-FR')] }), _jsx("span", { className: "px-2 py-1 bg-neutral-100 rounded-full text-xs", children: article.categorie })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => navigate(`/journaliste/articles/editer/${article._id}`), className: "flex items-center gap-1 px-3 py-1.5 text-sm text-accent-600 hover:bg-accent-50 rounded-lg transition-colors", children: [_jsx(Edit, { className: "w-4 h-4" }), "\u00C9diter"] }), _jsxs("button", { onClick: () => handleDelete(article._id), className: "flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: [_jsx(Trash2, { className: "w-4 h-4" }), "Supprimer"] })] })] })] }) }, article._id))) })) })] })] }));
};
export default JournalisteDashboard;
//# sourceMappingURL=JournalisteDashboard.js.map