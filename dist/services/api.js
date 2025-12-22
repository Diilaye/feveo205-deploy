// Configuration de base pour les appels API
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4320/api';
// Configuration des headers par défaut
const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (includeAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    return headers;
};
// Fonction utilitaire pour les appels API
const apiCall = async (endpoint, options = {}, includeAuth = true) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders(includeAuth),
            ...options,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erreur API');
        }
        return data;
    }
    catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};
export default apiCall;
//# sourceMappingURL=api.js.map