import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Wallet, Plus, Calendar, PiggyBank, Home, Users, ChevronRight } from 'lucide-react';
import EpargneTab from './EpargneTab';
const EpargneListTab = ({ gieCode, gieId }) => {
    const [epargnes, setEpargnes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEpargne, setSelectedEpargne] = useState(null);
    const [selectedEpargneData, setSelectedEpargneData] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const epargneTypes = [
        {
            value: 'epargne_volontaire',
            label: 'Épargne Volontaire',
            icon: Wallet,
            color: 'from-blue-500 to-blue-600',
            description: 'Épargne flexible pour vos projets personnels'
        },
        {
            value: 'epargne_tabaski',
            label: 'Épargne Tabaski',
            icon: Calendar,
            color: 'from-green-500 to-green-600',
            description: 'Préparez sereinement la fête de Tabaski'
        },
        {
            value: 'epargne_feveo_habitat',
            label: 'Épargne Feveo Habitat',
            icon: Home,
            color: 'from-orange-500 to-orange-600',
            description: 'Construisez votre projet immobilier'
        },
        {
            value: 'fonds_social_gie',
            label: 'Fonds Social GIE',
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            description: 'Solidarité et entraide collective'
        }
    ];
    useEffect(() => {
        loadEpargnes();
    }, [gieId]);
    const loadEpargnes = async () => {
        try {
            const token = localStorage.getItem('walletSession');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3051/api'}/epargne/gie/${gieId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 404) {
                // Aucune épargne trouvée - c'est normal
                setEpargnes([]);
            }
            else if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Le backend retourne un tableau d'épargnes avec stats
                    setEpargnes(data.data.map((item) => item.epargne));
                }
            }
        }
        catch (error) {
            console.error('Erreur chargement épargnes:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getEpargneTypeInfo = (type) => {
        return epargneTypes.find(t => t.value === type) || epargneTypes[0];
    };
    const getAvailableTypes = () => {
        // Ne bloquer que les types avec une épargne ACTIVE ou SUSPENDUE
        // Les épargnes clôturées permettent la création d'une nouvelle du même type
        const existingActiveTypes = epargnes
            .filter(e => e.statut === 'active' || e.statut === 'suspendue')
            .map(e => e.configuration.objectifPrincipal);
        const available = epargneTypes.filter(type => !existingActiveTypes.includes(type.value));
        console.log('📊 Types existants (actifs/suspendus):', existingActiveTypes);
        console.log('✅ Types disponibles:', available.map(t => t.value));
        return available;
    };
    // Si une épargne est sélectionnée, afficher son détail
    if (selectedEpargne) {
        // Si c'est une nouvelle épargne (préfixée par "new-"), extraire le type
        const isNewEpargne = selectedEpargne.startsWith('new-');
        const epargneTypeToPass = isNewEpargne
            ? selectedEpargne.replace('new-', '')
            : epargnes.find(e => e._id === selectedEpargne)?.configuration.objectifPrincipal;
        return (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                        setSelectedEpargne(null);
                        setSelectedEpargneData(null);
                    }, className: "mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium", children: "\u2190 Retour \u00E0 la liste" }), _jsx(EpargneTab, { gieCode: gieCode, gieId: gieId, epargneType: epargneTypeToPass, isCreatingNew: isNewEpargne, initialData: selectedEpargneData ? {
                        ...selectedEpargneData,
                        identifiantGIE: selectedEpargneData.identifiantGIE || '',
                        nomGIE: selectedEpargneData.nomGIE || ''
                    } : null })] }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Chargement des \u00E9pargnes..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Mes \u00C9pargnes" }), _jsx("p", { className: "text-gray-600 mt-1", children: "G\u00E9rez vos diff\u00E9rents types d'\u00E9pargne" })] }), getAvailableTypes().length > 0 && (_jsxs("button", { onClick: () => {
                            console.log('🔵 Bouton "Créer une Épargne" cliqué');
                            console.log('📋 showCreateModal avant:', showCreateModal);
                            setShowCreateModal(true);
                            console.log('📋 showCreateModal après: true');
                        }, className: "flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold", children: [_jsx(Plus, { className: "w-5 h-5" }), "Cr\u00E9er une \u00C9pargne"] }))] }), epargnes.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: epargnes.map((epargne) => {
                    const typeInfo = getEpargneTypeInfo(epargne.configuration.objectifPrincipal);
                    const Icon = typeInfo.icon;
                    return (_jsxs("div", { onClick: () => {
                            setSelectedEpargne(epargne._id);
                            setSelectedEpargneData(epargne);
                        }, className: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-orange-200 p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: `w-14 h-14 bg-gradient-to-br ${typeInfo.color} rounded-xl flex items-center justify-center shadow-lg`, children: _jsx(Icon, { className: "w-7 h-7 text-white" }) }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${epargne.statut === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'}`, children: epargne.statut === 'active' ? 'Active' : epargne.statut })] }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: typeInfo.label }), _jsx("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: epargne.configuration.descriptionObjectif }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600 text-sm", children: "Solde Total" }), _jsxs("span", { className: "text-2xl font-bold text-gray-900", children: [epargne.soldeTotal.toLocaleString(), " ", _jsx("span", { className: "text-sm font-normal", children: "FCFA" })] })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Versements" }), _jsxs("span", { className: "text-green-600 font-semibold", children: ["+", epargne.totalVersements.toLocaleString(), " FCFA"] })] }), epargne.totalRetraits > 0 && (_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Retraits" }), _jsxs("span", { className: "text-red-600 font-semibold", children: ["-", epargne.totalRetraits.toLocaleString(), " FCFA"] })] }))] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-500 text-sm", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsxs("span", { children: ["Depuis ", new Date(epargne.dateActivation).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })] })] }), _jsx(ChevronRight, { className: "w-5 h-5 text-gray-400" })] })] }, epargne._id));
                }) })) : (_jsx("div", { className: "bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-12 text-center", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx("div", { className: "w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg", children: _jsx(PiggyBank, { className: "w-10 h-10 text-orange-500" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-3", children: "Aucune \u00E9pargne cr\u00E9\u00E9e" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Commencez \u00E0 \u00E9pargner pour vos projets en cr\u00E9ant votre premi\u00E8re \u00E9pargne" }), _jsxs("button", { onClick: () => {
                                console.log('🔵 Bouton "Créer ma première épargne" cliqué');
                                setShowCreateModal(true);
                            }, className: "inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold", children: [_jsx(Plus, { className: "w-5 h-5" }), "Cr\u00E9er ma premi\u00E8re \u00E9pargne"] })] }) })), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-white p-6 border-b border-gray-200 z-10", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Cr\u00E9er une nouvelle \u00E9pargne" }), _jsx("button", { onClick: () => {
                                                console.log('❌ Fermeture du modal');
                                                setShowCreateModal(false);
                                            }, className: "text-gray-500 hover:text-gray-700 transition-colors text-3xl leading-none", children: "\u00D7" })] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Choisissez le type d'\u00E9pargne que vous souhaitez cr\u00E9er" })] }), _jsx("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-4", children: getAvailableTypes().map((type) => {
                                const Icon = type.icon;
                                return (_jsxs("button", { onClick: () => {
                                        console.log('🎯 Type sélectionné:', type.value);
                                        setShowCreateModal(false);
                                        // Créer une nouvelle épargne avec ce type
                                        setSelectedEpargne('new-' + type.value);
                                        console.log('📝 selectedEpargne mis à:', 'new-' + type.value);
                                    }, className: "bg-white border-2 border-gray-200 hover:border-orange-400 rounded-xl p-6 text-left transition-all hover:shadow-lg group", children: [_jsx("div", { className: `w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`, children: _jsx(Icon, { className: "w-6 h-6 text-white" }) }), _jsx("h4", { className: "text-lg font-bold text-gray-900 mb-2", children: type.label }), _jsx("p", { className: "text-sm text-gray-600", children: type.description })] }, type.value));
                            }) })] }) }))] }));
};
export default EpargneListTab;
//# sourceMappingURL=EpargneListTab.js.map