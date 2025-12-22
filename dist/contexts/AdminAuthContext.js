import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
// Création du contexte avec une valeur par défaut
const AdminAuthContext = createContext(undefined);
// Fournisseur de contexte
export const AdminAuthProvider = ({ children }) => {
    const auth = useAdminAuth();
    return (_jsx(AdminAuthContext.Provider, { value: auth, children: children }));
};
// Hook personnalisé pour utiliser le contexte d'authentification admin
export const useAdminAuthContext = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuthContext doit être utilisé avec AdminAuthProvider');
    }
    return context;
};
//# sourceMappingURL=AdminAuthContext.js.map