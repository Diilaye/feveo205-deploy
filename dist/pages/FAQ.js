import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, ArrowLeft, HelpCircle, Users, Wallet, Shield, Phone, Mail } from 'lucide-react';
const faqData = [
    // Questions Générales
    {
        id: 'gen1',
        question: "Qu'est-ce que FEVEO 2050 ?",
        answer: "FEVEO 2050 est une plateforme digitale de gestion des Groupements d'Intérêt Économique (GIE) au Sénégal. Elle permet aux GIE de gérer leurs investissements quotidiens, leurs membres, et leurs finances de manière transparente et sécurisée. Notre mission est de faciliter l'épargne collective et l'autonomisation économique des communautés.",
        category: 'general'
    },
    {
        id: 'gen2',
        question: "Comment fonctionne le système d'épargne collective ?",
        answer: "Chaque GIE effectue un investissement quotidien de 6 060 FCFA pendant 60 jours. L'argent collecté est géré de manière transparente via la plateforme. À la fin du cycle, les membres reçoivent leurs retours sur investissement selon les règles établies par le GIE.",
        category: 'general'
    },
    {
        id: 'gen3',
        question: "Quels sont les avantages de rejoindre FEVEO 2050 ?",
        answer: "Les avantages incluent : gestion digitale simplifiée, traçabilité complète des transactions, sécurité des fonds, notifications automatiques, documents officiels générés automatiquement, tableau de bord en temps réel, et support technique dédié.",
        category: 'general'
    },
    // Questions GIE
    {
        id: 'gie1',
        question: "Comment créer un GIE sur la plateforme ?",
        answer: "Pour créer un GIE, connectez-vous en tant que coordinateur, accédez à la section 'Gestion GIE', cliquez sur 'Créer un GIE', puis remplissez les informations requises : nom du GIE, région, département, commune, informations de la présidente, et la composition des membres (minimum 8 membres).",
        category: 'gie'
    },
    {
        id: 'gie2',
        question: "Combien de membres doit avoir un GIE ?",
        answer: "Un GIE doit avoir au minimum 8 membres pour être considéré comme actif. La composition typique inclut : 1 Présidente, 1 Secrétaire, 1 Trésorière, et au minimum 5 autres membres. Vous pouvez ajouter des membres progressivement jusqu'à atteindre ce quota.",
        category: 'gie'
    },
    {
        id: 'gie3',
        question: "Comment obtenir le code GIE ?",
        answer: "Le code GIE est généré automatiquement lors de la création du GIE par le coordinateur. Il suit le format FEVEO-RR-DD-CC-AA-XXX où RR=Région, DD=Département, CC=Commune, AA=Arrondissement, XXX=Numéro séquentiel. Ce code unique sert à identifier et accéder au wallet du GIE.",
        category: 'gie'
    },
    {
        id: 'gie4',
        question: "Quels documents officiels sont générés ?",
        answer: "La plateforme génère automatiquement 4 types de documents officiels au format PDF : les Statuts du GIE, le Règlement Intérieur, le Procès-Verbal de constitution, et la Demande d'adhésion. Ces documents sont pré-remplis avec les informations du GIE et téléchargeables depuis l'onglet 'Documents Officiels'.",
        category: 'gie'
    },
    // Questions Wallet
    {
        id: 'wallet1',
        question: "Comment accéder au wallet de mon GIE ?",
        answer: "Pour accéder au wallet, cliquez sur 'Connexion Wallet' sur la page d'accueil, entrez votre code GIE, puis validez le code de vérification à 6 chiffres envoyé par WhatsApp au numéro de la présidente. Une fois connecté, vous accédez au tableau de bord complet du GIE.",
        category: 'wallet'
    },
    {
        id: 'wallet2',
        question: "Comment effectuer un investissement quotidien ?",
        answer: "Dans l'onglet 'Épargne GIE' de votre wallet, cliquez sur 'Investir Aujourd'hui'. Choisissez votre méthode de paiement (Wave ou Orange Money), entrez le montant de 6 060 FCFA, puis suivez les instructions pour finaliser le paiement. La transaction sera enregistrée automatiquement.",
        category: 'wallet'
    },
    {
        id: 'wallet3',
        question: "Comment suivre l'historique des transactions ?",
        answer: "L'historique complet des transactions est disponible dans l'onglet 'Épargne GIE'. Vous y verrez toutes les transactions avec leur date, montant, méthode de paiement, et statut (SUCCESS, PENDING, FAILED). Vous pouvez également filtrer par type de transaction et période.",
        category: 'wallet'
    },
    {
        id: 'wallet4',
        question: "Que signifient les différents statuts de transaction ?",
        answer: "SUCCESS : Transaction complétée avec succès. PENDING : Transaction en cours de traitement. FAILED : Transaction échouée, le paiement n'a pas été validé. Seules les transactions SUCCESS sont comptabilisées dans le solde du GIE.",
        category: 'wallet'
    },
    // Questions Investissement
    {
        id: 'inv1',
        question: "Quel est le montant de l'investissement quotidien ?",
        answer: "Le montant de l'investissement quotidien est de 6 060 FCFA. Ce montant doit être versé chaque jour pendant 60 jours consécutifs. Il est important de respecter ce calendrier pour maximiser les retours sur investissement du GIE.",
        category: 'investissement'
    },
    {
        id: 'inv2',
        question: "Que se passe-t-il si on manque un jour d'investissement ?",
        answer: "Si un jour d'investissement est manqué, le GIE peut rattraper le paiement les jours suivants. Cependant, il est fortement recommandé de maintenir la régularité des investissements pour assurer la stabilité financière du GIE. Le tableau de bord affiche clairement les jours investis avec succès.",
        category: 'investissement'
    },
    {
        id: 'inv3',
        question: "Comment sont calculés les retours sur investissement ?",
        answer: "Les retours sur investissement sont calculés automatiquement en fonction du montant total investi, de la durée du cycle (60 jours), et des règles définies par le GIE. Le système suit les transactions de type 'investment' avec statut SUCCESS et calcule les retours en conséquence.",
        category: 'investissement'
    },
    {
        id: 'inv4',
        question: "Quand peut-on retirer l'argent du wallet ?",
        answer: "Les retraits sont généralement possibles à la fin du cycle d'investissement de 60 jours, selon les règles établies par le GIE. La présidente ou la trésorière peuvent initier une demande de retrait via l'interface wallet. Le montant disponible est affiché dans le tableau de bord.",
        category: 'investissement'
    },
    // Questions Sécurité
    {
        id: 'sec1',
        question: "Comment sont sécurisées mes données ?",
        answer: "Vos données sont protégées par un chiffrement de bout en bout. Nous utilisons des protocoles de sécurité standard (HTTPS, JWT tokens). Les mots de passe sont hashés avec bcrypt. Chaque session est unique et expire automatiquement. Nous ne partageons jamais vos données avec des tiers.",
        category: 'securite'
    },
    {
        id: 'sec2',
        question: "Pourquoi dois-je vérifier mon numéro WhatsApp ?",
        answer: "La vérification WhatsApp ajoute une couche de sécurité supplémentaire. Elle confirme que c'est bien vous qui accédez au wallet et empêche les accès non autorisés. Le code à 6 chiffres est valable 5 minutes et est unique à chaque connexion.",
        category: 'securite'
    },
    {
        id: 'sec3',
        question: "Comment gérer les sessions actives ?",
        answer: "Dans les Paramètres > Sécurité de votre wallet, vous pouvez voir toutes vos sessions actives (appareil, navigateur, localisation, IP). Vous avez la possibilité de déconnecter des sessions individuelles ou toutes les sessions sauf celle en cours. Cela vous permet de contrôler l'accès à votre compte.",
        category: 'securite'
    },
    {
        id: 'sec4',
        question: "Que faire si j'oublie mon code GIE ?",
        answer: "Si vous oubliez votre code GIE, contactez votre coordinateur régional qui pourra vous le communiquer. Le code GIE est également disponible dans les documents officiels du GIE et dans les communications initiales lors de la création du GIE.",
        category: 'securite'
    },
    // Questions Techniques
    {
        id: 'tech1',
        question: "Quels navigateurs sont supportés ?",
        answer: "FEVEO 2050 fonctionne sur tous les navigateurs modernes : Google Chrome (recommandé), Firefox, Safari, Microsoft Edge, et Opera. Assurez-vous d'utiliser la dernière version de votre navigateur pour une expérience optimale.",
        category: 'technique'
    },
    {
        id: 'tech2',
        question: "L'application est-elle disponible sur mobile ?",
        answer: "Oui, notre interface est entièrement responsive et s'adapte à tous les écrans (smartphones, tablettes, ordinateurs). Vous pouvez accéder à votre wallet depuis n'importe quel appareil connecté à Internet. Une application mobile native est également en développement.",
        category: 'technique'
    },
    {
        id: 'tech3',
        question: "Que faire si le code WhatsApp n'arrive pas ?",
        answer: "Si le code WhatsApp n'arrive pas dans les 2 minutes : 1) Vérifiez que le numéro WhatsApp de la présidente est correct, 2) Vérifiez votre connexion Internet, 3) Cliquez sur 'Renvoyer le code', 4) Si le problème persiste, un code de secours s'affichera automatiquement.",
        category: 'technique'
    },
    {
        id: 'tech4',
        question: "Comment contacter le support technique ?",
        answer: "Pour toute assistance technique, vous pouvez : 1) Envoyer un email à contact@feveo2050.sn, 2) Appeler le 76 662 01 22 ou le 76 622 00 87 (du lundi au vendredi, 9h-18h), 3) Contacter votre coordinateur régional qui pourra remonter le problème à notre équipe technique.",
        category: 'technique'
    }
];
const categories = [
    { id: 'all', label: 'Toutes', icon: HelpCircle },
    { id: 'general', label: 'Général', icon: HelpCircle },
    { id: 'gie', label: 'GIE', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'investissement', label: 'Investissement', icon: Wallet },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'technique', label: 'Technique', icon: Phone }
];
const FAQ = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState(new Set());
    const toggleItem = (id) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            }
            else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const filteredFAQ = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-neutral-200", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 hover:bg-neutral-100 rounded-lg transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5 text-neutral-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-primary-600", children: "Questions Fr\u00E9quentes" }), _jsx("p", { className: "text-neutral-600 mt-1", children: "Trouvez rapidement des r\u00E9ponses \u00E0 vos questions" })] })] }) }), _jsxs("div", { className: "mt-6 relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" }), _jsx("input", { type: "text", placeholder: "Rechercher une question...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 sticky top-8", children: [_jsx("h3", { className: "font-semibold text-neutral-900 mb-4", children: "Cat\u00E9gories" }), _jsx("div", { className: "space-y-1", children: categories.map(category => {
                                            const Icon = category.icon;
                                            const isActive = activeCategory === category.id;
                                            const count = category.id === 'all'
                                                ? faqData.length
                                                : faqData.filter(item => item.category === category.id).length;
                                            return (_jsxs("button", { onClick: () => setActiveCategory(category.id), className: `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                                    ? 'bg-primary-50 text-primary-600 font-medium'
                                                    : 'text-neutral-700 hover:bg-neutral-50'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { children: category.label })] }), _jsx("span", { className: `text-sm px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-100' : 'bg-neutral-100'}`, children: count })] }, category.id));
                                        }) })] }) }), _jsxs("div", { className: "lg:col-span-3", children: [filteredFAQ.length === 0 ? (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center", children: [_jsx(HelpCircle, { className: "w-16 h-16 text-neutral-300 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-neutral-900 mb-2", children: "Aucun r\u00E9sultat trouv\u00E9" }), _jsx("p", { className: "text-neutral-600", children: "Essayez de modifier votre recherche ou de changer de cat\u00E9gorie" })] })) : (_jsx("div", { className: "space-y-4", children: filteredFAQ.map(item => {
                                        const isOpen = openItems.has(item.id);
                                        return (_jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden transition-all hover:shadow-md", children: [_jsxs("button", { onClick: () => toggleItem(item.id), className: "w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors", children: [_jsx("span", { className: "font-medium text-neutral-900 pr-4", children: item.question }), isOpen ? (_jsx(ChevronUp, { className: "w-5 h-5 text-primary-600 flex-shrink-0" })) : (_jsx(ChevronDown, { className: "w-5 h-5 text-neutral-400 flex-shrink-0" }))] }), isOpen && (_jsx("div", { className: "px-6 pb-5 pt-0", children: _jsx("div", { className: "border-t border-neutral-100 pt-4", children: _jsx("p", { className: "text-neutral-600 leading-relaxed", children: item.answer }) }) }))] }, item.id));
                                    }) })), _jsxs("div", { className: "mt-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl shadow-lg p-8 text-white", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Vous ne trouvez pas de r\u00E9ponse ?" }), _jsx("p", { className: "mb-6 text-primary-50", children: "Notre \u00E9quipe de support est l\u00E0 pour vous aider. Contactez-nous par email ou t\u00E9l\u00E9phone." }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("a", { href: "mailto:contact@feveo2050.sn", className: "flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all", children: [_jsx(Mail, { className: "w-5 h-5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-primary-100", children: "Email" }), _jsx("div", { className: "font-semibold", children: "contact@feveo2050.sn" })] })] }), _jsxs("a", { href: "tel:+221766620122", className: "flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all", children: [_jsx(Phone, { className: "w-5 h-5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-primary-100", children: "T\u00E9l\u00E9phone" }), _jsx("div", { className: "font-semibold", children: "76 662 01 22 - 76 622 00 87" })] })] })] })] })] })] }) })] }));
};
export default FAQ;
//# sourceMappingURL=FAQ.js.map