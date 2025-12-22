import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [language, setLanguage] = useState('fr');
    const dropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProgramsDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const navItems = [
        { name: 'Accueil', href: '#accueil', action: () => navigate('/') },
        {
            name: 'Programmes',
            href: '#programme',
            hasDropdown: true,
            submenu: [
                { name: 'Initiative globale Nexus', action: () => navigate('/about') },
                { name: 'Présentation projet AEROBUS', action: () => console.log('AEROBUS presentation') },
                // { name: 'Adhérer AVEC FEVEO', action: () => navigate('/adhesion') },
                // { name: 'Souscrire actions AEROBUS', action: () => console.log('AEROBUS subscription') }
            ]
        },
        { name: 'Adhérer', href: '#adherer', action: () => navigate('/adhesion') },
        { name: 'Investir', href: '#investir', action: () => navigate('/investir') },
        { name: 'Actualités', href: '#actualites', action: () => navigate('/actualites') },
        { name: 'Wallet GIE', href: '#wallet', action: () => navigate('/wallet/login') },
    ];
    const handleNavClick = (item) => {
        if (item.hasDropdown) {
            setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
        }
        else if (item.action) {
            item.action();
            setIsMenuOpen(false);
            setIsProgramsDropdownOpen(false);
        }
    };
    const handleSubmenuClick = (submenuItem) => {
        if (submenuItem.action) {
            submenuItem.action();
        }
        setIsMenuOpen(false);
        setIsProgramsDropdownOpen(false);
    };
    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        navigate('/');
    };
    return (_jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200", children: _jsxs("div", { className: "container-max section-padding", children: [_jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("div", { className: "cursor-pointer", onClick: () => navigate('/'), children: _jsx("img", { src: "/images/LOGOFEVEO.png", alt: "FEVEO 2050", className: "h-12 w-auto object-contain" }) }), _jsx("nav", { className: "hidden lg:flex items-center space-x-8", children: navItems.map((item) => (_jsxs("div", { className: "relative", ref: item.hasDropdown ? dropdownRef : null, children: [_jsxs("button", { onClick: () => handleNavClick(item), className: "flex items-center gap-1 text-neutral-600 hover:text-accent-500 font-medium transition-colors duration-200", children: [item.name, item.hasDropdown && (_jsx(ChevronDown, { className: `w-4 h-4 transition-transform duration-200 ${isProgramsDropdownOpen ? 'rotate-180' : ''}` }))] }), item.hasDropdown && isProgramsDropdownOpen && (_jsx("div", { className: "absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50", children: item.submenu?.map((submenuItem, index) => (_jsx("button", { onClick: () => handleSubmenuClick(submenuItem), className: "w-full text-left px-4 py-2 text-neutral-600 hover:text-accent-500 hover:bg-accent-50 transition-colors duration-200", children: submenuItem.name }, index))) }))] }, item.name))) }), _jsxs("div", { className: "hidden lg:flex items-center space-x-4", children: [_jsxs("button", { onClick: () => setLanguage(language === 'fr' ? 'wo' : 'fr'), className: "flex items-center space-x-1 text-neutral-600 hover:text-accent-500 transition-colors duration-200", children: [_jsx(Globe, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: language === 'fr' ? 'FR' : 'WO' })] }), isAuthenticated ? (_jsxs("div", { className: "relative", ref: userDropdownRef, children: [_jsxs("button", { onClick: () => setIsUserDropdownOpen(!isUserDropdownOpen), className: "flex items-center space-x-2 text-neutral-600 hover:text-accent-500 transition-colors duration-200", children: [_jsx(User, { className: "w-5 h-5" }), _jsx("span", { className: "text-sm font-medium", children: user?.prenom }), _jsx(ChevronDown, { className: `w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}` })] }), isUserDropdownOpen && (_jsxs("div", { className: "absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50", children: [_jsxs("div", { className: "px-4 py-2 border-b border-neutral-200", children: [_jsxs("p", { className: "text-sm font-medium text-neutral-900", children: [user?.prenom, " ", user?.nom] }), _jsx("p", { className: "text-xs text-neutral-500", children: user?.email })] }), _jsx("button", { onClick: () => {
                                                        navigate('/dashboard');
                                                        setIsUserDropdownOpen(false);
                                                    }, className: "w-full text-left px-4 py-2 text-neutral-600 hover:text-accent-500 hover:bg-accent-50 transition-colors duration-200", children: "Tableau de bord" }), _jsxs("button", { onClick: handleLogout, className: "w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center", children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), "D\u00E9connexion"] })] }))] })) : null, _jsx("button", { className: "btn-accent", children: "AEROBUS" })] }), _jsx("button", { onClick: () => setIsMenuOpen(!isMenuOpen), className: "lg:hidden p-2 text-neutral-600 hover:text-accent-500 transition-colors duration-200", children: isMenuOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) })] }), isMenuOpen && (_jsx("div", { className: "lg:hidden py-4 border-t border-neutral-200 animate-fade-in", children: _jsxs("nav", { className: "flex flex-col space-y-3", children: [navItems.map((item) => (_jsxs("div", { children: [_jsxs("button", { onClick: () => handleNavClick(item), className: "flex items-center justify-between w-full text-neutral-600 hover:text-accent-500 font-medium py-2 transition-colors duration-200 text-left", children: [item.name, item.hasDropdown && (_jsx(ChevronDown, { className: `w-4 h-4 transition-transform duration-200 ${isProgramsDropdownOpen ? 'rotate-180' : ''}` }))] }), item.hasDropdown && isProgramsDropdownOpen && (_jsx("div", { className: "ml-4 mt-2 space-y-2", children: item.submenu?.map((submenuItem, index) => (_jsxs("button", { onClick: () => handleSubmenuClick(submenuItem), className: "block w-full text-left text-neutral-500 hover:text-accent-500 py-1 text-sm transition-colors duration-200", children: ["\u2022 ", submenuItem.name] }, index))) }))] }, item.name))), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-neutral-200", children: [_jsxs("button", { onClick: () => setLanguage(language === 'fr' ? 'wo' : 'fr'), className: "flex items-center space-x-1 text-neutral-600 hover:text-accent-500 transition-colors duration-200", children: [_jsx(Globe, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: language === 'fr' ? 'FR' : 'WO' })] }), isAuthenticated ? (_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsxs("span", { className: "text-sm text-neutral-600", children: [user?.prenom, " ", user?.nom] }), _jsxs("button", { onClick: handleLogout, className: "text-red-600 hover:text-red-700 text-sm flex items-center", children: [_jsx(LogOut, { className: "w-4 h-4 mr-1" }), "D\u00E9connexion"] })] })) : null] })] }) }))] }) }));
};
export default Header;
//# sourceMappingURL=Header.js.map