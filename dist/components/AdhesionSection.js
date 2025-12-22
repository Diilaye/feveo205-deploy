import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Users, FileText, CreditCard, Check, ArrowRight } from 'lucide-react';
import AdhesionForm from './AdhesionForm';
const AdhesionSection = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        region: '',
        secteur: ''
    });
    const [errors, setErrors] = useState({});
    if (showForm) {
        return _jsx(AdhesionForm, { onBack: () => setShowForm(false) });
    }
    const steps = [
        {
            icon: Users,
            title: 'Constitution GIE',
            description: 'Formez votre Groupement d\'Intérêt Économique avec au minimum 5 membres',
            color: 'bg-primary-500'
        },
        {
            icon: FileText,
            title: 'Fiche d\'adhésion',
            description: 'Complétez votre dossier d\'adhésion avec les documents requis',
            color: 'bg-accent-500'
        },
        {
            icon: CreditCard,
            title: 'Paiement 20 000 FCFA',
            description: 'Réglez les frais d\'adhésion pour finaliser votre inscription',
            color: 'bg-success-500'
        }
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
    const validateForm = () => {
        const newErrors = {};
        if (!formData.nom.trim())
            newErrors.nom = 'Le nom est requis';
        if (!formData.email.trim())
            newErrors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Email invalide';
        if (!formData.telephone.trim())
            newErrors.telephone = 'Le téléphone est requis';
        if (!formData.region)
            newErrors.region = 'La région est requise';
        if (!formData.secteur)
            newErrors.secteur = 'Le secteur est requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Formulaire soumis:', formData);
            // Ici, vous ajouteriez la logique de soumission
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    return (_jsx("section", { id: "adherer", className: "py-20 bg-neutral-50", children: _jsxs("div", { className: "container-max section-padding", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-neutral-900 mb-6", children: ["Rejoignez-nous en", _jsx("span", { className: "block text-accent-500", children: "3 \u00E9tapes simples" })] }), _jsx("p", { className: "text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed", children: "Un processus d'adh\u00E9sion simplifi\u00E9 pour vous accompagner dans votre parcours entrepreneurial" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-16", children: steps.map((step, index) => (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "card text-center hover:scale-105 transition-all duration-300", children: [_jsx("div", { className: `w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6`, children: _jsx(step.icon, { className: "w-8 h-8 text-neutral-50" }) }), _jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-neutral-50 rounded-full flex items-center justify-center text-sm font-bold", children: index + 1 }), _jsx("h3", { className: "text-xl font-bold text-neutral-900 mb-4", children: step.title }), _jsx("p", { className: "text-neutral-600 leading-relaxed", children: step.description })] }), index < steps.length - 1 && (_jsx("div", { className: "hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2", children: _jsx(ArrowRight, { className: "w-6 h-6 text-neutral-300" }) }))] }, index))) }), _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "card", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold text-neutral-900 mb-2", children: "Commencez votre adh\u00E9sion" }), _jsx("p", { className: "text-neutral-600", children: "Remplissez ce formulaire pour d\u00E9marrer le processus" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Nom du GIE *" }), _jsx("input", { type: "text", value: formData.nom, onChange: (e) => handleInputChange('nom', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.nom ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "Nom de votre GIE" }), errors.nom && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nom })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Email *" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => handleInputChange('email', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.email ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "votre@email.com" }), errors.email && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "T\u00E9l\u00E9phone *" }), _jsx("input", { type: "tel", value: formData.telephone, onChange: (e) => handleInputChange('telephone', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.telephone ? 'border-red-300' : 'border-neutral-300'}`, placeholder: "+221 XX XXX XX XX" }), errors.telephone && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.telephone })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "R\u00E9gion *" }), _jsxs("select", { value: formData.region, onChange: (e) => handleInputChange('region', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.region ? 'border-red-300' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez votre r\u00E9gion" }), regions.map((region) => (_jsx("option", { value: region, children: region }, region)))] }), errors.region && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.region })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Secteur d'activit\u00E9 *" }), _jsxs("select", { value: formData.secteur, onChange: (e) => handleInputChange('secteur', e.target.value), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 ${errors.secteur ? 'border-red-300' : 'border-neutral-300'}`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez votre secteur" }), secteurs.map((secteur) => (_jsx("option", { value: secteur, children: secteur }, secteur)))] }), errors.secteur && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.secteur })] }), _jsxs("div", { className: "flex items-center space-x-3 p-4 bg-success-50 rounded-lg", children: [_jsx(Check, { className: "w-5 h-5 text-success-500 flex-shrink-0" }), _jsx("p", { className: "text-sm text-success-700", children: "En soumettant ce formulaire, vous acceptez nos conditions d'utilisation et notre politique de confidentialit\u00E9." })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { type: "submit", className: "flex-1 btn-secondary text-lg py-4 hover:scale-105 transform transition-all duration-200", children: "Pr\u00E9-inscription rapide" }), _jsx("button", { type: "button", onClick: () => setShowForm(true), className: "flex-1 btn-accent text-lg py-4 hover:scale-105 transform transition-all duration-200", children: "Formulaire complet d'adh\u00E9sion" })] })] })] }) })] }) }));
};
export default AdhesionSection;
//# sourceMappingURL=AdhesionSection.js.map