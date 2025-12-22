import apiCall from './api';
// Service d'authentification admin
export const adminAuthService = {
    // Connexion admin
    async login(credentials) {
        const response = await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }, false);
        // Sauvegarder le token admin
        if (response.success && response.data?.token) {
            localStorage.setItem('adminAuthToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.utilisateur));
        }
        return response;
    },
    // Déconnexion admin
    async logout() {
        try {
            // Nettoyer le stockage local admin
            localStorage.removeItem('adminAuthToken');
            localStorage.removeItem('adminUser');
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion admin:', error);
        }
    },
    // Vérifier si l'administrateur est connecté
    isAuthenticated() {
        return !!localStorage.getItem('adminAuthToken');
    },
    // Obtenir l'administrateur actuel
    getCurrentAdmin() {
        const adminData = localStorage.getItem('adminUser');
        if (!adminData || adminData === 'undefined') {
            return null;
        }
        try {
            return JSON.parse(adminData);
        }
        catch (error) {
            console.error('Erreur lors du parsing de adminUser:', error);
            localStorage.removeItem('adminUser');
            return null;
        }
    },
    // Obtenir le token admin
    getToken() {
        return localStorage.getItem('adminAuthToken');
    }
};
//# sourceMappingURL=adminAuthService.js.map