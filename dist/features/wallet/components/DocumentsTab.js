import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FileText, Shield, UserPlus } from 'lucide-react';
const DocumentsTab = ({ documents, documentsLoading, onDownloadDocument }) => {
    const documentCards = [
        {
            id: 'statuts',
            title: 'Statuts du GIE',
            description: "Document officiel définissant la structure, l'organisation et le fonctionnement du GIE.",
            icon: _jsx(FileText, { className: "w-5 h-5 text-indigo-600" }),
            badgeClass: 'bg-indigo-100',
            buttonClass: 'bg-indigo-600 text-white',
            buttonHoverClass: 'hover:bg-indigo-700'
        },
        {
            id: 'reglementInterieur',
            title: 'Règlement Intérieur',
            description: 'Règles internes, droits et obligations des membres du GIE.',
            icon: _jsx(Shield, { className: "w-5 h-5 text-blue-600" }),
            badgeClass: 'bg-blue-100',
            buttonClass: 'bg-blue-600 text-white',
            buttonHoverClass: 'hover:bg-blue-700'
        },
        {
            id: 'procesVerbal',
            title: 'Procès Verbal',
            description: "Document attestant des décisions prises lors de l'assemblée constitutive.",
            icon: _jsx(FileText, { className: "w-5 h-5 text-green-600" }),
            badgeClass: 'bg-green-100',
            buttonClass: 'bg-green-600 text-white',
            buttonHoverClass: 'hover:bg-green-700'
        },
        {
            id: 'demandeAdhesion',
            title: "Demande d'Adhésion",
            description: "Formulaire officiel pour l'adhésion au programme FEVEO 2050.",
            icon: _jsx(UserPlus, { className: "w-5 h-5 text-orange-600" }),
            badgeClass: 'bg-orange-100',
            buttonClass: 'bg-orange-600 text-white',
            buttonHoverClass: 'hover:bg-orange-700'
        }
    ];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "Documents Officiels du GIE" }), _jsx("p", { className: "text-purple-100", children: "Consultez et t\u00E9l\u00E9chargez les documents importants de votre GIE" })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: documentCards.map((doc) => {
                    const isAvailable = documents[doc.id];
                    return (_jsxs("div", { className: "bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: `w-10 h-10 rounded-full ${doc.badgeClass} flex items-center justify-center mr-3`, children: doc.icon }), _jsx("h4", { className: "text-lg font-bold text-gray-900", children: doc.title })] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: doc.description }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`, children: isAvailable ? 'Disponible' : 'En attente' }), _jsx("button", { onClick: () => onDownloadDocument(doc.id), disabled: documentsLoading || !isAvailable, className: `px-3 py-2 rounded-lg text-sm font-medium ${documentsLoading || !isAvailable
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : `${doc.buttonClass} ${doc.buttonHoverClass}`}`, children: "T\u00E9l\u00E9charger" })] })] }, doc.id));
                }) })] }));
};
export default DocumentsTab;
//# sourceMappingURL=DocumentsTab.js.map