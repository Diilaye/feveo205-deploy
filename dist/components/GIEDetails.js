import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Clipboard, CheckCircle, XCircle, Clock, FileText, Users, Building, Shield, DollarSign, Eye, Edit, UserPlus } from 'lucide-react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';
import TransactionHistory from './TransactionHistory';
const GIEDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { admin } = useAdminAuthContext();
    const [gie, setGie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('informations');
    const [historiqueActiveTab, setHistoriqueActiveTab] = useState('evenements');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    // États pour la modification des membres
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [savingMember, setSavingMember] = useState(false);
    // Fonction pour charger les détails du GIE
    const fetchGIEDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('adminAuthToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }
            const response = await axios.get(`/admin/gies/${id}`, {
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data && response.data.success) {
                setGie(response.data.data);
            }
            else {
                setError(response.data?.message || 'Erreur lors du chargement des données du GIE');
            }
        }
        catch (err) {
            console.error('Erreur lors du chargement des détails du GIE:', err);
            setError('Impossible de charger les informations du GIE. Veuillez réessayer.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGIEDetails();
    }, [id, navigate]);
    const activerAdhesion = async () => {
        if (!gie)
            return;
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.post(`/admin/gies/${gie._id}/activer-adhesion`, {}, {
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                alert(response.data.message || 'Adhésion activée avec succès !');
                // Recharger les détails du GIE
                window.location.reload();
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'activation de l\'adhésion:', error);
            alert('Erreur lors de l\'activation de l\'adhésion');
        }
    };
    // Fonction pour ouvrir le modal d'édition de membre
    const handleEditMember = (member) => {
        setEditingMember(member);
        setShowEditMemberModal(true);
    };
    // Fonction pour fermer le modal d'édition de membre
    const handleCloseEditModal = () => {
        setShowEditMemberModal(false);
        setEditingMember(null);
    };
    // Fonction pour mettre à jour ou ajouter un membre
    const handleShowTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
    };
    const handleUpdateMember = async (updatedMemberData) => {
        if (!gie || !editingMember)
            return;
        try {
            setSavingMember(true);
            const token = localStorage.getItem('adminAuthToken');
            // Déterminer si c'est un ajout ou une modification
            const isNewMember = editingMember.isNew;
            const isPresidente = updatedMemberData.fonction === 'Présidente';
            // URL et méthode en fonction de l'opération
            let url = `/admin/gies/${gie._id}/membres`;
            let method = 'post';
            if (!isNewMember) {
                // Si c'est la présidente, utiliser la route spécifique
                if (isPresidente) {
                    url = `${url}/presidente`;
                }
                else {
                    url = `${url}/${editingMember._id}`;
                }
                method = 'put';
            }
            const response = await axios.request({
                url,
                method,
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: updatedMemberData
            });
            if (response.data && response.data.success) {
                alert(isNewMember ? 'Membre ajouté avec succès !' : 'Membre mis à jour avec succès !');
                handleCloseEditModal();
                // Recharger les données du GIE pour avoir les informations à jour
                // Surtout important pour la présidente dont les données sont dans le GIE
                if (isPresidente) {
                    console.log('🔄 Rechargement des données du GIE après modification de la présidente...');
                    await fetchGIEDetails();
                }
                else {
                    // Pour les autres membres, mettre à jour localement
                    let updatedMembers = [...(gie.membres || [])];
                    if (isNewMember) {
                        // Ajouter le nouveau membre
                        updatedMembers.push(response.data.data);
                    }
                    else {
                        // Mettre à jour le membre existant
                        updatedMembers = updatedMembers.map(membre => membre._id === editingMember._id ? response.data.data : membre);
                    }
                    setGie({ ...gie, membres: updatedMembers });
                }
            }
            else {
                alert(response.data?.message || `Erreur lors de ${isNewMember ? 'l\'ajout' : 'la mise à jour'} du membre`);
            }
        }
        catch (error) {
            console.error(`Erreur lors de ${editingMember.isNew ? 'l\'ajout' : 'la mise à jour'} du membre:`, error);
            alert(`Erreur lors de ${editingMember.isNew ? 'l\'ajout' : 'la mise à jour'} du membre`);
        }
        finally {
            setSavingMember(false);
        }
    };
    const renderStatusBadge = (status, type) => {
        let bgColor = 'bg-gray-100 text-gray-700';
        let text = 'Inconnu';
        if (type === 'adhesion') {
            if (status === 'validee') {
                bgColor = 'bg-green-100 text-green-800';
                text = 'Validée';
            }
            else if (status === 'en_attente') {
                bgColor = 'bg-yellow-100 text-yellow-800';
                text = 'En attente';
            }
            else {
                bgColor = 'bg-red-100 text-red-800';
                text = 'Non validée';
            }
        }
        else {
            if (status === 'valide') {
                bgColor = 'bg-green-100 text-green-800';
                text = 'Valide';
            }
            else if (status === 'en_attente_paiement') {
                bgColor = 'bg-yellow-100 text-yellow-800';
                text = 'En attente';
            }
            else if (status === 'rejete') {
                bgColor = 'bg-red-100 text-red-800';
                text = 'Rejeté';
            }
            else {
                bgColor = 'bg-purple-100 text-purple-800';
                text = 'En traitement';
            }
        }
        return (_jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-3 py-1 ${bgColor}`, children: text }));
    };
    const renderTabContent = () => {
        if (!gie)
            return null;
        switch (activeTab) {
            case 'informations':
                return (_jsxs("div", { className: "bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700", children: "Statut d'adh\u00E9sion" }), renderStatusBadge(gie.statutAdhesion, 'adhesion')] }), _jsx("p", { className: "text-sm text-gray-500", children: gie.statutAdhesion === 'validee'
                                                ? 'Le GIE est pleinement opérationnel et peut réaliser des opérations financières.'
                                                : 'Le GIE est en attente de validation pour devenir pleinement opérationnel.' })] }), _jsxs("div", { className: "bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700", children: "Statut d'enregistrement" }), renderStatusBadge(gie.statutEnregistrement, 'enregistrement')] }), _jsx("p", { className: "text-sm text-gray-500", children: gie.statutEnregistrement === 'valide'
                                                ? 'Tous les documents d\'enregistrement du GIE ont été validés.'
                                                : 'Certains documents d\'enregistrement sont en attente de validation.' })] }), _jsxs("div", { className: "bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700", children: "Investissement" }), _jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${gie.daysInvestedSuccess && gie.daysInvestedSuccess > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'}`, children: gie.daysInvestedSuccess && gie.daysInvestedSuccess > 0 ? 'Actif' : 'Inactif' })] }), _jsx("div", { className: "flex items-center", children: _jsxs("span", { className: "text-lg font-bold text-gray-800", children: [gie.daysInvestedSuccess || 0, " jours"] }) }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: gie.daysInvestedSuccess && gie.daysInvestedSuccess > 0
                                                ? `Actif jusqu'au ${new Date(gie.investissementDateFin || '').toLocaleDateString('fr-FR')}`
                                                : 'Aucun investissement actif en cours' })] }), _jsxs("div", { className: "bg-primary-50 p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between", children: [_jsxs("div", { className: "flex items-center mb-3", children: [_jsx(Calendar, { className: "w-5 h-5 text-primary-600 mr-2" }), _jsx("h3", { className: "text-sm font-semibold text-gray-700", children: "Informations cl\u00E9s" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Date de cr\u00E9ation:" }), _jsx("span", { className: "text-sm font-medium", children: new Date(gie.dateCreation).toLocaleDateString('fr-FR') })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Identifiant:" }), _jsx("span", { className: "text-sm font-medium", children: gie.identifiantGIE })] }), (gie.presidenteNom) && (_jsxs(_Fragment, { children: [_jsx("div", { className: "pt-2 mt-2 border-t border-gray-100", children: _jsxs("div", { className: "flex items-center my-2", children: [_jsx(Shield, { className: "w-4 h-4 mr-2 text-purple-600" }), _jsx("span", { className: "text-sm font-medium text-purple-800", children: "Pr\u00E9sidente" })] }) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Nom complet:" }), _jsxs("span", { className: "text-sm font-medium", children: [gie.presidentePrenom || '', " ", gie.presidenteNom || ''] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "T\u00E9l\u00E9phone:" }), _jsx("span", { className: "text-sm font-medium", children: gie.presidenteTelephone || 'Non renseigné' })] }), (gie.presidenteAdresse) && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Adresse:" }), _jsx("span", { className: "text-sm font-medium", children: gie.presidenteAdresse })] })), gie.presidenteEmail && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "Email:" }), _jsx("span", { className: "text-sm font-medium", children: gie.presidenteEmail })] })), gie.presidenteCIN && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-xs text-gray-500", children: "CIN:" }), _jsx("span", { className: "text-sm font-medium", children: gie.presidenteCIN })] }))] }))] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 bg-primary-50 border-b border-gray-200", children: _jsxs("h3", { className: "font-medium text-gray-900 flex items-center", children: [_jsx(MapPin, { className: "w-5 h-5 text-primary-600 mr-2" }), "Localisation"] }) }), _jsx("div", { className: "p-5", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "R\u00E9gion" }), _jsxs("p", { className: "text-sm font-medium", children: [gie.detailsGeographiques?.nomRegion || gie.region, " ", gie.codeRegion && _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", gie.codeRegion, ")"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "D\u00E9partement" }), _jsxs("p", { className: "text-sm font-medium", children: [gie.detailsGeographiques?.nomDepartement || gie.departement, " ", gie.codeDepartement && _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", gie.codeDepartement, ")"] })] })] }), (gie.arrondissement || gie.detailsGeographiques?.nomArrondissement) && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Arrondissement" }), _jsxs("p", { className: "text-sm font-medium", children: [gie.detailsGeographiques?.nomArrondissement || gie.arrondissement, " ", gie.codeArrondissement && _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", gie.codeArrondissement, ")"] })] })] })), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Commune" }), _jsxs("p", { className: "text-sm font-medium", children: [gie.detailsGeographiques?.nomCommune || gie.commune, " ", gie.codeCommune && _jsxs("span", { className: "text-xs text-gray-500 ml-1", children: ["(", gie.codeCommune, ")"] })] })] }), gie.numeroProtocole && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Num\u00E9ro de protocole" }), _jsx("p", { className: "text-sm font-medium", children: gie.numeroProtocole })] }))] }) })] }), (gie.secteurPrincipal || gie.activites) && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 bg-primary-50 border-b border-gray-200", children: _jsxs("h3", { className: "font-medium text-gray-900 flex items-center", children: [_jsx(Building, { className: "w-5 h-5 text-primary-600 mr-2" }), "Activit\u00E9s"] }) }), _jsxs("div", { className: "p-5", children: [gie.secteurPrincipal && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Secteur principal" }), _jsx("p", { className: "text-sm font-medium bg-primary-50 inline-block px-2 py-1 rounded-md", children: gie.secteurPrincipal })] })), gie.activites && gie.activites.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-xs text-gray-500 mb-2", children: "Types d'activit\u00E9s" }), _jsx("div", { className: "flex flex-wrap gap-2", children: gie.activites.map((activite, index) => (_jsx("span", { className: "text-xs bg-green-50 text-green-800 px-2 py-1 rounded-md", children: activite }, index))) })] })), gie.objectifs && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Objectifs" }), _jsx("p", { className: "text-sm", children: gie.objectifs })] }))] })] })), gie.presidente && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [_jsx("div", { className: "bg-primary-50 px-5 py-3 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "w-5 h-5 text-primary-600 mr-2" }), _jsx("h3", { className: "font-semibold text-gray-800", children: "Pr\u00E9sidente" })] }) }), _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-lg mr-4", children: (gie.presidente.prenom?.charAt(0) || '') + (gie.presidente.nom?.charAt(0) || '') }), _jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-800", children: [gie.presidente.prenom || '', " ", gie.presidente.nom || ''] }), _jsx("p", { className: "text-xs text-primary-600 font-medium", children: "Pr\u00E9sidente du GIE" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center p-2 rounded-lg bg-gray-50", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-500 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "T\u00E9l\u00E9phone" }), _jsx("p", { className: "text-sm font-medium", children: gie.presidente.telephone || 'Non renseigné' })] })] }), gie.presidente.adresse && (_jsxs("div", { className: "flex items-center p-2 rounded-lg bg-gray-50", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-500 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Adresse" }), _jsx("p", { className: "text-sm font-medium", children: gie.presidente.adresse })] })] }))] })] })] }))] }), _jsx("div", { className: "mt-8 flex justify-end", children: (gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (_jsxs("button", { onClick: activerAdhesion, className: "flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-sm transition-all ml-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 mr-2" }), "Activer l'adh\u00E9sion du GIE"] })) })] }));
            case 'membres':
                return (_jsxs("div", { className: "bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 flex items-center", children: [_jsx(Users, { className: "w-5 h-5 mr-2 text-primary-600" }), "Membres du GIE"] }), _jsx("div", { className: "flex items-center", children: _jsxs("span", { className: "bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium", children: [gie.membres ? gie.membres.length : 0, " membres"] }) })] }), _jsxs("div", { className: "flex flex-wrap gap-3 mb-6 bg-primary-50 p-3 rounded-lg border border-primary-100", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-purple-500 mr-2" }), _jsx("span", { className: "text-xs font-medium text-gray-700", children: "Pr\u00E9sidente" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-primary-600 mr-2" }), _jsx("span", { className: "text-xs font-medium text-gray-700", children: "Secr\u00E9taire" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-green-500 mr-2" }), _jsx("span", { className: "text-xs font-medium text-gray-700", children: "Tr\u00E9sori\u00E8re" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-gray-500 mr-2" }), _jsx("span", { className: "text-xs font-medium text-gray-700", children: "Membre" })] })] }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs("button", { className: "flex items-center text-sm bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg", onClick: () => {
                                    const newMember = {
                                        _id: '',
                                        nom: '',
                                        prenom: '',
                                        telephone: '',
                                        email: '',
                                        adresse: '',
                                        fonction: 'Membre',
                                        cin: '',
                                        isNew: true
                                    };
                                    handleEditMember(newMember);
                                }, children: [_jsx(UserPlus, { className: "w-4 h-4 mr-2" }), "Ajouter un membre"] }) }), (!gie.membres || gie.membres.length === 0) && !(gie.presidente || gie.presidenteNom) ? (_jsxs("div", { className: "bg-gray-50 rounded-xl p-12 text-center border border-gray-200", children: [_jsx(Users, { className: "w-10 h-10 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500 mb-1", children: "Aucun membre enregistr\u00E9" }), _jsx("p", { className: "text-sm text-gray-400", children: "Le GIE n'a pas encore de membres dans sa base de donn\u00E9es." })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [(gie.presidente || gie.presidenteNom) && !gie.membres?.some(m => m.fonction === 'Présidente') && (_jsxs("div", { className: "rounded-xl border border-purple-200 overflow-hidden shadow-sm md:col-span-2 md:row-span-2 order-first", children: [_jsxs("div", { className: "bg-purple-50 px-4 py-3 border-b border-purple-200 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Shield, { className: "w-5 h-5 text-purple-600" }), _jsx("span", { className: "ml-2 text-sm font-semibold text-purple-700", children: "Pr\u00E9sidente" })] }), _jsx("span", { className: "bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full", children: "Repr\u00E9sentante l\u00E9gale" })] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-semibold text-sm mr-3", children: (gie.presidentePrenom?.charAt(0) || gie.presidente?.prenom?.charAt(0) || '') + (gie.presidenteNom?.charAt(0) || gie.presidente?.nom?.charAt(0) || '') }), _jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-800", children: [gie.presidentePrenom || gie.presidente?.prenom || '', " ", gie.presidenteNom || gie.presidente?.nom || ''] }), _jsx("p", { className: "text-xs text-purple-600", children: "Repr\u00E9sentante l\u00E9gale du GIE" })] })] }), _jsx("button", { onClick: () => handleEditMember({
                                                                _id: gie.presidente?._id || 'presidente',
                                                                nom: gie.presidenteNom || gie.presidente?.nom || '',
                                                                prenom: gie.presidentePrenom || gie.presidente?.prenom || '',
                                                                telephone: gie.presidenteTelephone || gie.presidente?.telephone || '',
                                                                email: gie.presidenteEmail || gie.presidente?.email || '',
                                                                adresse: gie.presidenteAdresse || gie.presidente?.adresse || '',
                                                                fonction: 'Présidente',
                                                                cin: gie.presidenteCIN || ''
                                                            }), className: "p-2 bg-purple-100 hover:bg-purple-200 rounded-full text-purple-700 transition", children: _jsx(Edit, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Phone, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: gie.presidenteTelephone || gie.presidente?.telephone || 'Non renseigné' })] }), (gie.presidenteAdresse || gie.presidente?.adresse) && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: gie.presidenteAdresse || gie.presidente?.adresse })] })), (gie.presidenteEmail || gie.presidente?.email) && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Mail, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: gie.presidenteEmail || gie.presidente?.email })] })), gie.presidenteCIN && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Shield, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: ["CIN: ", gie.presidenteCIN] })] })), _jsxs("div", { className: "mt-3 pt-3 border-t border-gray-100", children: [_jsx("div", { className: "text-xs font-medium text-gray-500 mb-2", children: "Responsabilit\u00E9s:" }), _jsxs("ul", { className: "list-disc list-inside text-xs text-gray-600 space-y-1", children: [_jsx("li", { children: "Repr\u00E9sentation l\u00E9gale" }), _jsx("li", { children: "Coordination des activit\u00E9s" }), _jsx("li", { children: "Gestion administrative" }), _jsx("li", { children: "Prise de d\u00E9cisions importantes" })] })] })] })] }, "presidente")), gie.membres && gie.membres.map((membre) => {
                                    // Déterminer les couleurs et icônes basées sur le rôle
                                    let bgColor = "bg-gray-100";
                                    let textColor = "text-gray-700";
                                    let borderColor = "border-gray-200";
                                    let iconComponent = _jsx(Users, { className: "w-5 h-5" });
                                    if (membre.fonction === 'Présidente') {
                                        bgColor = "bg-purple-50";
                                        textColor = "text-purple-700";
                                        borderColor = "border-purple-200";
                                        iconComponent = _jsx(Shield, { className: "w-5 h-5 text-purple-600" });
                                    }
                                    else if (membre.fonction === 'Secrétaire') {
                                        bgColor = "bg-primary-50";
                                        textColor = "text-primary-700";
                                        borderColor = "border-primary-200";
                                        iconComponent = _jsx(FileText, { className: "w-5 h-5 text-primary-600" });
                                    }
                                    else if (membre.fonction === 'Trésorière') {
                                        bgColor = "bg-green-50";
                                        textColor = "text-green-700";
                                        borderColor = "border-green-200";
                                        iconComponent = _jsx(DollarSign, { className: "w-5 h-5 text-green-600" });
                                    }
                                    const roleName = membre.fonction === 'Présidente'
                                        ? 'Présidente'
                                        : membre.fonction === 'secretaire'
                                            ? 'Secrétaire'
                                            : membre.fonction === 'tresoriere'
                                                ? 'Trésorière'
                                                : 'Membre';
                                    return (_jsxs("div", { className: `rounded-xl border ${borderColor} overflow-hidden shadow-sm ${membre.fonction === 'Présidente' ? 'md:col-span-2 md:row-span-2 order-first' : ''}`, children: [_jsxs("div", { className: `${bgColor} px-4 py-3 border-b ${borderColor} flex justify-between items-center`, children: [_jsxs("div", { className: "flex items-center", children: [iconComponent, _jsx("span", { className: `ml-2 text-sm font-semibold ${textColor}`, children: membre.fonction })] }), membre.fonction === 'Présidente' && (_jsx("span", { className: "bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full", children: "Repr\u00E9sentante l\u00E9gale" }))] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `h-10 w-10 rounded-full ${membre.fonction === 'Présidente' ? 'bg-purple-100 text-purple-800' : 'bg-primary-100 text-primary-700'} flex items-center justify-center font-semibold text-sm mr-3`, children: [membre.prenom.charAt(0), membre.nom.charAt(0)] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-800", children: [membre.prenom, " ", membre.nom] }), membre.fonction === 'Présidente' && (_jsx("p", { className: "text-xs text-purple-600", children: "Repr\u00E9sentante l\u00E9gale du GIE" }))] })] }), _jsx("button", { onClick: () => handleEditMember(membre), className: `p-2 ${membre.fonction === 'Présidente' ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' : 'bg-primary-100 hover:bg-primary-200 text-primary-700'} rounded-full transition`, children: _jsx(Edit, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Phone, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: membre.telephone })] }), membre.fonction === 'Présidente' && (gie.presidenteAdresse || gie.presidente?.adresse) && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: gie.presidenteAdresse || gie.presidente?.adresse })] })), membre.fonction === 'Présidente' && (membre.email || gie.presidenteEmail) && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Mail, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { children: membre.email || gie.presidenteEmail })] })), membre.fonction === 'Présidente' && gie.presidenteCIN && (_jsxs("div", { className: "flex items-center mt-2 text-gray-600 text-sm", children: [_jsx(Shield, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsxs("span", { children: ["CIN: ", gie.presidenteCIN] })] })), membre.fonction === 'Présidente' && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-100", children: [_jsx("div", { className: "text-xs font-medium text-gray-500 mb-2", children: "Responsabilit\u00E9s:" }), _jsxs("ul", { className: "list-disc list-inside text-xs text-gray-600 space-y-1", children: [_jsx("li", { children: "Repr\u00E9sentation l\u00E9gale" }), _jsx("li", { children: "Coordination des activit\u00E9s" }), _jsx("li", { children: "Gestion administrative" }), _jsx("li", { children: "Prise de d\u00E9cisions importantes" })] })] }))] })] }, membre._id));
                                })] }))] }));
            case 'documents':
                return (_jsxs("div", { className: "bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 flex items-center", children: [_jsx(FileText, { className: "w-5 h-5 mr-2 text-primary-600" }), "Documents du GIE"] }), _jsx("div", { className: "flex items-center", children: _jsxs("span", { className: "bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium", children: [gie.documents ? gie.documents.length : 0, " documents"] }) })] }), gie.documentsGeneres && (_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-sm font-semibold mb-3 pb-2 border-b border-gray-100", children: "Documents g\u00E9n\u00E9r\u00E9s" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: `p-3 rounded-lg flex items-center ${gie.documentsGeneres.statuts ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-3 ${gie.documentsGeneres.statuts ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: _jsx(FileText, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Statuts" }), _jsx("p", { className: "text-xs text-gray-500", children: gie.documentsGeneres.statuts ? 'Généré' : 'Non généré' })] })] }), _jsxs("div", { className: `p-3 rounded-lg flex items-center ${gie.documentsGeneres.reglementInterieur ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-3 ${gie.documentsGeneres.reglementInterieur ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: _jsx(FileText, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "R\u00E8glement int\u00E9rieur" }), _jsx("p", { className: "text-xs text-gray-500", children: gie.documentsGeneres.reglementInterieur ? 'Généré' : 'Non généré' })] })] }), _jsxs("div", { className: `p-3 rounded-lg flex items-center ${gie.documentsGeneres.procesVerbal ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-3 ${gie.documentsGeneres.procesVerbal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: _jsx(FileText, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Proc\u00E8s-verbal" }), _jsx("p", { className: "text-xs text-gray-500", children: gie.documentsGeneres.procesVerbal ? 'Généré' : 'Non généré' })] })] }), _jsxs("div", { className: `p-3 rounded-lg flex items-center ${gie.documentsGeneres.demandeAdhesion ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center mr-3 ${gie.documentsGeneres.demandeAdhesion ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: _jsx(FileText, { className: "w-4 h-4" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: "Demande d'adh\u00E9sion" }), _jsx("p", { className: "text-xs text-gray-500", children: gie.documentsGeneres.demandeAdhesion ? 'Généré' : 'Non généré' })] })] })] })] })), !gie.documents || gie.documents.length === 0 ? (_jsxs("div", { className: "bg-gray-50 rounded-xl p-8 text-center border border-gray-200", children: [_jsx(FileText, { className: "w-10 h-10 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500 mb-1", children: "Aucun document t\u00E9l\u00E9charg\u00E9" }), _jsx("p", { className: "text-sm text-gray-400", children: "Le GIE n'a pas encore t\u00E9l\u00E9charg\u00E9 de documents suppl\u00E9mentaires." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: gie.documents.map((document) => {
                                // Déterminer l'icône en fonction du type de document
                                const getFileIcon = () => {
                                    const type = document.type.toLowerCase();
                                    if (type.includes('pdf'))
                                        return _jsx(FileText, { className: "w-10 h-10 text-red-500" });
                                    if (type.includes('image') || type.includes('photo') || type.includes('jpeg') || type.includes('png'))
                                        return _jsx(FileText, { className: "w-10 h-10 text-green-500" });
                                    if (type.includes('doc') || type.includes('word'))
                                        return _jsx(FileText, { className: "w-10 h-10 text-primary-600" });
                                    return _jsx(FileText, { className: "w-10 h-10 text-gray-500" });
                                };
                                return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all", children: [_jsxs("div", { className: "p-5 flex flex-col items-center justify-center text-center border-b border-gray-100", children: [getFileIcon(), _jsx("h4", { className: "font-medium text-gray-800 mt-3 mb-1", children: document.nom }), _jsx("span", { className: "inline-flex text-xs font-medium rounded-full px-3 py-1 bg-primary-100 text-primary-700", children: document.type })] }), _jsxs("div", { className: "bg-gray-50 p-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Ajout\u00E9 le ", new Date(document.dateUpload).toLocaleDateString('fr-FR')] }), _jsxs("a", { href: document.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), "Visualiser"] })] })] }, document._id));
                            }) }))] }));
            case 'historique':
                return (_jsx("div", { className: "bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100", children: _jsx(TransactionHistory, { historique: gie.historique, transactions: gie.transactions, activeTab: historiqueActiveTab, onTabChange: setHistoriqueActiveTab, onTransactionSelect: handleShowTransactionDetails }) }));
            default:
                return null;
        }
    };
    // Modal pour éditer un membre
    const renderMemberEditModal = () => {
        if (!showEditMemberModal || !editingMember)
            return null;
        const isPresidente = editingMember.fonction === 'Présidente';
        return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800", children: editingMember.isNew ? 'Ajouter un nouveau membre' : `Modifier ${isPresidente ? 'la présidente' : 'un membre'}` }), _jsx("button", { onClick: handleCloseEditModal, className: "text-gray-400 hover:text-gray-500", children: _jsx(XCircle, { className: "w-6 h-6" }) })] }), _jsx("div", { className: "p-6", children: _jsxs("form", { onSubmit: (e) => {
                                e.preventDefault();
                                // Récupérer les données du formulaire
                                const formData = new FormData(e.currentTarget);
                                const updatedMemberData = {
                                    nom: formData.get('nom'),
                                    prenom: formData.get('prenom'),
                                    telephone: formData.get('telephone'),
                                    email: formData.get('email'),
                                    adresse: formData.get('adresse'),
                                    fonction: formData.get('fonction'),
                                    cin: formData.get('cin'),
                                    genre: formData.get('genre')
                                };
                                handleUpdateMember(updatedMemberData);
                            }, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "prenom", className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", id: "prenom", name: "prenom", defaultValue: editingMember.prenom, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "nom", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsx("input", { type: "text", id: "nom", name: "nom", defaultValue: editingMember.nom, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "telephone", className: "block text-sm font-medium text-gray-700 mb-1", children: "Num\u00E9ro de t\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", id: "telephone", name: "telephone", defaultValue: editingMember.telephone, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", defaultValue: editingMember.email, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "adresse", className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse" }), _jsx("input", { type: "text", id: "adresse", name: "adresse", defaultValue: editingMember.adresse, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "cin", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Num\u00E9ro CIN ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "cin", name: "cin", defaultValue: editingMember.cin, placeholder: "Ex: 1234567890123", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, minLength: 13, maxLength: 13 })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "genre", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Genre ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { id: "genre", name: "genre", defaultValue: editingMember.genre || 'femme', className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "", children: "-- S\u00E9lectionner --" }), _jsx("option", { value: "femme", children: "Femme" }), _jsx("option", { value: "homme", children: "Homme" }), _jsx("option", { value: "jeune", children: "Jeune" })] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "fonction", className: "block text-sm font-medium text-gray-700 mb-1", children: "Fonction" }), _jsxs("select", { id: "fonction", name: "fonction", defaultValue: editingMember.fonction, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500", required: true, children: [_jsx("option", { value: "Pr\u00E9sidente", children: "Pr\u00E9sidente" }), _jsx("option", { value: "Secr\u00E9taire", children: "Secr\u00E9taire" }), _jsx("option", { value: "Tr\u00E9sori\u00E8re", children: "Tr\u00E9sori\u00E8re" }), _jsx("option", { value: "Membre", children: "Membre simple" })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100", children: [_jsx("button", { type: "button", onClick: handleCloseEditModal, className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsx("button", { type: "submit", disabled: savingMember, className: `px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 ${savingMember ? 'opacity-70 cursor-not-allowed' : ''}`, children: savingMember ? 'Enregistrement...' : (editingMember.isNew ? 'Ajouter' : 'Enregistrer') })] })] }) })] }) }));
    };
    if (loading) {
        return (_jsxs("div", { className: "p-8 flex flex-col items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4" }), _jsx("p", { className: "text-gray-600", children: "Chargement des d\u00E9tails du GIE..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "p-8 flex flex-col items-center justify-center", children: [_jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-4", children: _jsx("p", { children: error }) }), _jsxs("button", { onClick: () => navigate('/admin/dashboard'), className: "flex items-center px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Retour au tableau de bord"] })] }));
    }
    if (!gie) {
        return (_jsxs("div", { className: "p-8 flex flex-col items-center justify-center", children: [_jsx("div", { className: "bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-xl mb-4", children: _jsx("p", { children: "Aucune information trouv\u00E9e pour ce GIE." }) }), _jsxs("button", { onClick: () => navigate('/admin/dashboard'), className: "flex items-center px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Retour au tableau de bord"] })] }));
    }
    return (_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8", children: _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden mb-8", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-primary-500 to-primary-600" }), _jsxs("div", { className: "relative p-6 pt-20", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("button", { onClick: () => navigate('/admin/dashboard'), className: "flex items-center bg-white text-gray-700 hover:text-primary-600 px-4 py-2 rounded-xl shadow-sm border border-gray-200 transition-all", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), _jsx("span", { className: "font-medium", children: "Retour au tableau de bord" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [gie.statutAdhesion === 'validee' && gie.statutEnregistrement === 'valide' ? (_jsxs("span", { className: "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-green-100 text-green-600 shadow-sm", children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-2" }), "GIE actif"] })) : (_jsxs("span", { className: "inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-amber-100 text-amber-600 shadow-sm", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), "En attente d'activation"] })), (gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (_jsxs("button", { onClick: activerAdhesion, className: "flex items-center px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-sm transition-all", children: [_jsx(CheckCircle, { className: "w-4 h-4 mr-2" }), "Activer l'adh\u00E9sion"] }))] })] }), _jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between", children: [_jsxs("div", { className: "flex items-center mb-4 md:mb-0", children: [_jsx("div", { className: "flex items-center justify-center bg-primary-50 text-primary-600 rounded-xl h-16 w-16 mr-4 shadow-sm", children: _jsx(Building, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-1", children: gie.nomGIE }), _jsxs("div", { className: "flex items-center text-primary-600 text-sm font-medium", children: [_jsx(Clipboard, { className: "w-4 h-4 mr-1.5" }), _jsx("span", { children: gie.identifiantGIE })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [_jsxs("div", { className: "flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Localisation" }), _jsxs("p", { className: "text-sm font-medium", children: [gie.detailsGeographiques?.nomRegion || gie.region, ", ", gie.detailsGeographiques?.nomDepartement || gie.departement] })] })] }), _jsxs("div", { className: "flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200", children: [_jsx(Calendar, { className: "w-4 h-4 mr-2 text-primary-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-sm font-medium", children: new Date(gie.dateCreation).toLocaleDateString('fr-FR') })] })] })] })] })] }), _jsx("div", { className: "px-6 pt-4 border-t border-gray-100 bg-primary-50", children: _jsxs("div", { className: "flex overflow-x-auto space-x-2 pb-2", children: [_jsxs("button", { onClick: () => setActiveTab('informations'), className: `px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${activeTab === 'informations'
                                            ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'}`, children: [_jsx(FileText, { className: `w-4 h-4 mr-2 ${activeTab === 'informations' ? 'text-primary-600' : 'text-gray-500'}` }), "Informations g\u00E9n\u00E9rales"] }), _jsxs("button", { onClick: () => setActiveTab('membres'), className: `px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${activeTab === 'membres'
                                            ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'}`, children: [_jsx(Users, { className: `w-4 h-4 mr-2 ${activeTab === 'membres' ? 'text-primary-600' : 'text-gray-500'}` }), "Membres"] }), _jsxs("button", { onClick: () => setActiveTab('documents'), className: `px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${activeTab === 'documents'
                                            ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'}`, children: [_jsx(FileText, { className: `w-4 h-4 mr-2 ${activeTab === 'documents' ? 'text-primary-600' : 'text-gray-500'}` }), "Documents"] }), _jsxs("button", { onClick: () => setActiveTab('historique'), className: `px-4 py-2 rounded-t-lg transition-all whitespace-nowrap flex items-center ${activeTab === 'historique'
                                            ? 'bg-white text-primary-600 font-medium shadow-sm border-t border-l border-r border-gray-200'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-white hover:bg-opacity-50'}`, children: [_jsx(Clock, { className: `w-4 h-4 mr-2 ${activeTab === 'historique' ? 'text-primary-600' : 'text-gray-500'}` }), "Historique"] })] }) })] }), renderTabContent(), renderMemberEditModal()] }) }));
};
export default GIEDetails;
//# sourceMappingURL=GIEDetails.js.map