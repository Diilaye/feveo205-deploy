import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const PaymentErrorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const reference = params.get('ref');
    const message = params.get('message');
    useEffect(() => {
        const timer = setTimeout(() => {
            window.close();
            // Si la fenêtre ne se ferme pas, rediriger vers l'accueil
            navigate('/', { replace: true });
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        }, children: _jsxs("div", { style: {
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                padding: 32,
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
            }, children: [_jsx("div", { style: { fontSize: 48, color: '#dc3545', marginBottom: 16 }, children: "\u274C" }), _jsx("h2", { style: { color: '#dc3545', margin: 0 }, children: "Paiement \u00E9chou\u00E9" }), _jsx("p", { style: { margin: '16px 0' }, children: message || "La transaction a été annulée ou n'a pas pu être complétée." }), reference && (_jsxs("div", { style: {
                        background: '#f1f1f1',
                        padding: 10,
                        borderRadius: 5,
                        fontFamily: 'monospace',
                        margin: '20px 0',
                    }, children: ["R\u00E9f\u00E9rence : ", reference] })), _jsx("p", { children: "Cette fen\u00EAtre se fermera automatiquement dans 2 secondes..." }), _jsx("div", { style: { width: '100%', height: 6, background: '#e9ecef', borderRadius: 3, marginTop: 20, overflow: 'hidden' }, children: _jsx("div", { style: { height: '100%', width: '100%', background: '#dc3545', animation: 'countdown 2s linear forwards' } }) }), _jsx("style", { children: `
          @keyframes countdown {
            from { width: 100%; }
            to { width: 0%; }
          }
        ` })] }) }));
};
export default PaymentErrorPage;
//# sourceMappingURL=PaymentErrorPage.js.map