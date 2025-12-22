import apiCall from './api';
// Service Investissement
export const investissementService = {
    // Créer un nouveau cycle d'investissement
    async createCycle(data) {
        return await apiCall('/investissements/cycles', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Obtenir tous les cycles d'investissement
    async getAllCycles() {
        return await apiCall('/investissements/cycles');
    },
    // Obtenir les cycles actifs
    async getCyclesActifs() {
        return await apiCall('/investissements/cycles?statut=en_cours');
    },
    // Obtenir un cycle par ID
    async getCycleById(id) {
        return await apiCall(`/investissements/cycles/${id}`);
    },
    // Obtenir les cycles d'un GIE
    async getCyclesByGIE(gieId) {
        return await apiCall(`/investissements/gie/${gieId}/cycles`);
    },
    // Investir dans un cycle
    async investir(data) {
        return await apiCall(`/investissements/investir`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Obtenir les investissements d'un utilisateur
    async getMesInvestissements() {
        return await apiCall('/investissements/mes-investissements');
    },
    // Obtenir les statistiques des investissements
    async getInvestissementStats() {
        return await apiCall('/investissements/stats');
    },
    // Calculer les dividendes pour un cycle
    async calculerDividendes(cycleId) {
        return await apiCall(`/investissements/cycles/${cycleId}/dividendes`, {
            method: 'POST',
        });
    },
    // Distribuer les dividendes
    async distribuerDividendes(cycleId, periodeId) {
        return await apiCall(`/investissements/cycles/${cycleId}/dividendes/${periodeId}/distribuer`, {
            method: 'POST',
        });
    },
    // Obtenir l'historique du wallet d'un GIE
    async getWalletHistory(gieId) {
        return await apiCall(`/investissements/gie/${gieId}/wallet/history`);
    },
    // Obtenir le solde du wallet d'un GIE
    async getWalletBalance(gieId) {
        return await apiCall(`/investissements/gie/${gieId}/wallet/balance`);
    },
    // Fermer un cycle d'investissement
    async fermerCycle(cycleId) {
        return await apiCall(`/investissements/cycles/${cycleId}/fermer`, {
            method: 'PUT',
        });
    }
};
//# sourceMappingURL=investissementService.js.map