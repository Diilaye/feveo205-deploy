const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3051/api';
// Helper pour récupérer le token de session
const getSessionToken = () => {
    return localStorage.getItem('walletSession');
};
// Helper pour définir le token de session
export const setSessionToken = (token) => {
    localStorage.setItem('walletSession', token);
};
// Helper pour supprimer le token de session
export const removeSessionToken = () => {
    localStorage.removeItem('walletSession');
};
// Helper pour créer les headers avec authentification
const getAuthHeaders = () => {
    const token = getSessionToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};
export const walletApi = {
    async fetchWalletInfo(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/info/${gieCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération des informations wallet: ${response.status} - ${errorText}`);
        }
        return response.json();
    },
    async fetchTransactions(gieCode, sessionToken, signal) {
        const url = `${API_BASE_URL}/transactions?gieCode=${gieCode}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': sessionToken ? `Bearer ${sessionToken}` : '',
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la récupération des transactions: ${response.status} - ${errorText}`);
        }
        return response.json();
    },
    async fetchMembers(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/members/${gieCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des membres: ${response.status}`);
        }
        return response.json();
    },
    async fetchMembersStats(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/members/${gieCode}/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des statistiques des membres: ${response.status}`);
        }
        return response.json();
    },
    async addMember(gieCode, payload, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/members/${gieCode}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Une erreur est survenue lors de l\'ajout du membre');
        }
        return data;
    },
    async updateMember(gieCode, memberId, payload, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/members/${gieCode}/${memberId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Une erreur est survenue lors de la mise à jour du membre');
        }
        return data;
    },
    async deleteMember(gieCode, memberId, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/members/${gieCode}/${memberId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Une erreur est survenue lors de la suppression du membre');
        }
        return data;
    },
    async fetchDocuments(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/documents/${gieCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des documents: ${response.status}`);
        }
        return response.json();
    },
    async downloadDocument(gieCode, documentType) {
        const response = await fetch(`${API_BASE_URL}/wallet/documents/${gieCode}/${documentType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement du document ${documentType}`);
        }
        return response.blob();
    },
    async createTransaction(payload, signal) {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            },
            body: JSON.stringify(payload),
            signal
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Une erreur est survenue lors de la création de la transaction');
        }
        return data;
    },
    // ============================================
    // SESSION MANAGEMENT
    // ============================================
    async fetchSessions(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/${gieCode}/sessions`, {
            method: 'GET',
            headers: getAuthHeaders(),
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des sessions: ${response.status}`);
        }
        return response.json();
    },
    async disconnectSession(gieCode, sessionId, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/${gieCode}/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la déconnexion de la session: ${response.status}`);
        }
        return response.json();
    },
    async disconnectAllSessions(gieCode, signal) {
        const response = await fetch(`${API_BASE_URL}/wallet/${gieCode}/sessions/all`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            signal
        });
        if (!response.ok) {
            throw new Error(`Erreur lors de la déconnexion de toutes les sessions: ${response.status}`);
        }
        return response.json();
    }
};
export const walletDocumentNames = {
    statuts: 'Statuts',
    reglementInterieur: 'Règlement Intérieur',
    procesVerbal: 'Procès-Verbal',
    demandeAdhesion: 'Demande d\'adhésion'
};
export const formatWalletDocumentFileName = (gieCode, documentType) => {
    switch (documentType) {
        case 'statuts':
            return `Statuts_GIE_${gieCode}.pdf`;
        case 'reglementInterieur':
            return `Reglement_Interieur_GIE_${gieCode}.pdf`;
        case 'procesVerbal':
            return `Proces_Verbal_GIE_${gieCode}.pdf`;
        case 'demandeAdhesion':
            return `Demande_Adhesion_GIE_${gieCode}.pdf`;
        default:
            return `Document_GIE_${gieCode}.pdf`;
    }
};
//# sourceMappingURL=walletApi.js.map