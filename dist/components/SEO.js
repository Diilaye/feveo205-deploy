import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
const SEO = ({ title = 'FEVEO 2050 | Femme Vision - Plateforme d\'Investissement pour Femmes Entrepreneures', description = 'FEVEO 2050 - Femme Vision : Plateforme d\'investissement et d\'épargne collective pour 365 000 femmes entrepreneures au Sénégal. Rejoignez 27 650 GIE de femmes dans l\'économie organique.', keywords = 'FEVEO 2050, Femme Vision, femmes entrepreneures Sénégal, GIE femmes, investissement femmes', image = '/images/LOGOFEVEO.png', url = '', type = 'website' }) => {
    const siteUrl = 'https://feveo2050.sn';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
    return (_jsxs(Helmet, { children: [_jsx("title", { children: title }), _jsx("meta", { name: "description", content: description }), _jsx("meta", { name: "keywords", content: keywords }), _jsx("link", { rel: "canonical", href: fullUrl }), _jsx("meta", { property: "og:title", content: title }), _jsx("meta", { property: "og:description", content: description }), _jsx("meta", { property: "og:image", content: fullImage }), _jsx("meta", { property: "og:url", content: fullUrl }), _jsx("meta", { property: "og:type", content: type }), _jsx("meta", { property: "og:site_name", content: "FEVEO 2050" }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), _jsx("meta", { name: "twitter:title", content: title }), _jsx("meta", { name: "twitter:description", content: description }), _jsx("meta", { name: "twitter:image", content: fullImage })] }));
};
export default SEO;
//# sourceMappingURL=SEO.js.map