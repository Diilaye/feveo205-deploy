import apiCall from './api';
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4320/api';
// Service GIE
export const gieService = {
    // Créer un nouveau GIE
    async createGIE(gieData) {
        return await apiCall('/gie', {
            method: 'POST',
            body: JSON.stringify(gieData),
        });
    },
    // Obtenir tous les GIE
    async getAllGIE() {
        return await apiCall('/gie');
    },
    // Obtenir un GIE par ID
    async getGIEById(id) {
        return await apiCall(`/gie/${id}`);
    },
    // Mettre à jour un GIE
    async updateGIE(id, gieData) {
        return await apiCall(`/gie/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gieData),
        });
    },
    // Supprimer un GIE
    async deleteGIE(id) {
        return await apiCall(`/gie/${id}`, {
            method: 'DELETE',
        });
    },
    // Obtenir les statistiques des GIE
    async getGIEStats() {
        return await apiCall('/gie/stats');
    },
    // Obtenir le prochain numéro de protocole
    async getNextProtocol() {
        return await apiCall('/gie/next-protocol');
    },
    // Obtenir les statistiques publiques (sans authentification)
    async getStatsPubliques() {
        const response = await fetch(`${API_BASE_URL}/gie/stats-publiques`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Erreur lors de la récupération des statistiques');
        }
        return result.data;
    },
    // Enregistrer un GIE publiquement (sans authentification)
    async enregistrerGIE(gieData) {
        const response = await fetch(`${API_BASE_URL}/gie/enregistrer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gieData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Enregistrement GIE result success:', result.success);
        console.log('Enregistrement GIE result message:', result.message);
        console.log('Enregistrement GIE result data:', result.data);
        if (!result.success) {
            throw new Error(result.message || 'Erreur lors de l\'enregistrement du GIE');
        }
        return result;
    },
    // Obtenir les GIEs en attente de paiement (admin seulement)
    async getGIEsEnAttentePaiement() {
        return await apiCall('/gie/en-attente-paiement');
    },
    // Obtenir les GIEs en attente (méthode publique pour les administrateurs)
    async getGIEsEnAttente() {
        const response = await fetch(`${API_BASE_URL}/gie/en-attente`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Erreur lors de la récupération des GIEs en attente');
        }
        return result.data;
    },
    // Valider le paiement d'un GIE (admin seulement)
    async validerPaiementGIE(id, paiementData) {
        return await apiCall(`/gie/${id}/valider-paiement`, {
            method: 'POST',
            body: JSON.stringify(paiementData),
        });
    }
};
//# sourceMappingURL=gieService.js.map