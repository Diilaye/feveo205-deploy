// Service Admin API
export const adminService = {
    // Obtenir les données du tableau de bord admin
    async getDashboardData() {
        // Utiliser le token admin pour l'authentification
        const token = localStorage.getItem('adminAuthToken');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4320/api'}/admin/dashboard`, {
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }
            return data;
        }
        catch (error) {
            console.error('Erreur API Admin:', error);
            throw error;
        }
    },
    // Obtenir la liste des utilisateurs
    async getUsers() {
        const token = localStorage.getItem('adminAuthToken');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4320/api'}/admin/utilisateurs`, {
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }
            return data;
        }
        catch (error) {
            console.error('Erreur API Admin:', error);
            throw error;
        }
    },
    // Obtenir la liste des GIE
    async getGIEs() {
        const token = localStorage.getItem('adminAuthToken');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4320/api'}/admin/gies`, {
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }
            return data;
        }
        catch (error) {
            console.error('Erreur API Admin:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=adminService.js.map