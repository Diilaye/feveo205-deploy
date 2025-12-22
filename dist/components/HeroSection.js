import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, Target, Heart, Lightbulb, X } from 'lucide-react';
import { gieService } from '../services/gieService';
const HeroSection = ({ onNavigate }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [stats, setStats] = useState(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    // Charger les statistiques au montage du composant
    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoadingStats(true);
                const statsData = await gieService.getStatsPubliques();
                console.log('statsData:', statsData);
                setStats(statsData);
            }
            catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
                // Garder les valeurs par défaut en cas d'erreur
            }
            finally {
                setIsLoadingStats(false);
            }
        };
        loadStats();
    }, []);
    const metrics = [
        {
            icon: TrendingUp,
            value: isLoadingStats ? '...' : (stats?.totalGIEs?.toString() || '?'),
            label: 'GIEs enregistrés',
            color: 'text-accent-500'
        },
        {
            icon: Users,
            value: isLoadingStats ? '...' : (stats?.estimations?.femmes + stats?.totalGIEs || '691 250'),
            label: 'Nbre min. de femmes',
            color: 'text-success-500'
        },
        {
            icon: Users,
            value: isLoadingStats ? '...' : (stats?.estimations?.jeunes?.toLocaleString() || '331 800'),
            label: 'Nbre de jeunes',
            color: 'text-accent-500'
        },
        {
            icon: Users,
            value: isLoadingStats ? '...' : (stats?.estimations?.adultes?.toLocaleString() || '82 950'),
            label: 'Nbre d\'adultes',
            color: 'text-success-500'
        },
        {
            icon: Calendar,
            value: '1 826',
            label: 'Nbre jours d\'invest',
            color: 'text-accent-500'
        },
    ];
    const visionMission = [
        {
            icon: Target,
            title: 'Notre Vision',
            description: 'Créer un écosystème d\'investissement Économique organique pour faire des femmes le moteur de la transformation systémique de l\'économie du Sénégal',
            color: 'bg-primary-500'
        },
        {
            icon: Heart,
            title: 'Notre Mission',
            description: 'Placer les femmes au cœur du système de création de richesses par l\'exploitation de toute la chaine de valeur',
            color: 'bg-success-500'
        },
        {
            icon: Lightbulb,
            title: 'Nos Projets',
            description: '',
            color: 'bg-accent-500',
            projects: [
                {
                    name: 'FEVEO GRANDE DISTRIBUTION',
                    icon: '🏪',
                    description: 'Réseau de distribution moderne et innovant',
                    color: 'bg-blue-500/20 border-blue-400/30'
                },
                {
                    name: 'PLANS VASTES DE ZONES',
                    icon: '🏗️',
                    description: 'Développement territorial intégré',
                    color: 'bg-green-500/20 border-green-400/30'
                },
                {
                    name: 'AEROBUS',
                    icon: '✈️',
                    description: 'Transport aérien connecté',
                    color: 'bg-purple-500/20 border-purple-400/30'
                },
                {
                    name: 'FEVEO CASH',
                    icon: '💰',
                    description: 'Solutions financières digitales',
                    color: 'bg-yellow-500/20 border-yellow-400/30'
                }
            ]
        }
    ];
    return (_jsxs("section", { id: "accueil", className: "relative min-h-screen", children: [_jsx("div", { className: "absolute inset-0 background-slideshow-enhanced" }), _jsx("div", { className: "absolute inset-0 bg-primary-900/30" }), _jsxs("div", { className: "relative z-10 container-max section-padding py-20", children: [_jsxs("div", { className: "max-w-4xl mx-auto text-center text-neutral-50 mb-20", children: [_jsxs("div", { className: "animate-slide-up", children: [_jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6", children: ["AVEC INVESTISSEMENT", _jsx("span", { className: "block text-accent-400", children: "\u00AB FEVEO 2050 \u00BB" })] }), _jsx("p", { className: "text-xl md:text-2xl text-neutral-100 mb-8  mx-auto leading-relaxed", children: "L'avenir de l'investissement en \u00E9conomie organique, \u00E0 partir du S\u00E9n\u00E9gal" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center mb-16", children: [_jsx("button", { onClick: () => onNavigate?.('about'), className: "btn-accent text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200", children: "D\u00E9couvrir la plateforme" }), _jsx("button", { onClick: () => onNavigate?.('actualites'), className: "bg-transparent border-2 border-neutral-50 text-neutral-50 hover:bg-neutral-50 hover:text-primary-900 text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl", children: "Actualites" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-8 max-w-4xl mx-auto animate-fade-in", children: metrics.map((metric, index) => (_jsxs("div", { className: "text-center animate-float", style: { animationDelay: `${index * 0.2}s` }, children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-neutral-50/10 backdrop-blur-sm rounded-full mb-4", children: _jsx(metric.icon, { className: `w-8 h-8 ${metric.color}` }) }), _jsx("div", { className: "text-3xl md:text-4xl font-bold mb-2", children: metric.value }), _jsx("div", { className: "text-neutral-200 font-medium", children: metric.label })] }, index))) })] }), _jsxs("div", { className: "max-w-6xl mx-auto mb-20", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-neutral-50 mb-4", children: "Pr\u00E9sentation FEVEO 2050" }), _jsx("p", { className: "text-xl text-neutral-200 max-w-2xl mx-auto", children: "Une vision d'entreprise en \u00E9conomie organique, autour des femmes, dans la perspective d'une transformation structurelle des potentiels \u00E9conomiques territoriales" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: visionMission.map((item, index) => (_jsx("div", { className: "group", children: _jsxs("div", { className: "bg-neutral-50/10 backdrop-blur-sm rounded-xl p-6 border border-neutral-50/20 hover:bg-neutral-50/15 transition-all duration-300 h-full", children: [_jsx("div", { className: `w-14 h-14 ${item.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`, children: _jsx(item.icon, { className: "w-7 h-7 text-neutral-50" }) }), _jsx("h3", { className: "text-xl font-bold text-neutral-50 mb-4", children: item.title }), item.title === 'Nos Projets' ? (_jsx("div", { className: "space-y-3", children: item.projects?.map((project, projIndex) => (_jsx("div", { className: "flex-1", children: _jsxs("h4", { className: "font-semibold text-neutral-50 text-sm mb-1 group-hover/project:text-accent-400 transition-colors duration-300", children: ["\u2756 ", project.name] }) }, projIndex))) })) : (_jsx("p", { className: "text-neutral-200 leading-relaxed", children: item.description }))] }) }, index))) })] }), _jsx("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce", children: _jsx("div", { className: "w-6 h-10 border-2 border-neutral-50/30 rounded-full flex justify-center", children: _jsx("div", { className: "w-1 h-3 bg-neutral-50/50 rounded-full mt-2 animate-pulse" }) }) })] }), showVideo && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-4xl mx-4", children: [_jsx("button", { onClick: () => setShowVideo(false), className: "absolute -top-12 right-0 text-neutral-50 hover:text-neutral-300 transition-colors duration-200", children: _jsx(X, { className: "w-8 h-8" }) }), _jsxs("div", { className: "bg-neutral-50 rounded-xl overflow-hidden shadow-2xl", children: [_jsxs("div", { className: "aspect-video bg-neutral-900 flex items-center justify-center relative", children: [_jsxs("video", { autoPlay: true, loop: true, muted: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover", children: [_jsx("source", { src: "/videos/feveo2050.mp4", type: "video/mp4" }), _jsx("source", { src: "/videos/feveo2050.mov", type: "video/quicktime" }), "Votre navigateur ne prend pas en charge la lecture vid\u00E9o."] }), "                ", _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none", children: _jsxs("div", { className: "absolute bottom-4 left-4 text-neutral-50", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Vid\u00E9o Tutoriel FEVEO 2050" }), _jsx("p", { className: "text-sm text-neutral-300", children: "D\u00E9couvrez notre plateforme d'investissement en \u00E9conomie organique" })] }) })] }), _jsx("div", { className: "p-4 bg-neutral-50 text-center", children: _jsx("button", { onClick: () => setShowVideo(false), className: "btn-accent px-6 py-2", children: "Fermer la vid\u00E9o" }) })] })] }) }))] }));
};
export default HeroSection;
//# sourceMappingURL=HeroSection.js.map