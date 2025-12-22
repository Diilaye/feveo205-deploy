import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight, MapPin, Users } from 'lucide-react';
const RegionDepartementReportNew = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [regionsData, setRegionsData] = useState([]);
    const [expandedRegions, setExpandedRegions] = useState([]);
    const [expandedDepartements, setExpandedDepartements] = useState({});
    const [reportTimePeriod, setReportTimePeriod] = useState('30d');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    // Fetch data from API
    useEffect(() => {
        setSearchQuery('');
        setActiveSearch('');
        fetchRegionDepartementData();
    }, [reportTimePeriod]);
    // Fonction de recherche explicite
    const handleSearch = () => {
        setActiveSearch(searchQuery);
        fetchRegionDepartementData(searchQuery);
    };
    /**
     * Récupère les données des GIEs par région et département depuis l'API
     */
    const fetchRegionDepartementData = async (query = '') => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            setLoading(true);
            // Appel API
            const response = await axios.get('/admin/reports/gies-by-region-departement', {
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    period: reportTimePeriod,
                    search: query ? query.trim() : undefined
                }
            });
            // Vérification de la réponse
            if (!response?.data?.success) {
                setError('Erreur lors de la récupération des données');
                return;
            }
            console.log('API response:', response.data);
            // Extraction des données pertinentes
            const { giesByDepartement } = response.data.data;
            // Vérifier que nous avons bien des données de GIEs par département
            if (!Array.isArray(giesByDepartement)) {
                console.error("Format de données inattendu: giesByDepartement n'est pas un tableau");
                setError('Format de données incorrect');
                return;
            }
            // Organiser les départements par région
            const departmentsByRegion = {};
            const regionCount = {};
            // Traiter les données de GIEs par département
            for (const deptData of giesByDepartement) {
                // Extraire la région du département à partir des GIEs
                // Dans cet exemple, nous supposons que tous les GIEs d'un département partagent la même région
                // Si ce n'est pas le cas, il faudra adapter cette logique
                let regionCode = '';
                if (deptData.gies && deptData.gies.length > 0) {
                    regionCode = deptData.gies[0].region;
                }
                else {
                    // Si nous n'avons pas de GIE pour déterminer la région, on utilise un code par défaut
                    regionCode = 'unknown';
                }
                const departmentCode = deptData.departement;
                const departmentName = deptData.nom || departmentCode;
                // Initialiser le tableau pour cette région s'il n'existe pas encore
                if (!departmentsByRegion[regionCode]) {
                    departmentsByRegion[regionCode] = [];
                    regionCount[regionCode] = 0;
                }
                // Ajouter ce département à sa région
                departmentsByRegion[regionCode].push({
                    nom: departmentName,
                    code: departmentCode,
                    giesCount: deptData.count || deptData.gies.length || 0,
                    gies: deptData.gies || []
                });
                // Mettre à jour le nombre total de GIEs pour cette région
                regionCount[regionCode] += deptData.count || deptData.gies.length || 0;
            }
            // Transformer les données en format attendu par le composant
            const regionsWithDepts = Object.keys(departmentsByRegion).map(regionCode => {
                // Trier les départements par nombre de GIEs (descendant)
                const departments = [...departmentsByRegion[regionCode]];
                departments.sort((a, b) => b.giesCount - a.giesCount);
                return {
                    nom: regionCode,
                    code: regionCode,
                    totalGIEs: regionCount[regionCode],
                    departements: departments
                };
            });
            // Tri des régions par nombre total de GIEs
            regionsWithDepts.sort((a, b) => b.totalGIEs - a.totalGIEs);
            setRegionsData(regionsWithDepts);
            setError(null);
        }
        catch (err) {
            console.error('Erreur lors de la récupération des données:', err);
            setError('Erreur lors de la récupération des données');
        }
        finally {
            setLoading(false);
        }
    };
    // Toggle region expansion
    const toggleRegion = (regionCode) => {
        if (expandedRegions.includes(regionCode)) {
            setExpandedRegions(expandedRegions.filter(r => r !== regionCode));
        }
        else {
            setExpandedRegions([...expandedRegions, regionCode]);
        }
    };
    // Toggle department expansion to show GIEs
    const toggleDepartement = (regionDeptKey) => {
        setExpandedDepartements(prev => ({
            ...prev,
            [regionDeptKey]: !prev[regionDeptKey]
        }));
    };
    // Handle period change
    const handlePeriodChange = (period) => {
        setReportTimePeriod(period);
    };
    // Format date string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };
    // Get status badge class
    const getStatusBadgeClass = (status) => {
        if (status === 'validee' || status === 'valide') {
            return 'bg-green-100 text-green-700';
        }
        else if (status === 'en_attente' || status === 'en_attente_paiement') {
            return 'bg-amber-100 text-amber-700';
        }
        else {
            return 'bg-red-100 text-red-700';
        }
    };
    // Get status label
    const getStatusLabel = (status) => {
        if (status === 'validee' || status === 'valide')
            return 'Validée';
        if (status === 'en_attente')
            return 'En attente';
        if (status === 'en_attente_paiement')
            return 'En attente de paiement';
        return 'Rejetée';
    };
    // Get presenter name with proper formatting
    const getPresidenteName = (gie) => {
        if (gie.presidente) {
            return `${gie.presidente.prenom || ''} ${gie.presidente.nom || ''}`.trim();
        }
        if (gie.presidentePrenom && gie.presidenteNom) {
            return `${gie.presidentePrenom} ${gie.presidenteNom}`.trim();
        }
        return "Non spécifié";
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "p-4 border-b", children: _jsx("div", { className: "flex flex-col md:flex-row md:justify-between md:items-center gap-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Rapport des GIEs par r\u00E9gion et d\u00E9partement" }) }) }), _jsx("div", { className: "p-4 bg-gray-50", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx("div", { className: "bg-white p-4 rounded-lg border shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-50 rounded-md", children: _jsx(MapPin, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "R\u00E9gions" }), _jsx("p", { className: "text-xl font-semibold", children: regionsData.length })] })] }) }), _jsx("div", { className: "bg-white p-4 rounded-lg border shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-indigo-50 rounded-md", children: _jsx(MapPin, { className: "h-5 w-5 text-indigo-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "D\u00E9partements" }), _jsx("p", { className: "text-xl font-semibold", children: regionsData.reduce((acc, region) => acc + region.departements.length, 0) })] })] }) }), _jsx("div", { className: "bg-white p-4 rounded-lg border shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-emerald-50 rounded-md", children: _jsx(Users, { className: "h-5 w-5 text-emerald-600" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Total GIEs" }), _jsx("p", { className: "text-xl font-semibold", children: regionsData.reduce((acc, region) => acc + region.totalGIEs, 0) })] })] }) })] }) }), _jsxs("div", { className: "p-4", children: [loading && (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-gray-200" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Chargement des donn\u00E9es..." })] })), !loading && error && (_jsx("div", { className: "text-center py-8 text-red-600", children: error })), !loading && !error && (_jsx("div", { className: "divide-y", children: regionsData.map((region, index) => {
                            const isRegionExpanded = expandedRegions.includes(region.code);
                            return (_jsxs("div", { className: `py-3 ${isRegionExpanded ? 'bg-gray-50' : ''}`, children: [_jsxs("button", { type: "button", className: "w-full flex items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded text-left", onClick: () => toggleRegion(region.code), "aria-expanded": isRegionExpanded, children: [_jsx("div", { className: "mr-2", children: isRegionExpanded ? (_jsx(ChevronDown, { className: "h-5 w-5 text-gray-500" })) : (_jsx(ChevronRight, { className: "h-5 w-5 text-gray-500" })) }), _jsxs("div", { className: "flex items-center justify-between flex-grow", children: [_jsx("h4", { className: "font-medium text-gray-800", children: region.nom }), _jsxs("div", { className: "bg-blue-100 px-2 py-0.5 rounded-full text-sm text-blue-700", children: [region.totalGIEs, " GIEs"] })] })] }), isRegionExpanded && (_jsx("div", { className: "mt-2 pl-7", children: _jsx("div", { className: "border-l-2 border-gray-200 pl-3", children: _jsx("div", { className: "space-y-2", children: region.departements.map(dept => {
                                                    const regionDeptKey = `${region.code}-${dept.code}`;
                                                    const isDeptExpanded = expandedDepartements[regionDeptKey] || false;
                                                    return (_jsxs("div", { className: "bg-white rounded-md border", children: [_jsxs("button", { type: "button", className: "w-full flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 text-left", onClick: () => toggleDepartement(regionDeptKey), "aria-expanded": isDeptExpanded, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "mr-2", children: isDeptExpanded ? (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" })) : (_jsx(ChevronRight, { className: "h-4 w-4 text-gray-500" })) }), _jsx("span", { className: "font-medium text-gray-700", children: dept.nom })] }), _jsxs("div", { className: "bg-gray-100 px-2 py-0.5 rounded-full text-xs", children: [dept.giesCount, " GIEs"] })] }), isDeptExpanded && (_jsx(_Fragment, { children: dept.gies && dept.gies.length > 0 ? (_jsx("div", { className: "p-3 border-t", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Identifiant" }), _jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom" }), _jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Commune" }), _jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Pr\u00E9sidente" }), _jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date Cr\u00E9ation" }), _jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: dept.gies.map(gie => {
                                                                                        const presidenteName = getPresidenteName(gie);
                                                                                        return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2 text-sm font-medium text-gray-800", children: gie.identifiantGIE || gie.identifiant || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.nomGIE || gie.nom || gie.name || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.commune || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: presidenteName }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.dateCreation ? formatDate(gie.dateCreation) : "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-2 py-0.5 ${getStatusBadgeClass(gie.statutAdhesion)}`, children: getStatusLabel(gie.statutAdhesion) }) })] }, gie._id || gie.id));
                                                                                    }) })] }) }) })) : (_jsx("div", { className: "px-3 pb-3 text-center text-gray-500 text-sm py-4", children: "Aucun GIE disponible pour ce d\u00E9partement" })) }))] }, regionDeptKey));
                                                }) }) }) }))] }, region.code));
                        }) }))] })] }));
};
export default RegionDepartementReportNew;
//# sourceMappingURL=RegionDepartementReportNew.js.map