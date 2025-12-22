import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from '../../contexts/AdminAuthContext';
import { adminService } from '../../services/adminService';
import '../../styles/AdminDashboard.css';
const AdminDashboard = () => {
    const { admin, isAuthenticated, logout } = useAdminAuthContext();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Rediriger si non authentifié
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, navigate]);
    // Charger les données du tableau de bord
    useEffect(() => {
        if (isAuthenticated) {
            const fetchDashboardData = async () => {
                try {
                    setLoading(true);
                    const response = await adminService.getDashboardData();
                    if (response.success && response.data) {
                        setDashboardData(response.data);
                    }
                    else {
                        setError(response.message || 'Erreur lors du chargement des données');
                    }
                }
                catch (error) {
                    setError(error.message || 'Erreur lors du chargement des données');
                }
                finally {
                    setLoading(false);
                }
            };
            fetchDashboardData();
        }
    }, [isAuthenticated]);
    if (!isAuthenticated || !admin) {
        return null;
    }
    return (_jsxs("div", { className: "admin-dashboard", children: [_jsxs("header", { className: "admin-header", children: [_jsx("div", { className: "admin-logo", children: "FEVEO 2050 | Administration" }), _jsxs("div", { className: "admin-user-info", children: [_jsxs("span", { children: [admin.prenom, " ", admin.nom] }), _jsx("button", { onClick: logout, className: "logout-button", children: "D\u00E9connexion" })] })] }), _jsxs("div", { className: "admin-content", children: [_jsx("div", { className: "admin-sidebar", children: _jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { href: "/admin/dashboard", children: "Tableau de bord" }) }), _jsx("li", { children: _jsx("a", { href: "/admin/users", children: "Utilisateurs" }) }), _jsx("li", { children: _jsx("a", { href: "/admin/gie", children: "Gestion GIE" }) }), _jsx("li", { children: _jsx("a", { href: "/admin/investissements", children: "Investissements" }) }), _jsx("li", { children: _jsx("a", { href: "/admin/rapports", children: "Rapports" }) }), _jsx("li", { children: _jsx("a", { href: "/admin/configuration", children: "Configuration" }) })] }) }) }), _jsxs("main", { className: "admin-main", children: [_jsx("h1", { children: "Tableau de bord administrateur" }), _jsxs("p", { children: ["Bienvenue, ", admin.prenom, " ", admin.nom, "!"] }), loading ? (_jsx("div", { className: "loading-indicator", children: "Chargement des donn\u00E9es..." })) : error ? (_jsx("div", { className: "error-message", children: error })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "admin-stats", children: [_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Utilisateurs" }), _jsx("p", { className: "stat-value", children: dashboardData?.stats.utilisateurs || 0 })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "GIE" }), _jsx("p", { className: "stat-value", children: dashboardData?.stats.gies || 0 })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Investissements" }), _jsx("p", { className: "stat-value", children: dashboardData?.stats.investissements || 0 })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "Transactions" }), _jsx("p", { className: "stat-value", children: dashboardData?.stats.transactions || 0 })] })] }), _jsxs("section", { className: "admin-recent-activity", children: [_jsx("h2", { children: "Utilisateurs r\u00E9cents" }), dashboardData?.recent.utilisateurs && dashboardData.recent.utilisateurs.length > 0 ? (_jsx("ul", { className: "activity-list", children: dashboardData.recent.utilisateurs.map((user, index) => (_jsxs("li", { children: [user.prenom, " ", user.nom, " (", user.email, ") - ", user.role] }, index))) })) : (_jsx("p", { children: "Aucun utilisateur r\u00E9cent \u00E0 afficher." }))] }), _jsxs("section", { className: "admin-recent-activity", children: [_jsx("h2", { children: "GIE r\u00E9cents" }), dashboardData?.recent.gies && dashboardData.recent.gies.length > 0 ? (_jsx("ul", { className: "activity-list", children: dashboardData.recent.gies.map((gie, index) => (_jsxs("li", { children: [gie.nomGIE, " (", gie.identifiantGIE, ")"] }, index))) })) : (_jsx("p", { children: "Aucun GIE r\u00E9cent \u00E0 afficher." }))] })] }))] })] })] }));
};
export default AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map