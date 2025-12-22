import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa';
const Footer = () => {
    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61581461046662', label: 'Facebook' },
        { icon: FaTiktok, href: 'https://www.tiktok.com/@feveo2050', label: 'TikTok' },
        { icon: Instagram, href: 'https://www.instagram.com/feveo_2050/', label: 'Instagram' },
        { icon: FaYoutube, href: 'https://www.youtube.com/@FeveoTV', label: 'YouTube' },
    ];
    const quickLinks = [
        { name: 'À propos', href: '/about' },
        { name: 'Programme', href: '/#programme' },
        { name: 'Adhérer', href: '/adhesion' },
        { name: 'Investir', href: '/investir' },
        { name: 'Actualités', href: '/actualites' },
        { name: 'FAQ', href: '/faq' },
    ];
    const legalLinks = [
        { name: 'Conditions d\'utilisation', href: '#' },
        { name: 'Politique de confidentialité', href: '#' },
        { name: 'Mentions légales', href: '#' },
    ];
    return (_jsx("footer", { className: "bg-neutral-900 text-neutral-50", children: _jsxs("div", { className: "container-max section-padding py-16", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: [_jsxs("div", { className: "lg:col-span-1", children: [_jsx("div", { className: "mb-6", children: _jsx("img", { src: "/images/LOGOFEVEO.png", alt: "FEVEO 2050", className: "h-16 w-auto object-contain" }) }), _jsx("p", { className: "text-neutral-300 mb-6 leading-relaxed", children: "Pour un investissement dans L'\u00E9conomie organique avec le Leadership f\u00E9minin" }), _jsx("div", { className: "flex space-x-4", children: socialLinks.map((social, index) => (_jsx("a", { href: social.href, target: "_blank", rel: "noopener noreferrer", className: "w-10 h-10 bg-neutral-800 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors duration-200", "aria-label": social.label, children: _jsx(social.icon, { className: "w-5 h-5" }) }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-6", children: "Liens rapides" }), _jsx("ul", { className: "space-y-3", children: quickLinks.map((link, index) => (_jsx("li", { children: _jsx("a", { href: link.href, className: "text-neutral-300 hover:text-accent-400 transition-colors duration-200", children: link.name }) }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-6", children: "Contact" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("a", { href: "https://maps.app.goo.gl/UWbhkznrY5EAduv8A", target: "_blank", rel: "noopener noreferrer", className: "flex items-center space-x-3 hover:text-accent-400 transition-colors duration-200 cursor-pointer", children: [_jsx(MapPin, { className: "w-5 h-5 text-accent-400 flex-shrink-0" }), _jsx("span", { className: "text-neutral-300 hover:text-accent-400", children: "Thies Grand Standing , Thies" })] }), _jsxs("a", { href: "tel:+221766620122", className: "flex items-center space-x-3 hover:text-accent-400 transition-colors duration-200 cursor-pointer", children: [_jsx(Phone, { className: "w-5 h-5 text-accent-400 flex-shrink-0" }), _jsx("span", { className: "text-neutral-300 hover:text-accent-400", children: "76 662 01 22 - 76 622 00 87" })] }), _jsxs("a", { href: "mailto:contact@feveo2050.sn", className: "flex items-center space-x-3 hover:text-accent-400 transition-colors duration-200 cursor-pointer", children: [_jsx(Mail, { className: "w-5 h-5 text-accent-400 flex-shrink-0" }), _jsx("span", { className: "text-neutral-300 hover:text-accent-400", children: "contact@feveo2050.sn" })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold mb-6", children: "Canal Officiel" }), _jsx("div", { className: "flex flex-col space-y-3", children: _jsx("button", { className: "btn-accent", onClick: () => window.location.href = 'https://whatsapp.com/channel/0029VbBRE1CJ3jv37efeB61c', children: "Acceder  \u00E0 FEVEO 2050" }) })] })] }), _jsx("div", { className: "border-t border-neutral-800 mt-12 pt-8", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0", children: [_jsx("p", { className: "text-neutral-400 text-sm", children: "\u00A9 2024 FEVEO 2050. Tous droits r\u00E9serv\u00E9s." }), _jsx("div", { className: "flex flex-wrap gap-6", children: legalLinks.map((link, index) => (_jsx("a", { href: link.href, className: "text-neutral-400 hover:text-accent-400 text-sm transition-colors duration-200", children: link.name }, index))) })] }) })] }) }));
};
export default Footer;
//# sourceMappingURL=Footer.js.map