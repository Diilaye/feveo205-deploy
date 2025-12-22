import apiCall from './api';
// Service Adhésion
export const adhesionService = {
    // Créer une nouvelle adhésion
    async createAdhesion(gieId, adhesionData) {
        return await apiCall(`/gie/${gieId}/adhesion`, {
            method: 'POST',
            body: JSON.stringify(adhesionData),
        });
    },
    // Obtenir toutes les adhésions
    async getAllAdhesions() {
        return await apiCall('/adhesions');
    },
    // Obtenir une adhésion par ID
    async getAdhesionById(id) {
        return await apiCall(`/adhesions/${id}`);
    },
    // Obtenir l'adhésion d'un GIE
    async getAdhesionByGIE(gieId) {
        return await apiCall(`/adhesions/gie/${gieId}`);
    },
    // Mettre à jour le statut de validation
    async updateValidationStatus(id, data) {
        return await apiCall(`/adhesions/${id}/validation`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Mettre à jour le statut de paiement
    async updatePaiementStatus(id, data) {
        return await apiCall(`/adhesions/${id}/paiement`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Obtenir les statistiques des adhésions
    async getAdhesionStats() {
        return await apiCall('/adhesions/stats');
    },
    // Obtenir la progression d'une adhésion
    async getProgression(id) {
        return await apiCall(`/adhesions/${id}/progression`);
    }
};
//# sourceMappingURL=adhesionService.js.map