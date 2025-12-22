import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Wallet as WalletIcon, TrendingUp, BarChart3, Users, FileText, Settings as SettingsIcon, ExternalLink, PiggyBank } from 'lucide-react';
import WalletOverviewTab from './components/WalletOverviewTab';
import InvestmentsTab from './components/InvestmentsTab';
import RevenueTab from './components/RevenueTab';
import MembersTab from './components/MembersTab';
import DocumentsTab from './components/DocumentsTab';
import SettingsTab from './components/SettingsTab';
import EpargneListTab from './components/EpargneListTab';
import { walletApi, formatWalletDocumentFileName } from './services/walletApi';
const DEFAULT_WALLET_DATA = {
    gieInfo: {
        _id: '',
        code: 'FEVEO-05-01-01-01-001',
        nom: 'GIE Agriculture Bio Dakar',
        presidente: 'Aïssatou Diallo',
        daysInvestedSuccess: 10,
        status: 'ACTIVE'
    },
    balance: {
        current: 156000,
        invested: 60000,
        returns: 8400
    },
    cycleInfo: {
        currentDay: 10,
        totalDays: 1826,
        dailyInvestment: 6000,
        daysInvestedSuccess: 10,
        nextInvestmentDate: (() => {
            const startDate = new Date('2025-04-01');
            startDate.setDate(startDate.getDate() + 10);
            return startDate.toISOString();
        })()
    },
    transactions: []
};
const WalletDashboard = () => {
    const navigate = useNavigate();
    const [walletData, setWalletData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('wallet');
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [transactionStatusFilter, setTransactionStatusFilter] = useState('SUCCESS');
    const [displayedMonth, setDisplayedMonth] = useState(() => new Date('2025-04-01'));
    const [investmentType, setInvestmentType] = useState('classique');
    const [revenueActivityType, setRevenueActivityType] = useState('commerce');
    const [membres, setMembres] = useState([]);
    const [membresLoading, setMembresLoading] = useState(false);
    const [membresStats, setMembresStats] = useState(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [documents, setDocuments] = useState({
        statuts: false,
        reglementInterieur: false,
        procesVerbal: false,
        demandeAdhesion: false
    });
    const [showAddActivityModal, setShowAddActivityModal] = useState(false);
    // États pour le modal d'épargne volontaire
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [savingsAmount, setSavingsAmount] = useState('');
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    // État pour le modal des conditions Feveo Habitat
    const [showHabitatConditionsModal, setShowHabitatConditionsModal] = useState(false);
    const [memberForm, setMemberForm] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        fonction: 'Membre',
        genre: 'femme',
        cin: '',
        dateNaissance: '',
        profession: '',
        adresse: '',
        statut: 'Actif'
    });
    const createTimeoutSignal = (timeoutMs) => {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
        return {
            signal: controller.signal,
            cancel: () => window.clearTimeout(timeoutId)
        };
    };
    useEffect(() => {
        const loadWalletData = async () => {
            try {
                const storedData = localStorage.getItem('walletData');
                let gieCode = null;
                if (storedData) {
                    const data = JSON.parse(storedData);
                    gieCode = data?.gieInfo?.code;
                }
                if (!gieCode) {
                    setWalletData(DEFAULT_WALLET_DATA);
                    setIsLoading(false);
                    return;
                }
                try {
                    const response = await walletApi.fetchWalletInfo(gieCode);
                    if (response.success && response.data) {
                        const apiData = response.data;
                        const transformedData = {
                            gieInfo: {
                                _id: apiData.gieInfo._id,
                                code: apiData.gieInfo.identifiantGIE,
                                nom: apiData.gieInfo.nomGIE,
                                presidente: `${apiData.gieInfo.presidenteInfo.prenom} ${apiData.gieInfo.presidenteInfo.nom}`,
                                presidenteInfo: apiData.gieInfo.presidenteInfo,
                                localisation: apiData.gieInfo.localisation,
                                description: apiData.gieInfo.description || '',
                                daysInvestedSuccess: apiData.gieInfo.daysInvestedSuccess || 0,
                                status: apiData.gieInfo.statut
                            },
                            balance: {
                                current: apiData.financialStats.soldeTotal || 0,
                                invested: apiData.financialStats.balanceInvestissement || 0,
                                returns: apiData.financialStats.balanceRevenu || 0
                            },
                            cycleInfo: {
                                currentDay: apiData.gieInfo.daysInvestedSuccess || 0,
                                totalDays: apiData.cycleInfo.totalDays || 1826,
                                dailyInvestment: apiData.cycleInfo.dailyInvestment || 6000,
                                daysInvestedSuccess: apiData.gieInfo.daysInvestedSuccess || 0,
                                nextInvestmentDate: (() => {
                                    const startDate = new Date('2025-04-01');
                                    const daysInvested = apiData.gieInfo.daysInvestedSuccess || 0;
                                    const nextDay = new Date(startDate);
                                    nextDay.setDate(startDate.getDate() + daysInvested);
                                    return nextDay.toISOString();
                                })()
                            },
                            transactions: []
                        };
                        setWalletData(transformedData);
                        localStorage.setItem('walletData', JSON.stringify(transformedData));
                    }
                    else {
                        const data = JSON.parse(storedData);
                        setWalletData(data);
                    }
                }
                catch (apiError) {
                    console.warn('Erreur API, utilisation des données en cache:', apiError);
                    const data = JSON.parse(storedData);
                    setWalletData(data);
                }
            }
            catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                setWalletData(DEFAULT_WALLET_DATA);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadWalletData();
    }, []);
    const loadTransactions = useCallback(async () => {
        if (!walletData?.gieInfo?.code) {
            console.warn('Impossible de charger les transactions: Code GIE manquant');
            return;
        }
        setTransactionsLoading(true);
        try {
            const sessionToken = localStorage.getItem('walletSession') || undefined;
            const data = await walletApi.fetchTransactions(walletData.gieInfo.code, sessionToken);
            if (data?.status === 'OK' && Array.isArray(data.data)) {
                const formattedTransactions = data.data.map((transaction) => {
                    let formattedDate;
                    try {
                        // Utiliser createdAt ou updatedAt de la transaction
                        const dateSource = transaction.createdAt || transaction.updatedAt || transaction.date;
                        if (dateSource) {
                            const dateObj = new Date(dateSource);
                            if (!Number.isNaN(dateObj.getTime()) && dateObj.getFullYear() > 2000) {
                                formattedDate = dateObj.toISOString().split('T')[0];
                            }
                            else {
                                console.warn('Date invalide pour la transaction:', transaction._id, dateSource);
                                formattedDate = ''; // Date vide plutôt que date du jour
                            }
                        }
                        else {
                            console.warn('Aucune date trouvée pour la transaction:', transaction._id);
                            formattedDate = ''; // Date vide plutôt que date du jour
                        }
                    }
                    catch (error) {
                        console.error('Erreur lors du traitement de la date:', error);
                        formattedDate = ''; // Date vide plutôt que date du jour
                    }
                    return {
                        id: transaction._id,
                        type: transaction.operationType === 'ADHESION'
                            ? 'adhesion'
                            : transaction.operationType === 'INVESTISSEMENT'
                                ? 'investment'
                                : transaction.operationType === 'EPARGNE_GIE' || transaction.operationType === 'EPARGNE'
                                    ? 'gie'
                                    : 'other',
                        amount: transaction.amount || 0,
                        date: formattedDate,
                        description: transaction.operationType === 'ADHESION'
                            ? "Frais d'adhésion FEVEO 2050"
                            : transaction.operationType === 'INVESTISSEMENT'
                                ? `Investissement ${transaction.daysInvested || ''} ${transaction.daysInvested === 1 ? 'jour' : 'jours'}`
                                : transaction.operationType === 'EPARGNE_GIE' || transaction.operationType === 'EPARGNE'
                                    ? `Épargne GIE`
                                    : transaction.description || 'Transaction',
                        status: transaction.status,
                        method: transaction.method
                    };
                });
                setTransactions(formattedTransactions);
            }
            else {
                console.warn('Format de données inattendu:', data);
                setTransactions([]);
            }
        }
        catch (error) {
            console.error('Erreur lors du chargement des transactions:', error);
            setTransactions([
                { type: 'investment', amount: 6000, date: '2025-07-26', description: 'Investissement jour 12', status: 'SUCCESS' },
                { type: 'return', amount: 420, date: '2025-07-25', description: 'Retour investissement jour 11', status: 'SUCCESS' },
                { type: 'investment', amount: 6000, date: '2025-07-25', description: 'Investissement jour 11', status: 'SUCCESS' }
            ]);
        }
        finally {
            setTransactionsLoading(false);
        }
    }, [walletData?.gieInfo?.code]);
    useEffect(() => {
        if (walletData && !isLoading) {
            void loadTransactions();
        }
    }, [walletData, isLoading, loadTransactions]);
    const loadMembres = useCallback(async () => {
        if (!walletData?.gieInfo?.code)
            return;
        setMembresLoading(true);
        const timeout = createTimeoutSignal(10000);
        try {
            const response = await walletApi.fetchMembers(walletData.gieInfo.code, timeout.signal);
            if (response?.data?.membres) {
                setMembres(response.data.membres);
            }
            else {
                console.error('Format de données inattendu:', response);
                setMembres([]);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des membres:', error);
            setMembres([
                {
                    nom: 'GNING',
                    prenom: 'FATOU',
                    fonction: 'Présidente',
                    cin: '22670197500225',
                    telephone: '765301149',
                    genre: 'femme',
                    _id: { $oid: 'president123' }
                },
                {
                    nom: 'THIAO',
                    prenom: 'THIORO',
                    fonction: 'Secrétaire',
                    cin: '2597198400032',
                    telephone: '773941632',
                    genre: 'femme',
                    _id: { $oid: 'secretaire456' }
                },
                {
                    nom: 'DIOUF',
                    prenom: 'FATOU',
                    fonction: 'Trésorière',
                    cin: '2670199100067',
                    telephone: '766468286',
                    genre: 'femme',
                    _id: { $oid: 'tresoriere789' }
                }
            ]);
        }
        finally {
            timeout.cancel();
            setMembresLoading(false);
        }
    }, [walletData?.gieInfo?.code]);
    const loadMembresStats = useCallback(async () => {
        if (!walletData?.gieInfo?.code)
            return;
        const timeout = createTimeoutSignal(10000);
        try {
            const response = await walletApi.fetchMembersStats(walletData.gieInfo.code, timeout.signal);
            if (response?.data) {
                setMembresStats(response.data);
            }
            else {
                console.error('Format de données inattendu pour les statistiques:', response);
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        }
        finally {
            timeout.cancel();
        }
    }, [walletData?.gieInfo?.code]);
    const loadDocuments = useCallback(async () => {
        if (!walletData?.gieInfo?.code)
            return;
        setDocumentsLoading(true);
        const timeout = createTimeoutSignal(10000);
        try {
            const response = await walletApi.fetchDocuments(walletData.gieInfo.code, timeout.signal);
            if (response?.data?.documentsGeneres) {
                setDocuments(response.data.documentsGeneres);
            }
            else {
                console.error('Format de données inattendu pour les documents:', response);
                setDocuments({
                    statuts: Math.random() > 0.5,
                    reglementInterieur: Math.random() > 0.5,
                    procesVerbal: Math.random() > 0.5,
                    demandeAdhesion: Math.random() > 0.5
                });
            }
        }
        catch (error) {
            console.error('Erreur lors de la récupération des documents:', error);
            setDocuments({ statuts: true, reglementInterieur: true, procesVerbal: true, demandeAdhesion: true });
        }
        finally {
            timeout.cancel();
            setDocumentsLoading(false);
        }
    }, [walletData?.gieInfo?.code]);
    useEffect(() => {
        if (activeTab === 'membres' && walletData?.gieInfo?.code) {
            void loadMembres();
            void loadMembresStats();
        }
        else if (activeTab === 'documents' && walletData?.gieInfo?.code) {
            void loadDocuments();
        }
    }, [activeTab, walletData?.gieInfo?.code, loadDocuments, loadMembres, loadMembresStats]);
    const filteredTransactions = useMemo(() => {
        if (transactionStatusFilter === 'PENDING') {
            return transactions.filter((transaction) => ['PENDING'].includes(transaction.status));
        }
        return transactions.filter((transaction) => transaction.status === 'SUCCESS');
    }, [transactions, transactionStatusFilter]);
    const isSuccessFilter = transactionStatusFilter === 'SUCCESS';
    const emptyTransactionsMessage = isSuccessFilter
        ? 'Aucune transaction réussie pour ce GIE.'
        : 'Aucune transaction échouée pour ce GIE.';
    const handleMemberInputChange = (event) => {
        const { name, value } = event.target;
        setMemberForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const resetMemberForm = () => {
        setMemberForm({
            nom: '',
            prenom: '',
            telephone: '',
            fonction: 'Membre',
            genre: 'femme',
            cin: '',
            dateNaissance: '',
            profession: '',
            adresse: '',
            statut: 'Actif'
        });
    };
    const handleAddMember = async (event) => {
        event.preventDefault();
        if (!walletData?.gieInfo?.code)
            return;
        const timeout = createTimeoutSignal(10000);
        try {
            const payload = {
                nom: memberForm.nom,
                prenom: memberForm.prenom,
                fonction: memberForm.fonction,
                cin: memberForm.cin,
                telephone: memberForm.telephone,
                genre: memberForm.genre
            };
            console.log('📤 Payload envoyé:', payload);
            await walletApi.addMember(walletData.gieInfo.code, payload, timeout.signal);
            toast.success('Membre ajouté avec succès !');
            setShowAddMemberModal(false);
            resetMemberForm();
            await loadMembres();
            await loadMembresStats();
        }
        catch (error) {
            console.error("Erreur lors de l'ajout du membre:", error);
            alert(error?.message || "Erreur lors de l'ajout du membre");
        }
        finally {
            timeout.cancel();
        }
    };
    const handleEditMember = async (event) => {
        event.preventDefault();
        if (!walletData?.gieInfo?.code || !selectedMember)
            return;
        const timeout = createTimeoutSignal(10000);
        try {
            const payload = {
                nom: memberForm.nom,
                prenom: memberForm.prenom,
                fonction: memberForm.fonction,
                cin: memberForm.cin,
                telephone: memberForm.telephone,
                genre: memberForm.genre
            };
            const memberId = selectedMember._id?.$oid || selectedMember._id || selectedMember.cin;
            await walletApi.updateMember(walletData.gieInfo.code, String(memberId), payload, timeout.signal);
            toast.success('Membre modifié avec succès !');
            setShowEditMemberModal(false);
            resetMemberForm();
            setSelectedMember(null);
            await loadMembres();
            await loadMembresStats();
        }
        catch (error) {
            console.error('Erreur lors de la modification du membre:', error);
            toast.error(error?.message || "Échec de la modification du membre");
        }
        finally {
            timeout.cancel();
        }
    };
    const handleDeleteMember = async (membre) => {
        if (!walletData?.gieInfo?.code)
            return;
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${membre.prenom} ${membre.nom} ?`)) {
            return;
        }
        const timeout = createTimeoutSignal(10000);
        try {
            const memberId = membre._id?.$oid || membre._id || membre.cin;
            await walletApi.deleteMember(walletData.gieInfo.code, String(memberId), timeout.signal);
            toast.success('Membre supprimé avec succès !');
            setShowEditMemberModal(false);
            await loadMembres();
            await loadMembresStats();
        }
        catch (error) {
            console.error('Erreur lors de la suppression du membre:', error);
            alert(error?.message || 'Erreur lors de la suppression du membre');
        }
        finally {
            timeout.cancel();
        }
    };
    const openEditModal = (membre) => {
        setSelectedMember(membre);
        setMemberForm({
            nom: membre.nom || '',
            prenom: membre.prenom || '',
            telephone: membre.telephone || '',
            fonction: membre.fonction || 'Membre',
            genre: membre.genre || 'femme',
            cin: membre.cin || '',
            dateNaissance: membre.dateNaissance ? membre.dateNaissance.split('T')[0] : '',
            profession: membre.profession || '',
            adresse: membre.adresse || '',
            statut: membre.statut || 'Actif'
        });
        setShowEditMemberModal(true);
    };
    const handleDocumentDownload = async (documentType) => {
        if (!walletData?.gieInfo?.code)
            return;
        try {
            const blob = await walletApi.downloadDocument(walletData.gieInfo.code, documentType);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = formatWalletDocumentFileName(walletData.gieInfo.code, documentType);
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success(`Téléchargement du document "${a.download}" réussi !`);
        }
        catch (error) {
            console.error(`Erreur lors du téléchargement du document ${documentType}:`, error);
            toast.error('Erreur lors du téléchargement du document');
        }
    };
    const handleInvestment = async (planId) => {
        if (!walletData?.gieInfo?.code) {
            console.warn("Impossible d'effectuer l'opération: Code GIE manquant");
            return;
        }
        const investmentPlan = investmentPlans.find((plan) => plan.id === planId);
        const savingsPlan = savingsPlans.find((plan) => plan.id === planId);
        const isInvestment = Boolean(investmentPlan);
        if (!investmentPlan && !savingsPlan) {
            console.error('Plan non trouvé:', planId);
            return;
        }
        // Si c'est l'épargne volontaire (plan 101), Épargne Tabaski (plan 102) ou Épargne Feveo Habitat (plan 103), ouvrir le modal approprié
        if (savingsPlan && (savingsPlan.id === 101 || savingsPlan.id === 102)) {
            setSelectedPlanId(planId);
            setSavingsAmount('');
            setShowSavingsModal(true);
            return;
        }
        // Si c'est Épargne Feveo Habitat (plan 103), afficher d'abord les conditions puis le modal
        if (savingsPlan && savingsPlan.id === 103) {
            setShowHabitatConditionsModal(true);
            return;
        }
        let amount;
        let daysInvested;
        if (isInvestment && investmentPlan) {
            amount = investmentPlan.amount;
            daysInvested = investmentPlan.daysInvested;
        }
        else if (savingsPlan) {
            amount = savingsPlan.amount || savingsPlan.minAmount || 5000;
        }
        else {
            return;
        }
        const operationType = isInvestment ? 'INVESTISSEMENT' : 'EPARGNE';
        const confirmMessage = isInvestment && investmentPlan
            ? `Êtes-vous sûr de vouloir investir ${formatCurrency(amount)} pour ${investmentPlan.daysInvested} jours?`
            : `Êtes-vous sûr de vouloir épargner ${formatCurrency(amount)}?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }
        try {
            const actionVerb = operationType === 'INVESTISSEMENT' ? 'investissement' : 'épargne';
            toast.info(`Traitement de votre ${actionVerb} de ${formatCurrency(amount)}...`);
            const finalAmount = operationType === 'INVESTISSEMENT' && daysInvested
                ? 6000 * daysInvested + 6000 * daysInvested * 0.01
                : amount;
            const transactionResponse = await walletApi.createTransaction({
                gieCode: walletData.gieInfo.code,
                amount: finalAmount,
                method: 'WAVE',
                daysInvested,
                operationType
            });
            toast.success(`${operationType === 'INVESTISSEMENT' ? 'Investissement' : 'Épargne'} de ${formatCurrency(amount)} effectué avec succès!`);
            const transaction = transactionResponse.data;
            const paymentUrl = transaction?.urlWave;
            const transactionId = transaction?.reference;
            if (paymentUrl) {
                const message = `🎉 Transaction ${operationType === 'INVESTISSEMENT' ? "d'investissement" : "d'épargne"} créée avec succès !\n\n` +
                    `Détails :\n` +
                    `• Code GIE: ${walletData.gieInfo.code}\n` +
                    `• Montant: ${formatCurrency(amount)}\n` +
                    (daysInvested ? `• Période: ${daysInvested} jours\n` : '') +
                    `• Transaction ID: ${transactionId}\n\n` +
                    'Redirection vers Wave...';
                alert(message);
                window.open(paymentUrl, '_blank');
            }
        }
        catch (error) {
            console.error("Erreur lors de la requête d'investissement:", error);
            alert('Une erreur est survenue lors de la transaction');
        }
    };
    const handleSavingsSubmit = async () => {
        const amount = parseFloat(savingsAmount);
        // Validation du montant minimum (5000 FCFA pour tous les plans)
        const minAmount = 5000;
        if (!amount || amount < minAmount) {
            toast.error(`Le montant minimum est de ${formatCurrency(minAmount)}`);
            return;
        }
        setShowSavingsModal(false);
        const savingsType = selectedPlanId === 101 ? 'épargne volontaire'
            : selectedPlanId === 102 ? 'épargne Tabaski'
                : 'épargne Feveo Habitat';
        const savingsEmoji = selectedPlanId === 101 ? '💰'
            : selectedPlanId === 102 ? '🕌'
                : '🏡';
        try {
            toast.info(`Traitement de votre ${savingsType} de ${formatCurrency(amount)}...`);
            const transactionResponse = await walletApi.createTransaction({
                gieCode: walletData.gieInfo.code,
                amount,
                method: 'WAVE',
                operationType: 'EPARGNE'
            });
            toast.success(`Épargne de ${formatCurrency(amount)} effectuée avec succès!`);
            const transaction = transactionResponse.data;
            const paymentUrl = transaction?.urlWave;
            const transactionId = transaction?.reference;
            if (paymentUrl) {
                const message = `${savingsEmoji} Transaction de ${savingsType} créée avec succès !\n\n` +
                    `Détails :\n` +
                    `• Code GIE: ${walletData.gieInfo.code}\n` +
                    `• Montant: ${formatCurrency(amount)}\n` +
                    `• Transaction ID: ${transactionId}\n\n` +
                    'Redirection vers Wave...';
                alert(message);
                window.open(paymentUrl, '_blank');
            }
        }
        catch (error) {
            console.error(`Erreur lors de la ${savingsType}:`, error);
            toast.error(`Une erreur est survenue lors de la ${savingsType}`);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('walletData');
        localStorage.removeItem('walletSession');
        navigate('/');
    };
    const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount);
    const revenueActivityData = {
        commerce: [],
        agriculture: [],
        industrie: []
    };
    const getInvestmentDates = () => {
        const startDate = new Date('2025-04-01');
        const totalDays = 1826;
        const dates = [];
        const now = new Date();
        const diffTime = now.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const currentDay = Math.max(1, Math.min(diffDays + 1, totalDays));
        const rawDays = walletData?.gieInfo?.daysInvestedSuccess;
        const successDaysCount = Array.isArray(rawDays)
            ? rawDays.length
            : typeof rawDays === 'number'
                ? Math.max(0, Math.floor(rawDays))
                : 0;
        const successDaysSet = new Set();
        for (let day = 1; day <= successDaysCount; day += 1) {
            successDaysSet.add(day);
        }
        for (let i = 0; i < totalDays; i += 1) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayNumber = i + 1;
            const isSuccessfulInvestment = successDaysSet.has(dayNumber);
            dates.push({
                date,
                dayNumber,
                isInvested: dayNumber <= currentDay,
                isToday: dayNumber === currentDay,
                isSuccessfulInvestment
            });
        }
        if (walletData && walletData.cycleInfo) {
            walletData.cycleInfo.totalDays = totalDays;
            walletData.cycleInfo.currentDay = currentDay;
        }
        return dates;
    };
    const investmentDates = getInvestmentDates();
    const groupByMonth = (dates) => {
        const grouped = {};
        dates.forEach((dateObj) => {
            const { date } = dateObj;
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            if (!grouped[monthKey]) {
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                const startDay = (firstDay.getDay() + 6) % 7;
                grouped[monthKey] = {
                    startDay,
                    daysInMonth: lastDay.getDate(),
                    investmentDays: [],
                    successfulDays: []
                };
            }
            grouped[monthKey].investmentDays.push(date.getDate());
            if (dateObj.isSuccessfulInvestment) {
                grouped[monthKey].successfulDays.push(date.getDate());
            }
        });
        return grouped;
    };
    const monthlyData = groupByMonth(investmentDates);
    const investmentPlans = [
        {
            id: 1,
            name: 'Plan Quotidien',
            description: "Investissement quotidien de 6 000 FCFA",
            amount: 6000,
            frequency: 'Quotidien',
            duration: '60 jours',
            expectedReturn: '7% par jour',
            isActive: true,
            totalInvested: (walletData?.cycleInfo.currentDay || 0) * 6000,
            remainingDays: (walletData?.cycleInfo.totalDays || 0) - (walletData?.cycleInfo.currentDay || 0),
            daysInvested: 1,
            type: 'classique'
        },
        {
            id: 2,
            name: 'Plan 10 Jours',
            description: 'Investissement de 60 000 FCFA tous les 10 jours',
            amount: 60000,
            frequency: '10 Jours',
            duration: '10 jours',
            expectedReturn: '7.5% par période',
            isActive: false,
            totalInvested: 0,
            remainingDays: 0,
            daysInvested: 10,
            type: 'classique'
        },
        {
            id: 3,
            name: 'Plan 15 Jours',
            description: 'Investissement de 90 000 FCFA tous les 15 jours',
            amount: 90000,
            frequency: '15 Jours',
            duration: '15 jours',
            expectedReturn: '8% par période',
            isActive: false,
            totalInvested: 0,
            remainingDays: 0,
            daysInvested: 15,
            type: 'classique'
        },
        {
            id: 4,
            name: 'Plan 30 Jours',
            description: 'Investissement de 180 000 FCFA tous les 30 jours',
            amount: 180000,
            frequency: '30 Jours',
            duration: '30 jours',
            expectedReturn: '9% par période',
            isActive: false,
            totalInvested: 0,
            remainingDays: 0,
            daysInvested: 30,
            type: 'classique'
        }
    ];
    const savingsPlans = [
        {
            id: 101,
            name: 'Épargne volontaire',
            description: 'Déposez le montant de votre choix quand vous le souhaitez',
            minAmount: 5000,
            expectedReturn: '3% annuel',
            isActive: true,
            totalSaved: 150000,
            type: 'epargne'
        },
        {
            id: 102,
            name: 'Épargne Tabaski',
            description: "Plan d'épargne avec versement mensuel fixe",
            amount: 25000,
            frequency: 'Mensuel',
            duration: 'Illimité',
            expectedReturn: '4% annuel',
            isActive: false,
            totalSaved: 0,
            type: 'epargne'
        },
        {
            id: 103,
            name: 'Epargne Feveo Habitat',
            description: 'Plan d\'épargne avec versement mensuel libre',
            minAmount: 5000,
            frequency: 'Mensuel',
            expectedReturn: '5% à terme',
            isActive: false,
            totalSaved: 0,
            type: 'epargne'
        },
        {
            id: 104,
            name: 'Fonds Social GIE',
            description: 'Contribution au fonds social du GIE',
            minAmount: 2000,
            frequency: 'Mensuel',
            expectedReturn: 'Solidarité',
            isActive: false,
            totalSaved: 0,
            type: 'epargne'
        }
    ];
    const goToPreviousMonth = () => {
        const newDate = new Date(displayedMonth);
        newDate.setMonth(displayedMonth.getMonth() - 1);
        if (newDate >= new Date('2025-04-01')) {
            setDisplayedMonth(newDate);
        }
    };
    const goToNextMonth = () => {
        const newDate = new Date(displayedMonth);
        newDate.setMonth(displayedMonth.getMonth() + 1);
        const endDate = new Date('2030-03-31');
        if (newDate <= endDate) {
            setDisplayedMonth(newDate);
        }
    };
    const goToCurrentMonth = () => {
        const now = new Date();
        if (now < new Date('2025-04-01')) {
            setDisplayedMonth(new Date('2025-04-01'));
        }
        else if (now > new Date('2030-03-31')) {
            setDisplayedMonth(new Date('2030-03-01'));
        }
        else {
            setDisplayedMonth(now);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" }) }));
    }
    if (!walletData) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-600 mb-4", children: "Erreur lors du chargement des donn\u00E9es du wallet" }), _jsx("button", { onClick: () => navigate('/wallet/login'), className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700", children: "Retour \u00E0 la connexion" })] }) }));
    }
    const renderContent = () => {
        switch (activeTab) {
            case 'investments':
                return (_jsx(InvestmentsTab, { walletBalance: walletData.balance, cycleInfo: walletData.cycleInfo, investmentType: investmentType, setInvestmentType: setInvestmentType, investmentPlans: investmentPlans, savingsPlans: savingsPlans, handleInvestment: handleInvestment, formatCurrency: formatCurrency, transactions: transactions }));
            case 'revenue':
                return (_jsx(RevenueTab, { revenueActivityType: revenueActivityType, setRevenueActivityType: setRevenueActivityType, revenueActivityData: revenueActivityData, formatCurrency: formatCurrency, onAddActivity: () => setShowAddActivityModal(true) }));
            case 'epargne':
                return (_jsx(EpargneListTab, { gieCode: walletData.gieInfo.code, gieId: walletData.gieInfo._id || walletData.gieInfo.code }));
            case 'membres':
                return (_jsx(MembersTab, { membres: membres, membresStats: membresStats, membresLoading: membresLoading, onAddMember: () => setShowAddMemberModal(true), onRefreshMembers: () => void loadMembres(), onEditMember: openEditModal, onDeleteMember: handleDeleteMember }));
            case 'documents':
                return (_jsx(DocumentsTab, { documents: documents, documentsLoading: documentsLoading, onDownloadDocument: handleDocumentDownload }));
            case 'settings':
                return _jsx(SettingsTab, { walletData: walletData, formatCurrency: formatCurrency });
            case 'wallet':
            default:
                return (_jsx(WalletOverviewTab, { walletData: walletData, formatCurrency: formatCurrency, displayedMonth: displayedMonth, monthlyData: monthlyData, goToPreviousMonth: goToPreviousMonth, goToNextMonth: goToNextMonth, goToCurrentMonth: goToCurrentMonth, transactionStatusFilter: transactionStatusFilter, setTransactionStatusFilter: setTransactionStatusFilter, loadTransactions: () => void loadTransactions(), transactionsLoading: transactionsLoading, filteredTransactions: filteredTransactions, emptyTransactionsMessage: emptyTransactionsMessage, transactions: transactions }));
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4", children: [_jsxs("div", { className: "flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto", children: [_jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-white font-bold text-sm", children: "F" }) }), _jsxs("div", { className: "min-w-0 flex-1 sm:flex-none", children: [_jsx("h1", { className: "text-base sm:text-lg font-bold text-gray-900 truncate", children: "Wallet GIE" }), _jsx("p", { className: "text-xs sm:text-sm text-gray-600 truncate", children: walletData.gieInfo.code })] })] }), _jsxs("div", { className: "flex items-center justify-between w-full sm:w-auto sm:space-x-4", children: [_jsxs("div", { className: "text-left sm:text-right", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: walletData.gieInfo.presidente }), _jsx("p", { className: "text-xs text-gray-500", children: "Pr\u00E9sidente" })] }), _jsx("button", { onClick: handleLogout, className: "p-2 text-gray-600 hover:text-red-600 transition-colors flex-shrink-0", children: _jsx(ExternalLink, { className: "w-5 h-5" }) })] })] }) }), _jsxs("div", { className: "flex flex-col lg:flex-row", children: [_jsx("div", { className: "lg:w-64 bg-white shadow-sm lg:h-screen overflow-x-auto lg:overflow-x-visible", children: _jsxs("nav", { className: "p-2 sm:p-4 flex lg:flex-col gap-1 sm:gap-0 overflow-x-auto lg:overflow-x-visible whitespace-nowrap lg:whitespace-normal", children: [_jsxs("button", { onClick: () => setActiveTab('wallet'), className: `flex-shrink-0 lg:w-full flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg lg:mb-2 transition-colors text-sm sm:text-base ${activeTab === 'wallet' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(WalletIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" }), _jsx("span", { className: "font-medium hidden sm:inline", children: "Mon Wallet" })] }), [
                                    { id: 'investments', name: 'Investissements', icon: TrendingUp },
                                    { id: 'revenue', name: "Revenus d'Activité", icon: BarChart3 },
                                    { id: 'epargne', name: 'Épargne Volontaire', icon: PiggyBank },
                                    { id: 'membres', name: 'Membres', icon: Users },
                                    { id: 'documents', name: 'Documents', icon: FileText },
                                    { id: 'settings', name: 'Paramètres', icon: SettingsIcon }
                                ].map((item) => (_jsxs("button", { onClick: () => setActiveTab(item.id), className: `flex-shrink-0 lg:w-full flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg lg:mb-2 transition-colors text-sm sm:text-base ${activeTab === item.id ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`, children: [_jsx(item.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" }), _jsx("span", { className: "font-medium hidden sm:inline", children: item.name })] }, item.id)))] }) }), _jsxs("div", { className: "flex-1 p-4 sm:p-6", children: [_jsxs("div", { className: "mb-4 sm:mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Mon Wallet GIE" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Derni\u00E8re mise \u00E0 jour: ", new Date().toLocaleDateString('fr-FR')] })] }), renderContent()] })] }), showAddActivityModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Ajouter une Nouvelle Activit\u00E9" }), _jsx("button", { onClick: () => setShowAddActivityModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }) }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); toast.info('Fonctionnalité en développement'); setShowAddActivityModal(false); }, className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type d'Activit\u00E9*" }), _jsxs("select", { required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un type" }), _jsx("option", { value: "commerce", children: "Commerce & Distribution" }), _jsx("option", { value: "agriculture", children: "Services Agriculture" }), _jsx("option", { value: "industrie", children: "Services Transformation" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom de l'Activit\u00E9*" }), _jsx("input", { type: "text", required: true, placeholder: "Ex: Commerce Grande Distribution", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description*" }), _jsx("textarea", { required: true, rows: 3, placeholder: "Description d\u00E9taill\u00E9e de l'activit\u00E9", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Revenu Initial (FCFA)" }), _jsx("input", { type: "number", min: "0", placeholder: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre de Transactions" }), _jsx("input", { type: "number", min: "0", placeholder: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 border-t border-gray-200 pt-4", children: [_jsx("button", { type: "button", onClick: () => setShowAddActivityModal(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors", children: "Ajouter l'Activit\u00E9" })] })] })] }) })), showAddMemberModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Ajouter un Nouveau Membre" }), _jsx("button", { onClick: () => setShowAddMemberModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors", children: "\u00D7" })] }) }), _jsxs("form", { onSubmit: handleAddMember, className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [[
                                            { label: 'Prénom*', name: 'prenom', type: 'text', required: true, placeholder: 'Prénom' },
                                            { label: 'Nom*', name: 'nom', type: 'text', required: true, placeholder: 'Nom' },
                                            {
                                                label: 'Téléphone*',
                                                name: 'telephone',
                                                type: 'tel',
                                                required: true,
                                                placeholder: 'Ex: 771234567'
                                            },
                                            {
                                                label: 'Numéro CIN*',
                                                name: 'cin',
                                                type: 'text',
                                                required: true,
                                                placeholder: 'Ex: 1234567890123'
                                            },
                                            { label: 'Date de Naissance', name: 'dateNaissance', type: 'date' },
                                            {
                                                label: 'Genre*',
                                                name: 'genre',
                                                type: 'select',
                                                required: true,
                                                options: [
                                                    { value: '', label: 'Sélectionnez' },
                                                    { value: 'femme', label: 'Femme' },
                                                    { value: 'jeune', label: 'Jeune' },
                                                    { value: 'homme', label: 'Homme' }
                                                ]
                                            },
                                            { label: 'Profession', name: 'profession', type: 'text', placeholder: 'Profession' },
                                            {
                                                label: 'Fonction dans le GIE*',
                                                name: 'fonction',
                                                type: 'select',
                                                required: true,
                                                options: [
                                                    { value: 'Membre', label: 'Membre' },
                                                ]
                                            }
                                        ].map((field) => (_jsxs("div", { className: field.name === 'adresse' ? 'md:col-span-2' : '', children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: field.label }), field.type === 'select' ? (_jsx("select", { name: field.name, value: memberForm[field.name], onChange: handleMemberInputChange, required: field.required, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: field.options?.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })) : (_jsx("input", { type: field.type, name: field.name, value: memberForm[field.name], onChange: handleMemberInputChange, required: field.required, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: field.placeholder }))] }, field.name))), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse" }), _jsx("input", { type: "text", name: "adresse", value: memberForm.adresse, onChange: handleMemberInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "Adresse compl\u00E8te" })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 border-t border-gray-200 pt-4", children: [_jsx("button", { type: "button", onClick: () => setShowAddMemberModal(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center", children: "Ajouter le Membre" })] })] })] }) })), showEditMemberModal && selectedMember && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Modifier un Membre" }), _jsx("button", { onClick: () => setShowEditMemberModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors", children: "\u00D7" })] }) }), _jsxs("form", { onSubmit: handleEditMember, className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [[
                                            { label: 'Prénom*', name: 'prenom', type: 'text', required: true },
                                            { label: 'Nom*', name: 'nom', type: 'text', required: true },
                                            { label: 'Téléphone*', name: 'telephone', type: 'tel', required: true },
                                            { label: 'Numéro CIN*', name: 'cin', type: 'text', required: true },
                                            { label: 'Date de Naissance', name: 'dateNaissance', type: 'date' },
                                            {
                                                label: 'Genre*',
                                                name: 'genre',
                                                type: 'select',
                                                required: true,
                                                options: [
                                                    { value: '', label: 'Sélectionnez' },
                                                    { value: 'femme', label: 'Femme' },
                                                    { value: 'jeune', label: 'Jeune' },
                                                    { value: 'homme', label: 'Homme' }
                                                ]
                                            },
                                            {
                                                label: 'Fonction dans le GIE*',
                                                name: 'fonction',
                                                type: 'select',
                                                required: true,
                                                options: [
                                                    { value: 'Membre', label: 'Membre' },
                                                    { value: 'Présidente', label: 'Présidente' },
                                                    { value: 'Vice-Président', label: 'Vice-Président' },
                                                    { value: 'Trésorière', label: 'Trésorière' },
                                                    { value: 'Secrétaire', label: 'Secrétaire' }
                                                ]
                                            },
                                            { label: 'Statut', name: 'statut', type: 'select', options: [
                                                    { value: 'Actif', label: 'Actif' },
                                                    { value: 'Inactif', label: 'Inactif' }
                                                ] }
                                        ].map((field) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: field.label }), field.type === 'select' ? (_jsx("select", { name: field.name, value: memberForm[field.name], onChange: handleMemberInputChange, required: field.required, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: field.options?.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })) : (_jsx("input", { type: field.type, name: field.name, value: memberForm[field.name], onChange: handleMemberInputChange, required: field.required, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" }))] }, field.name))), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse" }), _jsx("input", { type: "text", name: "adresse", value: memberForm.adresse, onChange: handleMemberInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" })] })] }), _jsxs("div", { className: "flex justify-between space-x-3 border-t border-gray-200 pt-4", children: [_jsx("button", { type: "button", onClick: () => {
                                                if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
                                                    handleDeleteMember(selectedMember);
                                                }
                                            }, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Supprimer" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowEditMemberModal(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: "Enregistrer" })] })] })] })] }) })), showSavingsModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: selectedPlanId === 101
                                            ? '💰 Épargne Volontaire'
                                            : selectedPlanId === 102
                                                ? '🕌 Épargne Tabaski'
                                                : selectedPlanId === 103
                                                    ? '🏡 Épargne Feveo Habitat'
                                                    : '💰 Épargne' }), _jsx("button", { onClick: () => setShowSavingsModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: selectedPlanId === 101
                                                ? 'Choisissez le montant que vous souhaitez épargner. Le montant minimum est de 5 000 FCFA.'
                                                : selectedPlanId === 102
                                                    ? 'Indiquez le montant de votre versement mensuel pour l\'épargne Tabaski. Le montant minimum est de 5 000 FCFA.'
                                                    : 'Indiquez le montant de votre épargne pour le projet Feveo Habitat. Le montant minimum est de 5 000 FCFA (Recommandé : 50 000 FCFA ou plus).' }), _jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant \u00E0 \u00E9pargner (FCFA)*" }), _jsx("input", { type: "number", min: "5000", step: "1000", value: savingsAmount, onChange: (e) => setSavingsAmount(e.target.value), placeholder: "Ex: 10000", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg", autoFocus: true }), savingsAmount && parseFloat(savingsAmount) < 5000 && (_jsx("p", { className: "mt-2 text-sm text-red-600", children: "\u26A0\uFE0F Le montant minimum est de 5 000 FCFA" })), selectedPlanId === 103 && savingsAmount && parseFloat(savingsAmount) >= 5000 && parseFloat(savingsAmount) < 50000 && (_jsx("p", { className: "mt-2 text-sm text-amber-600", children: "\uD83D\uDCA1 Montant conseill\u00E9 : 50 000 FCFA ou plus pour un meilleur rendement" }))] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowSavingsModal(false), className: "px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { type: "button", onClick: handleSavingsSubmit, disabled: !savingsAmount ||
                                                parseFloat(savingsAmount) < 5000, className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed", children: "Confirmer" })] })] })] }) })), showHabitatConditionsModal && (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp", children: [_jsx("div", { className: "bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "\uD83C\uDFE0 \u00C9pargne Feveo Habitat" }), _jsx("p", { className: "text-orange-100 text-sm", children: "Programme d'accession \u00E0 la propri\u00E9t\u00E9" })] }), _jsx("button", { onClick: () => setShowHabitatConditionsModal(false), className: "text-white/80 hover:text-white transition-colors text-3xl leading-none hover:rotate-90 transform duration-300", children: "\u00D7" })] }) }), _jsxs("div", { className: "overflow-y-auto max-h-[calc(90vh-180px)] p-6", children: [_jsx("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-lg mb-6", children: _jsxs("p", { className: "text-gray-800 leading-relaxed", children: ["Le programme ", _jsx("strong", { children: "\u00C9pargne Feveo Habitat" }), " vous permet de constituer un apport personnel pour acqu\u00E9rir votre logement. \u00C9pargnez de mani\u00E8re r\u00E9guli\u00E8re et b\u00E9n\u00E9ficiez d'avantages exclusifs."] }) }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx("span", { className: "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm", children: "1" }), "Conditions d'\u00C9ligibilit\u00E9"] }), _jsxs("div", { className: "space-y-3 ml-11", children: [_jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-green-100 rounded-full p-1 mr-3 mt-0.5", children: _jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsxs("p", { className: "text-gray-700", children: [_jsx("strong", { children: "\u00CAtre membre actif" }), " d'un GIE enregistr\u00E9 sur la plateforme FEVEO 2050"] })] }), _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-green-100 rounded-full p-1 mr-3 mt-0.5", children: _jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsxs("p", { className: "text-gray-700", children: [_jsx("strong", { children: "Avoir particip\u00E9" }), " \u00E0 au moins 6 mois d'investissements quotidiens"] })] }), _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-green-100 rounded-full p-1 mr-3 mt-0.5", children: _jsx("svg", { className: "w-4 h-4 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }), _jsxs("p", { className: "text-gray-700", children: [_jsx("strong", { children: "Avoir un historique" }), " de paiements r\u00E9guliers sans retard majeur"] })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx("span", { className: "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm", children: "2" }), "Modalit\u00E9s du Programme"] }), _jsx("div", { className: "bg-gray-50 rounded-xl p-4 space-y-4 ml-11", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "text-orange-600 font-semibold mb-1", children: "Versement Mensuel" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "Montant Libre" }), _jsx("div", { className: "text-sm text-gray-500 mt-1", children: "Minimum 5 000 FCFA" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "text-orange-600 font-semibold mb-1", children: "Dur\u00E9e Minimale" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "24 mois" }), _jsx("div", { className: "text-sm text-gray-500 mt-1", children: "2 ans d'\u00E9pargne" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "text-orange-600 font-semibold mb-1", children: "Rendement" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "5% par an" }), _jsx("div", { className: "text-sm text-gray-500 mt-1", children: "Int\u00E9r\u00EAts garantis" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-200", children: [_jsx("div", { className: "text-orange-600 font-semibold mb-1", children: "Recommandation" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: "\u2265 50 000 FCFA" }), _jsx("div", { className: "text-sm text-gray-500 mt-1", children: "Montant conseill\u00E9/mois" })] })] }) })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx("span", { className: "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm", children: "3" }), "Avantages du Programme"] }), _jsxs("div", { className: "space-y-3 ml-11", children: [_jsxs("div", { className: "flex items-start bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200", children: [_jsx("span", { className: "text-2xl mr-3", children: "\uD83C\uDFC6" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Priorit\u00E9 d'acc\u00E8s aux logements FEVEO" }), _jsx("p", { className: "text-sm text-gray-600", children: "Acc\u00E8s privil\u00E9gi\u00E9 aux programmes immobiliers d\u00E9velopp\u00E9s par FEVEO" })] })] }), _jsxs("div", { className: "flex items-start bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200", children: [_jsx("span", { className: "text-2xl mr-3", children: "\uD83D\uDCB0" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Facilit\u00E9s de cr\u00E9dit immobilier" }), _jsx("p", { className: "text-sm text-gray-600", children: "Taux pr\u00E9f\u00E9rentiels et conditions avantageuses aupr\u00E8s de nos partenaires bancaires" })] })] }), _jsxs("div", { className: "flex items-start bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200", children: [_jsx("span", { className: "text-2xl mr-3", children: "\uD83C\uDFAF" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Accompagnement personnalis\u00E9" }), _jsx("p", { className: "text-sm text-gray-600", children: "Conseils et suivi par nos experts en financement immobilier" })] })] }), _jsxs("div", { className: "flex items-start bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200", children: [_jsx("span", { className: "text-2xl mr-3", children: "\uD83D\uDEE1\uFE0F" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "\u00C9pargne s\u00E9curis\u00E9e et bloqu\u00E9e" }), _jsx("p", { className: "text-sm text-gray-600", children: "Fonds garantis et disponibles uniquement pour l'acquisition immobili\u00E8re" })] })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h4", { className: "text-xl font-bold text-gray-900 mb-4 flex items-center", children: [_jsx("span", { className: "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm", children: "4" }), "Engagement et Retrait"] }), _jsxs("div", { className: "space-y-3 ml-11", children: [_jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: _jsxs("p", { className: "text-amber-900 text-sm leading-relaxed", children: [_jsx("strong", { children: "\u26A0\uFE0F Important :" }), " L'\u00E9pargne est bloqu\u00E9e pendant la dur\u00E9e du programme. Un retrait anticip\u00E9 avant 24 mois entra\u00EEne une p\u00E9nalit\u00E9 de 10% sur le montant total \u00E9pargn\u00E9 et la perte des avantages du programme."] }) }), _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-1 mr-3 mt-0.5", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("p", { className: "text-gray-700", children: "Possibilit\u00E9 de suspension temporaire (max 3 mois) sur justificatif" })] }), _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-1 mr-3 mt-0.5", children: _jsx("svg", { className: "w-4 h-4 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("p", { className: "text-gray-700", children: "Transfert possible vers un autre membre du GIE avec accord pr\u00E9alable" })] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl p-6", children: [_jsxs("h4", { className: "text-lg font-bold mb-4 flex items-center", children: [_jsx("span", { className: "text-2xl mr-2", children: "\uD83D\uDCCA" }), "Simulation d'\u00C9pargne (exemple avec 50 000 FCFA/mois)"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center bg-white/10 rounded-lg p-3", children: [_jsx("span", { children: "Apr\u00E8s 24 mois (minimum)" }), _jsx("span", { className: "text-xl font-bold", children: "1 260 000 FCFA" })] }), _jsxs("div", { className: "flex justify-between items-center bg-white/10 rounded-lg p-3", children: [_jsx("span", { children: "Apr\u00E8s 36 mois (3 ans)" }), _jsx("span", { className: "text-xl font-bold", children: "1 912 500 FCFA" })] }), _jsxs("div", { className: "flex justify-between items-center bg-white/10 rounded-lg p-3", children: [_jsx("span", { children: "Apr\u00E8s 48 mois (4 ans)" }), _jsx("span", { className: "text-xl font-bold", children: "2 580 000 FCFA" })] }), _jsx("p", { className: "text-sm text-orange-100 mt-4", children: "* Simulation bas\u00E9e sur 50 000 FCFA/mois incluant int\u00E9r\u00EAts de 5% par an, capitalis\u00E9s annuellement. Vous pouvez \u00E9pargner un montant libre (minimum 5 000 FCFA)." })] })] })] }), _jsx("div", { className: "bg-gray-50 px-6 py-4 border-t border-gray-200", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-end", children: [_jsx("button", { onClick: () => setShowHabitatConditionsModal(false), className: "px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium", children: "Fermer" }), _jsx("button", { onClick: () => {
                                            setShowHabitatConditionsModal(false);
                                            setSelectedPlanId(103);
                                            setSavingsAmount('');
                                            setShowSavingsModal(true);
                                        }, className: "px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold", children: "J'accepte et je souhaite adh\u00E9rer" })] }) })] }) }))] }));
};
export default WalletDashboard;
//# sourceMappingURL=WalletDashboard.js.map