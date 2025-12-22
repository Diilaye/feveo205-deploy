import apiCall from './api';
// Service d'authentification
export const authService = {
    // Connexion
    async login(credentials) {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }, false);
        // Sauvegarder le token
        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },
    // Inscription
    async register(userData) {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }, false);
        // Sauvegarder le token après inscription
        if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },
    // Obtenir le profil
    async getProfile() {
        return await apiCall('/auth/profile');
    },
    // Mettre à jour le profil
    async updateProfile(userData) {
        return await apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },
    // Changer le mot de passe
    async changePassword(data) {
        return await apiCall('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Déconnexion
    async logout() {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
        }
        catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
        finally {
            // Nettoyer le stockage local
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },
    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    },
    // Obtenir l'utilisateur actuel
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        if (!userData || userData === 'undefined') {
            return null;
        }
        try {
            return JSON.parse(userData);
        }
        catch (error) {
            console.error('Erreur lors du parsing de userData:', error);
            localStorage.removeItem('user');
            return null;
        }
    },
    // Obtenir le token
    getToken() {
        return localStorage.getItem('authToken');
    }
};
//# sourceMappingURL=authService.js.map