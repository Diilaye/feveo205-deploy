import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Users, Building, DollarSign, FileText, Settings, LogOut, BarChart3, CheckCircle, TrendingUp, AlertCircle, Eye, Edit, Trash2, Plus, Search, Filter, Bell, UserCheck, Map, Download, ArrowUpRight, MapPin, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';
import ActivityLogsView from './ActivityLogsView';
import ProfileSettings from './admin/ProfileSettings';
import { getRegions, getDepartements, getArrondissements, getCommunes } from '../data/senegalGeography';
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { admin, logout } = useAdminAuthContext();
    const [gieCount, setGieCount] = useState(0);
    const [giesEnAttenteAdhesion, setGiesEnAttenteAdhesion] = useState(0);
    const [utilisateurCount, setUtilisateurCount] = useState(0);
    const [activeTab, setActiveTab] = useState('dashboard');
    // États pour le modal des GIEs en attente
    const [showGiesEnAttenteModal, setShowGiesEnAttenteModal] = useState(false);
    const [giesEnAttenteList, setGiesEnAttenteList] = useState([]);
    const [loadingGiesEnAttente, setLoadingGiesEnAttente] = useState(false);
    // États pour le modal des utilisateurs
    const [showUtilisateursModal, setShowUtilisateursModal] = useState(false);
    const [utilisateursList, setUtilisateursList] = useState([]);
    const [loadingUtilisateurs, setLoadingUtilisateurs] = useState(false);
    const [gies, setGies] = useState([]);
    // Variables pour le composant RegionDepartementReportNew
    const adminToken = localStorage.getItem('adminAuthToken');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
    const [loading, setLoading] = useState(false);
    const [detailedGIEs, setDetailedGIEs] = useState([]);
    const [giesLoading, setGiesLoading] = useState(false);
    const [error, setError] = useState(null);
    // États pour la pagination et la recherche
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Pagination fixée à 10 éléments par page
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCommuneFilter, setSearchCommuneFilter] = useState(""); // Filtre par commune pour la gestion des GIE
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // États pour les rapports
    const [giesByRegion, setGiesByRegion] = useState({});
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [regionSearchResults, setRegionSearchResults] = useState('');
    const [departements, setDepartements] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState("");
    const [arrondissements, setArrondissements] = useState([]);
    const [selectedArrondissement, setSelectedArrondissement] = useState("");
    const [communes, setCommunes] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState("");
    const [communeSearchResults, setCommuneSearchResults] = useState([]);
    const [gieRegistrationData, setGieRegistrationData] = useState([]);
    const [reportTimePeriod, setReportTimePeriod] = useState('30d');
    // États pour l'évolution des adhésions avec statuts actifs/inactifs
    const [adhesionEvolution, setAdhesionEvolution] = useState([]);
    const [adhesionViewType, setAdhesionViewType] = useState('monthly');
    const [loadingAdhesionData, setLoadingAdhesionData] = useState(false);
    const [adhesionChartHeight, setAdhesionChartHeight] = useState(500);
    // États pour le volume d'investissement par trimestre/année
    const [volumeInvestissement, setVolumeInvestissement] = useState([]);
    const [investissementViewType, setInvestissementViewType] = useState('quarterly');
    const [loadingInvestissementData, setLoadingInvestissementData] = useState(false);
    // États pour les rapports GIE Sénégal
    const [rapportGieSenegal, setRapportGieSenegal] = useState(null);
    const [loadingRapport, setLoadingRapport] = useState(false);
    const [errorRapport, setErrorRapport] = useState('');
    const [expandedRegions, setExpandedRegions] = useState(new Set());
    // États pour les données par région
    const [rapportRegionDetails, setRapportRegionDetails] = useState(null);
    const [selectedRegionForDetails, setSelectedRegionForDetails] = useState('');
    const [loadingRegionDetails, setLoadingRegionDetails] = useState(false);
    const [errorRegionDetails, setErrorRegionDetails] = useState('');
    const [expandedDepartements, setExpandedDepartements] = useState(new Set());
    // États pour les arrondissements d'un département spécifique
    const [rapportDepartementArrondissements, setRapportDepartementArrondissements] = useState(null);
    const [selectedDepartementForArrondissements, setSelectedDepartementForArrondissements] = useState({ region: '', departement: '', codeDepartement: '' });
    const [loadingDepartementArrondissements, setLoadingDepartementArrondissements] = useState(false);
    const [errorDepartementArrondissements, setErrorDepartementArrondissements] = useState('');
    const [expandedArrondissements, setExpandedArrondissements] = useState(new Set());
    // États pour les GIE d'un arrondissement spécifique
    const [rapportArrondissementGies, setRapportArrondissementGies] = useState(null);
    const [selectedArrondissementForGies, setSelectedArrondissementForGies] = useState({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '' });
    const [loadingArrondissementGies, setLoadingArrondissementGies] = useState(false);
    const [errorArrondissementGies, setErrorArrondissementGies] = useState('');
    // États pour les GIE d'une commune spécifique
    const [rapportCommuneGies, setRapportCommuneGies] = useState(null);
    const [selectedCommuneForGies, setSelectedCommuneForGies] = useState({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '', commune: '', codeCommune: '' });
    const [loadingCommuneGies, setLoadingCommuneGies] = useState(false);
    const [errorCommuneGies, setErrorCommuneGies] = useState('');
    // États pour les activités récentes
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingRecentActivities, setLoadingRecentActivities] = useState(false);
    // États pour la gestion des utilisateurs
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [utilisateurSearchTerm, setUtilisateurSearchTerm] = useState("");
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState(null);
    // États pour le modal d'activation d'investissement
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [selectedGieId, setSelectedGieId] = useState("");
    const [selectedGieName, setSelectedGieName] = useState("");
    const [investmentDays, setInvestmentDays] = useState(30);
    const [processingInvestment, setProcessingInvestment] = useState(false);
    const [volumeTotal, setVolumeTotal] = useState(0);
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    // Fonction pour récupérer le volume total des transactions réussies
    const fetchVolumeTotal = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/transactions/volume-total`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success && response.data.volumeTotal !== undefined) {
                setVolumeTotal(response.data.volumeTotal);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération du volume total des transactions:', error);
            // En cas d'erreur, on calcule une estimation basée sur les GIEs
            // Hypothèse : chaque jour investi = 6000 FCFA
            try {
                const token = localStorage.getItem('adminAuthToken');
                const giesResponse = await axios.get(`${baseUrl}/admin/gies/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (giesResponse.data && giesResponse.data.success) {
                    const total = giesResponse.data.data.reduce((sum, gie) => {
                        return sum + (gie.daysInvestedSuccess || 0) * 6000;
                    }, 0);
                    setVolumeTotal(total);
                }
            }
            catch (err) {
                console.error('Erreur lors du calcul du volume total alternatif:', err);
            }
        }
    };
    // Fonction pour récupérer les statistiques du dashboard
    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success && response.data.data.stats) {
                const stats = response.data.data.stats;
                setGieCount(stats.gies || 0);
                setGiesEnAttenteAdhesion(stats.giesEnAttenteAdhesion || 0);
                setUtilisateurCount(stats.utilisateurs || 0);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        }
    };
    // Fonction pour récupérer la liste des GIEs en attente d'adhésion
    const fetchGiesEnAttente = async () => {
        try {
            setLoadingGiesEnAttente(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/gies?statutAdhesion=en_attente&limit=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                setGiesEnAttenteList(response.data.data || []);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIEs en attente:', error);
        }
        finally {
            setLoadingGiesEnAttente(false);
        }
    };
    // Fonction pour télécharger la liste en Excel
    const downloadGiesEnAttenteExcel = () => {
        if (giesEnAttenteList.length === 0)
            return;
        // Préparer les données pour Excel
        const excelData = giesEnAttenteList.map(gie => ({
            'Identifiant': gie.identifiantGIE || '',
            'Nom du GIE': gie.nomGIE || '',
            'Région': gie.region || '',
            'Département': gie.departement || '',
            'Commune': gie.commune || '',
            'Présidente Nom': gie.presidenteNom || '',
            'Présidente Prénom': gie.presidentePrenom || '',
            'Téléphone': gie.presidenteTelephone || '',
            'Email': gie.presidenteEmail || '',
            'Date de création': gie.dateCreation ? new Date(gie.dateCreation).toLocaleDateString('fr-FR') : '',
            'Statut': 'En attente'
        }));
        // Créer le contenu CSV
        const headers = Object.keys(excelData[0]);
        const csvContent = [
            headers.join(','),
            ...excelData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        // Créer le blob et télécharger
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `gies_en_attente_adhesion_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };
    // Fonction pour récupérer la liste des utilisateurs pour le modal
    const fetchUtilisateursModal = async () => {
        setLoadingUtilisateurs(true);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/utilisateurs?limit=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                setUtilisateursList(response.data.data || []);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
        finally {
            setLoadingUtilisateurs(false);
        }
    };
    // Fonction pour télécharger la liste des utilisateurs en Excel
    const downloadUtilisateursExcel = () => {
        if (utilisateursList.length === 0)
            return;
        // Préparer les données pour Excel
        const excelData = utilisateursList.map(user => ({
            'Nom': user.nom || '',
            'Prénom': user.prenom || '',
            'Email': user.email || '',
            'Téléphone': user.telephone || '',
            'Rôle': user.role || '',
            'Statut': user.isActive ? 'Actif' : 'Inactif',
            'Date de création': user.dateCreation ? new Date(user.dateCreation).toLocaleDateString('fr-FR') : ''
        }));
        // Créer le contenu CSV
        const headers = Object.keys(excelData[0]);
        const csvContent = [
            headers.join(','),
            ...excelData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        // Créer le blob et télécharger
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };
    // Fonction pour récupérer le nombre de GIE depuis l'API (garde pour compatibilité)
    const fetchGIECount = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/gies/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success && response.data.count !== undefined) {
                setGieCount(response.data.count);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération du nombre de GIE:', error);
        }
    };
    // Fonction pour récupérer la liste des GIEs avec pagination et recherche
    const fetchGIEs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/gies`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: currentPage,
                    limit: itemsPerPage, // Limite fixée à 10 items par page
                    search: searchTerm.trim() || undefined,
                    commune: searchCommuneFilter.trim() || undefined
                }
            });
            console.log('API response:', response.data);
            if (response.data && response.data.success) {
                setGies(response.data.data);
                setTotalItems(response.data.total);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.pages);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIEs:', error);
            setError('Impossible de charger la liste des GIEs. Veuillez réessayer.');
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour activer l'adhésion d'un GIE
    const activerAdhesion = async (gieId) => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.post(`${baseUrl}/admin/gies/${gieId}/activer-adhesion`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des GIEs après l'activation
                fetchGIEs();
                alert('Adhésion activée avec succès');
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'activation de l\'adhésion:', error);
            alert('Erreur lors de l\'activation de l\'adhésion');
        }
    };
    // Fonction pour ouvrir le modal d'activation d'investissement
    const ouvrirModalInvestissement = (gieId, gieName) => {
        setSelectedGieId(gieId);
        setSelectedGieName(gieName);
        setInvestmentDays(30); // Valeur par défaut
        setShowInvestModal(true);
    };
    // Fonction pour activer l'investissement pour un nombre de jours spécifié
    const activerInvestissement = async () => {
        if (!selectedGieId || investmentDays <= 0)
            return;
        setProcessingInvestment(true);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.post(`${baseUrl}/admin/gies/${selectedGieId}/activer-investissement`, {
                dureeJours: investmentDays
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des GIEs après l'activation
                fetchGIEs();
                alert(`Investissement activé pour ${investmentDays} jours avec succès`);
                setShowInvestModal(false);
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'activation de l\'investissement:', error);
            alert('Erreur lors de l\'activation de l\'investissement');
        }
        finally {
            setProcessingInvestment(false);
        }
    };
    // Gestion du changement de page
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // fetchGIEs sera appelé grâce au useEffect qui surveille currentPage
        }
    };
    // Gestion de la recherche
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
        // On ne déclenche pas immédiatement fetchGIEs() car le useEffect s'en chargera
    };
    // Fonction pour récupérer la liste des utilisateurs
    const fetchUtilisateurs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/utilisateurs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                setUtilisateurs(response.data.data);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            setError('Impossible de charger la liste des utilisateurs. Veuillez réessayer.');
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour ajouter un nouvel utilisateur
    const ajouterUtilisateur = async (userData) => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.post(`${baseUrl}/admin/utilisateurs`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des utilisateurs
                fetchUtilisateurs();
                setShowAddUserModal(false);
                alert('Utilisateur ajouté avec succès');
            }
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
            alert('Erreur lors de l\'ajout de l\'utilisateur');
        }
    };
    // Fonction pour modifier un utilisateur existant
    const modifierUtilisateur = async (userId, userData) => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.put(`${baseUrl}/admin/utilisateurs/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des utilisateurs
                fetchUtilisateurs();
                setShowEditUserModal(false);
                setSelectedUtilisateur(null);
                alert('Utilisateur modifié avec succès');
            }
        }
        catch (error) {
            console.error('Erreur lors de la modification de l\'utilisateur:', error);
            alert('Erreur lors de la modification de l\'utilisateur');
        }
    };
    // Fonction pour bloquer/débloquer un utilisateur
    const toggleBlockUtilisateur = async (userId, nouveauStatut) => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.patch(`${baseUrl}/admin/utilisateurs/${userId}/statut`, { statut: nouveauStatut }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des utilisateurs
                fetchUtilisateurs();
                alert(`Utilisateur ${nouveauStatut === 'actif' ? 'débloqué' : 'bloqué'} avec succès`);
            }
        }
        catch (error) {
            console.error(`Erreur lors du changement de statut de l'utilisateur:`, error);
            alert(`Erreur lors du changement de statut de l'utilisateur`);
        }
    };
    // Fonction pour supprimer un utilisateur
    const supprimerUtilisateur = async (userId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?'))
            return;
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.delete(`${baseUrl}/admin/utilisateurs/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                // Rafraîchir la liste des utilisateurs
                fetchUtilisateurs();
                alert('Utilisateur supprimé avec succès');
            }
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            alert('Erreur lors de la suppression de l\'utilisateur');
        }
    };
    // Fonction pour récupérer l'évolution des adhésions par période avec statuts
    const fetchAdhesionEvolution = async (viewType = 'monthly') => {
        setLoadingAdhesionData(true);
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/adhesion-evolution-detailed`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    type: viewType,
                    limit: viewType === 'monthly' ? 12 : 5, // 12 derniers mois ou 5 dernières années
                    includeStatus: true
                }
            });
            if (response.data && response.data.success) {
                setAdhesionEvolution(response.data.data.map(item => ({
                    ...item,
                    type: viewType
                })));
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'évolution des adhésions:', error);
            // Données simulées en cas d'erreur avec statuts actifs/inactifs
            const currentDate = new Date();
            const simulatedData = [];
            if (viewType === 'monthly') {
                // 12 derniers mois
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                    const totalCount = Math.floor(Math.random() * 25) + 10; // Entre 10 et 35 adhésions
                    const actifsCount = Math.floor(totalCount * (0.6 + Math.random() * 0.3)); // 60-90% actifs
                    const inactifsCount = totalCount - actifsCount;
                    simulatedData.push({
                        period: monthName,
                        total: totalCount,
                        actifs: actifsCount,
                        inactifs: inactifsCount,
                        type: 'monthly'
                    });
                }
            }
            else {
                // 5 dernières années
                for (let i = 4; i >= 0; i--) {
                    const year = currentDate.getFullYear() - i;
                    const totalCount = Math.floor(Math.random() * 300) + 100; // Entre 100 et 400 adhésions
                    const actifsCount = Math.floor(totalCount * (0.65 + Math.random() * 0.25)); // 65-90% actifs
                    const inactifsCount = totalCount - actifsCount;
                    simulatedData.push({
                        period: year.toString(),
                        total: totalCount,
                        actifs: actifsCount,
                        inactifs: inactifsCount,
                        type: 'yearly'
                    });
                }
            }
            setAdhesionEvolution(simulatedData);
        }
        finally {
            setLoadingAdhesionData(false);
        }
    };
    // Fonction pour changer le type de vue des adhésions
    const handleAdhesionViewChange = (newViewType) => {
        setAdhesionViewType(newViewType);
        fetchAdhesionEvolution(newViewType);
    };
    // Fonction pour récupérer les données de volume d'investissement
    const fetchVolumeInvestissement = async (viewType = 'quarterly') => {
        try {
            setLoadingInvestissementData(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/volume-investissement-detailed?type=${viewType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data && response.data.success && response.data.data) {
                setVolumeInvestissement(response.data.data.map((item) => ({
                    period: item.period,
                    montant: item.montant,
                    nombreTransactions: item.nombreTransactions,
                    type: viewType
                })));
            }
            else {
                // Données simulées pour le développement si l'API n'est pas encore prête
                const simulatedData = [];
                if (viewType === 'quarterly') {
                    const quarters = ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024'];
                    for (const quarter of quarters) {
                        simulatedData.push({
                            period: quarter,
                            montant: Math.floor(Math.random() * 50000000) + 10000000, // Entre 10M et 60M FCFA
                            nombreTransactions: Math.floor(Math.random() * 100) + 20,
                            type: viewType
                        });
                    }
                }
                else {
                    const years = ['2022', '2023', '2024'];
                    for (const year of years) {
                        simulatedData.push({
                            period: year,
                            montant: Math.floor(Math.random() * 200000000) + 50000000, // Entre 50M et 250M FCFA
                            nombreTransactions: Math.floor(Math.random() * 400) + 100,
                            type: viewType
                        });
                    }
                }
                setVolumeInvestissement(simulatedData);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération du volume d\'investissement:', error);
            // Données simulées de fallback
            const simulatedData = [];
            if (viewType === 'quarterly') {
                const quarters = ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024'];
                for (const quarter of quarters) {
                    simulatedData.push({
                        period: quarter,
                        montant: Math.floor(Math.random() * 50000000) + 10000000,
                        nombreTransactions: Math.floor(Math.random() * 100) + 20,
                        type: viewType
                    });
                }
            }
            else {
                const years = ['2022', '2023', '2024'];
                for (const year of years) {
                    simulatedData.push({
                        period: year,
                        montant: Math.floor(Math.random() * 200000000) + 50000000,
                        nombreTransactions: Math.floor(Math.random() * 400) + 100,
                        type: viewType
                    });
                }
            }
            setVolumeInvestissement(simulatedData);
        }
        finally {
            setLoadingInvestissementData(false);
        }
    };
    // Fonction pour changer le type de vue des investissements
    const handleInvestissementViewChange = (newViewType) => {
        setInvestissementViewType(newViewType);
        fetchVolumeInvestissement(newViewType);
    };
    const fetchGIEsByRegion = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/gies-by-region`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    period: reportTimePeriod
                }
            });
            if (response.data && response.data.success) {
                setGiesByRegion(response.data.data);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIEs par région:', error);
            // En cas d'erreur, on utilise des données simulées
            setGiesByRegion({
                'Dakar': 25,
                'Thiès': 18,
                'Saint-Louis': 12,
                'Ziguinchor': 8,
                'Kaolack': 10,
                'Diourbel': 7,
                'Fatick': 5,
                'Kaffrine': 3,
                'Kédougou': 2,
                'Kolda': 6,
                'Louga': 4,
                'Matam': 3,
                'Sédhiou': 3,
                'Tambacounda': 4
            });
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour récupérer la liste détaillée des GIEs
    const fetchDetailedGIEs = async () => {
        try {
            setGiesLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            // Paramètres pour la pagination et la recherche
            const params = {
                page: currentPage,
                limit: itemsPerPage,
            };
            // Ajout du terme de recherche s'il existe
            if (searchTerm) {
                params.search = searchTerm;
            }
            // Ajout des filtres de localité si sélectionnés
            if (selectedRegion) {
                params.region = selectedRegion;
            }
            if (selectedDepartement) {
                params.departement = selectedDepartement;
            }
            if (selectedArrondissement) {
                params.arrondissement = selectedArrondissement;
            }
            if (selectedCommune) {
                params.commune = selectedCommune;
            }
            // Sélection de l'endpoint approprié en fonction des filtres géographiques
            let endpoint = '/admin/reports/gies-by-region';
            if (selectedRegion) {
                // Si une région est sélectionnée, obtenir les départements
                endpoint = '/admin/reports/gies-by-region-departement';
                if (selectedDepartement && !selectedArrondissement) {
                    // Si un département est sélectionné, obtenir les arrondissements
                    endpoint = '/admin/reports/gies-by-region-departement-arrondissement';
                }
                else if (selectedDepartement && selectedArrondissement) {
                    // Si un arrondissement est sélectionné, obtenir les communes
                    endpoint = '/admin/reports/gies-by-region-departement-arrondissement-commune';
                }
            }
            const response = await axios.get(`${baseUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            });
            if (response.data?.success) {
                if (response.data.gies) {
                    setDetailedGIEs(response.data.gies);
                    setTotalItems(response.data.totalGies || response.data.gies.length);
                    setTotalPages(Math.ceil((response.data.totalGies || response.data.gies.length) / itemsPerPage));
                    setError(null);
                }
                else {
                    console.error('Aucune liste de GIEs trouvée dans la réponse');
                    setError('La liste des GIEs est vide');
                    setDetailedGIEs([]);
                }
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIEs:', error);
            setError('Impossible de récupérer la liste des GIEs');
            // Simulation de données en cas d'erreur
            const mockGIEs = Array.from({ length: 5 }, (_, index) => {
                const regions = ["DAKAR", "THIES", "SAINT-LOUIS", "KAOLACK", "ZIGUINCHOR"];
                const communes = ["Médina", "Parcelles Assainies", "Pikine", "Rufisque", "Guédiawaye"];
                const statuts = ["validee", "en_attente", "rejetee"];
                return {
                    _id: `gie-${index + 1}`,
                    identifiantGIE: `FEVEO-${(index + 1).toString().padStart(2, '0')}-23-01-${(index + 1).toString().padStart(3, '0')}`,
                    nomGIE: `GIE Femmes Solidaires ${index + 1}`,
                    region: regions[Math.floor(Math.random() * regions.length)],
                    departement: "Departement Test",
                    commune: communes[Math.floor(Math.random() * communes.length)],
                    statutAdhesion: statuts[Math.floor(Math.random() * statuts.length)],
                    statutEnregistrement: statuts[Math.floor(Math.random() * statuts.length)],
                    presidente: {
                        nom: "Ndiaye",
                        prenom: `Fatou ${index + 1}`,
                    },
                    dateCreation: new Date().toISOString()
                };
            });
            setDetailedGIEs(mockGIEs);
            setTotalItems(42); // Simulation du nombre total
            setTotalPages(Math.ceil(42 / itemsPerPage));
        }
        finally {
            setGiesLoading(false);
        }
    };
    // Gestion de la recherche pour les GIEs détaillés
    const handleGIESearch = (event) => {
        setSearchTerm(event.target.value);
    };
    // Fonction pour rechercher les GIEs par localité (région, département, arrondissement ou commune)
    const searchGIEsByLocalite = async () => {
        const params = {
            period: reportTimePeriod
        };
        if (selectedRegion) {
            params.region = selectedRegion;
        }
        if (selectedDepartement) {
            params.departement = selectedDepartement;
        }
        if (selectedArrondissement) {
            params.arrondissement = selectedArrondissement;
        }
        if (selectedCommune) {
            params.commune = selectedCommune;
        }
        if (!selectedRegion && !selectedDepartement && !selectedArrondissement && !selectedCommune) {
            setCommuneSearchResults([]);
            setDetailedGIEs([]);
            setTotalItems(0);
            setTotalPages(0);
            return;
        }
        console.log('Recherche de GIEs avec les paramètres:', params); // Sélection de l'endpoint en fonction des critères de recherche
        let endpoint = '/admin/reports/gies-by-region';
        if (selectedRegion) {
            // Si une région est sélectionnée, obtenir les départements
            endpoint = '/admin/reports/gies-by-region-departement';
            if (selectedDepartement && !selectedArrondissement) {
                // Si un département est sélectionné, obtenir les arrondissements
                endpoint = '/admin/reports/gies-by-region-departement-arrondissement';
            }
            else if (selectedDepartement && selectedArrondissement && !selectedCommune) {
                // Si un arrondissement est sélectionné, obtenir les communes
                endpoint = '/admin/reports/gies-by-region-departement-arrondissement-commune';
            }
            else if (selectedDepartement && selectedArrondissement && selectedCommune) {
                // Si tous sont sélectionnés, obtenir la liste complète
                endpoint = '/admin/reports/gies-complete-list';
            }
        }
        console.log(`Appel de l'endpoint: ${endpoint} avec les paramètres:`, params);
        try {
            setLoading(true);
            setGiesLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            // Requête pour les statistiques agrégées et la liste des GIEs
            const response = await axios.get(`${baseUrl}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ...params,
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm
                }
            });
            // Traitement des résultats statistiques
            if (response.data?.success) {
                let results = [];
                // Traitement des données en fonction de l'endpoint utilisé
                if (endpoint === '/admin/reports/gies-complete-list') {
                    // Pour gies-complete-list, nous avons des objets GIE complets
                    const giesByCommune = {};
                    const giesByRegion = {};
                    response.data.data.forEach((gie) => {
                        // Pour le comptage par commune
                        if (!giesByCommune[gie.commune]) {
                            giesByCommune[gie.commune] = 0;
                        }
                        giesByCommune[gie.commune]++;
                        // Pour le regroupement par région
                        if (!giesByRegion[gie.commune]) {
                            giesByRegion[gie.commune] = { region: gie.region, count: 0 };
                        }
                        giesByRegion[gie.commune].count++;
                    });
                    // Transformer en format attendu par le state
                    results = Object.entries(giesByCommune).map(([commune, count]) => ({
                        commune,
                        region: giesByRegion[commune]?.region || selectedRegion || '',
                        count
                    }));
                }
                else if (endpoint === '/admin/reports/gies-by-region-departement-arrondissement-commune') {
                    // Structure hiérarchique: region > departement > arrondissement > commune > count
                    const data = response.data.data;
                    for (const region in data) {
                        for (const departement in data[region]) {
                            for (const arrondissement in data[region][departement]) {
                                for (const commune in data[region][departement][arrondissement]) {
                                    results.push({
                                        region,
                                        commune,
                                        count: data[region][departement][arrondissement][commune]
                                    });
                                }
                            }
                        }
                    }
                }
                else if (endpoint === '/admin/reports/gies-by-region-departement-arrondissement') {
                    // Structure hiérarchique: region > departement > arrondissement > count
                    const data = response.data.data;
                    for (const region in data) {
                        for (const departement in data[region]) {
                            for (const arrondissement in data[region][departement]) {
                                results.push({
                                    region,
                                    commune: `${arrondissement} (${departement})`,
                                    count: data[region][departement][arrondissement]
                                });
                            }
                        }
                    }
                }
                else if (endpoint === '/admin/reports/gies-by-region-departement') {
                    // Structure hiérarchique: region > departement > count
                    const data = response.data.data;
                    console.log('Données reçues pour gies-by-region-departement:', data);
                    setRegionSearchResults("success");
                    for (const region in data) {
                        console.log(`Traitement de la région: ${region}`);
                        // Si une région est sélectionnée, on n'affiche que ses départements
                        if (!selectedRegion || selectedRegion === region) {
                            for (const departement in data[region]) {
                                // Trouver le nom du département (si disponible dans les données)
                                const departementObj = getDepartements(region).find(d => d.code === departement || d.nom === departement);
                                const displayName = departementObj ? departementObj.nom : departement;
                                results.push({
                                    region,
                                    commune: departement, // Conserver le code du département comme identifiant
                                    count: data[region][departement],
                                    displayName: displayName // Nom d'affichage du département
                                });
                            }
                        }
                    }
                }
                else {
                    // Pour gies-by-region, structure simple: region > count
                    const data = response.data.data;
                    results = Object.entries(data).map(([region, count]) => ({
                        region,
                        commune: region,
                        count: count
                    }));
                }
                setCommuneSearchResults(results);
                const data = response.data.data;
                // Traiter la liste des GIEs de la réponse
                if (data?.gies) {
                    setDetailedGIEs(data.gies);
                    setTotalItems(data.totalGies || data.gies.length);
                    setTotalPages(Math.ceil((data.totalGies || data.gies.length) / itemsPerPage));
                    setError(null);
                }
                else {
                    console.error('Aucune liste de GIEs trouvée dans la réponse');
                    // En cas d'absence de données, on utilise des données simulées pour la liste des GIEs
                    generateMockGIEsList();
                }
            }
            else {
                setCommuneSearchResults([]);
            }
        }
        catch (error) {
            console.error(`Erreur lors de la recherche des GIEs avec l'endpoint ${endpoint}:`, error);
            // En cas d'erreur, on utilise des données simulées adaptées selon les critères de sélection
            let simulatedResults = [];
            // Générer également une liste simulée de GIEs
            generateMockGIEsList();
            if (selectedRegion) {
                const region = selectedRegion;
                if (selectedDepartement) {
                    const departement = selectedDepartement;
                    if (selectedArrondissement) {
                        const arrondissement = selectedArrondissement;
                        if (selectedCommune) {
                            // Simulation pour commune spécifique
                            simulatedResults = [
                                { commune: selectedCommune, region, count: Math.floor(Math.random() * 10) + 1 }
                            ];
                        }
                        else {
                            // Simulation pour arrondissement
                            simulatedResults = [
                                { commune: `${arrondissement} - Commune 1`, region, count: Math.floor(Math.random() * 8) + 1 },
                                { commune: `${arrondissement} - Commune 2`, region, count: Math.floor(Math.random() * 5) + 1 }
                            ];
                        }
                    }
                    else {
                        // Simulation pour département
                        simulatedResults = [
                            { commune: `${departement} - Arr. 1`, region, count: Math.floor(Math.random() * 12) + 1 },
                            { commune: `${departement} - Arr. 2`, region, count: Math.floor(Math.random() * 8) + 1 }
                        ];
                    }
                }
                else {
                    // Simulation pour région
                    simulatedResults = [
                        { commune: `${region} - Dept. 1`, region, count: Math.floor(Math.random() * 15) + 5 },
                        { commune: `${region} - Dept. 2`, region, count: Math.floor(Math.random() * 10) + 3 }
                    ];
                }
            }
            else {
                // Simulation générale
                simulatedResults = [
                    { commune: 'Dakar-Plateau', region: 'DAKAR', count: 8 },
                    { commune: 'Médina', region: 'DAKAR', count: 6 },
                    { commune: 'Grand Dakar', region: 'DAKAR', count: 5 }
                ];
            }
            setCommuneSearchResults(simulatedResults);
            // Générer aussi des données simulées pour la liste des GIEs
            generateMockGIEsList();
        }
        finally {
            setLoading(false);
            setGiesLoading(false);
        }
    };
    // Fonction pour générer des données simulées pour la liste des GIEs
    const generateMockGIEsList = () => {
        // Nombre de GIEs simulés basé sur la sélection géographique
        let mockCount = 5;
        if (selectedRegion) {
            mockCount = selectedDepartement ? (selectedArrondissement ? (selectedCommune ? 3 : 5) : 8) : 12;
        }
        const mockGIEs = Array.from({ length: mockCount }, (_, index) => {
            // Utiliser les valeurs sélectionnées si disponibles, sinon valeurs aléatoires
            const regions = ["DAKAR", "THIES", "SAINT-LOUIS", "KAOLACK", "ZIGUINCHOR"];
            const communes = ["Médina", "Parcelles Assainies", "Pikine", "Rufisque", "Guédiawaye"];
            const statuts = ["validee", "en_attente", "rejetee"];
            const region = selectedRegion || regions[Math.floor(Math.random() * regions.length)];
            const commune = selectedCommune || communes[Math.floor(Math.random() * communes.length)];
            return {
                _id: `gie-${index + 1}`,
                identifiantGIE: `FEVEO-${region.substring(0, 2)}-${(index + 1).toString().padStart(2, '0')}-23-${(index + 1).toString().padStart(3, '0')}`,
                nomGIE: `GIE ${commune} Solidarité ${index + 1}`,
                region: region,
                departement: selectedDepartement || "Département Test",
                commune: commune,
                statutAdhesion: statuts[Math.floor(Math.random() * statuts.length)],
                statutEnregistrement: statuts[Math.floor(Math.random() * statuts.length)],
                presidente: {
                    nom: "Ndiaye",
                    prenom: `Fatou ${index + 1}`,
                },
                dateCreation: new Date().toISOString()
            };
        });
        setDetailedGIEs(mockGIEs);
        setTotalItems(mockCount * 4); // Simulation d'un nombre total plus grand
        setTotalPages(Math.ceil((mockCount * 4) / itemsPerPage));
        setError(null);
    };
    // Fonction pour récupérer les départements d'une région depuis l'API
    const fetchDepartements = async (region) => {
        if (!region) {
            setDepartements([]);
            setSelectedDepartement("");
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/gies-by-region-departement`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    region: region,
                    period: reportTimePeriod
                }
            });
            if (response.data && response.data.success) {
                setRegionSearchResults("success");
                const regionData = response.data.data[region] || {};
                const deptData = Object.keys(regionData).map(dept => ({
                    nom: dept,
                    code: dept.substring(0, 2) // Utilisation des 2 premiers caractères comme code temporaire
                }));
                setDepartements(deptData);
            }
            else {
                setDepartements([]);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des départements:', error);
            // En cas d'erreur, on utilise des données simulées basées sur la région
            if (region === 'DAKAR') {
                setDepartements([
                    { nom: 'Dakar', code: '01' },
                    { nom: 'Pikine', code: '02' },
                    { nom: 'Rufisque', code: '03' },
                    { nom: 'Guédiawaye', code: '04' }
                ]);
            }
            else if (region === 'THIES') {
                setDepartements([
                    { nom: 'Thiès', code: '05' },
                    { nom: 'Tivaouane', code: '06' },
                    { nom: 'Mbour', code: '07' }
                ]);
            }
            else {
                setDepartements([
                    { nom: `Département de ${region} 1`, code: '10' },
                    { nom: `Département de ${region} 2`, code: '20' }
                ]);
            }
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour récupérer les arrondissements d'un département depuis l'API
    const fetchArrondissements = async (departement) => {
        if (!selectedRegion || !departement) {
            setArrondissements([]);
            setSelectedArrondissement("");
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/gies-by-region-departement-arrondissement`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    region: selectedRegion,
                    departement: departement,
                    period: reportTimePeriod
                }
            });
            if (response.data && response.data.success) {
                const regionData = response.data.data[selectedRegion] || {};
                const deptData = regionData[departement] || {};
                const arrData = Object.keys(deptData).map(arr => ({
                    nom: arr,
                    code: arr.substring(0, 2) // Utilisation des 2 premiers caractères comme code temporaire
                }));
                setArrondissements(arrData);
            }
            else {
                setArrondissements([]);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des arrondissements:', error);
            // En cas d'erreur, on utilise des données simulées basées sur le département
            if (departement === 'Dakar') {
                setArrondissements([
                    { nom: 'Plateau', code: '01' },
                    { nom: 'Médina', code: '02' },
                    { nom: 'Grand Dakar', code: '03' },
                    { nom: 'Almadies', code: '04' }
                ]);
            }
            else {
                setArrondissements([
                    { nom: `Arrondissement de ${departement} 1`, code: '01' },
                    { nom: `Arrondissement de ${departement} 2`, code: '02' }
                ]);
            }
        }
        finally {
            setLoading(false);
        }
    };
    // Fonction pour récupérer les communes d'un arrondissement depuis l'API
    const fetchCommunes = async (arrondissement) => {
        if (!selectedRegion || !selectedDepartement || !arrondissement) {
            setCommunes([]);
            setSelectedCommune("");
            return;
        }
        try {
            setLoading(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/gies-by-region-departement-arrondissement-commune`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    region: selectedRegion,
                    departement: selectedDepartement,
                    arrondissement: arrondissement,
                    period: reportTimePeriod
                }
            });
            if (response.data && response.data.success) {
                const regionData = response.data.data[selectedRegion] || {};
                const deptData = regionData[selectedDepartement] || {};
                const arrData = deptData[arrondissement] || {};
                const communesData = Object.keys(arrData).map(commune => ({
                    nom: commune,
                    code: commune.substring(0, 2) // Utilisation des 2 premiers caractères comme code temporaire
                }));
                setCommunes(communesData);
            }
            else {
                setCommunes([]);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des communes:', error);
            // En cas d'erreur, on utilise des données simulées basées sur l'arrondissement
            if (arrondissement === 'Plateau') {
                setCommunes([
                    { nom: 'Dakar-Plateau', code: '01' },
                    { nom: 'Fann-Point E-Amitié', code: '02' },
                    { nom: 'Gueule Tapée-Fass-Colobane', code: '03' }
                ]);
            }
            else if (arrondissement === 'Médina') {
                setCommunes([
                    { nom: 'Médina', code: '04' },
                    { nom: 'Gibraltar', code: '05' },
                    { nom: 'Rebeuss', code: '06' }
                ]);
            }
            else {
                setCommunes([
                    { nom: `Commune de ${arrondissement} 1`, code: '10' },
                    { nom: `Commune de ${arrondissement} 2`, code: '20' }
                ]);
            }
        }
        finally {
            setLoading(false);
        }
    };
    // Gestion du changement de période pour les rapports
    const handlePeriodChange = (period) => {
        setReportTimePeriod(period);
        // Les fonctions seront appelées par le useEffect qui surveille reportTimePeriod
    };
    // Fonction pour charger toutes les communes avec le nombre de GIE
    const fetchAllCommunes = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/admin/reports/gies-by-region-departement-arrondissement-commune`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && response.data.success) {
                const communesData = [];
                const data = response.data.data;
                // Parcourir toutes les régions, départements, arrondissements et communes
                Object.keys(data).forEach(region => {
                    Object.keys(data[region]).forEach(departement => {
                        Object.keys(data[region][departement]).forEach(arrondissement => {
                            Object.keys(data[region][departement][arrondissement]).forEach(commune => {
                                const count = data[region][departement][arrondissement][commune];
                                communesData.push({
                                    nom: commune,
                                    code: commune.substring(0, 2),
                                    commune: commune,
                                    count: count
                                });
                            });
                        });
                    });
                });
                // Trier par nom de commune
                communesData.sort((a, b) => a.commune.localeCompare(b.commune));
                setCommunes(communesData);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des communes:', error);
        }
    };
    // Effectuer la requête au chargement du composant et à chaque changement de pagination ou du terme de recherche
    useEffect(() => {
        fetchDashboardStats(); // Récupère les stats incluant GIEs en attente d'adhésion
        fetchVolumeTotal();
        // Charger les données en fonction de l'onglet actif
        if (activeTab === 'dashboard') {
            fetchAdhesionEvolution(adhesionViewType);
            fetchVolumeInvestissement(investissementViewType);
            fetchRecentActivities();
        }
        else if (activeTab === 'gie') {
            fetchGIEs();
            fetchAllCommunes(); // Charger la liste des communes pour le filtre
        }
        else if (activeTab === 'users') {
            fetchUtilisateurs();
        }
        else if (activeTab === 'reports') {
            setRegions(getRegions());
            fetchGIEsByRegion();
            fetchDetailedGIEs(); // Charger la liste détaillée des GIEs
        }
    }, [activeTab, currentPage, searchTerm, searchCommuneFilter, reportTimePeriod, adhesionViewType, investissementViewType]); // Ajout de investissementViewType et searchCommuneFilter aux dépendances
    // Effect pour charger les départements quand une région est sélectionnée
    useEffect(() => {
        if (activeTab === 'reports' && selectedRegion) {
            //fetchDepartements(selectedRegion);
        }
    }, [activeTab, selectedRegion]);
    // Fonction pour récupérer les données du rapport GIE Sénégal
    const fetchRapportGieSenegal = async () => {
        try {
            setLoadingRapport(true);
            setErrorRapport('');
            const response = await axios.get(`${baseUrl}/rapports/gie-senegal`);
            if (response.data && response.data.data) {
                setRapportGieSenegal(response.data);
            }
            else {
                setErrorRapport('Aucune donnée trouvée');
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération du rapport GIE Sénégal:', error);
            setErrorRapport('Erreur lors du chargement des données');
        }
        finally {
            setLoadingRapport(false);
        }
    };
    // Fonction pour récupérer les données d'une région spécifique
    const fetchRapportRegionDetails = async (regionCode) => {
        setLoadingRegionDetails(true);
        setErrorRegionDetails('');
        setSelectedRegionForDetails(regionCode);
        try {
            const response = await axios.get(`${baseUrl}/rapports/gie-senegal-regions?codeRegions=${regionCode}`);
            console.log('Données région reçues:', response.data);
            setRapportRegionDetails(response.data);
            // Cacher les données générales du Sénégal
            setRapportGieSenegal(null);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des détails de la région:', error);
            setErrorRegionDetails(`Impossible de charger les détails de la région ${regionCode}`);
        }
        finally {
            setLoadingRegionDetails(false);
        }
    };
    // Fonction pour récupérer les arrondissements d'un département spécifique
    const fetchRapportDepartementArrondissements = async (region, codeDepartement, departementNom = '') => {
        setLoadingDepartementArrondissements(true);
        setErrorDepartementArrondissements('');
        setSelectedDepartementForArrondissements({ region, departement: departementNom, codeDepartement });
        try {
            const response = await axios.get(`${baseUrl}/rapports/gie-senegal-region-departement?codeRegion=${region}&codeDepartement=${codeDepartement}`);
            console.log('Données arrondissements reçues:', response.data);
            setRapportDepartementArrondissements(response.data);
            // Cacher les autres données
            setRapportGieSenegal(null);
            setRapportRegionDetails(null);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des arrondissements du département:', error);
            setErrorDepartementArrondissements(`Impossible de charger les arrondissements du département ${departementNom || codeDepartement} de la région ${region}`);
        }
        finally {
            setLoadingDepartementArrondissements(false);
        }
    };
    // Fonction pour récupérer les GIE d'un arrondissement spécifique
    const fetchRapportArrondissementGies = async (region, codeDepartement, codeArrondissement, departementNom = '', arrondissementNom = '') => {
        setLoadingArrondissementGies(true);
        setErrorArrondissementGies('');
        setSelectedArrondissementForGies({ region, departement: departementNom, codeDepartement, arrondissement: arrondissementNom, codeArrondissement });
        try {
            const response = await axios.get(`${baseUrl}/rapports/gie-senegal-arrondissement?codeRegion=${region}&codeDepartement=${codeDepartement}&codeArrondissement=${codeArrondissement}`);
            console.log('Données GIE arrondissement reçues:', response.data);
            setRapportArrondissementGies(response.data);
            // Cacher les autres données
            setRapportGieSenegal(null);
            setRapportRegionDetails(null);
            setRapportDepartementArrondissements(null);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIE de l\'arrondissement:', error);
            setErrorArrondissementGies(`Impossible de charger les GIE de l'arrondissement ${arrondissementNom || codeArrondissement} du département ${departementNom || codeDepartement} de la région ${region}`);
        }
        finally {
            setLoadingArrondissementGies(false);
        }
    };
    // Fonction pour récupérer les GIE d'une commune spécifique
    const fetchRapportCommuneGies = async (region, codeDepartement, codeArrondissement, codeCommune, departementNom = '', arrondissementNom = '', communeNom = '') => {
        setLoadingCommuneGies(true);
        setErrorCommuneGies('');
        setSelectedCommuneForGies({ region, departement: departementNom, codeDepartement, arrondissement: arrondissementNom, codeArrondissement, commune: communeNom, codeCommune });
        try {
            // Utiliser les codes numériques pour l'API (région 01 = DAKAR)
            const regionCode = region === 'DAKAR' ? '01' : region;
            console.log('Appel API pour commune:', { regionCode, codeDepartement, codeArrondissement, codeCommune });
            const response = await axios.get(`${baseUrl}/rapports/gie-senegal-commune?codeRegion=${regionCode}&codeDepartement=${codeDepartement}&codeArrondissement=${codeArrondissement}&codeCommune=${codeCommune}`);
            console.log('Status de la réponse:', response.status);
            console.log('Headers de la réponse:', response.headers);
            console.log('Données GIE commune reçues:', response.data);
            console.log('Type de response.data:', typeof response.data);
            // Vérifier si les données sont valides
            if (response.data && response.status === 200) {
                console.log('Définition de rapportCommuneGies avec:', response.data);
                setRapportCommuneGies(response.data);
                // Cacher les autres données
                setRapportGieSenegal(null);
                setRapportRegionDetails(null);
                setRapportDepartementArrondissements(null);
                setRapportArrondissementGies(null);
                console.log('Données commune définies avec succès');
            }
            else {
                console.log('Réponse inattendue:', response);
                throw new Error(`Réponse inattendue du serveur: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des GIE de la commune:', error);
            console.error('Détails de l\'erreur:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            setErrorCommuneGies(`Impossible de charger les GIE de la commune ${communeNom || codeCommune} de l'arrondissement ${arrondissementNom || codeArrondissement} du département ${departementNom || codeDepartement} de la région ${region}. Erreur: ${error.message}`);
        }
        finally {
            setLoadingCommuneGies(false);
        }
    };
    // Effect pour charger les données du rapport GIE Sénégal quand l'onglet reports est activé
    useEffect(() => {
        if (activeTab === 'reports') {
            fetchRapportGieSenegal();
        }
    }, [activeTab]);
    // Effect pour charger les arrondissements quand un département est sélectionné
    useEffect(() => {
        if (activeTab === 'reports' && selectedDepartement) {
            // fetchArrondissements(selectedDepartement);
        }
    }, [activeTab, selectedRegion, selectedDepartement]);
    // Effect pour charger les communes quand un arrondissement est sélectionné
    useEffect(() => {
        if (activeTab === 'reports' && selectedArrondissement) {
            //fetchCommunes(selectedArrondissement);
        }
    }, [activeTab, selectedRegion, selectedDepartement, selectedArrondissement]);
    const adminStats = [
        { label: 'GIE Enregistré', value: (gieCount || 0).toString(), icon: Building, color: 'blue-900', trend: '' },
        { label: 'Utilisateurs', value: (utilisateurCount || 0).toString(), icon: Users, color: 'green-500', trend: '' },
        { label: 'Adhésions en attente', value: (giesEnAttenteAdhesion || 0).toString(), icon: FileText, color: 'orange-500', trend: '' },
        { label: 'Volume total', value: `${(volumeTotal || 0).toLocaleString()} FCFA`, icon: DollarSign, color: 'purple-500', trend: '' }
    ];
    const pendingTasks = [];
    // Fonction pour charger les 5 activités récentes
    const fetchRecentActivities = async () => {
        try {
            setLoadingRecentActivities(true);
            const token = localStorage.getItem('adminAuthToken');
            const response = await axios.get(`${baseUrl}/logs/recent?limit=5`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                // L'API retourne { success: true, data: [...] } et non { success: true, logs: [...] }
                setRecentActivities(response.data.data || []);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des activités récentes:', error);
        }
        finally {
            setLoadingRecentActivities(false);
        }
    };
    // Fonction pour obtenir l'icône et la couleur selon l'action
    const getActivityIcon = (action) => {
        if (action.includes('login'))
            return { icon: UserCheck, color: 'blue' };
        if (action.includes('consultation'))
            return { icon: Eye, color: 'green' };
        if (action.includes('activation'))
            return { icon: CheckCircle, color: 'green' };
        if (action.includes('creation'))
            return { icon: Plus, color: 'blue' };
        if (action.includes('modification'))
            return { icon: Edit, color: 'amber' };
        if (action.includes('suppression'))
            return { icon: Trash2, color: 'red' };
        return { icon: FileText, color: 'gray' };
    };
    // Fonction pour formater la date relative
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60)
            return 'À l\'instant';
        if (diffInSeconds < 3600)
            return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
        if (diffInSeconds < 86400)
            return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800)
            return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };
    const renderDashboardContent = () => {
        switch (activeTab) {
            case 'users':
                return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-gray-100", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "w-1/3", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher par nom, pr\u00E9nom ou email...", className: "w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all", value: utilisateurSearchTerm, onChange: (e) => setUtilisateurSearchTerm(e.target.value) }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none", children: _jsx(Search, { className: "w-4 h-4 text-gray-400" }) })] }) }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => setShowAddUserModal(true), className: "px-4 py-2.5 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center space-x-2 transition-all", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Ajouter un utilisateur" })] }), _jsxs("button", { onClick: () => {
                                                            setUtilisateurSearchTerm('');
                                                            fetchUtilisateurs();
                                                        }, className: "px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: "R\u00E9initialiser" })] })] })] }) }), loading ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "Chargement en cours..." }) })) : error ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("p", { className: "text-red-500", children: error }), _jsx("button", { onClick: () => fetchUtilisateurs(), className: "mt-4 px-4 py-2 bg-primary-600 text-white rounded-md", children: "R\u00E9essayer" })] })) : (_jsx(_Fragment, { children: utilisateurs.length === 0 ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "Aucun utilisateur trouv\u00E9" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs uppercase bg-gray-50 text-gray-600", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 font-medium", children: "Nom" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Email" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "R\u00F4le" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Statut" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Date de cr\u00E9ation" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: utilisateurs
                                                        .filter(user => {
                                                        if (!utilisateurSearchTerm)
                                                            return true;
                                                        const searchLower = utilisateurSearchTerm.toLowerCase();
                                                        return (user.nom?.toLowerCase().includes(searchLower) ||
                                                            user.prenom?.toLowerCase().includes(searchLower) ||
                                                            user.email?.toLowerCase().includes(searchLower));
                                                    })
                                                        .map((user) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "px-6 py-4", children: [user.prenom, " ", user.nom] }), _jsx("td", { className: "px-6 py-4", children: user.email }), _jsx("td", { className: "px-6 py-4", children: user.telephone || '-' }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-3 py-1 ${user.role === 'admin'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : user.role === 'moderateur'
                                                                            ? 'bg-purple-100 text-purple-700'
                                                                            : user.role === 'gie_president'
                                                                                ? 'bg-blue-100 text-blue-700'
                                                                                : 'bg-green-100 text-green-700'}`, children: user.role === 'admin'
                                                                        ? 'Admin'
                                                                        : user.role === 'moderateur'
                                                                            ? 'Modérateur'
                                                                            : user.role === 'gie_president'
                                                                                ? 'Présidente'
                                                                                : 'Opérateur' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-3 py-1 ${user.statut === 'actif'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : user.statut === 'suspendu'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-amber-100 text-amber-700'}`, children: user.statut === 'actif'
                                                                        ? 'Actif'
                                                                        : user.statut === 'suspendu'
                                                                            ? 'Bloqué'
                                                                            : 'Inactif' }) }), _jsx("td", { className: "px-6 py-4", children: user.dateCreation ? new Date(user.dateCreation).toLocaleDateString('fr-FR') : '-' }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { className: "p-1.5 text-gray-400 hover:text-primary-600 transition-colors", onClick: () => {
                                                                                setSelectedUtilisateur(user);
                                                                                setShowEditUserModal(true);
                                                                            }, title: "Modifier l'utilisateur", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { className: `p-1.5 ${user.statut === 'suspendu' ? 'text-gray-400 hover:text-green-600' : 'text-gray-400 hover:text-red-600'} transition-colors`, onClick: () => toggleBlockUtilisateur(user._id, user.statut === 'suspendu' ? 'actif' : 'suspendu'), title: user.statut === 'suspendu' ? "Débloquer l'utilisateur" : "Bloquer l'utilisateur", children: user.statut === 'suspendu' ? (_jsx(UserCheck, { className: "w-4 h-4" })) : (_jsx(AlertCircle, { className: "w-4 h-4" })) }), _jsx("button", { className: "p-1.5 text-gray-400 hover:text-red-600 transition-colors", onClick: () => supprimerUtilisateur(user._id), title: "Supprimer l'utilisateur", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, user._id))) })] }) })) }))] }), showAddUserModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl p-6 w-full max-w-md", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Ajouter un utilisateur" }), _jsx("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            const form = e.target;
                                            const formData = new FormData(form);
                                            ajouterUtilisateur({
                                                nom: formData.get('nom'),
                                                prenom: formData.get('prenom'),
                                                email: formData.get('email'),
                                                telephone: formData.get('telephone'),
                                                role: formData.get('role'),
                                                statut: 'actif',
                                                // Le mot de passe sera traité par le backend
                                            });
                                        }, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", name: "prenom", className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsx("input", { type: "text", name: "nom", className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", name: "email", className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", name: "telephone", className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "R\u00F4le" }), _jsxs("select", { name: "role", className: "w-full p-2 border border-gray-300 rounded-md", required: true, children: [_jsx("option", { value: "coordinateur", children: "Coordinateur" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { className: "pt-4 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowAddUserModal(false), className: "px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50", children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700", children: "Ajouter" })] })] }) })] }) })), showEditUserModal && selectedUtilisateur && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl p-6 w-full max-w-md", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Modifier l'utilisateur" }), _jsx("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            const form = e.target;
                                            const formData = new FormData(form);
                                            modifierUtilisateur(selectedUtilisateur._id, {
                                                nom: formData.get('nom'),
                                                prenom: formData.get('prenom'),
                                                email: formData.get('email'),
                                                telephone: formData.get('telephone'),
                                                role: formData.get('role'),
                                            });
                                        }, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", name: "prenom", defaultValue: selectedUtilisateur.prenom, className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsx("input", { type: "text", name: "nom", defaultValue: selectedUtilisateur.nom, className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", name: "email", defaultValue: selectedUtilisateur.email, className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", name: "telephone", defaultValue: selectedUtilisateur.telephone, className: "w-full p-2 border border-gray-300 rounded-md", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "R\u00F4le" }), _jsxs("select", { name: "role", defaultValue: selectedUtilisateur.role, className: "w-full p-2 border border-gray-300 rounded-md", required: true, children: [_jsx("option", { value: "coordinateur", children: "Coordinateur" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { className: "pt-4 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: () => {
                                                                setShowEditUserModal(false);
                                                                setSelectedUtilisateur(null);
                                                            }, className: "px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50", children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700", children: "Enregistrer" })] })] }) })] }) }))] }));
            case 'gie':
                return (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-gray-100", children: _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher par code GIE, nom ou pr\u00E9nom de pr\u00E9sidente...", className: "w-full py-2.5 pl-10 pr-4 text-sm border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all", value: searchTerm, onChange: handleSearchChange }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none", children: _jsx(Search, { className: "w-4 h-4 text-gray-400" }) })] }) }), _jsx("div", { className: "w-64", children: _jsxs("select", { value: searchCommuneFilter, onChange: (e) => {
                                                        setSearchCommuneFilter(e.target.value);
                                                        setCurrentPage(1);
                                                    }, className: "w-full py-2.5 px-4 text-sm border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all", children: [_jsx("option", { value: "", children: "Toutes les communes" }), communes.map((commune) => (_jsxs("option", { value: commune.commune, children: [commune.commune, " (", commune.count, " GIE", commune.count > 1 ? 's' : '', ")"] }, commune.commune)))] }) }), _jsxs("button", { onClick: () => {
                                                    setSearchTerm('');
                                                    setSearchCommuneFilter('');
                                                    setCurrentPage(1);
                                                    fetchGIEs();
                                                }, className: "px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: "R\u00E9initialiser" })] })] }) }) }), loading ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "Chargement en cours..." }) })) : error ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("p", { className: "text-red-500", children: error }), _jsx("button", { onClick: () => fetchGIEs(), className: "mt-4 px-4 py-2 bg-primary-600 text-white rounded-md", children: "R\u00E9essayer" })] })) : (_jsx(_Fragment, { children: gies.length === 0 ? (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "Aucun GIE trouv\u00E9" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs uppercase bg-gray-50 text-gray-600", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 font-medium", children: "ID GIE" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Nom" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "R\u00E9gion" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Pr\u00E9sidente" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Jours investis" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Statut Adh\u00E9sion" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Statut Enregistrement" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Date Cr\u00E9ation" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: gies.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-medium text-gray-800", children: gie.identifiantGIE }), _jsx("td", { className: "px-6 py-4", children: gie.nomGIE }), _jsx("td", { className: "px-6 py-4", children: gie.region }), _jsx("td", { className: "px-6 py-4", children: gie.presidentePrenom && gie.presidenteNom
                                                                ? `${gie.presidentePrenom} ${gie.presidenteNom}`
                                                                : gie.presidente && (gie.presidente.prenom || gie.presidente.nom)
                                                                    ? `${gie.presidente.prenom || ''} ${gie.presidente.nom || ''}`
                                                                    : '-' }), _jsx("td", { className: "px-6 py-4", children: gie.presidenteTelephone || (gie.presidente && gie.presidente.telephone) || '-' }), _jsx("td", { className: "px-6 py-4", children: gie.daysInvestedSuccess ? (_jsxs("span", { className: "inline-flex text-xs font-medium rounded-full px-3 py-1 bg-blue-100 text-blue-700", children: [gie.daysInvestedSuccess, " jours"] })) : '-' }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-3 py-1 ${gie.statutAdhesion === 'validee'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : gie.statutAdhesion === 'en_attente'
                                                                        ? 'bg-amber-100 text-amber-700'
                                                                        : 'bg-red-100 text-red-700'}`, children: gie.statutAdhesion === 'validee'
                                                                    ? 'Validée'
                                                                    : gie.statutAdhesion === 'en_attente'
                                                                        ? 'En attente'
                                                                        : 'Non validée' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-3 py-1 ${gie.statutEnregistrement === 'valide'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-amber-100 text-amber-700'}`, children: gie.statutEnregistrement === 'valide' ? 'Valide' : 'En attente' }) }), _jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-xs text-gray-800", children: new Date(gie.dateCreation).toLocaleDateString('fr-FR') }), _jsx("div", { className: "text-xs text-gray-500", children: new Date(gie.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { className: "p-1.5 text-gray-400 hover:text-primary-600 transition-colors", onClick: () => navigate(`/admin/gies/${gie._id}`), title: "Voir les d\u00E9tails", children: _jsx(Eye, { className: "w-4 h-4" }) }), (gie.statutAdhesion !== 'validee' || gie.statutEnregistrement !== 'valide') && (_jsx("button", { className: "p-1.5 text-gray-400 hover:text-green-600 transition-colors", onClick: () => activerAdhesion(gie._id), title: "Activer l'adh\u00E9sion", children: _jsx(CheckCircle, { className: "w-4 h-4" }) })), gie.statutAdhesion === 'validee' && gie.statutEnregistrement === 'valide' && (_jsx("button", { className: `p-1.5 ${gie.investissementActif ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-purple-600'} transition-colors`, onClick: () => ouvrirModalInvestissement(gie._id, gie.nomGIE), title: gie.investissementActif ? `Investissement actif (${gie.daysInvestedSuccess || 0} jours)` : "Activer l'investissement", children: _jsx(DollarSign, { className: "w-4 h-4" }) }))] }) })] }, gie._id))) })] }) })) })), _jsxs("div", { className: "p-6 border-t border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0", children: [_jsx("div", { className: "text-sm text-gray-500", children: gies.length > 0 ? `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(currentPage * itemsPerPage, totalItems)} sur ${totalItems} GIEs (10 par page)` : 'Aucun GIE à afficher' }), totalPages > 1 && (_jsxs("div", { className: "flex items-center space-x-2 self-center md:self-auto", children: [_jsxs("button", { onClick: () => handlePageChange(currentPage - 1), className: `flex items-center px-3 py-2 text-sm border border-gray-200 rounded-lg transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 hover:text-primary-600'}`, disabled: currentPage === 1, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-1", children: _jsx("path", { d: "m15 18-6-6 6-6" }) }), _jsx("span", { className: "hidden sm:inline", children: "Page pr\u00E9c\u00E9dente" }), _jsx("span", { className: "inline sm:hidden", children: "Pr\u00E9c." })] }), _jsx("div", { className: "hidden sm:flex space-x-1", children: (() => {
                                                    const maxPagesToShow = 5;
                                                    let startPage = Math.max(1, currentPage - 2);
                                                    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                                                    if (endPage - startPage + 1 < maxPagesToShow) {
                                                        startPage = Math.max(1, endPage - maxPagesToShow + 1);
                                                    }
                                                    const pages = [];
                                                    if (startPage > 1) {
                                                        pages.push(_jsx("button", { onClick: () => handlePageChange(1), className: "w-8 h-8 flex items-center justify-center text-sm rounded-md border border-gray-200 hover:bg-primary-50 hover:text-primary-600", children: "1" }, "first"));
                                                        if (startPage > 2) {
                                                            pages.push(_jsx("span", { className: "px-2 text-gray-400", children: "..." }, "dots-1"));
                                                        }
                                                    }
                                                    for (let i = startPage; i <= endPage; i++) {
                                                        pages.push(_jsx("button", { onClick: () => handlePageChange(i), className: `w-8 h-8 flex items-center justify-center text-sm rounded-md ${currentPage === i
                                                                ? 'bg-primary-600 text-white'
                                                                : 'border border-gray-200 hover:bg-primary-50 hover:text-primary-600'}`, children: i }, i));
                                                    }
                                                    if (endPage < totalPages) {
                                                        if (endPage < totalPages - 1) {
                                                            pages.push(_jsx("span", { className: "px-2 text-gray-400", children: "..." }, "dots-2"));
                                                        }
                                                        pages.push(_jsx("button", { onClick: () => handlePageChange(totalPages), className: "w-8 h-8 flex items-center justify-center text-sm rounded-md border border-gray-200 hover:bg-primary-50 hover:text-primary-600", children: totalPages }, "last"));
                                                    }
                                                    return pages;
                                                })() }), _jsx("div", { className: "flex sm:hidden items-center", children: _jsxs("span", { className: "px-3 py-1 text-sm bg-gray-50 rounded-md border border-gray-200", children: [currentPage, " / ", totalPages] }) }), _jsxs("button", { onClick: () => handlePageChange(currentPage + 1), className: `flex items-center px-3 py-2 text-sm border border-gray-200 rounded-lg transition-colors ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 hover:text-primary-600'}`, disabled: currentPage >= totalPages, children: [_jsx("span", { className: "hidden sm:inline", children: "Page suivante" }), _jsx("span", { className: "inline sm:hidden", children: "Suiv." }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "ml-1", children: _jsx("path", { d: "m9 18 6-6-6-6" }) })] })] }))] })] }) }));
            case 'dashboard':
                return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: adminStats.map((stat, index) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `flex-shrink-0 rounded-xl p-3 ${stat.color.includes('blue') ? 'bg-primary-50' :
                                                        stat.color.includes('green') ? 'bg-green-50' :
                                                            stat.color.includes('amber') ? 'bg-amber-50' :
                                                                'bg-orange-50'}`, children: _jsx(stat.icon, { className: `w-6 h-6 ${stat.color.includes('blue') ? 'text-primary-600' :
                                                            stat.color.includes('green') ? 'text-green-600' :
                                                                stat.color.includes('amber') ? 'text-amber-600' :
                                                                    'text-orange-500'}` }) }), _jsxs("div", { className: "ml-4 truncate", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500", children: stat.label }), _jsxs("div", { className: "mt-2.5 flex items-baseline", children: [_jsx("p", { className: "text-xl font-bold text-gray-900", children: stat.value }), _jsx("span", { className: "ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full", children: stat.trend })] })] })] }) }), _jsx("div", { className: "bg-gray-50 px-6 py-3 border-t border-gray-100", children: _jsx("button", { onClick: () => {
                                                if (stat.label === 'Adhésions en attente') {
                                                    setShowGiesEnAttenteModal(true);
                                                    fetchGiesEnAttente();
                                                }
                                                else if (stat.label === 'Utilisateurs') {
                                                    setShowUtilisateursModal(true);
                                                    fetchUtilisateursModal();
                                                }
                                            }, className: "text-sm font-medium text-primary-600 hover:text-primary-700", children: "Voir d\u00E9tails" }) })] }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center", children: [_jsx("h3", { className: "font-medium text-gray-800", children: "Activit\u00E9s r\u00E9centes" }), _jsxs("button", { onClick: () => setActiveTab('logs'), className: "text-sm text-primary-600 hover:text-primary-700 transition-colors font-medium flex items-center gap-1", children: ["Voir tous", _jsx(ArrowUpRight, { className: "w-4 h-4" })] })] }), _jsx("div", { className: "p-5", children: loadingRecentActivities ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" }) })) : !recentActivities || recentActivities.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-sm text-gray-500", children: "Aucune activit\u00E9 r\u00E9cente" })] })) : (_jsx("div", { className: "space-y-4", children: recentActivities.map((activity, index) => {
                                                    const { icon: Icon, color } = getActivityIcon(activity.action);
                                                    return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: `w-10 h-10 rounded-lg ${color === 'blue' ? 'bg-blue-50' :
                                                                        color === 'green' ? 'bg-green-50' :
                                                                            color === 'amber' ? 'bg-amber-50' :
                                                                                color === 'red' ? 'bg-red-50' :
                                                                                    'bg-gray-50'} flex items-center justify-center`, children: _jsx(Icon, { className: `w-5 h-5 ${color === 'blue' ? 'text-blue-600' :
                                                                            color === 'green' ? 'text-green-600' :
                                                                                color === 'amber' ? 'text-amber-600' :
                                                                                    color === 'red' ? 'text-red-600' :
                                                                                        'text-gray-600'}` }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: activity.utilisateurNom }), _jsx("p", { className: "text-xs text-gray-600 mt-0.5", children: activity.description })] }), _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-2 py-0.5 whitespace-nowrap ${activity.statut === 'succes' ? 'bg-green-100 text-green-700' :
                                                                                    'bg-red-100 text-red-700'}`, children: activity.statut === 'succes' ? '✓' : '✗' })] }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("span", { className: "text-xs text-gray-400", children: getRelativeTime(activity.dateCreation) }), activity.ipAddress && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-gray-300", children: "\u2022" }), _jsx("span", { className: "text-xs text-gray-400", children: activity.ipAddress })] }))] })] })] }, activity._id));
                                                }) })) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center", children: [_jsx("h3", { className: "font-medium text-gray-800", children: "\u00C9volution des adh\u00E9sions par statut" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleAdhesionViewChange('monthly'), className: `text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${adhesionViewType === 'monthly'
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-600 hover:bg-gray-50'}`, children: "Mois" }), _jsx("button", { onClick: () => handleAdhesionViewChange('yearly'), className: `text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${adhesionViewType === 'yearly'
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-600 hover:bg-gray-50'}`, children: "Ann\u00E9e" })] })] }), _jsx("div", { className: "p-5", children: loadingAdhesionData ? (_jsx("div", { className: "h-72 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-center gap-4 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 bg-emerald-500 rounded shadow-sm" }), _jsx("span", { className: "font-medium text-gray-700", children: "Actifs" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 bg-orange-500 rounded shadow-sm" }), _jsx("span", { className: "font-medium text-gray-700", children: "Inactifs" })] })] }), _jsx("div", { className: "h-64", children: _jsxs("div", { className: "flex items-end justify-between h-full border-b-2 border-l-2 border-gray-300 pl-4 pb-4 relative", children: [_jsx("div", { className: "absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-3", children: Array.from({ length: 6 }, (_, i) => {
                                                                        const maxValue = Math.max(...adhesionEvolution.flatMap(d => [d.actifs, d.inactifs]));
                                                                        const value = Math.round((maxValue * (5 - i)) / 5);
                                                                        return (_jsx("div", { className: "text-right pr-2", children: value }, i));
                                                                    }) }), adhesionEvolution.map((item, index) => {
                                                                    const maxValue = Math.max(...adhesionEvolution.flatMap(d => [d.actifs, d.inactifs]));
                                                                    const actifsHeight = (item.actifs / maxValue) * 85; // 85% de la hauteur disponible
                                                                    const inactifsHeight = (item.inactifs / maxValue) * 85;
                                                                    return (_jsxs("div", { className: "flex flex-col items-center w-full group", children: [_jsxs("div", { className: "flex items-end gap-1 mb-2", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-t from-emerald-500 to-emerald-400 w-4 rounded-t-sm border border-emerald-600 shadow-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500", style: { height: `${actifsHeight * 2.5}px`, minHeight: '4px' } }), _jsx("div", { className: "absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-emerald-700", children: item.actifs })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-t from-orange-500 to-orange-400 w-4 rounded-t-sm border border-orange-600 shadow-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-500", style: { height: `${inactifsHeight * 2.5}px`, minHeight: '4px' } }), _jsx("div", { className: "absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-orange-700", children: item.inactifs })] })] }), _jsxs("div", { className: "absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap", children: [_jsx("div", { className: "font-semibold", children: item.period }), _jsxs("div", { children: ["Total: ", item.total] }), _jsxs("div", { className: "text-emerald-300", children: ["Actifs: ", item.actifs] }), _jsxs("div", { className: "text-orange-300", children: ["Inactifs: ", item.inactifs] })] }), _jsx("div", { className: "text-xs text-gray-600 mt-1 text-center font-medium", title: item.period, children: adhesionViewType === 'monthly'
                                                                                    ? item.period.split(' ')[0].substring(0, 3)
                                                                                    : item.period })] }, index));
                                                                })] }) })] })) })] })] })] }));
            case 'logs':
                return (_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden p-6", children: _jsx(ActivityLogsView, {}) }));
            case 'adhesions':
                return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-gray-100 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h3", { className: "font-medium text-gray-800", children: "Demandes d'adh\u00E9sion" }), _jsx("span", { className: "ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800", children: "8 en attente" })] }), _jsx("div", { className: "flex gap-3", children: _jsxs("button", { className: "px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center space-x-2 transition-all", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: "Filtrer" })] }) })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs uppercase bg-gray-50 text-gray-600", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 font-medium", children: "Code GIE" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Demandeur" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Date soumission" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Documents" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Statut" }), _jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: [1, 2, 3, 4, 5].map((item) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsxs("td", { className: "px-6 py-4 font-medium text-gray-800", children: ["FEVEO-0", item, "-01-01-", item, "01"] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-medium", children: item % 2 === 0 ? 'MD' : 'AS' }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm text-gray-700", children: item % 2 === 0 ? 'Marie Diop' : 'Amadou Sow' }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Tel: +221 77 ", item, "00 00 00"] })] })] }) }), _jsxs("td", { className: "px-6 py-4 text-gray-600", children: ["10/0", item, "/2024"] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [_jsxs("span", { className: "bg-primary-100 text-primary-700 text-xs px-2.5 py-1 rounded-full", children: [item + 2, "/5"] }), _jsx("button", { className: "ml-2 text-primary-600 hover:text-primary-800 text-xs underline transition-colors", children: "Voir fichiers" })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${item % 3 === 0 ? 'bg-amber-100 text-amber-700' :
                                                            item % 3 === 1 ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'}`, children: item % 3 === 0 ? 'En attente' :
                                                            item % 3 === 1 ? 'Validée' : 'Documents manquants' }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { className: "p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { className: "p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-colors", children: _jsx(CheckCircle, { className: "w-4 h-4" }) })] }) })] }, item))) })] }) }), _jsxs("div", { className: "p-6 border-t border-gray-100 flex justify-between items-center", children: [_jsx("div", { className: "text-sm text-gray-500", children: "Affichage de 1 \u00E0 5 sur 8 demandes d'adh\u00E9sion" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Pr\u00E9c\u00E9dent" }), _jsx("button", { className: "px-4 py-2 text-sm bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors", children: "Suivant" })] })] })] }));
            case 'reports':
                return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: _jsxs("div", { className: "p-5 border-b border-gray-100", children: [_jsx("h3", { className: "font-medium text-gray-800 mb-4", children: "Recherche par localit\u00E9" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "region-select", className: "block text-sm font-medium text-gray-700 mb-1", children: "R\u00E9gion" }), _jsxs("select", { id: "region-select", value: selectedRegion, onChange: (e) => {
                                                            const newRegion = e.target.value;
                                                            setSelectedRegion(newRegion);
                                                            setDepartements(getDepartements(newRegion));
                                                            setSelectedDepartement("");
                                                            setSelectedArrondissement("");
                                                            setSelectedCommune("");
                                                            // Si une région est sélectionnée, charger ses détails
                                                            if (newRegion) {
                                                                fetchRapportRegionDetails(newRegion);
                                                            }
                                                            else {
                                                                // Si aucune région sélectionnée, revenir aux données générales
                                                                setRapportRegionDetails(null);
                                                                setSelectedRegionForDetails('');
                                                                if (!rapportGieSenegal) {
                                                                    fetchRapportGieSenegal();
                                                                }
                                                            }
                                                        }, className: "block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez une r\u00E9gion" }), regions.map((region) => (_jsx("option", { value: region.code, children: region.nom }, region.code)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "departement-select", className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00E9partement" }), _jsxs("select", { id: "departement-select", value: selectedDepartement, onChange: (e) => {
                                                            const selectedDeptCode = e.target.value;
                                                            setSelectedDepartement(selectedDeptCode);
                                                            setArrondissements(getArrondissements(selectedRegion, selectedDeptCode));
                                                            setSelectedArrondissement("");
                                                            setSelectedCommune("");
                                                            // Si un département est sélectionné, charger automatiquement ses arrondissements
                                                            if (selectedDeptCode && selectedRegion) {
                                                                const selectedDeptInfo = departements.find(dept => dept.code === selectedDeptCode);
                                                                const selectedRegionInfo = regions.find(region => region.code === selectedRegion);
                                                                if (selectedDeptInfo && selectedRegionInfo) {
                                                                    fetchRapportDepartementArrondissements(selectedRegionInfo.nom.toUpperCase(), selectedDeptCode, selectedDeptInfo.nom);
                                                                }
                                                            }
                                                            else {
                                                                // Si aucun département sélectionné, revenir aux données régionales ou générales
                                                                setRapportDepartementArrondissements(null);
                                                                setSelectedDepartementForArrondissements({ region: '', departement: '', codeDepartement: '' });
                                                            }
                                                        }, disabled: !selectedRegion || departements.length === 0, className: "block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un d\u00E9partement" }), departements.map((departement, index) => (_jsx("option", { value: departement.code, children: departement.nom }, index)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "arrondissement-select", className: "block text-sm font-medium text-gray-700 mb-1", children: "Arrondissement" }), _jsxs("select", { id: "arrondissement-select", value: selectedArrondissement, onChange: (e) => {
                                                            const selectedArrCode = e.target.value;
                                                            setSelectedArrondissement(selectedArrCode);
                                                            setCommunes(getCommunes(selectedRegion, selectedDepartement, selectedArrCode));
                                                            setSelectedCommune("");
                                                            // Si un arrondissement est sélectionné, charger automatiquement ses GIE
                                                            if (selectedArrCode && selectedDepartement && selectedRegion) {
                                                                const selectedArrInfo = arrondissements.find(arr => arr.code === selectedArrCode);
                                                                const selectedDeptInfo = departements.find(dept => dept.code === selectedDepartement);
                                                                const selectedRegionInfo = regions.find(region => region.code === selectedRegion);
                                                                if (selectedArrInfo && selectedDeptInfo && selectedRegionInfo) {
                                                                    fetchRapportArrondissementGies(selectedRegionInfo.nom.toUpperCase(), selectedDepartement, selectedArrCode, selectedDeptInfo.nom, selectedArrInfo.nom);
                                                                }
                                                            }
                                                            else {
                                                                // Si aucun arrondissement sélectionné, revenir aux données départementales
                                                                setRapportArrondissementGies(null);
                                                                setSelectedArrondissementForGies({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '' });
                                                            }
                                                        }, disabled: !selectedDepartement || arrondissements.length === 0, className: "block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un arrondissement" }), arrondissements.map((arrondissement, index) => (_jsx("option", { value: arrondissement.code, children: arrondissement.nom }, index)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "commune-select", className: "block text-sm font-medium text-gray-700 mb-1", children: "Commune" }), _jsxs("select", { id: "commune-select", value: selectedCommune, onChange: (e) => {
                                                            const selectedCommCode = e.target.value;
                                                            setSelectedCommune(selectedCommCode);
                                                            // Si une commune est sélectionnée, charger automatiquement ses GIE
                                                            if (selectedCommCode && selectedArrondissement && selectedDepartement && selectedRegion) {
                                                                const selectedCommInfo = communes.find(comm => comm.code === selectedCommCode);
                                                                const selectedArrInfo = arrondissements.find(arr => arr.code === selectedArrondissement);
                                                                const selectedDeptInfo = departements.find(dept => dept.code === selectedDepartement);
                                                                const selectedRegionInfo = regions.find(region => region.code === selectedRegion);
                                                                if (selectedCommInfo && selectedArrInfo && selectedDeptInfo && selectedRegionInfo) {
                                                                    fetchRapportCommuneGies(selectedRegionInfo.nom.toUpperCase(), selectedDepartement, selectedArrondissement, selectedCommCode, selectedDeptInfo.nom, selectedArrInfo.nom, selectedCommInfo.nom);
                                                                }
                                                            }
                                                            else {
                                                                // Si aucune commune sélectionnée, revenir aux données d'arrondissement ou supérieures
                                                                setRapportCommuneGies(null);
                                                                setSelectedCommuneForGies({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '', commune: '', codeCommune: '' });
                                                            }
                                                        }, disabled: !selectedArrondissement || communes.length === 0, className: "block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-600 focus:border-blue-600 disabled:opacity-50", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez une commune" }), communes.map((commune, index) => (_jsx("option", { value: commune.code, children: commune.nom }, index)))] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: searchGIEsByLocalite, className: "px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all", children: "Rechercher" }) })] }) }), errorRapport && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-400 mr-3" }), _jsx("p", { className: "text-red-700", children: errorRapport })] }) })), (loadingRapport || loadingRegionDetails) && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-8 text-center", children: _jsxs("div", { className: "inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-500 bg-white transition ease-in-out duration-150", children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), loadingRegionDetails ? `Chargement des données de la région ${selectedRegionForDetails}...` : 'Chargement des données...'] }) })), errorRegionDetails && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-400 mr-3" }), _jsx("p", { className: "text-red-700", children: errorRegionDetails }), _jsx("button", { onClick: () => {
                                            setErrorRegionDetails('');
                                            setRapportRegionDetails(null);
                                            setSelectedRegionForDetails('');
                                            setSelectedRegion('');
                                            fetchRapportGieSenegal();
                                        }, className: "ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200", children: "Retour aux donn\u00E9es g\u00E9n\u00E9rales" })] }) })), rapportRegionDetails && rapportRegionDetails.data && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-4", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("button", { onClick: () => {
                                                        setRapportRegionDetails(null);
                                                        setSelectedRegionForDetails('');
                                                        setSelectedRegion('');
                                                        fetchRapportGieSenegal();
                                                    }, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all", children: "\u2190 Retour au rapport g\u00E9n\u00E9ral" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["D\u00E9tails de la r\u00E9gion: ", selectedRegionForDetails] })] }) }) }), rapportRegionDetails.data.map((regionData, index) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Building, { className: "h-8 w-8 text-blue-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total GIE" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: regionData.nombreTotalGIE })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-8 w-8 text-green-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Adh\u00E9rents" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: regionData.totalTotalAdherents })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DollarSign, { className: "h-8 w-8 text-purple-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Investissements" }), _jsxs("dd", { className: "text-lg font-medium text-gray-900", children: [regionData.totalTotalInvestissements.toLocaleString(), " FCFA"] })] }) })] }) })] }), regionData.departements.map((deptData, deptIndex) => {
                                            const isDeptExpanded = expandedDepartements.has(`${regionData.region}-${deptData.departement}`);
                                            const toggleDepartement = () => {
                                                const newExpanded = new Set(expandedDepartements);
                                                const deptKey = `${regionData.region}-${deptData.departement}`;
                                                if (isDeptExpanded) {
                                                    newExpanded.delete(deptKey);
                                                }
                                                else {
                                                    newExpanded.add(deptKey);
                                                }
                                                setExpandedDepartements(newExpanded);
                                            };
                                            return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-6 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: toggleDepartement, className: "mr-3 text-gray-400 hover:text-gray-600 transition-colors", children: isDeptExpanded ? (_jsx(ChevronDown, { className: "w-5 h-5" })) : (_jsx(ChevronRight, { className: "w-5 h-5" })) }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(MapPin, { className: "w-5 h-5 text-blue-600 mr-2" }), "D\u00E9partement: ", deptData.departement] }), _jsx("button", { onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                // Trouver le code département pour ce département
                                                                                const departementCode = deptData.gies && deptData.gies.length > 0 ? deptData.gies[0].codeDepartement : null;
                                                                                if (departementCode) {
                                                                                    fetchRapportDepartementArrondissements(regionData.region, departementCode, deptData.departement);
                                                                                }
                                                                                else {
                                                                                    console.error('Code département introuvable');
                                                                                }
                                                                            }, className: "ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors", children: "Voir arrondissements" })] }), _jsxs("div", { className: "flex space-x-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center bg-blue-50 px-3 py-1 rounded-full", children: [_jsx(Building, { className: "w-4 h-4 mr-1 text-blue-600" }), _jsx("span", { className: "font-medium text-blue-800", children: deptData.nombreGIE }), _jsxs("span", { className: "ml-1 text-blue-600", children: ["GIE", deptData.nombreGIE > 1 ? 's' : ''] })] }), _jsxs("span", { className: "flex items-center bg-green-50 px-3 py-1 rounded-full", children: [_jsx(Users, { className: "w-4 h-4 mr-1 text-green-600" }), _jsx("span", { className: "font-medium text-green-800", children: deptData.totalAdherents }), _jsxs("span", { className: "ml-1 text-green-600", children: ["membre", deptData.totalAdherents > 1 ? 's' : ''] })] }), _jsxs("span", { className: "flex items-center bg-purple-50 px-3 py-1 rounded-full", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-1 text-purple-600" }), _jsx("span", { className: "font-medium text-purple-800", children: deptData.totalInvestissements.toLocaleString() }), _jsx("span", { className: "ml-1 text-purple-600", children: "FCFA" })] })] })] }) }), isDeptExpanded && (_jsx("div", { className: "border-t border-gray-100", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Arrondissement" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Secteur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: deptData.gies.map((gie, gieIndex) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: gie.nomGIE }), _jsx("div", { className: "text-sm text-gray-500", children: gie.identifiantGIE })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.nomArrondissement || gie.arrondissement || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.nomCommune || gie.commune || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.secteurPrincipal }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [gie.nombreMembres, " membre", gie.nombreMembres > 1 ? 's' : ''] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gie.statutEnregistrement === 'valide' ? 'bg-green-100 text-green-800' :
                                                                                            gie.statutEnregistrement === 'en_attente_paiement' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                'bg-red-100 text-red-800'}`, children: gie.statutEnregistrement }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-900 mr-3 transition-colors", children: "Voir" }), _jsx("button", { className: "text-green-600 hover:text-green-900 transition-colors", children: "\u00C9diter" })] })] }, gieIndex))) })] }) }) }))] }, deptIndex));
                                        })] }, index)))] })), rapportGieSenegal && rapportGieSenegal.data && !rapportRegionDetails && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Building, { className: "h-8 w-8 text-blue-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total GIE" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: rapportGieSenegal.data.reduce((total, region) => total + region.nombreGIE, 0) })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-8 w-8 text-green-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Adh\u00E9rents" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: rapportGieSenegal.data.reduce((total, region) => total + region.totalAdherents, 0) })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DollarSign, { className: "h-8 w-8 text-purple-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Investissements" }), _jsxs("dd", { className: "text-lg font-medium text-gray-900", children: [rapportGieSenegal.data.reduce((total, region) => total + region.totalInvestissements, 0).toLocaleString(), " FCFA"] })] }) })] }) })] }), rapportGieSenegal.data.map((regionData, index) => {
                                    const isExpanded = expandedRegions.has(regionData.region);
                                    const toggleRegion = () => {
                                        const newExpanded = new Set(expandedRegions);
                                        if (isExpanded) {
                                            newExpanded.delete(regionData.region);
                                        }
                                        else {
                                            newExpanded.add(regionData.region);
                                        }
                                        setExpandedRegions(newExpanded);
                                    };
                                    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsxs("div", { className: "p-6 cursor-pointer hover:bg-gray-50 transition-colors", onClick: toggleRegion, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { className: "mr-3 text-gray-400 hover:text-gray-600 transition-colors", children: isExpanded ? (_jsx(ChevronDown, { className: "w-5 h-5" })) : (_jsx(ChevronRight, { className: "w-5 h-5" })) }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(MapPin, { className: "w-5 h-5 text-blue-600 mr-2" }), regionData.region] })] }), _jsxs("div", { className: "flex space-x-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center bg-blue-50 px-3 py-1 rounded-full", children: [_jsx(Building, { className: "w-4 h-4 mr-1 text-blue-600" }), _jsx("span", { className: "font-medium text-blue-800", children: regionData.nombreGIE }), _jsxs("span", { className: "ml-1 text-blue-600", children: ["GIE", regionData.nombreGIE > 1 ? 's' : ''] })] }), _jsxs("span", { className: "flex items-center bg-green-50 px-3 py-1 rounded-full", children: [_jsx(Users, { className: "w-4 h-4 mr-1 text-green-600" }), _jsx("span", { className: "font-medium text-green-800", children: regionData.totalAdherents }), _jsxs("span", { className: "ml-1 text-green-600", children: ["membre", regionData.totalAdherents > 1 ? 's' : ''] })] }), _jsxs("span", { className: "flex items-center bg-purple-50 px-3 py-1 rounded-full", children: [_jsx(DollarSign, { className: "w-4 h-4 mr-1 text-purple-600" }), _jsx("span", { className: "font-medium text-purple-800", children: regionData.totalInvestissements.toLocaleString() }), _jsx("span", { className: "ml-1 text-purple-600", children: "FCFA" })] })] })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500 mb-2", children: [_jsx("span", { children: "R\u00E9partition des GIEs" }), _jsxs("span", { children: [Math.round((regionData.nombreGIE / rapportGieSenegal.data.reduce((total, r) => total + r.nombreGIE, 0)) * 100), "% du total"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500", style: { width: `${(regionData.nombreGIE / Math.max(...rapportGieSenegal.data.map((r) => r.nombreGIE))) * 100}%` } }) })] })] }), isExpanded && (_jsx("div", { className: "border-t border-gray-100 bg-gray-50", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("h4", { className: "text-md font-medium text-gray-700", children: ["Liste des GIEs (", regionData.gies.length, ")"] }), _jsxs("div", { className: "flex space-x-2 text-xs", children: [_jsxs("span", { className: "bg-white px-2 py-1 rounded border", children: ["Total: ", regionData.gies.length, " GIE", regionData.gies.length > 1 ? 's' : ''] }), _jsxs("span", { className: "bg-white px-2 py-1 rounded border", children: ["Actifs: ", regionData.gies.filter(g => g.statutEnregistrement === 'valide').length] })] })] }), _jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partement" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Arrondissement" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Secteur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: regionData.gies.map((gie, gieIndex) => (_jsxs("tr", { className: "hover:bg-blue-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: gie.nomGIE }), _jsx("div", { className: "text-sm text-gray-500", children: gie.identifiantGIE })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.departement }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.nomArrondissement || gie.arrondissement || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.nomCommune || gie.commune || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.secteurPrincipal }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [gie.nombreMembres, " membre", gie.nombreMembres > 1 ? 's' : ''] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gie.statutEnregistrement === 'valide' ? 'bg-green-100 text-green-800' :
                                                                                                gie.statutEnregistrement === 'en_attente_paiement' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                    'bg-red-100 text-red-800'}`, children: gie.statutEnregistrement }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-900 mr-3 transition-colors", children: "Voir" }), _jsx("button", { className: "text-green-600 hover:text-green-900 transition-colors", children: "\u00C9diter" })] })] }, gieIndex))) })] }) }) })] }) }))] }, index));
                                })] })), !loadingRapport && !errorRapport && !rapportGieSenegal && !loadingRegionDetails && !rapportRegionDetails && !loadingDepartementArrondissements && !rapportDepartementArrondissements && !loadingArrondissementGies && !rapportArrondissementGies && !loadingCommuneGies && !rapportCommuneGies && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-8 text-center", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Aucune donn\u00E9e disponible" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Cliquez sur \"Actualiser\" pour charger les donn\u00E9es du rapport GIE S\u00E9n\u00E9gal." }), _jsx("button", { onClick: fetchRapportGieSenegal, className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all", children: "Charger les donn\u00E9es" })] })), loadingDepartementArrondissements && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Chargement des arrondissements..." }), _jsxs("p", { className: "text-gray-600", children: ["R\u00E9cup\u00E9ration des donn\u00E9es pour ", selectedDepartementForArrondissements.departement, " (", selectedDepartementForArrondissements.region, ")"] })] })), errorDepartementArrondissements && !loadingDepartementArrondissements && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-8 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-red-900 mb-2", children: "Erreur de chargement" }), _jsx("p", { className: "text-red-600 mb-4", children: errorDepartementArrondissements }), _jsx("button", { onClick: () => {
                                        const { region, codeDepartement, departement } = selectedDepartementForArrondissements;
                                        if (region && codeDepartement) {
                                            fetchRapportDepartementArrondissements(region, codeDepartement, departement);
                                        }
                                    }, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all", children: "R\u00E9essayer" })] })), loadingArrondissementGies && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Chargement des GIE..." }), _jsxs("p", { className: "text-gray-600", children: ["R\u00E9cup\u00E9ration des GIE de ", selectedArrondissementForGies.arrondissement, " (", selectedArrondissementForGies.departement, ", ", selectedArrondissementForGies.region, ")"] })] })), errorArrondissementGies && !loadingArrondissementGies && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-8 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-red-900 mb-2", children: "Erreur de chargement" }), _jsx("p", { className: "text-red-600 mb-4", children: errorArrondissementGies }), _jsx("button", { onClick: () => {
                                        const { region, codeDepartement, codeArrondissement, departement, arrondissement } = selectedArrondissementForGies;
                                        if (region && codeDepartement && codeArrondissement) {
                                            fetchRapportArrondissementGies(region, codeDepartement, codeArrondissement, departement, arrondissement);
                                        }
                                    }, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all", children: "R\u00E9essayer" })] })), loadingCommuneGies && (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Chargement des GIE..." }), _jsxs("p", { className: "text-gray-600", children: ["R\u00E9cup\u00E9ration des GIE de ", selectedCommuneForGies.commune, " (", selectedCommuneForGies.arrondissement, ", ", selectedCommuneForGies.departement, ", ", selectedCommuneForGies.region, ")"] })] })), errorCommuneGies && !loadingCommuneGies && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-8 text-center", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-red-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-red-900 mb-2", children: "Erreur de chargement" }), _jsx("p", { className: "text-red-600 mb-4", children: errorCommuneGies }), _jsx("button", { onClick: () => {
                                        const { region, codeDepartement, codeArrondissement, codeCommune, departement, arrondissement, commune } = selectedCommuneForGies;
                                        if (region && codeDepartement && codeArrondissement && codeCommune) {
                                            fetchRapportCommuneGies(region, codeDepartement, codeArrondissement, codeCommune, departement, arrondissement, commune);
                                        }
                                    }, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all", children: "R\u00E9essayer" })] })), rapportDepartementArrondissements && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => {
                                                        setRapportDepartementArrondissements(null);
                                                        setSelectedDepartementForArrondissements({ region: '', departement: '', codeDepartement: '' });
                                                        if (selectedRegionForDetails) {
                                                            fetchRapportRegionDetails(selectedRegionForDetails);
                                                        }
                                                        else {
                                                            fetchRapportGieSenegal();
                                                        }
                                                    }, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all", children: "\u2190 Retour" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Arrondissements - ", selectedDepartementForArrondissements.departement || rapportDepartementArrondissements.departementDemande, " (", rapportDepartementArrondissements.regionDemandee, ")"] })] }) }) }), rapportDepartementArrondissements.data.map((departementData, index) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Building, { className: "h-8 w-8 text-blue-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total GIE" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: departementData.nombreTotalGIE })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-8 w-8 text-green-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Adh\u00E9rents" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: departementData.totalTotalAdherents })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DollarSign, { className: "h-8 w-8 text-purple-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Investissements" }), _jsxs("dd", { className: "text-lg font-medium text-gray-900", children: [departementData.totalTotalInvestissements.toLocaleString(), " FCFA"] })] }) })] }) })] }), _jsx("div", { className: "space-y-4", children: departementData.arrondissements.map((arrondissementData, arrIndex) => {
                                                const isExpandedArr = expandedArrondissements.has(`${arrondissementData.arrondissement}`);
                                                const toggleArrondissement = () => {
                                                    const newExpanded = new Set(expandedArrondissements);
                                                    if (isExpandedArr) {
                                                        newExpanded.delete(`${arrondissementData.arrondissement}`);
                                                    }
                                                    else {
                                                        newExpanded.add(`${arrondissementData.arrondissement}`);
                                                    }
                                                    setExpandedArrondissements(newExpanded);
                                                };
                                                return (_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between cursor-pointer", onClick: toggleArrondissement, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Map, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900", children: arrondissementData.gies && arrondissementData.gies.length > 0 && arrondissementData.gies[0].nomArrondissement
                                                                                            ? arrondissementData.gies[0].nomArrondissement
                                                                                            : `Arrondissement ${arrondissementData.arrondissement}` }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Code: ", arrondissementData.arrondissement] })] })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-blue-600", children: arrondissementData.nombreGIE }), _jsx("div", { className: "text-xs text-gray-500", children: "GIE" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-green-600", children: arrondissementData.totalAdherents }), _jsx("div", { className: "text-xs text-gray-500", children: "Adh\u00E9rents" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-purple-600", children: arrondissementData.totalInvestissements.toLocaleString() }), _jsx("div", { className: "text-xs text-gray-500", children: "FCFA" })] }), isExpandedArr ? _jsx(ChevronDown, { className: "w-5 h-5 text-gray-400" }) : _jsx(ChevronRight, { className: "w-5 h-5 text-gray-400" })] })] }), isExpandedArr && (_jsx("div", { className: "mt-6 border-t border-gray-100 pt-6", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Secteur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: arrondissementData.gies.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: gie.nomGIE }), _jsx("div", { className: "text-sm text-gray-500", children: gie.identifiantGIE })] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: gie.nomCommune || gie.commune }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Code: ", gie.codeCommune] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.secteurPrincipal }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.nombreMembres }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gie.statutEnregistrement === 'valide' ? 'bg-green-100 text-green-800' :
                                                                                                    gie.statutEnregistrement === 'en_attente_paiement' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                        'bg-red-100 text-red-800'}`, children: gie.statutEnregistrement }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-900 mr-3 transition-colors", children: "Voir" }), _jsx("button", { className: "text-green-600 hover:text-green-900 transition-colors", children: "\u00C9diter" })] })] }, gie._id))) })] }) }) }))] }) }, arrIndex));
                                            }) })] }, index)))] })), rapportArrondissementGies && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => {
                                                        setRapportArrondissementGies(null);
                                                        setSelectedArrondissementForGies({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '' });
                                                        // Revenir aux arrondissements du département
                                                        const { region, codeDepartement, departement } = selectedDepartementForArrondissements;
                                                        if (region && codeDepartement) {
                                                            fetchRapportDepartementArrondissements(region, codeDepartement, departement);
                                                        }
                                                        else if (selectedRegionForDetails) {
                                                            fetchRapportRegionDetails(selectedRegionForDetails);
                                                        }
                                                        else {
                                                            fetchRapportGieSenegal();
                                                        }
                                                    }, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all", children: "\u2190 Retour" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["GIE - ", selectedArrondissementForGies.arrondissement, " (", selectedArrondissementForGies.departement, ", ", selectedArrondissementForGies.region, ")"] })] }) }) }), rapportArrondissementGies.data.map((arrondissementData, index) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Building, { className: "h-8 w-8 text-blue-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total GIE" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: arrondissementData.nombreTotalGIE })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-8 w-8 text-green-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Adh\u00E9rents" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: arrondissementData.totalTotalAdherents })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DollarSign, { className: "h-8 w-8 text-purple-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Investissements" }), _jsxs("dd", { className: "text-lg font-medium text-gray-900", children: [arrondissementData.totalTotalInvestissements.toLocaleString(), " FCFA"] })] }) })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-100", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-900 mb-2", children: ["Liste des GIE (", arrondissementData.gies.length, ")"] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["GIE enregistr\u00E9s dans l'arrondissement ", arrondissementData.arrondissement] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Secteur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date cr\u00E9ation" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: arrondissementData.gies.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: gie.nomGIE }), _jsx("div", { className: "text-sm text-gray-500", children: gie.identifiantGIE })] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: gie.nomCommune || gie.commune }), _jsxs("div", { className: "text-sm text-gray-500", children: ["Code: ", gie.codeCommune] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: gie.secteurPrincipal }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: [gie.nombreMembres, " membre", gie.nombreMembres > 1 ? 's' : ''] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gie.statutEnregistrement === 'valide' ? 'bg-green-100 text-green-800' :
                                                                                    gie.statutEnregistrement === 'en_attente_paiement' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-red-100 text-red-800'}`, children: gie.statutEnregistrement }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(gie.createdAt).toLocaleDateString('fr-FR') }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [_jsx("button", { className: "text-blue-600 hover:text-blue-900 mr-3 transition-colors", children: "Voir" }), _jsx("button", { className: "text-green-600 hover:text-green-900 transition-colors", children: "\u00C9diter" })] })] }, gie._id))) })] }) })] })] }, index)))] })), rapportCommuneGies && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { onClick: () => {
                                                        setRapportCommuneGies(null);
                                                        setSelectedCommuneForGies({ region: '', departement: '', codeDepartement: '', arrondissement: '', codeArrondissement: '', commune: '', codeCommune: '' });
                                                        // Revenir aux GIE de l'arrondissement
                                                        const { region, codeDepartement, codeArrondissement, departement, arrondissement } = selectedCommuneForGies;
                                                        if (region && codeDepartement && codeArrondissement) {
                                                            fetchRapportArrondissementGies(region, codeDepartement, codeArrondissement, departement, arrondissement);
                                                        }
                                                        else if (selectedDepartementForArrondissements.region && selectedDepartementForArrondissements.codeDepartement) {
                                                            const { region, codeDepartement, departement } = selectedDepartementForArrondissements;
                                                            fetchRapportDepartementArrondissements(region, codeDepartement, departement);
                                                        }
                                                        else if (selectedRegionForDetails) {
                                                            fetchRapportRegionDetails(selectedRegionForDetails);
                                                        }
                                                        else {
                                                            fetchRapportGieSenegal();
                                                        }
                                                    }, className: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all", children: "\u2190 Retour" }), _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["GIE - ", selectedCommuneForGies.commune, " (", selectedCommuneForGies.arrondissement, ", ", selectedCommuneForGies.departement, ", ", selectedCommuneForGies.region, ")"] })] }) }) }), rapportCommuneGies.data.map((communeData, index) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Building, { className: "h-8 w-8 text-blue-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total GIE" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: communeData.nombreTotalGIE })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Users, { className: "h-8 w-8 text-green-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Adh\u00E9rents" }), _jsx("dd", { className: "text-lg font-medium text-gray-900", children: communeData.totalTotalAdherents })] }) })] }) }), _jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(DollarSign, { className: "h-8 w-8 text-purple-600" }) }), _jsx("div", { className: "ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "Total Investissements" }), _jsxs("dd", { className: "text-lg font-medium text-gray-900", children: [communeData.totalTotalInvestissements?.toLocaleString() || 0, " FCFA"] })] }) })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden", children: [_jsxs("div", { className: "p-6 border-b border-gray-100", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-900 mb-2", children: ["Liste des GIE (", communeData.gies.length, ")"] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["GIE enregistr\u00E9s dans la commune ", communeData.commune] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "GIE" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Secteur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date cr\u00E9ation" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: communeData.gies.map((gie, gieIndex) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: gie.nomGIE }), _jsxs("div", { className: "text-sm text-gray-500", children: ["ID: ", gie.identifiantGIE] }), gie.numeroProtocole && (_jsxs("div", { className: "text-sm text-gray-500", children: ["Protocole: ", gie.numeroProtocole] }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: gie.secteurPrincipal }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: gie.nombreMembres }), _jsxs("div", { className: "text-sm text-gray-500", children: [gie.membres?.length || 0, " d\u00E9taill\u00E9s"] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gie.statutEnregistrement === 'ACTIF' ? 'bg-green-100 text-green-800' :
                                                                                    gie.statutEnregistrement === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-red-100 text-red-800'}`, children: gie.statutEnregistrement }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(gie.createdAt).toLocaleDateString('fr-FR') })] }, gieIndex))) })] }) })] })] }, index)))] }))] }));
            case 'settings':
                return (_jsxs("div", { className: "space-y-6", children: [_jsx(ProfileSettings, {}), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-100", children: _jsx("h3", { className: "font-medium text-gray-800", children: "Param\u00E8tres de la plateforme" }) }), _jsx("div", { className: "p-6 divide-y divide-gray-100", children: [
                                        { name: 'Paramètres généraux', desc: 'Configurations générales de la plateforme' },
                                        { name: 'Sécurité', desc: 'Gestion des accès et autorisations' },
                                        { name: 'Notifications', desc: 'Configuration des alertes et messages' },
                                        { name: 'Intégrations', desc: 'Services tiers et API externes' }
                                    ].map((setting, index) => (_jsx("div", { className: "py-4 first:pt-0 last:pb-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-slate-800", children: setting.name }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: setting.desc })] }), _jsx("button", { className: "px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50", children: "Configurer" })] }) }, index))) })] }), _jsxs("div", { className: "bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-slate-200", children: _jsx("h3", { className: "font-medium text-slate-800", children: "Administrateurs syst\u00E8me" }) }), _jsxs("div", { className: "p-5", children: [_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((item) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium", children: item === 1 ? 'AD' : item === 2 ? 'OS' : 'MB' }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-slate-800", children: item === 1 ? 'Abdoulaye Diop' : item === 2 ? 'Ousmane Sy' : 'Mariama Ba' }), _jsx("p", { className: "text-xs text-slate-500", children: item === 1 ? 'Admin principal' : item === 2 ? 'Gestionnaire GIE' : 'Support technique' })] })] }), _jsx("div", { className: "flex space-x-2", children: _jsx("button", { className: "p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100", children: _jsx(Edit, { className: "w-4 h-4" }) }) })] }, item))) }), _jsx("div", { className: "mt-5 pt-5 border-t border-slate-200 flex justify-end", children: _jsxs("button", { className: "px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Ajouter administrateur" })] }) })] })] })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-100 overflow-hidden", children: [_jsxs("div", { className: "hidden md:flex flex-col w-64 bg-white border-r border-gray-200", children: [_jsx("div", { className: "flex items-center h-16 px-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center", children: _jsx(Shield, { className: "w-4 h-4 text-white" }) }), _jsx("span", { className: "text-lg font-semibold text-gray-800", children: "FEVEO 2050" })] }) }), _jsxs("div", { className: "flex-1 py-6 px-3 overflow-y-auto", children: [_jsx("div", { className: "px-3 mb-6", children: _jsx("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Principal" }) }), _jsxs("nav", { className: "space-y-1", children: [_jsxs("button", { onClick: () => setActiveTab('dashboard'), className: `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'dashboard'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(BarChart3, { className: `w-5 h-5 mr-3 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400'}` }), "Tableau de bord"] }), _jsxs("button", { onClick: () => setActiveTab('gie'), className: `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'gie'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(Building, { className: `w-5 h-5 mr-3 ${activeTab === 'gie' ? 'text-white' : 'text-gray-400'}` }), "Gestion des GIE"] }), _jsxs("button", { onClick: () => setActiveTab('users'), className: `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'users'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(Users, { className: `w-5 h-5 mr-3 ${activeTab === 'users' ? 'text-white' : 'text-gray-400'}` }), "Utilisateurs"] }), _jsx("div", { className: "px-3 pt-6 pb-2", children: _jsx("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Analyse et Gestion" }) }), _jsxs("button", { onClick: () => setActiveTab('reports'), className: `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'reports'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(TrendingUp, { className: `w-5 h-5 mr-3 ${activeTab === 'reports' ? 'text-white' : 'text-gray-400'}` }), "Rapports"] }), _jsxs("button", { onClick: () => setActiveTab('settings'), className: `flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'settings'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(Settings, { className: `w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-white' : 'text-gray-400'}` }), "Param\u00E8tres"] })] })] }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: "flex-shrink-0 h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm", children: [admin?.prenom?.charAt(0), admin?.nom?.charAt(0)] }), _jsxs("div", { className: "ml-3", children: [_jsxs("p", { className: "text-sm font-medium text-gray-800", children: [admin?.prenom, " ", admin?.nom] }), _jsx("p", { className: "text-xs text-gray-500", children: admin?.role || 'Administrateur' })] }), _jsx("button", { onClick: handleLogout, className: "ml-auto p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-100", children: _jsx(LogOut, { className: "w-4 h-4" }) })] }) })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200", children: [_jsx("div", { className: "md:hidden", children: _jsx("button", { className: "p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100", children: _jsx("svg", { width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M3 12h18M3 6h18M3 18h18" }) }) }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: activeTab === 'dashboard' ? 'Tableau de bord' :
                                            activeTab === 'gie' ? 'Gestion des GIE' :
                                                activeTab === 'users' ? 'Gestion des utilisateurs' :
                                                    activeTab === 'adhesions' ? 'Gestion des adhésions' :
                                                        activeTab === 'reports' ? 'Rapports et analyses' :
                                                            activeTab === 'logs' ? 'Journal d\'Activité' :
                                                                activeTab === 'settings' ? 'Paramètres système' :
                                                                    'Paramètres système' }), activeTab === 'dashboard' && (_jsx("span", { className: "text-xs font-medium px-2 py-1 bg-orange-100 text-orange-600 rounded-full", children: "Admin" }))] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "relative", children: _jsxs("button", { className: "relative p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-100 rounded-full", children: [_jsx(Bell, { className: "w-5 h-5" }), _jsx("span", { className: "absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full" })] }) }), _jsx("div", { className: "md:hidden", children: _jsxs("button", { className: "flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white", children: [admin?.prenom?.charAt(0), admin?.nom?.charAt(0)] }) })] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6", children: [_jsxs("div", { className: "mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900", children: activeTab === 'dashboard' ? 'Vue d\'ensemble' :
                                                    activeTab === 'gie' ? 'Liste des GIE' :
                                                        activeTab === 'users' ? 'Utilisateurs du système' :
                                                            activeTab === 'adhesions' ? 'Demandes d\'adhésion' :
                                                                activeTab === 'reports' ? 'Rapports et statistiques' :
                                                                    'Configuration système' }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: activeTab === 'dashboard'
                                                    ? `Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                                                    : 'Gérez efficacement votre plateforme FEVEO 2050' })] }), _jsx("div", {})] }), renderDashboardContent()] })] }), showInvestModal && (_jsx("div", { className: "fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Activer l'investissement" }), _jsxs("p", { className: "text-gray-600 mb-4", children: ["Vous \u00EAtes sur le point d'activer l'investissement pour ", _jsx("span", { className: "font-semibold", children: selectedGieName }), ".", gies.find(g => g._id === selectedGieId)?.investissementActif && (_jsxs("span", { className: "block mt-1 text-green-600", children: ["Ce GIE a d\u00E9j\u00E0 ", gies.find(g => g._id === selectedGieId)?.daysInvestedSuccess || 0, " jours d'investissement actif."] })), "Veuillez sp\u00E9cifier la dur\u00E9e additionnelle en jours."] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "investmentDays", className: "block text-sm font-medium text-gray-700", children: "Dur\u00E9e (en jours)" }), _jsx("input", { type: "number", id: "investmentDays", value: investmentDays, onChange: (e) => setInvestmentDays(parseInt(e.target.value)), min: "1", className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" })] }), _jsxs("div", { className: "flex justify-end space-x-3 mt-6", children: [_jsx("button", { type: "button", className: "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500", onClick: () => setShowInvestModal(false), children: "Annuler" }), _jsx("button", { type: "button", className: "px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", onClick: activerInvestissement, disabled: processingInvestment, children: processingInvestment ? 'Activation...' : 'Activer' })] })] }) })), showGiesEnAttenteModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-orange-100 rounded-lg", children: _jsx(AlertCircle, { className: "w-6 h-6 text-orange-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "GIEs en attente d'adh\u00E9sion" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [giesEnAttenteList.length, " GIE(s) en attente"] })] })] }), _jsx("button", { onClick: () => setShowGiesEnAttenteModal(false), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: loadingGiesEnAttente ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" }), _jsx("p", { className: "text-gray-600", children: "Chargement des GIEs en attente..." })] })) : giesEnAttenteList.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Aucun GIE en attente d'adh\u00E9sion" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Identifiant" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom du GIE" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "R\u00E9gion" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partement" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Pr\u00E9sidente" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date cr\u00E9ation" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: giesEnAttenteList.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900", children: gie.identifiantGIE }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-900", children: gie.nomGIE }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: gie.region }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: gie.departement }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: gie.commune }), _jsxs("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-900", children: [gie.presidenteNom, " ", gie.presidentePrenom] }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: gie.presidenteTelephone }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: new Date(gie.dateCreation).toLocaleDateString('fr-FR') }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm", children: _jsx("a", { href: `/admin/gies/${gie._id}`, className: "text-primary-600 hover:text-primary-800 font-medium", children: "Voir d\u00E9tails" }) })] }, gie._id))) })] }) })) }), _jsxs("div", { className: "flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Total : ", giesEnAttenteList.length, " GIE(s)"] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowGiesEnAttenteModal(false), className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Fermer" }), _jsxs("button", { onClick: downloadGiesEnAttenteExcel, disabled: giesEnAttenteList.length === 0, className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Download, { className: "w-4 h-4" }), "T\u00E9l\u00E9charger Excel"] })] })] })] }) })), showUtilisateursModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(Users, { className: "w-6 h-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Liste des utilisateurs" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [utilisateursList.length, " utilisateur(s)"] })] })] }), _jsx("button", { onClick: () => setShowUtilisateursModal(false), className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-500" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: loadingUtilisateurs ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) })) : utilisateursList.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Aucun utilisateur trouv\u00E9" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom complet" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "T\u00E9l\u00E9phone" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "R\u00F4le" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date cr\u00E9ation" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: utilisateursList.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900", children: [user.nom, " ", user.prenom] }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: user.email }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: user.telephone }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                                user.role === 'coordinateur' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'}`, children: user.role }) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: user.isActive ? 'Actif' : 'Inactif' }) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500", children: user.dateCreation ? new Date(user.dateCreation).toLocaleDateString('fr-FR') : 'N/A' })] }, user._id))) })] }) })) }), _jsxs("div", { className: "flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Total : ", utilisateursList.length, " utilisateur(s)"] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setShowUtilisateursModal(false), className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Fermer" }), _jsxs("button", { onClick: downloadUtilisateursExcel, disabled: utilisateursList.length === 0, className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Download, { className: "w-4 h-4" }), "T\u00E9l\u00E9charger Excel"] })] })] })] }) }))] }));
};
export default AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map