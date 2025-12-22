import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Building, FileText, MapPin, User, Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { gieService } from '../services/gieService';
import { adhesionService } from '../services/adhesionService';
import { SENEGAL_GEOGRAPHIC_DATA, getRegions, getDepartements, getArrondissements, getCommunes } from '../data/senegalGeography';
const AdhesionForm = ({ onBack }) => {
    const { user, isAuthenticated } = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    // États pour les données géographiques
    const [regions, setRegions] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [arrondissements, setArrondissements] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [formData, setFormData] = useState({
        // Identification GIE
        numeroAdhesion: '',
        codeRegion: '',
        codeDepartement: '',
        codeArrondissement: '',
        codeCommune: '',
        numeroListe: '',
        commune: '',
        arrondissement: '',
        departement: '',
        region: '',
        // Immatriculation
        immatricule: false,
        numeroRegistre: '',
        // Présidente
        presidenteNom: '',
        presidentePrenom: '',
        dateNaissance: '',
        cinNumero: '',
        cinDelivrance: '',
        cinValidite: '',
        telephone: '',
        // Activités
        activites: [],
        autresActivites: '',
        agriculture: false,
        elevage: false,
        transformation: false,
        commerceDistribution: false,
        // Coordonnateur
        coordinateurNom: '',
        coordinateurMatricule: '',
        // Signatures
        dateSignature: new Date().toISOString().split('T')[0]
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    // Initialiser les données géographiques
    useEffect(() => {
        setRegions(getRegions());
    }, []);
    // Gestion des changements géographiques
    const handleRegionChange = (regionCode) => {
        const regionData = SENEGAL_GEOGRAPHIC_DATA[regionCode];
        setFormData(prev => ({
            ...prev,
            codeRegion: regionCode,
            region: regionData?.nom || '',
            codeDepartement: '',
            departement: '',
            codeArrondissement: '',
            arrondissement: '',
            codeCommune: '',
            commune: ''
        }));
        setDepartements(getDepartements(regionCode));
        setArrondissements([]);
        setCommunes([]);
    };
    const handleDepartementChange = (departementCode) => {
        const departementData = SENEGAL_GEOGRAPHIC_DATA[formData.codeRegion]?.departements[departementCode];
        setFormData(prev => ({
            ...prev,
            codeDepartement: departementCode,
            departement: departementData?.nom || '',
            codeArrondissement: '',
            arrondissement: '',
            codeCommune: '',
            commune: ''
        }));
        setArrondissements(getArrondissements(formData.codeRegion, departementCode));
        setCommunes([]);
    };
    const handleArrondissementChange = (arrondissementCode) => {
        const arrondissementData = SENEGAL_GEOGRAPHIC_DATA[formData.codeRegion]?.departements[formData.codeDepartement]?.arrondissements[arrondissementCode];
        setFormData(prev => ({
            ...prev,
            codeArrondissement: arrondissementCode,
            arrondissement: arrondissementData?.nom || '',
            codeCommune: '',
            commune: ''
        }));
        setCommunes(getCommunes(formData.codeRegion, formData.codeDepartement, arrondissementCode));
    };
    const handleCommuneChange = (communeNom) => {
        setFormData(prev => ({
            ...prev,
            commune: communeNom,
            codeCommune: `${prev.codeArrondissement}-${communeNom.replace(/\s+/g, '-').toUpperCase()}`
        }));
    };
    const generateGIECode = () => {
        if (formData.codeRegion && formData.codeDepartement && formData.codeArrondissement && formData.codeCommune && formData.numeroListe) {
            return `FEVEO${formData.codeRegion}${formData.codeDepartement}${formData.codeArrondissement}${formData.codeCommune}${formData.numeroListe.padStart(3, '0')}`;
        }
        return '';
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1:
                if (!formData.codeRegion)
                    newErrors.codeRegion = 'Région requise';
                if (!formData.codeDepartement)
                    newErrors.codeDepartement = 'Département requis';
                if (!formData.codeArrondissement)
                    newErrors.codeArrondissement = 'Arrondissement requis';
                if (!formData.numeroListe)
                    newErrors.numeroListe = 'Numéro de liste requis';
                break;
            case 2:
                if (!formData.presidenteNom.trim())
                    newErrors.presidenteNom = 'Nom requis';
                if (!formData.presidentePrenom.trim())
                    newErrors.presidentePrenom = 'Prénom requis';
                if (!formData.dateNaissance)
                    newErrors.dateNaissance = 'Date de naissance requise';
                if (!formData.cinNumero.trim())
                    newErrors.cinNumero = 'Numéro CIN requis';
                if (!formData.telephone.trim())
                    newErrors.telephone = 'Téléphone requis';
                break;
            case 3:
                if (!formData.agriculture && !formData.elevage && !formData.transformation && !formData.commerceDistribution) {
                    newErrors.activites = 'Au moins une activité doit être sélectionnée';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };
    const handleSubmit = async () => {
        if (!isAuthenticated) {
            setSubmitError('Vous devez être connecté pour soumettre une adhésion');
            return;
        }
        if (!validateStep(currentStep)) {
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // D'abord créer le GIE
            const gieData = {
                nomGIE: `GIE ${formData.presidenteNom}`, // Vous pouvez ajuster la logique de nommage
                presidenteNom: formData.presidenteNom,
                presidentePrenom: formData.presidentePrenom,
                adresse: {
                    region: formData.region,
                    departement: formData.departement,
                    arrondissement: formData.arrondissement,
                    commune: formData.commune,
                },
                contact: {
                    telephone: formData.telephone,
                },
                activites: formData.activites,
                autresActivites: formData.autresActivites,
                nomCoordinateur: formData.coordinateurNom,
                matriculeCoordinateur: formData.coordinateurMatricule,
                immatricule: formData.immatricule,
                numeroRegistre: formData.numeroRegistre,
            };
            const gieResponse = await gieService.createGIE(gieData);
            if (!gieResponse.success || !gieResponse.data) {
                throw new Error(gieResponse.message || 'Erreur lors de la création du GIE');
            }
            // Ensuite créer l'adhésion
            const adhesionData = {
                numeroAdhesion: formData.numeroAdhesion,
                localisation: {
                    region: formData.region,
                    departement: formData.departement,
                    arrondissement: formData.arrondissement,
                    commune: formData.commune,
                    codeRegion: formData.codeRegion,
                    codeDepartement: formData.codeDepartement,
                    codeArrondissement: formData.codeArrondissement,
                    codeCommune: formData.codeCommune,
                    numeroListe: formData.numeroListe,
                },
                immatriculation: {
                    immatricule: formData.immatricule,
                    numeroRegistre: formData.numeroRegistre,
                },
                presidente: {
                    nom: formData.presidenteNom,
                    prenom: formData.presidentePrenom,
                    dateNaissance: formData.dateNaissance,
                    cin: {
                        numero: formData.cinNumero,
                        dateDelivrance: formData.cinDelivrance,
                        dateValidite: formData.cinValidite,
                    },
                    telephone: formData.telephone,
                },
                activites: {
                    liste: formData.activites,
                    autres: formData.autresActivites,
                    secteurs: {
                        agriculture: formData.agriculture,
                        elevage: formData.elevage,
                        transformation: formData.transformation,
                        commerceDistribution: formData.commerceDistribution,
                    },
                },
                coordinateur: {
                    nom: formData.coordinateurNom,
                    matricule: formData.coordinateurMatricule,
                },
                dateSignature: formData.dateSignature,
            };
            const adhesionResponse = await adhesionService.createAdhesion(gieResponse.data._id, adhesionData);
            if (adhesionResponse.success) {
                setSubmitSuccess(true);
                console.log('Adhésion créée avec succès:', adhesionResponse.data);
            }
            else {
                throw new Error(adhesionResponse.message || 'Erreur lors de la création de l\'adhésion');
            }
        }
        catch (error) {
            console.error('Erreur lors de la soumission:', error);
            setSubmitError(error.message || 'Erreur lors de la soumission du formulaire');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const steps = [
        { id: 1, title: 'Localisation GIE', icon: MapPin },
        { id: 2, title: 'Présidente', icon: User },
        { id: 3, title: 'Activités', icon: Building },
        { id: 4, title: 'Finalisation', icon: FileText }
    ];
    return (_jsx("div", { className: "min-h-screen bg-neutral-100 py-8", children: _jsxs("div", { className: "container-max section-padding", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("button", { onClick: onBack, className: "flex items-center text-neutral-600 hover:text-accent-500 transition-colors duration-200", children: [_jsx(ArrowLeft, { className: "w-5 h-5 mr-2" }), "Retour"] }), _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-neutral-900", children: "Demande d'Adh\u00E9sion FEVEO 2050" }), _jsx("p", { className: "text-neutral-600", children: "Plateforme d'investissement \u00E9conomie organique" })] }), _jsx("div", { className: "w-20" })] }), submitSuccess && (_jsx("div", { className: "bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "w-6 h-6 mr-3" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold", children: "Demande soumise avec succ\u00E8s !" }), _jsx("p", { className: "text-sm mt-1", children: "Votre demande d'adh\u00E9sion a \u00E9t\u00E9 enregistr\u00E9e. Vous recevrez une confirmation par email." })] })] }) })), submitError && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6", children: [_jsx("h3", { className: "font-semibold", children: "Erreur lors de la soumission" }), _jsx("p", { className: "text-sm mt-1", children: submitError })] })), !isAuthenticated && (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg mb-6", children: [_jsx("h3", { className: "font-semibold", children: "Connexion requise" }), _jsx("p", { className: "text-sm mt-1", children: "Vous devez \u00EAtre connect\u00E9 pour soumettre une demande d'adh\u00E9sion." })] })), _jsx("div", { className: "flex justify-center mb-12", children: _jsx("div", { className: "flex items-center space-x-4", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: `flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${currentStep >= step.id
                                        ? 'bg-accent-500 text-neutral-50'
                                        : 'bg-neutral-50 text-neutral-400 border border-neutral-200'}`, children: [_jsx(step.icon, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium text-sm", children: step.title })] }), index < steps.length - 1 && (_jsx("div", { className: `w-8 h-0.5 mx-2 ${currentStep > step.id ? 'bg-accent-500' : 'bg-neutral-300'}` }))] }, step.id))) }) }), _jsxs("div", { className: "max-w-4xl mx-auto", children: [currentStep === 1 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(MapPin, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Localisation du GIE" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "R\u00E9gion *" }), _jsxs("select", { value: formData.codeRegion, onChange: (e) => handleRegionChange(e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.codeRegion ? 'border-red-300' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la r\u00E9gion" }), regions.map((region) => (_jsxs("option", { value: region.code, children: [region.code, " - ", region.nom] }, region.code)))] }), errors.codeRegion && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.codeRegion })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { value: formData.codeDepartement, onChange: (e) => handleDepartementChange(e.target.value), disabled: !formData.codeRegion, className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.codeDepartement ? 'border-red-300' : 'border-neutral-300'} ${!formData.codeRegion ? 'bg-neutral-100' : ''}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez le d\u00E9partement" }), departements.map((dept) => (_jsxs("option", { value: dept.code, children: [dept.code, " - ", dept.nom] }, dept.code)))] }), errors.codeDepartement && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.codeDepartement })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Arrondissement *" }), _jsxs("select", { value: formData.codeArrondissement, onChange: (e) => handleArrondissementChange(e.target.value), disabled: !formData.codeDepartement, className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.codeArrondissement ? 'border-red-300' : 'border-neutral-300'} ${!formData.codeDepartement ? 'bg-neutral-100' : ''}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez l'arrondissement" }), arrondissements.map((arr) => (_jsxs("option", { value: arr.code, children: [arr.code, " - ", arr.nom] }, arr.code)))] }), errors.codeArrondissement && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.codeArrondissement })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Commune" }), _jsxs("select", { value: formData.commune, onChange: (e) => handleCommuneChange(e.target.value), disabled: !formData.codeArrondissement, className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${!formData.codeArrondissement ? 'bg-neutral-100' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez la commune" }), communes.map((commune, index) => (_jsx("option", { value: commune.nom, children: commune.nom }, index)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Num\u00E9ro de liste d'adh\u00E9sion *" }), _jsx("input", { type: "number", min: "1", max: "999", value: formData.numeroListe, onChange: (e) => handleInputChange('numeroListe', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.numeroListe ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Num\u00E9ro d'ordre dans la commune" }), errors.numeroListe && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.numeroListe })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom de la commune" }), _jsx("input", { type: "text", value: formData.commune, onChange: (e) => handleInputChange('commune', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", placeholder: "Nom de la commune" })] })] }), generateGIECode() && (_jsxs("div", { className: "mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200", children: [_jsx("h4", { className: "font-semibold text-accent-800 mb-2", children: "Code GIE g\u00E9n\u00E9r\u00E9 :" }), _jsx("p", { className: "text-2xl font-mono font-bold text-accent-600", children: generateGIECode() })] })), _jsx("div", { className: "flex justify-end mt-8", children: _jsx("button", { onClick: handleNext, className: "btn-accent px-8 py-3", children: "Continuer" }) })] })), currentStep === 2 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(User, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Informations de la Pr\u00E9sidente" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom *" }), _jsx("input", { type: "text", value: formData.presidenteNom, onChange: (e) => handleInputChange('presidenteNom', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.presidenteNom ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Nom de famille" }), errors.presidenteNom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidenteNom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Pr\u00E9nom *" }), _jsx("input", { type: "text", value: formData.presidentePrenom, onChange: (e) => handleInputChange('presidentePrenom', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.presidentePrenom ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Pr\u00E9nom(s)" }), errors.presidentePrenom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.presidentePrenom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Date de naissance *" }), _jsx("input", { type: "date", value: formData.dateNaissance, onChange: (e) => handleInputChange('dateNaissance', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.dateNaissance ? 'border-red-300' : 'border-neutral-300'}` }), errors.dateNaissance && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.dateNaissance })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Num\u00E9ro CIN *" }), _jsx("input", { type: "text", value: formData.cinNumero, onChange: (e) => handleInputChange('cinNumero', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.cinNumero ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Num\u00E9ro de la carte d'identit\u00E9" }), errors.cinNumero && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.cinNumero })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Date de d\u00E9livrance CIN" }), _jsx("input", { type: "date", value: formData.cinDelivrance, onChange: (e) => handleInputChange('cinDelivrance', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Date de validit\u00E9 CIN" }), _jsx("input", { type: "date", value: formData.cinValidite, onChange: (e) => handleInputChange('cinValidite', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "T\u00E9l\u00E9phone et PAYMASTER *" }), _jsx("input", { type: "tel", value: formData.telephone, onChange: (e) => handleInputChange('telephone', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.telephone ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "+221 XX XXX XX XX" }), errors.telephone && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.telephone })] })] }), _jsxs("div", { className: "mt-8 p-4 bg-neutral-50 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-neutral-900 mb-4", children: "Immatriculation au Registre de Commerce" }), _jsxs("div", { className: "flex items-center space-x-6 mb-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "immatriculation", checked: formData.immatricule, onChange: () => handleInputChange('immatricule', true), className: "mr-2" }), "Immatricul\u00E9"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "immatriculation", checked: !formData.immatricule, onChange: () => handleInputChange('immatricule', false), className: "mr-2" }), "Non immatricul\u00E9"] })] }), formData.immatricule && (_jsx("input", { type: "text", value: formData.numeroRegistre, onChange: (e) => handleInputChange('numeroRegistre', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", placeholder: "Num\u00E9ro de registre de commerce" }))] }), _jsxs("div", { className: "flex justify-between mt-8", children: [_jsx("button", { onClick: () => setCurrentStep(1), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsx("button", { onClick: handleNext, className: "btn-accent px-8 py-3", children: "Continuer" })] })] })), currentStep === 3 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Building, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Activit\u00E9s du GIE" })] }), _jsx("p", { className: "text-neutral-600 mb-6", children: "S\u00E9lectionnez les activit\u00E9s dans lesquelles votre GIE souhaite s'engager :" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200", children: [_jsx("input", { type: "checkbox", checked: formData.agriculture, onChange: (e) => handleInputChange('agriculture', e.target.checked), className: "mr-4 w-5 h-5 text-accent-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-900", children: "Agriculture" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Production agricole et mara\u00EEch\u00E8re" })] })] }), _jsxs("label", { className: "flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200", children: [_jsx("input", { type: "checkbox", checked: formData.elevage, onChange: (e) => handleInputChange('elevage', e.target.checked), className: "mr-4 w-5 h-5 text-accent-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-900", children: "\u00C9levage" }), _jsx("p", { className: "text-sm text-neutral-600", children: "\u00C9levage de b\u00E9tail et volaille" })] })] }), _jsxs("label", { className: "flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200", children: [_jsx("input", { type: "checkbox", checked: formData.transformation, onChange: (e) => handleInputChange('transformation', e.target.checked), className: "mr-4 w-5 h-5 text-accent-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-900", children: "Transformation" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Transformation des produits agricoles" })] })] }), _jsxs("label", { className: "flex items-center p-4 border border-neutral-200 rounded-lg hover:border-accent-300 cursor-pointer transition-colors duration-200", children: [_jsx("input", { type: "checkbox", checked: formData.commerceDistribution, onChange: (e) => handleInputChange('commerceDistribution', e.target.checked), className: "mr-4 w-5 h-5 text-accent-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-900", children: "Commerce et Distribution" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Vente et distribution de produits" })] })] })] }), errors.activites && _jsx("p", { className: "text-red-500 text-sm mt-4", children: errors.activites }), _jsxs("div", { className: "mt-8 p-4 bg-neutral-50 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-neutral-900 mb-4", children: "Coordonnateur d'enr\u00F4lement" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("input", { type: "text", value: formData.coordinateurNom, onChange: (e) => handleInputChange('coordinateurNom', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", placeholder: "Nom du coordonnateur" }), _jsx("input", { type: "text", value: formData.coordinateurMatricule, onChange: (e) => handleInputChange('coordinateurMatricule', e.target.value), className: "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200", placeholder: "Matricule (C.ENR.XXX)" })] })] }), _jsxs("div", { className: "flex justify-between mt-8", children: [_jsx("button", { onClick: () => setCurrentStep(2), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsx("button", { onClick: handleNext, className: "btn-accent px-8 py-3", children: "Continuer" })] })] })), currentStep === 4 && (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(FileText, { className: "w-8 h-8 text-accent-500 mr-3" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900", children: "Finalisation de la demande" })] }), _jsxs("div", { className: "bg-neutral-50 rounded-lg p-6 mb-8", children: [_jsx("h4", { className: "font-semibold text-neutral-900 mb-4", children: "R\u00E9capitulatif de la demande" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-medium text-neutral-700 mb-2", children: "Code GIE" }), _jsx("p", { className: "text-lg font-mono font-bold text-accent-600", children: generateGIECode() })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-neutral-700 mb-2", children: "Localisation" }), _jsxs("p", { className: "text-neutral-900", children: [formData.commune && `${formData.commune}, `, formData.arrondissement && `${formData.arrondissement}, `, formData.departement && `${formData.departement}, `, formData.region] })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-neutral-700 mb-2", children: "Pr\u00E9sidente" }), _jsxs("p", { className: "text-neutral-900", children: [formData.presidentePrenom, " ", formData.presidenteNom] }), _jsx("p", { className: "text-sm text-neutral-600", children: formData.telephone })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-neutral-700 mb-2", children: "Activit\u00E9s" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [formData.agriculture && _jsx("span", { className: "px-2 py-1 bg-success-100 text-success-700 rounded text-sm", children: "Agriculture" }), formData.elevage && _jsx("span", { className: "px-2 py-1 bg-success-100 text-success-700 rounded text-sm", children: "\u00C9levage" }), formData.transformation && _jsx("span", { className: "px-2 py-1 bg-success-100 text-success-700 rounded text-sm", children: "Transformation" }), formData.commerceDistribution && _jsx("span", { className: "px-2 py-1 bg-success-100 text-success-700 rounded text-sm", children: "Commerce" })] })] })] })] }), _jsxs("div", { className: "bg-accent-50 rounded-lg p-6 mb-8", children: [_jsx("h4", { className: "font-semibold text-accent-800 mb-4", children: "Frais d'adh\u00E9sion" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-accent-700", children: "Droits d'adh\u00E9sion :" }), _jsx("span", { className: "font-bold text-accent-800", children: "20 000 FCFA" })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-accent-700", children: "Actions d'investissement :" }), _jsx("span", { className: "font-bold text-accent-800", children: "60 000 FCFA" })] }), _jsx("div", { className: "md:col-span-2 border-t border-accent-200 pt-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-lg font-semibold text-accent-800", children: "Total :" }), _jsx("span", { className: "text-2xl font-bold text-accent-800", children: "80 000 FCFA" })] }) })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Date de signature" }), _jsx("input", { type: "date", value: formData.dateSignature, onChange: (e) => handleInputChange('dateSignature', e.target.value), className: "w-full max-w-xs px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200" })] }), _jsxs("div", { className: "bg-neutral-50 rounded-lg p-6 mb-8", children: [_jsx("h4", { className: "font-semibold text-neutral-900 mb-4", children: "Signatures requises" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2", children: _jsx("span", { className: "text-neutral-500 text-sm", children: "Signature Pr\u00E9sidente" }) }), _jsx("p", { className: "text-sm font-medium text-neutral-700", children: "Pr\u00E9sidente" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2", children: _jsx("span", { className: "text-neutral-500 text-sm", children: "Signature Secr\u00E9taire" }) }), _jsx("p", { className: "text-sm font-medium text-neutral-700", children: "Secr\u00E9taire G\u00E9n\u00E9rale" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "h-20 border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center mb-2", children: _jsx("span", { className: "text-neutral-500 text-sm", children: "Signature Tr\u00E9sori\u00E8re" }) }), _jsx("p", { className: "text-sm font-medium text-neutral-700", children: "Tr\u00E9sori\u00E8re" })] })] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentStep(3), className: "btn-secondary px-8 py-3", children: "Retour" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("button", { className: "btn-secondary px-6 py-3", children: [_jsx(Download, { className: "w-5 h-5 mr-2" }), "T\u00E9l\u00E9charger PDF"] }), _jsx("button", { onClick: handleSubmit, className: "btn-success px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" }), "Soumission en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-5 h-5 mr-2" }), "Soumettre la demande"] })) })] })] })] }))] })] }) }));
};
export default AdhesionForm;
//# sourceMappingURL=AdhesionForm.js.map