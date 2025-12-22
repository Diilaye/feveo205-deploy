import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight, MapPin, Users, Activity } from 'lucide-react';
const RegionDepartementReport = ({ authToken, apiBaseUrl }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [regionsData, setRegionsData] = useState([]);
    const [expandedRegions, setExpandedRegions] = useState([]);
    const [expandedDepartements, setExpandedDepartements] = useState({});
    const [reportTimePeriod, setReportTimePeriod] = useState('30d');
    // Fetch data from API
    useEffect(() => {
        fetchRegionDepartementData();
    }, [reportTimePeriod]);
    const fetchRegionDepartementData = async () => {
        try {
            const token = localStorage.getItem('adminAuthToken');
            setLoading(true);
            const response = await axios.get('/admin/reports/gies-by-region-departement', {
                baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3051',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    period: reportTimePeriod
                }
            });
            if (response?.data?.success) {
                // Transform the API data structure into our component state structure
                const regionsWithDepts = [];
                const data = response.data.data;
                const gies = response.data.gies || [];
                // Process each region
                for (const regionCode in data) {
                    const regionName = regionCode; // Use code as name if real name not available
                    const regionData = data[regionCode];
                    const regionGIEs = {
                        nom: regionName,
                        code: regionCode,
                        totalGIEs: regionData.totalGies,
                        departements: []
                    };
                    // Process each department in this region
                    for (const deptCode in regionData.departements) {
                        const deptData = regionData.departements[deptCode];
                        // Create department object
                        const departementData = {
                            nom: deptData.nom || deptCode,
                            code: deptCode,
                            giesCount: deptData.count,
                            gies: deptData.gies || []
                        };
                        regionGIEs.departements.push(departementData);
                    }
                    regionsWithDepts.push(regionGIEs);
                }
                // Sort regions by total GIEs count (descending)
                regionsWithDepts.sort((a, b) => b.totalGIEs - a.totalGIEs);
                // Sort departments within each region by GIEs count (descending)
                for (const region of regionsWithDepts) {
                    region.departements.sort((a, b) => b.giesCount - a.giesCount);
                }
                setRegionsData(regionsWithDepts);
                setError(null);
            }
            else {
                setError('Erreur lors de la récupération des données');
            }
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
        if (status === 'validee') {
            return 'bg-green-100 text-green-700';
        }
        else if (status === 'en_attente') {
            return 'bg-amber-100 text-amber-700';
        }
        else {
            return 'bg-red-100 text-red-700';
        }
    };
    // Get status label
    const getStatusLabel = (status) => {
        if (status === 'validee')
            return 'Validée';
        if (status === 'en_attente')
            return 'En attente';
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
    // Render function for content
    const renderContent = () => {
        if (loading) {
            return (_jsx("div", { className: "p-12 flex justify-center items-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" }) }));
        }
        if (error) {
            return (_jsxs("div", { className: "p-12 text-center", children: [_jsx("p", { className: "text-red-500", children: error }), _jsx("button", { onClick: fetchRegionDepartementData, className: "mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700", children: "R\u00E9essayer" })] }));
        }
        if (regionsData.length === 0) {
            return (_jsx("div", { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-500", children: "Aucune donn\u00E9e disponible" }) }));
        }
        return (_jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "bg-blue-50 rounded-lg p-4 flex items-center", children: [_jsx("div", { className: "rounded-full bg-blue-100 p-3 mr-3", children: _jsx(MapPin, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-blue-600", children: "R\u00E9gions" }), _jsx("p", { className: "text-2xl font-semibold text-blue-700", children: regionsData.length })] })] }), _jsxs("div", { className: "bg-purple-50 rounded-lg p-4 flex items-center", children: [_jsx("div", { className: "rounded-full bg-purple-100 p-3 mr-3", children: _jsx(Activity, { className: "h-5 w-5 text-purple-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-purple-600", children: "D\u00E9partements" }), _jsx("p", { className: "text-2xl font-semibold text-purple-700", children: regionsData.reduce((acc, region) => acc + region.departements.length, 0) })] })] }), _jsxs("div", { className: "bg-green-50 rounded-lg p-4 flex items-center", children: [_jsx("div", { className: "rounded-full bg-green-100 p-3 mr-3", children: _jsx(Users, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-green-600", children: "GIEs Total" }), _jsx("p", { className: "text-2xl font-semibold text-green-700", children: regionsData.reduce((acc, region) => acc + region.totalGIEs, 0) })] })] })] }), _jsx("div", { className: "space-y-4", children: regionsData.map((region) => {
                        const isRegionExpanded = expandedRegions.includes(region.code);
                        return (_jsxs("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: [_jsxs("button", { className: `w-full p-4 flex justify-between items-center text-left ${isRegionExpanded ? 'bg-gray-50' : 'bg-white'}`, onClick: () => toggleRegion(region.code), "aria-expanded": isRegionExpanded, children: [_jsxs("div", { className: "flex items-center", children: [isRegionExpanded ?
                                                    _jsx(ChevronDown, { className: "h-5 w-5 text-gray-500 mr-2" }) :
                                                    _jsx(ChevronRight, { className: "h-5 w-5 text-gray-500 mr-2" }), _jsx("h4", { className: "font-medium text-gray-800", children: region.nom }), _jsxs("div", { className: "ml-3 bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full", children: [region.totalGIEs, " GIEs"] })] }), _jsxs("div", { className: "text-sm text-gray-500", children: [region.departements.length, " d\u00E9partement", region.departements.length > 1 ? 's' : ''] })] }), isRegionExpanded && (_jsx("div", { className: "bg-gray-50 p-3", children: _jsx("div", { className: "space-y-3", children: region.departements.map((dept) => {
                                            const regionDeptKey = `${region.code}_${dept.code}`;
                                            const isDeptExpanded = expandedDepartements[regionDeptKey] || false;
                                            return (_jsxs("div", { className: "border border-gray-200 rounded-lg bg-white overflow-hidden", children: [_jsx("button", { className: `w-full p-3 flex justify-between items-center text-left hover:bg-gray-50 ${isDeptExpanded ? 'bg-gray-50' : ''}`, onClick: () => toggleDepartement(regionDeptKey), "aria-expanded": isDeptExpanded, children: _jsxs("div", { className: "flex items-center", children: [isDeptExpanded ?
                                                                    _jsx(ChevronDown, { className: "h-4 w-4 text-gray-500 mr-2" }) :
                                                                    _jsx(ChevronRight, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "font-medium text-gray-700", children: dept.nom }), _jsxs("div", { className: "ml-3 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full", children: [dept.giesCount, " GIEs"] })] }) }), isDeptExpanded && dept.gies && dept.gies.length > 0 && (_jsx("div", { className: "px-3 pb-3", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "ID GIE" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Nom" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Commune" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Pr\u00E9sidente" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Cr\u00E9ation" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-100", children: dept.gies.map((gie) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2 text-sm font-medium text-gray-800", children: gie.identifiantGIE || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.nomGIE || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.commune || "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: getPresidenteName(gie) }), _jsx("td", { className: "px-4 py-2 text-sm", children: gie.dateCreation ? formatDate(gie.dateCreation) : "N/A" }), _jsx("td", { className: "px-4 py-2 text-sm", children: _jsx("span", { className: `inline-flex text-xs font-medium rounded-full px-2 py-0.5 ${getStatusBadgeClass(gie.statutAdhesion)}`, children: getStatusLabel(gie.statutAdhesion) }) })] }, gie._id))) })] }) }) })), isDeptExpanded && (!dept.gies || dept.gies.length === 0) && (_jsx("div", { className: "px-3 pb-3 text-center text-gray-500 text-sm py-4", children: "Aucun GIE disponible pour ce d\u00E9partement" }))] }, dept.code));
                                        }) }) }))] }, region.code));
                    }) })] }));
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium text-gray-800", children: "P\u00E9riode d'analyse" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => handlePeriodChange('7d'), className: `px-4 py-2 text-sm border border-gray-200 rounded-lg transition-all ${reportTimePeriod === '7d' ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 hover:bg-gray-100'}`, children: "7 jours" }), _jsx("button", { onClick: () => handlePeriodChange('30d'), className: `px-4 py-2 text-sm border border-gray-200 rounded-lg transition-all ${reportTimePeriod === '30d' ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 hover:bg-gray-100'}`, children: "30 jours" }), _jsx("button", { onClick: () => handlePeriodChange('3m'), className: `px-4 py-2 text-sm border border-gray-200 rounded-lg transition-all ${reportTimePeriod === '3m' ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 hover:bg-gray-100'}`, children: "3 mois" }), _jsx("button", { onClick: () => handlePeriodChange('12m'), className: `px-4 py-2 text-sm border border-gray-200 rounded-lg transition-all ${reportTimePeriod === '12m' ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 hover:bg-gray-100'}`, children: "12 mois" })] })] }) }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-gray-100", children: _jsx("h3", { className: "font-medium text-gray-800", children: "Distribution des GIEs par R\u00E9gion et D\u00E9partement" }) }), renderContent()] })] }));
};
export default RegionDepartementReport;
//# sourceMappingURL=RegionDepartementReport.js.map