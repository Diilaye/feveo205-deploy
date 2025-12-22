import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, AlertCircle, Clock, Settings, Plus, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { toast } from 'react-toastify';
const EpargneTab = ({ gieCode, gieId, epargneType, isCreatingNew = false, initialData = null }) => {
    const [epargneData, setEpargneData] = useState(initialData);
    const [statistiques, setStatistiques] = useState(null);
    const [isLoading, setIsLoading] = useState(!initialData); // Si on a initialData, pas besoin de charger
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showVersementModal, setShowVersementModal] = useState(false);
    const [showRetraitModal, setShowRetraitModal] = useState(false);
    // Ref pour éviter d'ouvrir le modal plusieurs fois
    const modalOpenedRef = React.useRef(false);
    // Fonction pour obtenir le label du type d'épargne
    const getEpargneLabel = (type) => {
        const labels = {
            'epargne_volontaire': 'Épargne Volontaire',
            'epargne_tabaski': 'Épargne Tabaski',
            'epargne_feveo_habitat': 'Épargne Feveo Habitat',
            'fonds_social_gie': 'Fonds Social GIE'
        };
        return labels[type || config.objectifPrincipal] || 'Épargne Volontaire';
    };
    // État pour le formulaire de configuration
    const [config, setConfig] = useState({
        objectifPrincipal: 'epargne_volontaire',
        descriptionObjectif: '',
        categoriesMembresAutorises: ['tous'],
        montantVersement: 0,
        montantEpargne: 0,
        montantMinimum: 5000,
        montantMaximum: 100000,
        periodicite: 'mensuelle',
        delaiPreavisRetrait: 30,
        motifsAutorises: ['projet_associatif', 'entraide_membre', 'urgence_medicale'],
        montantMinimumRetrait: 5000,
        nombreRetraitsAnnuelMax: 2,
        productionInterets: false,
        tauxInteret: 0,
        destinataireInterets: 'association',
        pourcentageInteretsEpargnant: 0
    });
    // État pour le formulaire de versement
    const [versement, setVersement] = useState({
        montant: '',
        moyenPaiement: 'wave',
        referenceTransaction: '',
        remarque: ''
    });
    // État pour le formulaire de retrait
    const [retrait, setRetrait] = useState({
        montant: '',
        motifRetrait: 'entraide_membre',
        justification: ''
    });
    // Charger les données en premier
    useEffect(() => {
        // Si on a déjà les données initiales, pas besoin de recharger
        if (initialData) {
            console.log('✅ Données initiales fournies, pas de rechargement nécessaire');
            setEpargneData(initialData);
            setIsLoading(false);
            return;
        }
        // Sinon, charger depuis l'API
        loadEpargneData();
    }, [gieCode, epargneType, initialData]);
    // Auto-ouvrir le modal APRÈS le chargement des données
    useEffect(() => {
        console.log('🔄 useEffect auto-open:', {
            isCreatingNew,
            epargneType,
            epargneData: !!epargneData,
            isLoading,
            showConfigModal,
            modalOpenedRef: modalOpenedRef.current
        });
        // Attendre que le chargement soit terminé et ne pas ouvrir plusieurs fois
        if (!isLoading && isCreatingNew && epargneType && !epargneData && !modalOpenedRef.current) {
            console.log('✅ Conditions remplies - Ouverture automatique du modal (après chargement)');
            modalOpenedRef.current = true;
            setConfig(prev => ({
                ...prev,
                objectifPrincipal: epargneType
            }));
            // Délai pour s'assurer que le rendu "non activée" est terminé
            setTimeout(() => {
                console.log('🚀 Ouverture du modal maintenant - setShowConfigModal(true)');
                setShowConfigModal(true);
                console.log('✅ showConfigModal mis à true');
            }, 300);
        }
    }, [isLoading, isCreatingNew, epargneType, epargneData]);
    const loadEpargneData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('walletSession');
            if (!token) {
                console.warn('Aucun token de session trouvé');
                setEpargneData(null);
                setIsLoading(false);
                return;
            }
            const url = epargneType
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}?type=${epargneType}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setEpargneData(data.data.epargne);
                    setStatistiques(data.data.statistiques);
                }
            }
            else if (response.status === 404) {
                // Épargne non activée
                setEpargneData(null);
            }
            else if (response.status === 401) {
                console.error('Authentification échouée - Token invalide ou expiré');
                toast.error('Session expirée. Veuillez vous reconnecter.');
                setEpargneData(null);
            }
            else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erreur API:', errorData);
            }
        }
        catch (error) {
            console.error('Erreur chargement épargne:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleActiverEpargne = async () => {
        console.log('🔵 handleActiverEpargne appelé');
        console.log('📋 Config actuelle:', config);
        console.log('📝 Description:', config.descriptionObjectif);
        console.log('📏 Longueur description:', config.descriptionObjectif?.length);
        console.log('✅ Validation réussie - Envoi de la requête...');
        try {
            const token = localStorage.getItem('walletSession');
            console.log('🔑 Token:', token ? 'Présent' : 'Absent');
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}/activer`;
            console.log('🌐 URL:', url);
            console.log('📤 Body:', JSON.stringify(config, null, 2));
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });
            console.log('📥 Response status:', response.status);
            const data = await response.json();
            console.log('📥 Response data:', data);
            if (data.success) {
                toast.success(`${getEpargneLabel(config.objectifPrincipal)} activée avec succès!`);
                setShowConfigModal(false);
                loadEpargneData();
            }
            else {
                // Afficher un message spécifique pour les doublons
                if (data.error === 'DUPLICATE_EPARGNE_TYPE') {
                    toast.error(data.message, { autoClose: 7000 }); // Message plus long visible 7 secondes
                }
                else {
                    toast.error(data.message || 'Erreur lors de l\'activation');
                }
            }
        }
        catch (error) {
            console.error('❌ Erreur activation épargne:', error);
            toast.error('Erreur lors de l\'activation de l\'épargne');
        }
    };
    const handleUpdateConfiguration = async () => {
        if (!config.descriptionObjectif || config.descriptionObjectif.length < 20) {
            toast.error('La description de l\'objectif doit contenir au moins 20 caractères');
            return;
        }
        try {
            const token = localStorage.getItem('walletSession');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/${epargneData._id}/configuration`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Configuration mise à jour avec succès!');
                setShowConfigModal(false);
                loadEpargneData();
            }
            else {
                toast.error(data.message || 'Erreur lors de la mise à jour');
            }
        }
        catch (error) {
            console.error('Erreur mise à jour configuration:', error);
            toast.error('Erreur lors de la mise à jour de la configuration');
        }
    };
    const handleCloturerEpargne = async () => {
        try {
            const token = localStorage.getItem('walletSession');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/${epargneData._id}/cloturer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    motif: 'Clôture demandée par le GIE'
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Épargne clôturée avec succès!');
                loadEpargneData();
            }
            else {
                toast.error(data.message || 'Erreur lors de la clôture');
            }
        }
        catch (error) {
            console.error('Erreur clôture épargne:', error);
            toast.error('Erreur lors de la clôture de l\'épargne');
        }
    };
    const handleAjouterVersement = async () => {
        if (!versement.montant || parseFloat(versement.montant) < (epargneData?.configuration.montantMinimum || 5000)) {
            toast.error(`Le montant minimum est de ${epargneData?.configuration.montantMinimum.toLocaleString()} FCFA`);
            return;
        }
        try {
            const token = localStorage.getItem('walletSession');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}/versement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...versement,
                    montant: parseFloat(versement.montant)
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Versement enregistré avec succès!');
                setShowVersementModal(false);
                setVersement({ montant: '', moyenPaiement: 'wave', referenceTransaction: '', remarque: '' });
                loadEpargneData();
            }
            else {
                toast.error(data.message || 'Erreur lors de l\'enregistrement');
            }
        }
        catch (error) {
            console.error('Erreur versement:', error);
            toast.error('Erreur lors du versement');
        }
    };
    const handleDemanderRetrait = async () => {
        if (!retrait.montant || !retrait.justification || retrait.justification.length < 10) {
            toast.error('Veuillez remplir tous les champs (justification minimum 10 caractères)');
            return;
        }
        try {
            const token = localStorage.getItem('walletSession');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}/retrait`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...retrait,
                    montant: parseFloat(retrait.montant)
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Demande de retrait enregistrée avec succès!');
                setShowRetraitModal(false);
                setRetrait({ montant: '', motifRetrait: 'entraide_membre', justification: '' });
                loadEpargneData();
            }
            else {
                toast.error(data.message || 'Erreur lors de la demande');
            }
        }
        catch (error) {
            console.error('Erreur retrait:', error);
            toast.error('Erreur lors de la demande de retrait');
        }
    };
    // Fonction pour rendre le modal de configuration (réutilisable)
    const renderConfigModal = () => {
        if (!showConfigModal)
            return null;
        console.log('🎨 renderConfigModal appelé - showConfigModal:', showConfigModal);
        return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]", children: [_jsx("div", { className: "sticky top-0 bg-white p-6 border-b border-gray-200 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Configuration de l'\u00C9pargne Volontaire" }), _jsx("button", { onClick: () => {
                                        console.log('❌ Fermeture du modal');
                                        setShowConfigModal(false);
                                    }, className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-4 border border-blue-200", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Info, { className: "w-5 h-5 text-blue-500" }), "1. Objectif de l'\u00E9pargne"] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objectif principal *" }), epargneData ? (
                                            // Mode édition : afficher le type en lecture seule
                                            _jsxs("div", { className: "w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium", children: [config.objectifPrincipal === 'epargne_volontaire' && '📋 Épargne volontaire', config.objectifPrincipal === 'epargne_tabaski' && '🎉 Épargne Tabaski', config.objectifPrincipal === 'epargne_feveo_habitat' && '🏠 Épargne Feveo Habitat', config.objectifPrincipal === 'fonds_social_gie' && '🤝 Fonds Social GIE'] })) : (
                                            // Mode création : sélection du type
                                            _jsxs("select", { value: config.objectifPrincipal, onChange: (e) => setConfig({ ...config, objectifPrincipal: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: [_jsx("option", { value: "epargne_volontaire", children: "\u00C9pargne volontaire" }), _jsx("option", { value: "epargne_tabaski", children: "\u00C9pargne Tabaski" }), _jsx("option", { value: "epargne_feveo_habitat", children: "\u00C9pargne Feveo Habitat" }), _jsx("option", { value: "fonds_social_gie", children: "Fonds Social GIE" })] })), epargneData && (_jsx("p", { className: "text-sm text-gray-500 mt-1 italic", children: "\u2139\uFE0F Le type d'\u00E9pargne ne peut pas \u00EAtre modifi\u00E9 apr\u00E8s cr\u00E9ation" }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description d\u00E9taill\u00E9e de l'objectif * (minimum 20 caract\u00E8res)" }), _jsx("textarea", { value: config.descriptionObjectif, onChange: (e) => setConfig({ ...config, descriptionObjectif: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", rows: 4, maxLength: 500, placeholder: "Ex: Constituer un fonds de solidarit\u00E9 pour soutenir les membres en cas de difficult\u00E9s financi\u00E8res temporaires..." }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [config.descriptionObjectif.length, "/500 caract\u00E8res"] })] })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-4 border border-green-200", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-4", children: "2. Montants et p\u00E9riodicit\u00E9" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant versement (FCFA) *" }), _jsx("input", { type: "number", min: "0", value: config.montantVersement, onChange: (e) => setConfig({ ...config, montantVersement: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", placeholder: "Ex: 10000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant \u00E9pargne (FCFA) *" }), _jsx("input", { type: "number", min: "0", value: config.montantEpargne, onChange: (e) => setConfig({ ...config, montantEpargne: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", placeholder: "Ex: 50000" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "P\u00E9riodicit\u00E9 des versements *" }), _jsxs("select", { value: config.periodicite, onChange: (e) => setConfig({ ...config, periodicite: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: [_jsx("option", { value: "libre", children: "Libre (\u00E0 la convenance)" }), _jsx("option", { value: "jour", children: "Quotidienne (jour)" }), _jsx("option", { value: "semaine", children: "Hebdomadaire (semaine)" }), _jsx("option", { value: "mensuelle", children: "Mensuelle" }), _jsx("option", { value: "trimestrielle", children: "Trimestrielle" }), _jsx("option", { value: "semestrielle", children: "Semestrielle" }), _jsx("option", { value: "annuelle", children: "Annuelle" })] })] })] }), _jsxs("div", { className: "bg-yellow-50 rounded-lg p-4 border border-yellow-200", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-4", children: "3. Conditions de retrait" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9lai de pr\u00E9avis (jours)" }), _jsx("input", { type: "number", min: "7", max: "90", value: config.delaiPreavisRetrait, onChange: (e) => setConfig({ ...config, delaiPreavisRetrait: parseInt(e.target.value) || 30 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant minimum retrait (FCFA)" }), _jsx("input", { type: "number", min: "1000", value: config.montantMinimumRetrait, onChange: (e) => setConfig({ ...config, montantMinimumRetrait: parseInt(e.target.value) || 5000 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Retraits max/an" }), _jsx("input", { type: "number", min: "1", max: "12", value: config.nombreRetraitsAnnuelMax, onChange: (e) => setConfig({ ...config, nombreRetraitsAnnuelMax: parseInt(e.target.value) || 2 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Motifs de retrait autoris\u00E9s" }), _jsx("div", { className: "space-y-2", children: [
                                                    { value: 'projet_associatif', label: 'Projet associatif' },
                                                    { value: 'entraide_membre', label: 'Entraide membre' },
                                                    { value: 'urgence_medicale', label: 'Urgence médicale' },
                                                    { value: 'deces', label: 'Décès' },
                                                    { value: 'demission_association', label: 'Démission de l\'association' },
                                                    { value: 'fin_periode', label: 'Fin de période' }
                                                ].map((motif) => (_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.motifsAutorises.includes(motif.value), onChange: (e) => {
                                                                if (e.target.checked) {
                                                                    setConfig({ ...config, motifsAutorises: [...config.motifsAutorises, motif.value] });
                                                                }
                                                                else {
                                                                    setConfig({ ...config, motifsAutorises: config.motifsAutorises.filter(m => m !== motif.value) });
                                                                }
                                                            }, className: "rounded text-orange-500 focus:ring-orange-500" }), _jsx("span", { className: "text-sm text-gray-700", children: motif.label })] }, motif.value))) })] })] }), _jsxs("div", { className: "bg-purple-50 rounded-lg p-4 border border-purple-200", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-4", children: "4. Production d'int\u00E9r\u00EAts (optionnel)" }), _jsx("div", { className: "mb-4", children: _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: config.productionInterets, onChange: (e) => setConfig({ ...config, productionInterets: e.target.checked }), className: "rounded text-orange-500 focus:ring-orange-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Activer la production d'int\u00E9r\u00EAts" })] }) }), config.productionInterets && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Taux d'int\u00E9r\u00EAt annuel (%)" }), _jsx("input", { type: "number", min: "0", max: "10", step: "0.5", value: config.tauxInteret, onChange: (e) => setConfig({ ...config, tauxInteret: parseFloat(e.target.value) || 0 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Destinataire des int\u00E9r\u00EAts" }), _jsxs("select", { value: config.destinataireInterets, onChange: (e) => setConfig({ ...config, destinataireInterets: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: [_jsx("option", { value: "epargnant", children: "100% pour l'\u00E9pargnant (GIE)" }), _jsx("option", { value: "association", children: "100% pour l'association (FEVEO)" }), _jsx("option", { value: "mixte", children: "R\u00E9partition mixte" })] })] }), config.destinataireInterets === 'mixte' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Part de l'\u00E9pargnant (%)" }), _jsx("input", { type: "number", min: "0", max: "100", value: config.pourcentageInteretsEpargnant, onChange: (e) => setConfig({ ...config, pourcentageInteretsEpargnant: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Part de l'association: ", 100 - config.pourcentageInteretsEpargnant, "%"] })] }))] }))] })] }), _jsxs("div", { className: "sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3", children: [_jsx("button", { onClick: () => setShowConfigModal(false), className: "px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium", children: "Annuler" }), _jsx("button", { onClick: () => {
                                    console.log('🔘 Bouton Activer cliqué');
                                    console.log('📊 epargneData:', epargneData);
                                    console.log('🎯 Fonction appelée:', epargneData ? 'handleUpdateConfiguration' : 'handleActiverEpargne');
                                    if (epargneData) {
                                        handleUpdateConfiguration();
                                    }
                                    else {
                                        handleActiverEpargne();
                                    }
                                }, className: "px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg font-semibold", children: epargneData ? 'Mettre à jour' : `Activer ${getEpargneLabel()}` })] })] }) }));
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" }) }));
    }
    // Vérification de l'authentification
    const token = localStorage.getItem('walletSession');
    if (!token) {
        return (_jsx("div", { className: "max-w-4xl mx-auto", children: _jsx("div", { className: "bg-yellow-50 rounded-xl p-8 border-2 border-yellow-300", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "w-16 h-16 text-yellow-600 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Authentification requise" }), _jsx("p", { className: "text-gray-700 mb-4", children: "Vous devez \u00EAtre authentifi\u00E9 pour acc\u00E9der \u00E0 la fonctionnalit\u00E9 d'\u00E9pargne volontaire." }), _jsx("p", { className: "text-sm text-gray-600", children: "Cette fonctionnalit\u00E9 sera disponible apr\u00E8s la mise en place compl\u00E8te du syst\u00E8me d'authentification." })] }) }) }));
    }
    // Si l'épargne n'est pas activée
    if (!epargneData) {
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx(Wallet, { className: "w-16 h-16 text-orange-500 mx-auto mb-4" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: getEpargneLabel(epargneType) }), _jsx("p", { className: "text-gray-600", children: "Constituez une \u00E9pargne collective pour financer vos projets ou cr\u00E9er un fonds d'entraide" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "\uD83C\uDFAF Objectifs possibles" }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsx("li", { children: "\u2713 Financer un projet associatif" }), _jsx("li", { children: "\u2713 Cr\u00E9er un fonds d'entraide" }), _jsx("li", { children: "\u2713 Constituer un capital d'investissement" }), _jsx("li", { children: "\u2713 \u00C9tablir une r\u00E9serve de s\u00E9curit\u00E9" })] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "\u2699\uFE0F Fonctionnalit\u00E9s" }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [_jsx("li", { children: "\u2713 Versements libres ou r\u00E9guliers" }), _jsx("li", { children: "\u2713 Production d'int\u00E9r\u00EAts optionnelle" }), _jsx("li", { children: "\u2713 Retraits encadr\u00E9s et s\u00E9curis\u00E9s" }), _jsx("li", { children: "\u2713 Suivi transparent des op\u00E9rations" })] })] })] }), _jsx("div", { className: "text-center", children: _jsxs("button", { onClick: () => {
                                        console.log('🔵 Bouton principal "Activer" cliqué');
                                        console.log('📋 showConfigModal avant:', showConfigModal);
                                        setShowConfigModal(true);
                                        console.log('📋 showConfigModal après:', true);
                                    }, className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center gap-2 mx-auto", children: [_jsx(Settings, { className: "w-5 h-5" }), "Activer ", getEpargneLabel(epargneType)] }) })] }) }), renderConfigModal()] }));
    }
    // Si l'épargne est activée, afficher le dashboard
    const soldeDisponible = statistiques?.soldeDisponible || 0;
    const retraitsEnAttente = statistiques?.retraitsEnAttente || 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Wallet, { className: "w-8 h-8" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: getEpargneLabel(epargneData.configuration.objectifPrincipal) }), _jsx("p", { className: "text-orange-100", children: epargneData.configuration.descriptionObjectif })] })] }), _jsx("div", { className: `px-4 py-2 rounded-full text-sm font-semibold ${epargneData.statut === 'active' ? 'bg-green-500' :
                                    epargneData.statut === 'suspendue' ? 'bg-yellow-500' :
                                        'bg-gray-500'}`, children: epargneData.statut === 'active' ? '✓ Active' :
                                    epargneData.statut === 'suspendue' ? '⚠ Suspendue' :
                                        '✗ Clôturée' })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white/10 rounded-lg p-4", children: [_jsx("p", { className: "text-orange-100 text-sm mb-1", children: "Solde Total" }), _jsxs("p", { className: "text-2xl font-bold", children: [epargneData.soldeTotal.toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "bg-white/10 rounded-lg p-4", children: [_jsx("p", { className: "text-orange-100 text-sm mb-1", children: "Solde Disponible" }), _jsxs("p", { className: "text-2xl font-bold", children: [soldeDisponible.toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "bg-white/10 rounded-lg p-4", children: [_jsx("p", { className: "text-orange-100 text-sm mb-1", children: "Total Vers\u00E9" }), _jsxs("p", { className: "text-2xl font-bold", children: [epargneData.totalVersements.toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "bg-white/10 rounded-lg p-4", children: [_jsx("p", { className: "text-orange-100 text-sm mb-1", children: "Int\u00E9r\u00EAts" }), _jsxs("p", { className: "text-2xl font-bold", children: [epargneData.totalInterets.toLocaleString(), " FCFA"] })] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("button", { onClick: () => setShowVersementModal(true), disabled: epargneData.statut !== 'active', className: "flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Plus, { className: "w-5 h-5" }), "Effectuer un versement"] }), _jsxs("button", { onClick: () => setShowRetraitModal(true), disabled: epargneData.statut !== 'active' || soldeDisponible < epargneData.configuration.montantMinimumRetrait, className: "flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(ArrowDownRight, { className: "w-5 h-5" }), "Demander un retrait"] }), _jsxs("button", { onClick: () => {
                            setConfig(epargneData.configuration);
                            setShowConfigModal(true);
                        }, disabled: epargneData.statut === 'cloturee', className: "flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Settings, { className: "w-5 h-5" }), "Modifier la configuration"] }), epargneData.statut !== 'cloturee' && (_jsxs("button", { onClick: () => {
                            if (confirm('Êtes-vous sûr de vouloir clôturer cette épargne ? Cette action est irréversible.')) {
                                handleCloturerEpargne();
                            }
                        }, className: "flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold ml-auto", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), "Cl\u00F4turer l'\u00E9pargne"] }))] }), retraitsEnAttente > 0 && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3", children: [_jsx(Clock, { className: "w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-yellow-900", children: [retraitsEnAttente, " demande", retraitsEnAttente > 1 ? 's' : '', " de retrait en attente"] }), _jsx("p", { className: "text-sm text-yellow-700", children: "Vos demandes sont en cours de traitement par l'administration." })] })] })), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-green-500" }), "Statistiques de Versements"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Nombre de versements:" }), _jsx("span", { className: "font-semibold", children: statistiques?.nombreVersements || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Versement moyen:" }), _jsxs("span", { className: "font-semibold", children: [(statistiques?.versementMoyen || 0).toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Total vers\u00E9:" }), _jsxs("span", { className: "font-semibold text-green-600", children: [epargneData.totalVersements.toLocaleString(), " FCFA"] })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(ArrowDownRight, { className: "w-5 h-5 text-blue-500" }), "Statistiques de Retraits"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Nombre de retraits:" }), _jsx("span", { className: "font-semibold", children: statistiques?.nombreRetraits || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Retrait moyen:" }), _jsxs("span", { className: "font-semibold", children: [(statistiques?.retraitMoyen || 0).toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Total retir\u00E9:" }), _jsxs("span", { className: "font-semibold text-blue-600", children: [epargneData.totalRetraits.toLocaleString(), " FCFA"] })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Info, { className: "w-5 h-5 text-orange-500" }), "Configuration Actuelle"] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Montant min/max" }), _jsxs("p", { className: "font-semibold", children: [epargneData.configuration.montantMinimum.toLocaleString(), " - ", epargneData.configuration.montantMaximum.toLocaleString(), " FCFA"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "P\u00E9riodicit\u00E9" }), _jsx("p", { className: "font-semibold capitalize", children: epargneData.configuration.periodicite })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "D\u00E9lai de pr\u00E9avis" }), _jsxs("p", { className: "font-semibold", children: [epargneData.configuration.delaiPreavisRetrait, " jours"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Retraits max/an" }), _jsx("p", { className: "font-semibold", children: epargneData.configuration.nombreRetraitsAnnuelMax })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Production d'int\u00E9r\u00EAts" }), _jsx("p", { className: "font-semibold", children: epargneData.configuration.productionInterets ?
                                            `Oui (${epargneData.configuration.tauxInteret}%)` :
                                            'Non' })] }), epargneData.configuration.productionInterets && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Int\u00E9r\u00EAts pr\u00E9vus/an" }), _jsxs("p", { className: "font-semibold text-green-600", children: [(statistiques?.interetsPrevusAnnuel || 0).toLocaleString(), " FCFA"] })] }))] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-4", children: "Derni\u00E8res Op\u00E9rations" }), epargneData.versements.length === 0 && epargneData.retraits.length === 0 ? (_jsx("p", { className: "text-center text-gray-500 py-8", children: "Aucune op\u00E9ration enregistr\u00E9e" })) : (_jsx("div", { className: "space-y-2", children: [...epargneData.versements.slice(-5), ...epargneData.retraits.slice(-5)]
                            .sort((a, b) => new Date(b.dateVersement || b.datedemande).getTime() - new Date(a.dateVersement || a.datedemande).getTime())
                            .slice(0, 10)
                            .map((op, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [op.dateVersement ? (_jsx(ArrowUpRight, { className: "w-5 h-5 text-green-500" })) : (_jsx(ArrowDownRight, { className: "w-5 h-5 text-blue-500" })), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: op.dateVersement ? 'Versement' : 'Retrait' }), _jsx("p", { className: "text-sm text-gray-500", children: new Date(op.dateVersement || op.datedemande).toLocaleDateString('fr-FR') })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `font-semibold ${op.dateVersement ? 'text-green-600' : 'text-blue-600'}`, children: [op.dateVersement ? '+' : '-', " ", op.montant.toLocaleString(), " FCFA"] }), op.statut && (_jsx("p", { className: "text-xs text-gray-500 capitalize", children: op.statut }))] })] }, index))) }))] }), showVersementModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Effectuer un Versement" }), _jsx("button", { onClick: () => setShowVersementModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant (FCFA) *" }), _jsx("input", { type: "number", min: epargneData.configuration.montantMinimum, max: epargneData.configuration.montantMaximum, value: versement.montant, onChange: (e) => setVersement({ ...versement, montant: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", placeholder: `Min: ${epargneData.configuration.montantMinimum.toLocaleString()}` }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Entre ", epargneData.configuration.montantMinimum.toLocaleString(), " et ", epargneData.configuration.montantMaximum.toLocaleString(), " FCFA"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Moyen de paiement *" }), _jsxs("select", { value: versement.moyenPaiement, onChange: (e) => setVersement({ ...versement, moyenPaiement: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: [_jsx("option", { value: "wave", children: "Wave" }), _jsx("option", { value: "orange_money", children: "Orange Money" }), _jsx("option", { value: "virement", children: "Virement bancaire" }), _jsx("option", { value: "espece", children: "Esp\u00E8ce" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "R\u00E9f\u00E9rence de transaction" }), _jsx("input", { type: "text", value: versement.referenceTransaction, onChange: (e) => setVersement({ ...versement, referenceTransaction: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", placeholder: "Ex: WAVE123456789" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Remarque (optionnel)" }), _jsx("textarea", { value: versement.remarque, onChange: (e) => setVersement({ ...versement, remarque: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", rows: 3, placeholder: "Ajoutez une note..." })] })] }), _jsxs("div", { className: "bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3", children: [_jsx("button", { onClick: () => setShowVersementModal(false), className: "px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium", children: "Annuler" }), _jsx("button", { onClick: handleAjouterVersement, className: "px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg font-semibold", children: "Valider le Versement" })] })] }) })), showRetraitModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Demander un Retrait" }), _jsx("button", { onClick: () => setShowRetraitModal(false), className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-3", children: _jsxs("p", { className: "text-sm text-yellow-900", children: [_jsx("strong", { children: "D\u00E9lai de traitement:" }), " ", epargneData.configuration.delaiPreavisRetrait, " jours"] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Montant (FCFA) *" }), _jsx("input", { type: "number", min: epargneData.configuration.montantMinimumRetrait, max: soldeDisponible, value: retrait.montant, onChange: (e) => setRetrait({ ...retrait, montant: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", placeholder: `Min: ${epargneData.configuration.montantMinimumRetrait.toLocaleString()}` }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Disponible: ", soldeDisponible.toLocaleString(), " FCFA"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Motif du retrait *" }), _jsx("select", { value: retrait.motifRetrait, onChange: (e) => setRetrait({ ...retrait, motifRetrait: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", children: epargneData.configuration.motifsAutorises.map((motif) => (_jsx("option", { value: motif, children: motif === 'projet_associatif' ? 'Projet associatif' :
                                                    motif === 'entraide_membre' ? 'Entraide membre' :
                                                        motif === 'urgence_medicale' ? 'Urgence médicale' :
                                                            motif === 'deces' ? 'Décès' :
                                                                motif === 'demission_association' ? 'Démission' :
                                                                    motif === 'fin_periode' ? 'Fin de période' : motif }, motif))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Justification d\u00E9taill\u00E9e * (minimum 10 caract\u00E8res)" }), _jsx("textarea", { value: retrait.justification, onChange: (e) => setRetrait({ ...retrait, justification: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500", rows: 4, placeholder: "Expliquez en d\u00E9tail la raison de votre demande de retrait...", required: true }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [retrait.justification.length, " caract\u00E8res"] })] })] }), _jsxs("div", { className: "bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3", children: [_jsx("button", { onClick: () => setShowRetraitModal(false), className: "px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium", children: "Annuler" }), _jsx("button", { onClick: handleDemanderRetrait, className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg font-semibold", children: "Soumettre la Demande" })] })] }) })), renderConfigModal()] }));
};
export default EpargneTab;
//# sourceMappingURL=EpargneTab.js.map