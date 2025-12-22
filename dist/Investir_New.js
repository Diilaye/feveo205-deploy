import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './components/Header';
import Footer from './components/Footer';
import InvestmentSection from './components/InvestmentSection';
import { TrendingUp, Shield, Target, Award, ArrowRight } from 'lucide-react';
const Investir = () => {
    const advantages = [
        {
            icon: TrendingUp,
            title: 'Rendement Attractif',
            description: 'Des retours sur investissement compétitifs avec une croissance soutenue',
            color: 'text-accent-500'
        },
        {
            icon: Shield,
            title: 'Investissement Sécurisé',
            description: 'Plateforme régulée avec garanties et transparence totale',
            color: 'text-primary-500'
        },
        {
            icon: Target,
            title: 'Impact Social',
            description: 'Contribuez directement à l\'autonomisation des femmes entrepreneures',
            color: 'text-success-500'
        },
        {
            icon: Award,
            title: 'Excellence Reconnue',
            description: 'Plateforme primée par les institutions financières africaines',
            color: 'text-accent-500'
        }
    ];
    const steps = [
        {
            number: '01',
            title: 'Inscription',
            description: 'Créez votre compte investisseur en quelques minutes'
        },
        {
            number: '02',
            title: 'Vérification',
            description: 'Validation de votre profil et de vos documents'
        },
        {
            number: '03',
            title: 'Investissement',
            description: 'Choisissez vos parts et effectuez votre premier investissement'
        },
        {
            number: '04',
            title: 'Suivi',
            description: 'Suivez vos investissements via votre tableau de bord'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx(Header, {}), _jsxs("section", { className: "relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("div", { className: "w-full h-full bg-repeat", style: { backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" } }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" }), _jsx("div", { className: "relative z-10 container-max mx-auto px-6 py-20 flex items-center min-h-screen", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full", children: [_jsxs("div", { className: "text-center lg:text-left", children: [_jsxs("div", { className: "inline-flex items-center bg-accent-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-accent-400 mr-2" }), _jsx("span", { className: "text-accent-400 text-sm font-medium", children: "Investissement Premium" })] }), _jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-50 leading-tight mb-6", children: ["Investir pour", _jsx("span", { className: "block text-accent-400", children: "l'avenir de l'Afrique" })] }), _jsx("p", { className: "text-xl text-neutral-200 mb-8 max-w-2xl", children: "Rejoignez la r\u00E9volution \u00E9conomique ! Investissez dans FEVEO 2050 et participez \u00E0 l'autonomisation de 365 000 femmes entrepreneures africaines." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-12", children: [_jsxs("button", { className: "btn-accent text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200 group", children: ["Commencer \u00E0 investir", _jsx(ArrowRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })] }), _jsx("button", { className: "btn-secondary bg-neutral-50/10 border-neutral-50/20 text-neutral-50 hover:bg-neutral-50/20 text-lg px-8 py-4", children: "D\u00E9couvrir les projets" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6 max-w-md", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-accent-400", children: "12%" }), _jsx("div", { className: "text-sm text-neutral-300", children: "Rendement annuel" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-success-400", children: "2.5M\u20AC" }), _jsx("div", { className: "text-sm text-neutral-300", children: "D\u00E9j\u00E0 investis" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-primary-400", children: "500+" }), _jsx("div", { className: "text-sm text-neutral-300", children: "Investisseurs" })] })] })] }), _jsx("div", { className: "relative", children: _jsxs("div", { className: "relative bg-gradient-to-br from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent rounded-2xl" }), _jsxs("div", { className: "relative z-10", children: [_jsx("h3", { className: "text-2xl font-bold text-neutral-50 mb-6", children: "Pourquoi investir avec nous ?" }), _jsx("div", { className: "space-y-4", children: advantages.map((advantage, index) => (_jsxs("div", { className: "flex items-start gap-3 group", children: [_jsx("div", { className: `w-10 h-10 rounded-lg bg-neutral-50/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`, children: _jsx(advantage.icon, { className: `w-5 h-5 ${advantage.color}` }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-50 mb-1", children: advantage.title }), _jsx("p", { className: "text-sm text-neutral-300", children: advantage.description })] })] }, index))) })] })] }) })] }) })] }), _jsx("section", { className: "py-20 bg-neutral-50", children: _jsxs("div", { className: "container-max mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-neutral-900 mb-4", children: "Comment \u00E7a marche ?" }), _jsx("p", { className: "text-xl text-neutral-600 max-w-2xl mx-auto", children: "Un processus simple et s\u00E9curis\u00E9 pour commencer votre parcours d'investissement" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: steps.map((step, index) => (_jsxs("div", { className: "relative group", children: [_jsxs("div", { className: "bg-white rounded-xl p-6 border border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all duration-300 h-full", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 bg-accent-500 text-neutral-50 rounded-full font-bold text-lg mb-4 group-hover:scale-110 transition-transform", children: step.number }), _jsx("h3", { className: "text-xl font-bold text-neutral-900 mb-3", children: step.title }), _jsx("p", { className: "text-neutral-600", children: step.description })] }), index < steps.length - 1 && (_jsx("div", { className: "hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2", children: _jsx(ArrowRight, { className: "w-6 h-6 text-neutral-300" }) }))] }, index))) })] }) }), _jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "container-max mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-neutral-900 mb-4", children: "Commencez votre investissement" }), _jsx("p", { className: "text-xl text-neutral-600 max-w-2xl mx-auto", children: "Remplissez le formulaire ci-dessous pour d\u00E9marrer votre parcours d'investissement" })] }), _jsx(InvestmentSection, {})] }) }), _jsx("section", { className: "py-16 bg-neutral-900", children: _jsxs("div", { className: "container-max mx-auto px-6", children: [_jsx("div", { className: "text-center mb-12", children: _jsx("h3", { className: "text-2xl font-bold text-neutral-50 mb-4", children: "Ils nous font confiance" }) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 items-center", children: [1, 2, 3, 4].map((item) => (_jsx("div", { className: "flex items-center justify-center p-6 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors", children: _jsx("div", { className: "w-24 h-12 bg-neutral-700 rounded flex items-center justify-center", children: _jsxs("span", { className: "text-neutral-400 text-sm", children: ["Logo ", item] }) }) }, item))) })] }) }), _jsx(Footer, {})] }));
};
export default Investir;
//# sourceMappingURL=Investir_New.js.map