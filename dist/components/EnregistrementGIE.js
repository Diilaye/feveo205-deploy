import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { gieService } from '../services/gieService';
const EnregistrementGIE = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        identifiantGIE: '',
        numeroProtocole: '',
        nomGIE: '',
        presidenteNom: '',
        presidentePrenom: '',
        presidenteTelephone: '',
        presidenteCIN: '',
        presidenteEmail: '',
        presidenteAdresse: '',
        region: '',
        departement: '',
        arrondissement: '',
        commune: '',
        // Ajout des codes manquants requis par le type EnregistrementGIEData
        codeRegion: '',
        codeDepartement: '',
        codeArrondissement: '',
        codeCommune: '',
        secteurPrincipal: '',
        objectifs: '', // String au lieu d'array
        activites: [],
        dateConstitution: '',
        nombreMembres: 1,
        membres: [],
        adresse: '',
        secteurActivite: '',
        description: '',
        besoinsFinancement: 0
    });
    // État local pour gérer la sélection multiple des objectifs comme array
    const [objectifsSelectionnes, setObjectifsSelectionnes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const secteursActivite = [
        'agriculture',
        'elevage',
        'peche',
        'artisanat',
        'commerce',
        'transformation',
        'services',
        'autre'
    ];
    const objectifsPossibles = [
        'Production',
        'Commerce',
        'Transformation',
        'Formation',
        'Crédit',
        'Épargne',
        'Solidarité',
        'Développement communautaire'
    ];
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Mise à jour standard du champ
        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: value
            };
            // Si un des champs d'adresse administratifs est modifié, mettre à jour le code correspondant
            // Note: Cette logique est simplifiée - idéalement, vous devriez récupérer les vrais codes
            // à partir d'une API ou d'une liste prédéfinie basée sur la sélection
            if (name === 'region') {
                updatedData.codeRegion = value.substring(0, 2); // exemple simple: utilise les 2 premiers caractères
            }
            else if (name === 'departement') {
                updatedData.codeDepartement = value.substring(0, 2); // exemple simple
            }
            else if (name === 'arrondissement') {
                updatedData.codeArrondissement = value.substring(0, 2); // exemple simple
            }
            else if (name === 'commune') {
                updatedData.codeCommune = value.substring(0, 3); // exemple simple
            }
            return updatedData;
        });
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    const handleObjectifChange = (objectif) => {
        const nouveauxObjectifs = objectifsSelectionnes.includes(objectif)
            ? objectifsSelectionnes.filter(obj => obj !== objectif)
            : [...objectifsSelectionnes, objectif];
        setObjectifsSelectionnes(nouveauxObjectifs);
        // Mettre à jour le formData avec la chaîne jointe
        setFormData(prev => ({
            ...prev,
            objectifs: nouveauxObjectifs.join(', ')
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.nomGIE.trim())
            newErrors.nomGIE = 'Le nom du GIE est requis';
        if (!formData.presidenteNom.trim())
            newErrors.presidenteNom = 'Le nom de la présidente est requis';
        if (!formData.presidenteTelephone.trim())
            newErrors.presidenteTelephone = 'Le téléphone est requis';
        if (!formData.adresse.trim())
            newErrors.adresse = 'L\'adresse est requise';
        if (!formData.secteurActivite)
            newErrors.secteurActivite = 'Le secteur d\'activité est requis';
        if (!formData.description.trim())
            newErrors.description = 'La description est requise';
        if (objectifsSelectionnes.length === 0)
            newErrors.objectifs = 'Au moins un objectif doit être sélectionné';
        if (formData.nombreMembres < 1)
            newErrors.nombreMembres = 'Le nombre de membres doit être supérieur à 0';
        if (formData.besoinsFinancement < 0)
            newErrors.besoinsFinancement = 'Les besoins de financement ne peuvent pas être négatifs';
        // Validation du format téléphone
        const phoneRegex = /^\+221[0-9]{9}$/;
        if (formData.presidenteTelephone && !phoneRegex.test(formData.presidenteTelephone)) {
            newErrors.presidenteTelephone = 'Format: +221XXXXXXXXX';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        setLoading(true);
        try {
            // Appel du service d'enregistrement
            const gie = await gieService.enregistrerGIE(formData);
            if (onSuccess) {
                onSuccess(gie);
            }
            // Réinitialiser le formulaire
            setFormData({
                identifiantGIE: '',
                numeroProtocole: '',
                nomGIE: '',
                presidenteNom: '',
                presidentePrenom: '',
                presidenteTelephone: '',
                presidenteCIN: '',
                presidenteEmail: '',
                presidenteAdresse: '',
                region: '',
                departement: '',
                arrondissement: '',
                commune: '',
                // Ajout des codes manquants requis par le type EnregistrementGIEData
                codeRegion: '',
                codeDepartement: '',
                codeArrondissement: '',
                codeCommune: '',
                secteurPrincipal: '',
                objectifs: '',
                activites: [],
                dateConstitution: '',
                nombreMembres: 1,
                membres: [],
                adresse: '',
                secteurActivite: '',
                description: '',
                besoinsFinancement: 0
            });
            setObjectifsSelectionnes([]);
            setErrors({});
        }
        catch (error) {
            const errorMessage = error.message || 'Erreur lors de l\'enregistrement';
            if (onError) {
                onError(errorMessage);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-green-800 mb-6", children: "Enregistrement de votre GIE" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom du GIE *" }), _jsx("input", { type: "text", name: "nomGIE", value: formData.nomGIE, onChange: handleInputChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.nomGIE ? 'border-red-500' : 'border-gray-300'}`, placeholder: "Ex: GIE Femmes Unies" }), errors.nomGIE && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.nomGIE })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom de la Pr\u00E9sidente *" }), _jsx("input", { type: "text", name: "presidenteNom", value: formData.presidenteNom, onChange: handleInputChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.presidenteNom ? 'border-red-500' : 'border-gray-300'}`, placeholder: "Ex: Aminata Diallo" }), errors.presidenteNom && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.presidenteNom })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone *" }), _jsx("input", { type: "tel", name: "presidenteTelephone", value: formData.presidenteTelephone, onChange: handleInputChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.presidenteTelephone ? 'border-red-500' : 'border-gray-300'}`, placeholder: "+221781234567" }), errors.presidenteTelephone && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.presidenteTelephone })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre de membres *" }), _jsx("input", { type: "number", name: "nombreMembres", value: formData.nombreMembres, onChange: handleInputChange, min: "1", className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.nombreMembres ? 'border-red-500' : 'border-gray-300'}` }), errors.nombreMembres && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.nombreMembres })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Adresse compl\u00E8te *" }), _jsx("input", { type: "text", name: "adresse", value: formData.adresse, onChange: handleInputChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`, placeholder: "Ex: Quartier Medina, Dakar, S\u00E9n\u00E9gal" }), errors.adresse && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.adresse })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Secteur d'activit\u00E9 *" }), _jsxs("select", { name: "secteurActivite", value: formData.secteurActivite, onChange: handleInputChange, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.secteurActivite ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un secteur" }), secteursActivite.map(secteur => (_jsx("option", { value: secteur, children: secteur.charAt(0).toUpperCase() + secteur.slice(1) }, secteur)))] }), errors.secteurActivite && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.secteurActivite })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description des activit\u00E9s *" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, rows: 4, className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`, placeholder: "D\u00E9crivez les activit\u00E9s principales de votre GIE..." }), errors.description && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.description })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objectifs du GIE *" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: objectifsPossibles.map(objectif => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", checked: objectifsSelectionnes.includes(objectif), onChange: () => handleObjectifChange(objectif), className: "text-green-600 focus:ring-green-500" }), _jsx("span", { className: "text-sm", children: objectif })] }, objectif))) }), errors.objectifs && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.objectifs })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Besoins de financement (FCFA)" }), _jsx("input", { type: "number", name: "besoinsFinancement", value: formData.besoinsFinancement, onChange: handleInputChange, min: "0", className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.besoinsFinancement ? 'border-red-500' : 'border-gray-300'}`, placeholder: "Ex: 500000" }), errors.besoinsFinancement && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.besoinsFinancement })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: `px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`, children: loading ? 'Enregistrement...' : 'Enregistrer le GIE' }) })] }), _jsx("div", { className: "mt-6 p-4 bg-blue-50 rounded-md", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Information :" }), " Apr\u00E8s l'enregistrement, votre GIE sera en attente de validation de paiement. Vous recevrez un SMS avec les instructions pour finaliser votre adh\u00E9sion."] }) })] }));
};
export default EnregistrementGIE;
//# sourceMappingURL=EnregistrementGIE.js.map