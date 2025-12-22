import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, Play, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';
const Galerie = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedImages, setLoadedImages] = useState(new Set());
    // Simuler le chargement initial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    // Données de la galerie (vraies images du projet)
    const mediaItems = [
        {
            id: '1',
            type: 'video',
            src: '/videos/feveo2050.mp4',
            thumbnail: '/images/galerie/PHOTO-2025-07-20-13-22-56.jpg',
            title: 'Présentation FEVEO 2050',
            description: 'Découvrez notre vision pour l\'économie organique au Sénégal',
            category: 'presentation'
        },
        // Images de concept et vision
        {
            id: '2',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-56(1).jpg',
            title: 'Vision Économie Organique',
            description: 'Concept de développement durable centré sur les femmes',
            category: 'concept'
        },
        {
            id: '3',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-56(2).jpg',
            title: 'Transformation Systémique',
            description: 'Écosystème d\'investissement économique organique',
            category: 'concept'
        },
        {
            id: '4',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-57.jpg',
            title: 'Autonomisation des Femmes',
            description: 'Les femmes au cœur de la transformation économique',
            category: 'autonomisation'
        },
        {
            id: '5',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-57(1).jpg',
            title: 'Leadership Féminin',
            description: 'Formation et accompagnement des femmes leaders',
            category: 'autonomisation'
        },
        {
            id: '6',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-57(2).jpg',
            title: 'Entrepreneuriat Féminin',
            description: 'Développement de l\'entrepreneuriat féminin au Sénégal',
            category: 'autonomisation'
        },
        {
            id: '7',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-57(3).jpg',
            title: 'Réseau de Femmes',
            description: 'Constitution d\'un réseau fort de femmes entrepreneures',
            category: 'autonomisation'
        },
        // Images de GIE
        {
            id: '8',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-58.jpg',
            title: 'Formation GIE',
            description: 'Formation des Groupements d\'Intérêt Économique',
            category: 'gie'
        },
        {
            id: '9',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-58(1).jpg',
            title: 'Constitution des GIE',
            description: 'Processus de création des GIE FEVEO',
            category: 'gie'
        },
        {
            id: '10',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-58(2).jpg',
            title: 'Accompagnement GIE',
            description: 'Suivi et accompagnement des groupements',
            category: 'gie'
        },
        {
            id: '11',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-58(3).jpg',
            title: 'Validation GIE',
            description: 'Processus de validation des GIE selon les critères FEVEO',
            category: 'gie'
        },
        // Images d'investissement
        {
            id: '12',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-59.jpg',
            title: 'Cycle d\'Investissement',
            description: '1 826 jours d\'investissement organique',
            category: 'investissement'
        },
        {
            id: '13',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-59(1).jpg',
            title: 'Mécanisme de Financement',
            description: 'Structure financière innovante pour l\'économie organique',
            category: 'investissement'
        },
        {
            id: '14',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-22-59(2).jpg',
            title: 'Plateforme d\'Investissement',
            description: 'Outils digitaux pour l\'investissement participatif',
            category: 'investissement'
        },
        // Images de territoire
        {
            id: '15',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-00.jpg',
            title: 'Développement Territorial',
            description: 'Transformation des territoires par l\'économie organique',
            category: 'territoire'
        },
        {
            id: '16',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-00(1).jpg',
            title: 'Impact Local',
            description: 'Développement économique des communautés locales',
            category: 'territoire'
        },
        {
            id: '17',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-00(2).jpg',
            title: 'Aménagement du Territoire',
            description: 'Plans vastes de zones de développement',
            category: 'territoire'
        },
        // Images de technologie
        {
            id: '18',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-01.jpg',
            title: 'Innovation Technologique',
            description: 'Solutions digitales pour l\'économie organique',
            category: 'technologie'
        },
        {
            id: '19',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-01(1).jpg',
            title: 'FEVEO CASH',
            description: 'Solution de paiement mobile pour l\'écosystème FEVEO',
            category: 'technologie'
        },
        {
            id: '20',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-01(2).jpg',
            title: 'Plateforme Digitale',
            description: 'Interface utilisateur de la plateforme FEVEO 2050',
            category: 'technologie'
        },
        {
            id: '21',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-01(3).jpg',
            title: 'Outils Numériques',
            description: 'Ensemble d\'outils pour la gestion des investissements',
            category: 'technologie'
        },
        {
            id: '22',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-01(4).jpg',
            title: 'Dashboard Analytics',
            description: 'Tableau de bord analytique pour le suivi des performances',
            category: 'technologie'
        },
        // Images de partenaires et événements
        {
            id: '23',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-02.jpg',
            title: 'Écosystème de Partenaires',
            description: 'Réseau de partenaires stratégiques',
            category: 'partenaires'
        },
        {
            id: '24',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-02(1).jpg',
            title: 'Événement de Lancement',
            description: 'Présentation officielle du projet FEVEO 2050',
            category: 'partenaires'
        },
        {
            id: '25',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-02(2).jpg',
            title: 'Conférence Partenaires',
            description: 'Rencontre avec les partenaires institutionnels',
            category: 'partenaires'
        },
        {
            id: '26',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-02(3).jpg',
            title: 'Signature de Partenariats',
            description: 'Formalisation des accords de partenariat',
            category: 'partenaires'
        },
        // Ajout d'images supplémentaires pour enrichir la galerie
        {
            id: '27',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-03.jpg',
            title: 'Formation Technique',
            description: 'Sessions de formation aux outils FEVEO',
            category: 'gie'
        },
        {
            id: '28',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-03(1).jpg',
            title: 'Ateliers Pratiques',
            description: 'Ateliers de formation pratique pour les GIE',
            category: 'gie'
        },
        {
            id: '29',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-03(2).jpg',
            title: 'Certification GIE',
            description: 'Processus de certification des groupements',
            category: 'gie'
        },
        {
            id: '30',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-03(3).jpg',
            title: 'Réseau National',
            description: 'Extension du réseau FEVEO à l\'échelle nationale',
            category: 'territoire'
        },
        {
            id: '31',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-04.jpg',
            title: 'Mobilisation Communautaire',
            description: 'Engagement des communautés dans le projet',
            category: 'autonomisation'
        },
        {
            id: '32',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-04(1).jpg',
            title: 'Sensibilisation Locale',
            description: 'Campagnes de sensibilisation dans les communautés',
            category: 'autonomisation'
        },
        {
            id: '33',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-04(2).jpg',
            title: 'Inclusion Financière',
            description: 'Programmes d\'inclusion financière pour les femmes',
            category: 'investissement'
        },
        {
            id: '34',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-04(3).jpg',
            title: 'Microfinance Communautaire',
            description: 'Systèmes de microfinance adaptés aux communautés',
            category: 'investissement'
        },
        {
            id: '35',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-23-05.jpg',
            title: 'Innovation Sociale',
            description: 'Solutions innovantes pour l\'impact social',
            category: 'concept'
        },
        // Dernières images pour compléter
        {
            id: '36',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-24-05.jpg',
            title: 'Grande Distribution FEVEO',
            description: 'Projet de réseau de distribution moderne',
            category: 'concept'
        },
        {
            id: '37',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-24-05(1).jpg',
            title: 'Transport AEROBUS',
            description: 'Projet de transport aérien connecté',
            category: 'concept'
        },
        {
            id: '38',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-24-06.jpg',
            title: 'Plateforme Collaborative',
            description: 'Outils de collaboration pour les GIE',
            category: 'technologie'
        },
        {
            id: '39',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-24-06(1).jpg',
            title: 'Interface Mobile',
            description: 'Application mobile FEVEO pour les utilisateurs',
            category: 'technologie'
        },
        {
            id: '40',
            type: 'image',
            src: '/images/galerie/PHOTO-2025-07-20-13-24-06(2).jpg',
            title: 'Réseau Institutionnel',
            description: 'Partenariats avec les institutions publiques',
            category: 'partenaires'
        }
    ];
    const categories = [
        { id: 'all', name: 'Tout voir', count: mediaItems.length },
        { id: 'presentation', name: 'Présentation', count: mediaItems.filter(item => item.category === 'presentation').length },
        { id: 'concept', name: 'Concept', count: mediaItems.filter(item => item.category === 'concept').length },
        { id: 'autonomisation', name: 'Autonomisation', count: mediaItems.filter(item => item.category === 'autonomisation').length },
        { id: 'gie', name: 'GIE', count: mediaItems.filter(item => item.category === 'gie').length },
        { id: 'investissement', name: 'Investissement', count: mediaItems.filter(item => item.category === 'investissement').length },
        { id: 'territoire', name: 'Territoire', count: mediaItems.filter(item => item.category === 'territoire').length },
        { id: 'technologie', name: 'Technologie', count: mediaItems.filter(item => item.category === 'technologie').length },
        { id: 'partenaires', name: 'Partenaires', count: mediaItems.filter(item => item.category === 'partenaires').length }
    ];
    const filteredItems = selectedCategory === 'all'
        ? mediaItems
        : mediaItems.filter(item => item.category === selectedCategory);
    const openModal = (item) => {
        setSelectedMedia(item);
        setCurrentIndex(filteredItems.findIndex(media => media.id === item.id));
    };
    const closeModal = () => {
        setSelectedMedia(null);
    };
    const goToPrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
        setCurrentIndex(newIndex);
        setSelectedMedia(filteredItems[newIndex]);
    };
    const goToNext = () => {
        const newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        setSelectedMedia(filteredItems[newIndex]);
    };
    const handleImageLoad = (imageId) => {
        setLoadedImages(prev => new Set(prev).add(imageId));
    };
    const handleImageError = (e) => {
        // Remplacer par une image placeholder si l'image n'existe pas
        const target = e.currentTarget;
        const originalSrc = target.src;
        // Éviter la boucle infinie en vérifiant si on est déjà sur le placeholder
        if (!originalSrc.includes('via.placeholder.com')) {
            target.src = `https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=${encodeURIComponent('FEVEO 2050')}`;
        }
    };
    return (_jsxs("section", { id: "galerie", className: "min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-20", children: [_jsxs("div", { className: "container-max section-padding", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsxs("button", { onClick: () => onNavigate?.('accueil'), className: "inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 mb-6", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Retour \u00E0 l'accueil"] }), _jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-neutral-900 mb-4", children: ["Galerie ", _jsx("span", { className: "text-accent-500", children: "FEVEO 2050" })] }), _jsx("p", { className: "text-xl text-neutral-600 max-w-3xl mx-auto", children: "D\u00E9couvrez en images et vid\u00E9os notre vision de l'\u00E9conomie organique, nos projets et notre impact sur le d\u00E9veloppement territorial du S\u00E9n\u00E9gal." })] }), _jsx("div", { className: "flex flex-wrap justify-center gap-3 mb-12", children: categories.map((category) => (_jsxs("button", { onClick: () => setSelectedCategory(category.id), className: `px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedCategory === category.id
                                ? 'bg-accent-500 text-white shadow-lg'
                                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'}`, children: [category.name, " (", category.count, ")"] }, category.id))) }), isLoading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: Array.from({ length: 8 }).map((_, index) => (_jsxs("div", { className: "bg-white rounded-xl overflow-hidden shadow-lg animate-pulse", children: [_jsx("div", { className: "aspect-square bg-neutral-200" }), _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "h-4 bg-neutral-200 rounded mb-2" }), _jsx("div", { className: "h-3 bg-neutral-200 rounded mb-3" }), _jsx("div", { className: "h-6 bg-neutral-200 rounded-full w-20" })] })] }, index))) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredItems.map((item, index) => (_jsxs("div", { className: "group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer", onClick: () => openModal(item), children: [_jsxs("div", { className: "aspect-square relative overflow-hidden", children: [item.type === 'video' ? (_jsxs("div", { className: "relative w-full h-full", children: [_jsx("img", { src: item.thumbnail || `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Vidéo`, alt: item.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300", onError: handleImageError, onLoad: () => handleImageLoad(item.id) }), _jsx("div", { className: "absolute inset-0 bg-neutral-900/30 flex items-center justify-center", children: _jsx("div", { className: "w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300", children: _jsx(Play, { className: "w-8 h-8 text-white ml-1" }) }) })] })) : (_jsxs(_Fragment, { children: [!loadedImages.has(item.id) && (_jsx("div", { className: "absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" }) })), _jsx("img", { src: item.src, alt: item.title, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300", onError: handleImageError, onLoad: () => handleImageLoad(item.id), style: { display: loadedImages.has(item.id) ? 'block' : 'none' } })] })), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsxs("div", { className: "flex items-center justify-between text-white", children: [_jsx(ZoomIn, { className: "w-5 h-5" }), item.type === 'video' && _jsx(Play, { className: "w-5 h-5" })] }) }) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-neutral-900 mb-2 line-clamp-2", children: item.title }), _jsx("p", { className: "text-sm text-neutral-600 line-clamp-2", children: item.description }), _jsx("div", { className: "mt-3", children: _jsx("span", { className: "inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs rounded-full", children: categories.find(cat => cat.id === item.category)?.name || item.category }) })] })] }, item.id))) })), filteredItems.length === 0 && (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "text-neutral-400 mb-4", children: _jsx(ZoomIn, { className: "w-16 h-16 mx-auto" }) }), _jsx("h3", { className: "text-xl font-semibold text-neutral-600 mb-2", children: "Aucun m\u00E9dia trouv\u00E9" }), _jsx("p", { className: "text-neutral-500", children: "Essayez de s\u00E9lectionner une autre cat\u00E9gorie." })] }))] }), selectedMedia && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full h-full max-w-6xl max-h-screen p-4 flex items-center justify-center", children: [_jsx("button", { onClick: goToPrevious, className: "absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200", children: _jsx(ArrowLeft, { className: "w-6 h-6" }) }), _jsx("button", { onClick: goToNext, className: "absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200", children: _jsx(ArrowRight, { className: "w-6 h-6" }) }), _jsx("button", { onClick: closeModal, className: "absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200", children: _jsx(X, { className: "w-6 h-6" }) }), _jsxs("div", { className: "relative w-full h-full flex items-center justify-center", children: [selectedMedia.type === 'video' ? (_jsx("div", { className: "relative w-full max-w-4xl", children: _jsxs("video", { controls: true, autoPlay: true, className: "w-full h-auto max-h-[80vh] rounded-lg shadow-2xl", children: [_jsx("source", { src: selectedMedia.src, type: "video/mp4" }), _jsx("source", { src: "/videos/feveo2050.mov", type: "video/quicktime" }), "Votre navigateur ne prend pas en charge la lecture vid\u00E9o."] }) })) : (_jsx("img", { src: selectedMedia.src, alt: selectedMedia.title, className: "max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl", onError: handleImageError })), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900/80 to-transparent p-6 text-white", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: selectedMedia.title }), _jsx("p", { className: "text-neutral-200 mb-4", children: selectedMedia.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "px-3 py-1 bg-accent-500 rounded-full text-sm", children: categories.find(cat => cat.id === selectedMedia.category)?.name || selectedMedia.category }), _jsxs("span", { className: "text-neutral-300 text-sm", children: [currentIndex + 1, " / ", filteredItems.length] })] })] })] })] }) }))] }));
};
export default Galerie;
//# sourceMappingURL=Galerie.js.map