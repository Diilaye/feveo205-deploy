import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Wallet, Store, Leaf, Settings, Play, Volume2, ChevronRight, Target, Users, TrendingUp, Award, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ProgramSection = () => {
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState('fr');
    const [playingAudio, setPlayingAudio] = useState(null);
    const [showVideoF, setShowVideoF] = useState(false);
    const [showVideoW, setShowVideoW] = useState(false);
    const pillars = [
        {
            icon: Wallet,
            title: 'FEVEO CASH',
            description: 'Solution d’investissements Innovants pour les GIEs de femmes en vue d’une exploitation de chaines de valeurs, grâce à :',
            color: 'bg-primary-500',
            features: ['Un fonds d’investissement International', 'Garantie internationale du fonds', 'Accompagnement des GIEs']
        },
        {
            icon: Store,
            title: 'Grande Distribution',
            description: 'Un réseau de distribution étendu pour la commercialiser des produits importés et locaux de la plateforme «FEVEO 2050»',
            color: 'bg-success-500',
            features: ['Réseau étendu', 'Marchés locaux', 'MarchéS international']
        },
        {
            icon: Leaf,
            title: 'Plans vastes de zones',
            description: 'Agriculture économique organique de précision, utilisant la nature comme partenaire',
            color: 'bg-accent-500',
            features: ['Agriculture durable', 'Dans une économie organique', 'Avec la nature, notre partenaire']
        },
        {
            icon: Settings,
            title: 'Transformation',
            description: 'Centre communaux de transformations des du secteur primaire pour une création de grandes Valeurs ajoutées',
            color: 'bg-primary-500',
            features: ['Valeur ajoutée', 'Transformation locale', 'Innovation technologique']
        }
    ];
    const platformFeatures = [
        {
            icon: Target,
            title: 'Investissement Organique',
            description: 'Une approche d\'investissement naturelle et durable qui respecte les cycles économiques locaux et favorise la croissance endogène.',
            stats: '85% de rentabilité durable'
        },
        {
            icon: Users,
            title: 'Écosystème Collaboratif',
            description: 'Plateforme qui connecte investisseurs, entrepreneures et partenaires dans un réseau d\'entraide et de développement mutuel.',
            stats: '9 125 GIE connectés'
        },
        {
            icon: TrendingUp,
            title: 'Croissance Inclusive',
            description: 'Modèle économique qui garantit une redistribution équitable des bénéfices et une croissance partagée pour toutes les participantes.',
            stats: '6B FCFA redistribués'
        },
        {
            icon: Award,
            title: 'Impact Social',
            description: 'Mesure et maximise l\'impact social positif de chaque investissement sur les communautés locales et l\'autonomisation féminine.',
            stats: '365K femmes impactées'
        }
    ];
    const content = {
        fr: {
            platformTitle: "Plateforme d'Investissement Économie Organique",
            platformSubtitle: "Une révolution dans l'approche de l'investissement",
            platformDescription: "Un modèle alternatif de développement par la valorisation des ressources humaines féminines au sein des terroirs. Ce modèle associe les femmes des groupements féminins à des investisseurs et partenaires internationaux qui partagent ensemble la vision « Femmes Economie Organique 2050 » consistant en une affirmation du leadership féminin dans une exploitation aboutie de chaines de valeurs économiques pour une souveraineté alimentaire.",
            programTitle: "Programme Projets FEVEO 2050",
            programSubtitle: "Quatre piliers stratégiques pour transformer l'économie africaine",
            programDescription: "Notre programme intégré combine financement, distribution, production et transformation pour créer un écosystème complet d'autonomisation économique. Chaque pilier est conçu pour renforcer les autres et maximiser l'impact collectif.",
            listenAudio: "Vidéo en français",
            stopAudio: "Arrêter l'audio"
        },
        wo: {
            platformTitle: "Plateforme bu Investissement Économie Organique",
            platformSubtitle: "Benn révolution ci approche bi investissement ci Afrique",
            platformDescription: "Benn model bu wuuteel ci wàllu développement mooy jëfandikoo ay jigéen ci xeeti terroir yi, ba noppi jox ay doole ci wàllu jàmm ak yéene. Ci model bii, ñu boole jigéeni wàllu groupement ak ay jëfandikukat ak ñaari mbéy yi (investisseurs) ak ay partenaire yu dëkk yu biti, ñuy bokk ci seen gis-gis bu mujj « Jigéen yi ci Ekonomi Organique 2050 ». Gis-gis bii dafay taxawu ci dooleel jigéen yi, ba ñuy doxal ay chaîne de valeur bu ekonomique ngir jot ci ay njariñu mujj te wër ndoxal ci wàllu suverénité alimentaire",
            programTitle: "Programme Projets FEVEO 2050",
            programSubtitle: "Ñeent piliers stratégiques ngir transformer économie bu Afrique",
            programDescription: "Sunuy programme bu intégré dafa combine financement, distribution, production ak transformation ngir sos benn écosystème bu complet bu autonomisation économique.",
            listenAudio: "Dégg ci wolof",
            stopAudio: "Taxawal audio bi"
        }
    };
    const handleAudioPlay = (audioId) => {
        if (playingAudio === audioId) {
            setPlayingAudio(null);
        }
        else {
            setPlayingAudio(audioId);
            // Ici vous ajouteriez la logique pour jouer l'audio réel
            setTimeout(() => setPlayingAudio(null), 30000); // Simulation de 30 secondes d'audio
        }
    };
    return (_jsxs("section", { id: "programme", className: "py-20 bg-neutral-100", children: [_jsxs("div", { className: "container-max section-padding", children: [_jsx("div", { className: "flex justify-center mb-8", children: _jsxs("div", { className: "bg-neutral-50 rounded-full p-1 shadow-sm border border-neutral-200", children: [_jsx("button", { onClick: () => setCurrentLanguage('fr'), className: `px-6 py-2 rounded-full font-medium transition-all duration-200 ${currentLanguage === 'fr'
                                        ? 'bg-accent-500 text-neutral-50 shadow-sm'
                                        : 'text-neutral-600 hover:text-accent-500'}`, children: "Fran\u00E7ais" }), _jsx("button", { onClick: () => setCurrentLanguage('wo'), className: `px-6 py-2 rounded-full font-medium transition-all duration-200 ${currentLanguage === 'wo'
                                        ? 'bg-accent-500 text-neutral-50 shadow-sm'
                                        : 'text-neutral-600 hover:text-accent-500'}`, children: "Wolof" })] }) }), _jsxs("div", { className: "mb-20", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl md:text-5xl font-bold text-neutral-900 mb-6", children: content[currentLanguage].platformTitle }), _jsx("p", { className: "text-xl text-accent-600 font-medium mb-4", children: content[currentLanguage].platformSubtitle }), _jsx("div", { className: "flex items-center justify-center gap-4 mb-6", children: _jsx("button", { onClick: () => currentLanguage === 'fr' ? setShowVideoF(true) : setShowVideoW(true), className: `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${playingAudio === 'platform'
                                                ? 'bg-success-500 text-neutral-50 border-success-500'
                                                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-accent-300'}`, children: playingAudio === 'platform' ? (_jsxs(_Fragment, { children: [_jsx(Volume2, { className: "w-4 h-4 animate-pulse" }), content[currentLanguage].stopAudio] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "w-4 h-4" }), content[currentLanguage].listenAudio] })) }) }), _jsx("p", { className: "text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed", children: content[currentLanguage].platformDescription })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" })] }), _jsx("div", { className: "mb-16", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: pillars.map((pillar, index) => (_jsx("div", { className: "group hover:scale-105 transition-all duration-300", children: _jsxs("div", { className: "card h-full relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-20 h-20 bg-accent-100 rounded-full -translate-y-10 translate-x-10 opacity-50" }), _jsx("div", { className: `w-16 h-16 ${pillar.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`, children: _jsx(pillar.icon, { className: "w-8 h-8 text-neutral-50" }) }), _jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-neutral-50 rounded-full flex items-center justify-center text-sm font-bold", children: index + 1 }), _jsx("h3", { className: "text-xl font-bold text-neutral-900 mb-4", children: pillar.title }), _jsx("p", { className: "text-neutral-600 mb-6 text-wrap", children: pillar.description }), _jsx("ul", { className: "space-y-2", children: pillar.features.map((feature, featureIndex) => (_jsxs("li", { className: "flex items-center text-sm text-neutral-500", children: [_jsx(ChevronRight, { className: "w-4 h-4 text-accent-500 mr-2 flex-shrink-0" }), feature] }, featureIndex))) })] }) }, index))) }) }), _jsxs("div", { className: "text-center bg-primary-500 rounded-2xl p-8 text-neutral-50", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "Pr\u00EAt \u00E0 rejoindre la r\u00E9volution f\u00E9minine ?" }), _jsx("p", { className: "text-lg mb-6 opacity-90" }), _jsx("button", { onClick: () => navigate('/adhesion'), className: "bg-accent-500 hover:bg-accent-600 text-neutral-50 font-semibold px-8 py-4 rounded-lg hover:scale-105 transform transition-all duration-200 shadow-lg", children: "Adh\u00E9rer \u00E0 la plateforme" })] })] }), showVideoF && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-4xl mx-4", children: [_jsx("button", { onClick: () => setShowVideoF(false), className: "absolute -top-12 right-0 text-neutral-50 hover:text-neutral-300 transition-colors duration-200", children: _jsx(X, { className: "w-8 h-8" }) }), _jsxs("div", { className: "bg-neutral-50 rounded-xl overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "aspect-video bg-neutral-900 flex items-center justify-center relative", children: [_jsxs("video", { autoPlay: true, loop: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover", children: [_jsx("source", { src: "/videos/feveo2050.mp4", type: "video/mp4" }), _jsx("source", { src: "/videos/feveo2050.mov", type: "video/quicktime" }), "Votre navigateur ne prend pas en charge la lecture vid\u00E9o."] }), "                ", _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none", children: _jsxs("div", { className: "absolute bottom-4 left-4 text-neutral-50", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Vid\u00E9o Tutoriel FEVEO 2050" }), _jsx("p", { className: "text-sm text-neutral-300", children: "D\u00E9couvrez notre plateforme d'investissement en \u00E9conomie organique" })] }) })] }), _jsx("div", { className: "p-4 bg-neutral-50 text-center", children: _jsx("button", { onClick: () => setShowVideoF(false), className: "btn-accent px-6 py-2", children: "Fermer la vid\u00E9o" }) })] })] }) })), showVideoW && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-4xl mx-4", children: [_jsx("button", { onClick: () => setShowVideoW(false), className: "absolute -top-12 right-0 text-neutral-50 hover:text-neutral-300 transition-colors duration-200", children: _jsx(X, { className: "w-8 h-8" }) }), _jsxs("div", { className: "bg-neutral-50 rounded-xl overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "aspect-video bg-neutral-900 flex items-center justify-center relative", children: [_jsxs("video", { autoPlay: true, loop: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover", children: [_jsx("source", { src: "/videos/feveo2050W.mp4", type: "video/mp4" }), "Votre navigateur ne prend pas en charge la lecture vid\u00E9o."] }), "                ", _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none", children: _jsxs("div", { className: "absolute bottom-4 left-4 text-neutral-50", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Vid\u00E9o Tutoriel FEVEO 2050" }), _jsx("p", { className: "text-sm text-neutral-300", children: "D\u00E9couvrez notre plateforme d'investissement en \u00E9conomie organique" })] }) })] }), _jsx("div", { className: "p-4 bg-neutral-50 text-center", children: _jsx("button", { onClick: () => setShowVideoW(false), className: "btn-accent px-6 py-2", children: "Fermer la vid\u00E9o" }) })] })] }) }))] }));
};
export default ProgramSection;
//# sourceMappingURL=ProgramSection.js.map