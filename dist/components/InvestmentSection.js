import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Shield, CreditCard, Wallet, Camera, CheckCircle, AlertCircle, Eye, EyeOff, Smartphone, FileText, Lock, User, Building, DollarSign, ArrowRight, Download, QrCode, Loader2 } from 'lucide-react';
import gieValidationService from '../services/gieValidationService';
const InvestmentSection = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoadingGIE, setIsLoadingGIE] = useState(false);
    const [validatedGIE, setValidatedGIE] = useState(null);
    // États pour la validation GIE
    const [validationError, setValidationError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [gieData, setGieData] = useState({
        identification: '',
        nom: '',
        presidenteNom: '',
        presidenteEmail: '',
        presidenteTelephone: '',
        region: '',
        nombreMembres: 0
    });
    const [subscriptionData, setSubscriptionData] = useState({
        nombreParts: 0,
        typeInvestissement: '',
        objectifProjet: '',
        secteurActivite: '',
        dureeInvestissement: '',
        descriptionProjet: '',
        montantTotal: 0
    });
    const [paymentData, setPaymentData] = useState({
        operateur: '',
        numeroTelephone: '',
        codePin: '',
        montantTotal: 0,
        showPin: false
    });
    const [faceVerification, setFaceVerification] = useState({
        isVerified: false,
        isProcessing: false,
        confidence: 0
    });
    const [walletGenerated, setWalletGenerated] = useState(false);
    const [errors, setErrors] = useState({});
    const steps = [
        { id: 1, title: 'Identification GIE', icon: Building },
        { id: 2, title: 'Fiche Souscription', icon: FileText },
        { id: 3, title: 'Vérification Faciale', icon: Camera },
        { id: 4, title: 'Paiement Mobile', icon: Smartphone },
        { id: 5, title: 'Wallet GIE', icon: Wallet }
    ];
    const regions = [
        'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Kaolack',
        'Tambacounda', 'Kolda', 'Ziguinchor', 'Fatick', 'Kaffrine',
        'Kédougou', 'Louga', 'Matam', 'Sédhiou'
    ];
    const secteurs = [
        'Agriculture', 'Élevage', 'Pêche', 'Artisanat', 'Commerce',
        'Transformation alimentaire', 'Textile', 'Services', 'Technologie'
    ];
    const operateurs = [
        { name: 'Orange Money', code: 'orange', logo: '🟠' },
        { name: 'Free Money', code: 'free', logo: '🔵' },
        { name: 'Expresso', code: 'expresso', logo: '🟣' },
        { name: 'Joni Joni', code: 'joni', logo: '🟢' }
    ];
    const typesInvestissement = [
        { value: 'production', label: 'Production Agricole', min: 50000, max: 2000000 },
        { value: 'transformation', label: 'Transformation', min: 100000, max: 5000000 },
        { value: 'commerce', label: 'Commerce/Distribution', min: 25000, max: 1000000 },
        { value: 'mixte', label: 'Projet Mixte', min: 75000, max: 3000000 }
    ];
    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1:
                if (!gieData.identification.trim())
                    newErrors.identification = 'Identification requise';
                if (!gieData.nom.trim())
                    newErrors.nom = 'Nom du GIE requis';
                if (!gieData.presidenteNom.trim())
                    newErrors.presidenteNom = 'Nom de la présidente requis';
                if (!gieData.presidenteEmail.trim())
                    newErrors.presidenteEmail = 'Email requis';
                if (!gieData.region)
                    newErrors.region = 'Région requise';
                break;
            case 2:
                if (!subscriptionData.nombreParts)
                    newErrors.nombreParts = 'Nombre de parts requis';
                if (!subscriptionData.typeInvestissement)
                    newErrors.typeInvestissement = 'Type d\'investissement requis';
                if (!subscriptionData.objectifProjet.trim())
                    newErrors.objectifProjet = 'Objectif du projet requis';
                break;
            case 4:
                if (!paymentData.operateur)
                    newErrors.operateur = 'Opérateur requis';
                if (!paymentData.numeroTelephone.trim())
                    newErrors.numeroTelephone = 'Numéro requis';
                if (!paymentData.codePin.trim())
                    newErrors.codePin = 'Code PIN requis';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Fonction pour valider le GIE
    const handleGIEValidation = async () => {
        if (!gieData.identification.trim()) {
            setErrors({ identification: 'Identification requise' });
            return;
        }
        setIsLoadingGIE(true);
        setIsValidating(true);
        setValidationError(null);
        try {
            const result = await gieValidationService.validateGie(gieData.identification);
            if (result.isValid && result.gie) {
                setValidatedGIE(result.gie);
                setCurrentStep(2); // Passer à l'étape suivante
                setErrors({});
            }
            else {
                setValidationError(result.error || 'GIE non valide');
            }
        }
        catch (error) {
            console.error('Erreur validation GIE:', error);
            setValidationError('Erreur de connexion au serveur');
        }
        finally {
            setIsLoadingGIE(false);
            setIsValidating(false);
        }
    };
    // Fonction pour effacer les erreurs
    const clearError = () => {
        setValidationError(null);
    };
    const handleNext = () => {
        // Pour l'étape 1, on utilise la validation GIE backend
        if (currentStep === 1) {
            handleGIEValidation();
            return;
        }
        // Pour les autres étapes, validation normale
        if (validateStep(currentStep)) {
            if (currentStep === 2) {
                // Calculer le montant total
                const prixPart = 10000; // 10 000 FCFA par part
                setSubscriptionData(prev => ({
                    ...prev,
                    montantTotal: prev.nombreParts * prixPart
                }));
            }
            setCurrentStep(prev => prev + 1);
        }
    };
    const handleFaceVerification = () => {
        setFaceVerification(prev => ({ ...prev, isProcessing: true }));
        // Simulation de la reconnaissance faciale
        setTimeout(() => {
            const confidence = Math.random() * 30 + 70; // 70-100%
            setFaceVerification({
                isProcessing: false,
                isVerified: confidence > 75,
                confidence: Math.round(confidence)
            });
        }, 3000);
    };
    const handlePayment = () => {
        if (validateStep(4)) {
            // Simulation du paiement
            setTimeout(() => {
                setWalletGenerated(true);
                setCurrentStep(5);
            }, 2000);
        }
    };
    const generateWalletId = () => {
        return `FEVEO-${gieData.identification}-${Date.now().toString().slice(-6)}`;
    };
    return (_jsx("section", { id: "investir", className: "py-20 bg-neutral-100", children: _jsxs("div", { className: "container-max section-padding", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-neutral-900 mb-6", children: ["Souscrire aux", _jsx("span", { className: "block text-accent-500", children: "Parts d'Investissement" })] }), _jsx("p", { className: "text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed", children: "Processus s\u00E9curis\u00E9 de souscription avec identification biom\u00E9trique et g\u00E9n\u00E9ration automatique du Wallet GIE" })] }), _jsx("div", { className: "flex justify-center mb-12", children: _jsx("div", { className: "flex items-center space-x-4 overflow-x-auto pb-4", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${currentStep >= step.id
                                        ? 'bg-accent-500 text-neutral-50'
                                        : 'bg-neutral-50 text-neutral-400 border border-neutral-200'}`, children: [_jsx(step.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium text-sm whitespace-nowrap", children: step.title })] }), index < steps.length - 1 && (_jsx(ArrowRight, { className: `w-5 h-5 mx-2 ${currentStep > step.id ? 'text-accent-500' : 'text-neutral-300'}` }))] }, step.id))) }) }), _jsxs("div", { className: "max-w-4xl mx-auto", children: [validationError && (_jsx("div", { className: "mb-8 p-4 bg-red-50 border border-red-200 rounded-lg", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-red-800", children: "Erreur de validation" }), _jsx("p", { className: "mt-1 text-sm text-red-600", children: validationError }), _jsxs("div", { className: "mt-4 flex space-x-3", children: [_jsx("button", { onClick: () => handleGIEValidation(), className: "text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200", children: "R\u00E9essayer" }), _jsx("button", { onClick: () => window.open('/contact', '_blank'), className: "text-sm text-red-600 underline hover:no-underline", children: "Contacter le support" })] })] })] }) })), currentStep === 1 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Building, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Identification du GIE Affili\u00E9" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Code d'identification alphanum\u00E9rique du GIE *" }), _jsx("input", { type: "text", value: gieData.identification, onChange: (e) => {
                                                        setGieData(prev => ({ ...prev, identification: e.target.value.toUpperCase() }));
                                                        clearError(); // Effacer les erreurs lors de la saisie
                                                    }, className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 font-mono text-lg ${errors.identification ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Ex: 68858062677053a96fa5cb54", disabled: isLoadingGIE || isValidating }), errors.identification && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.identification }), _jsx("p", { className: "text-sm text-neutral-500 mt-1", children: "Saisissez l'ID MongoDB de votre GIE valid\u00E9" })] }), _jsx("div", { className: "md:col-span-2 bg-blue-50 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-900 mb-1", children: "GIE Disponibles pour Test" }), _jsx("p", { className: "text-sm text-blue-700 mb-2", children: "Utilisez un de ces ID de GIE valid\u00E9s pour tester :" }), _jsxs("div", { className: "space-y-1 text-sm font-mono", children: [_jsxs("div", { className: "bg-blue-100 rounded px-2 py-1", children: [_jsx("span", { className: "text-blue-800", children: "68858062677053a96fa5cb54" }), _jsx("span", { className: "text-blue-600 ml-2", children: "(FEVEO-01-01-01-01-001)" })] }), _jsxs("div", { className: "bg-blue-100 rounded px-2 py-1", children: [_jsx("span", { className: "text-blue-800", children: "68858063677053a96fa5d2ad" }), _jsx("span", { className: "text-blue-600 ml-2", children: "(FEVEO-02-01-01-01-002)" })] })] })] })] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom du GIE *" }), _jsx("input", { type: "text", value: gieData.nom, onChange: (e) => setGieData(prev => ({ ...prev, nom: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.nom ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Nom du GIE" }), errors.nom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "R\u00E9gion *" }), _jsxs("select", { value: gieData.region, onChange: (e) => setGieData(prev => ({ ...prev, region: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.region ? 'border-red-300' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la r\u00E9gion" }), regions.map((region) => (_jsx("option", { value: region, children: region }, region)))] }), errors.region && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.region })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom de la Pr\u00E9sidente *" }), _jsx("input", { type: "text", value: gieData.presidenteNom, onChange: (e) => setGieData(prev => ({ ...prev, presidenteNom: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.presidenteNom ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Nom complet de la pr\u00E9sidente" }), errors.presidenteNom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidenteNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Email de la Pr\u00E9sidente *" }), _jsx("input", { type: "email", value: gieData.presidenteEmail, onChange: (e) => setGieData(prev => ({ ...prev, presidenteEmail: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.presidenteEmail ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "email@exemple.com" }), errors.presidenteEmail && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidenteEmail })] })] }), _jsx("div", { className: "flex justify-end mt-8", children: _jsxs("button", { onClick: handleNext, disabled: isLoadingGIE || isValidating || !gieData.identification.trim(), className: `px-8 py-3 rounded-lg flex items-center ${isLoadingGIE || isValidating
                                            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                                            : 'btn-accent'}`, children: [(isLoadingGIE || isValidating) && (_jsx(Loader2, { className: "w-5 h-5 mr-2 animate-spin" })), (isLoadingGIE || isValidating) ? 'Validation en cours...' : 'Valider le GIE', !(isLoadingGIE || isValidating) && _jsx(ArrowRight, { className: "w-5 h-5 ml-2" })] }) })] })), currentStep === 2 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(FileText, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Fiche de Souscription" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Type d'investissement *" }), _jsxs("select", { value: subscriptionData.typeInvestissement, onChange: (e) => setSubscriptionData(prev => ({ ...prev, typeInvestissement: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.typeInvestissement ? 'border-red-300' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez le type" }), typesInvestissement.map((type) => (_jsxs("option", { value: type.value, children: [type.label, " (", type.min.toLocaleString(), " - ", type.max.toLocaleString(), " FCFA)"] }, type.value)))] }), errors.typeInvestissement && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.typeInvestissement })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nombre de parts *" }), _jsx("input", { type: "number", min: "1", max: "500", value: subscriptionData.nombreParts, onChange: (e) => setSubscriptionData(prev => ({ ...prev, nombreParts: parseInt(e.target.value) || 0 })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.nombreParts ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Nombre de parts (1 part = 10 000 FCFA)" }), errors.nombreParts && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nombreParts }), subscriptionData.nombreParts && (_jsxs("p", { className: "text-sm text-success-600 mt-1", children: ["Montant total: ", (subscriptionData.nombreParts * 10000).toLocaleString(), " FCFA"] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Dur\u00E9e d'investissement" }), _jsxs("select", { value: subscriptionData.dureeInvestissement, onChange: (e) => setSubscriptionData(prev => ({ ...prev, dureeInvestissement: e.target.value })), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la dur\u00E9e" }), _jsx("option", { value: "6", children: "6 mois" }), _jsx("option", { value: "12", children: "12 mois" }), _jsx("option", { value: "24", children: "24 mois" }), _jsx("option", { value: "36", children: "36 mois" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Objectif du projet *" }), _jsx("input", { type: "text", value: subscriptionData.objectifProjet, onChange: (e) => setSubscriptionData(prev => ({ ...prev, objectifProjet: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.objectifProjet ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Ex: D\u00E9veloppement de la production mara\u00EEch\u00E8re" }), errors.objectifProjet && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.objectifProjet })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Description du projet" }), _jsx("textarea", { rows: 4, value: subscriptionData.descriptionProjet, onChange: (e) => setSubscriptionData(prev => ({ ...prev, descriptionProjet: e.target.value })), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", placeholder: "D\u00E9crivez votre projet d'investissement..." })] })] }), _jsxs("div", { className: "flex justify-between mt-8", children: [_jsx("button", { onClick: () => setCurrentStep(1), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsxs("button", { onClick: handleNext, className: "btn-accent px-8 py-3", children: ["Continuer", _jsx(ArrowRight, { className: "w-5 h-5 ml-2" })] })] })] })), currentStep === 3 && (_jsxs("div", { className: "card text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-6", children: [_jsx(Camera, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "V\u00E9rification Faciale S\u00E9curis\u00E9e" })] }), _jsxs("div", { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "bg-neutral-100 rounded-xl p-8 mb-6", children: [!faceVerification.isProcessing && !faceVerification.isVerified && (_jsxs("div", { children: [_jsx(Camera, { className: "w-24 h-24 text-neutral-400 mx-auto mb-4" }), _jsx("p", { className: "text-neutral-600 mb-6", children: "Positionnez votre visage dans le cadre pour la v\u00E9rification d'identit\u00E9 de la Pr\u00E9sidente du GIE" }), _jsx("button", { onClick: handleFaceVerification, className: "btn-accent px-6 py-3", children: "D\u00E9marrer la v\u00E9rification" })] })), faceVerification.isProcessing && (_jsxs("div", { children: [_jsx("div", { className: "w-24 h-24 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-accent-600 font-medium", children: "Analyse en cours..." }), _jsx("p", { className: "text-sm text-neutral-500 mt-2", children: "Veuillez rester immobile" })] })), faceVerification.isVerified && (_jsxs("div", { children: [_jsx(CheckCircle, { className: "w-24 h-24 text-success-500 mx-auto mb-4" }), _jsx("p", { className: "text-success-600 font-medium mb-2", children: "V\u00E9rification r\u00E9ussie !" }), _jsxs("p", { className: "text-sm text-neutral-600", children: ["Confiance: ", faceVerification.confidence, "%"] })] })), !faceVerification.isProcessing && !faceVerification.isVerified && faceVerification.confidence > 0 && (_jsxs("div", { children: [_jsx(AlertCircle, { className: "w-24 h-24 text-red-500 mx-auto mb-4" }), _jsx("p", { className: "text-red-600 font-medium mb-2", children: "V\u00E9rification \u00E9chou\u00E9e" }), _jsxs("p", { className: "text-sm text-neutral-600 mb-4", children: ["Confiance: ", faceVerification.confidence, "% (minimum requis: 75%)"] }), _jsx("button", { onClick: handleFaceVerification, className: "btn-accent px-6 py-3", children: "R\u00E9essayer" })] }))] }), _jsx("div", { className: "bg-blue-50 rounded-lg p-4 text-left", children: _jsxs("div", { className: "flex items-start", children: [_jsx(Shield, { className: "w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-900 mb-1", children: "S\u00E9curit\u00E9 garantie" }), _jsx("p", { className: "text-sm text-blue-700", children: "Vos donn\u00E9es biom\u00E9triques sont chiffr\u00E9es et ne sont utilis\u00E9es que pour la v\u00E9rification d'identit\u00E9." })] })] }) })] }), _jsxs("div", { className: "flex justify-between mt-8", children: [_jsx("button", { onClick: () => setCurrentStep(2), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsxs("button", { onClick: () => setCurrentStep(4), disabled: !faceVerification.isVerified, className: `px-8 py-3 rounded-lg font-medium transition-all duration-200 ${faceVerification.isVerified
                                                ? 'btn-accent'
                                                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'}`, children: ["Continuer", _jsx(ArrowRight, { className: "w-5 h-5 ml-2" })] })] })] })), currentStep === 4 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Smartphone, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Paiement Mobile Money" })] }), _jsx("div", { className: "bg-success-50 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-success-800", children: "Montant \u00E0 payer" }), _jsxs("p", { className: "text-2xl font-bold text-success-600", children: [subscriptionData.montantTotal.toLocaleString(), " FCFA"] }), _jsxs("p", { className: "text-sm text-success-700", children: [subscriptionData.nombreParts, " parts \u00D7 10 000 FCFA"] })] }), _jsx(DollarSign, { className: "w-12 h-12 text-success-500" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Op\u00E9rateur Mobile Money *" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: operateurs.map((op) => (_jsxs("button", { onClick: () => setPaymentData(prev => ({ ...prev, operateur: op.code })), className: `p-4 border rounded-lg text-center transition-all duration-200 ${paymentData.operateur === op.code
                                                            ? 'border-accent-500 bg-accent-50 text-accent-700'
                                                            : 'border-neutral-200 hover:border-neutral-300'}`, children: [_jsx("div", { className: "text-2xl mb-1", children: op.logo }), _jsx("div", { className: "text-sm font-medium", children: op.name })] }, op.code))) }), errors.operateur && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.operateur })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Num\u00E9ro de t\u00E9l\u00E9phone *" }), _jsx("input", { type: "tel", value: paymentData.numeroTelephone, onChange: (e) => setPaymentData(prev => ({ ...prev, numeroTelephone: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.numeroTelephone ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "+221 XX XXX XX XX" }), errors.numeroTelephone && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.numeroTelephone }), _jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2 mt-4", children: "Code PIN *" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: paymentData.showPin ? 'text' : 'password', value: paymentData.codePin, onChange: (e) => setPaymentData(prev => ({ ...prev, codePin: e.target.value })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 pr-12 ${errors.codePin ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Code PIN", maxLength: 4 }), _jsx("button", { type: "button", onClick: () => setPaymentData(prev => ({ ...prev, showPin: !prev.showPin })), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600", children: paymentData.showPin ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] }), errors.codePin && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.codePin })] })] }), _jsx("div", { className: "bg-amber-50 rounded-lg p-4 mt-6", children: _jsxs("div", { className: "flex items-start", children: [_jsx(Lock, { className: "w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-amber-900 mb-1", children: "Paiement s\u00E9curis\u00E9" }), _jsx("p", { className: "text-sm text-amber-700", children: "Votre paiement est prot\u00E9g\u00E9 par un chiffrement de niveau bancaire. Vous recevrez un SMS de confirmation apr\u00E8s le paiement." })] })] }) }), _jsxs("div", { className: "flex justify-between mt-8", children: [_jsx("button", { onClick: () => setCurrentStep(3), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsxs("button", { onClick: handlePayment, className: "btn-success px-8 py-3", children: ["Payer ", subscriptionData.montantTotal.toLocaleString(), " FCFA", _jsx(CreditCard, { className: "w-5 h-5 ml-2" })] })] })] })), currentStep === 5 && walletGenerated && (_jsxs("div", { className: "card text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-6", children: [_jsx(CheckCircle, { className: "w-12 h-12 text-success-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-success-600", children: "Wallet GIE G\u00E9n\u00E9r\u00E9 avec Succ\u00E8s !" })] }), _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "bg-primary-500 rounded-xl p-8 text-neutral-50 mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-bold mb-2", children: "WALLET GIE AFFILI\u00C9" }), _jsx("p", { className: "opacity-90", children: gieData.nom })] }), _jsx(Wallet, { className: "w-12 h-12 opacity-80" })] }), _jsxs("div", { className: "bg-neutral-50/10 rounded-lg p-4 mb-4", children: [_jsx("div", { className: "text-sm opacity-80 mb-1", children: "ID Wallet" }), _jsx("div", { className: "font-mono text-lg font-bold", children: generateWalletId() })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "bg-neutral-50/10 rounded-lg p-3", children: [_jsx("div", { className: "opacity-80", children: "Parts souscrites" }), _jsx("div", { className: "font-bold text-lg", children: subscriptionData.nombreParts })] }), _jsxs("div", { className: "bg-neutral-50/10 rounded-lg p-3", children: [_jsx("div", { className: "opacity-80", children: "Montant investi" }), _jsxs("div", { className: "font-bold text-lg", children: [subscriptionData.montantTotal.toLocaleString(), " FCFA"] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { className: "bg-neutral-100 rounded-lg p-6", children: [_jsx("h5", { className: "font-semibold text-neutral-900 mb-4", children: "Informations du GIE" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Code GIE:" }), _jsx("span", { className: "font-medium", children: gieData.identification })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Pr\u00E9sidente:" }), _jsx("span", { className: "font-medium", children: gieData.presidenteNom })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "R\u00E9gion:" }), _jsx("span", { className: "font-medium", children: gieData.region })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Statut:" }), _jsx("span", { className: "text-success-600 font-medium", children: "\u2713 V\u00E9rifi\u00E9" })] })] })] }), _jsxs("div", { className: "bg-neutral-100 rounded-lg p-6", children: [_jsx("h5", { className: "font-semibold text-neutral-900 mb-4", children: "D\u00E9tails Investissement" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Type:" }), _jsx("span", { className: "font-medium", children: typesInvestissement.find(t => t.value === subscriptionData.typeInvestissement)?.label })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Dur\u00E9e:" }), _jsxs("span", { className: "font-medium", children: [subscriptionData.dureeInvestissement, " mois"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Objectif:" }), _jsx("span", { className: "font-medium", children: subscriptionData.objectifProjet })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Date:" }), _jsx("span", { className: "font-medium", children: new Date().toLocaleDateString('fr-FR') })] })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs("button", { className: "btn-primary px-6 py-3", children: [_jsx(Download, { className: "w-5 h-5 mr-2" }), "T\u00E9l\u00E9charger le certificat"] }), _jsxs("button", { className: "btn-secondary px-6 py-3", children: [_jsx(QrCode, { className: "w-5 h-5 mr-2" }), "Code QR Wallet"] }), _jsxs("button", { className: "btn-accent px-6 py-3", children: [_jsx(Wallet, { className: "w-5 h-5 mr-2" }), "Acc\u00E9der au Wallet"] })] }), _jsx("div", { className: "bg-blue-50 rounded-lg p-4 mt-8 text-left", children: _jsxs("div", { className: "flex items-start", children: [_jsx(User, { className: "w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-900 mb-1", children: "Acc\u00E8s priv\u00E9 s\u00E9curis\u00E9" }), _jsx("p", { className: "text-sm text-blue-700", children: "Votre Wallet GIE est maintenant accessible depuis la rubrique \"WALLET GIE\" avec un acc\u00E8s priv\u00E9 s\u00E9curis\u00E9. Seuls les membres autoris\u00E9s du GIE peuvent y acc\u00E9der." })] })] }) })] })] }))] })] }) }));
};
export default InvestmentSection;
//# sourceMappingURL=InvestmentSection.js.map