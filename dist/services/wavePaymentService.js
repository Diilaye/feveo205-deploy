// Service Wave pour générer les liens de paiement
// /src/services/wavePaymentService.tsx
class WavePaymentService {
    baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4320/api';
    /**
     * Génère un lien de paiement Wave avec les informations du GIE
     */
    async generatePaymentLink(paymentRequest) {
        try {
            const response = await fetch(`${this.baseUrl}/paiements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    montant: paymentRequest.montant,
                    gieCode: paymentRequest.gieCode,
                    typePaiement: 'investissement',
                })
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Erreur lors de la génération du lien de paiement'
                };
            }
            return {
                success: true,
                paymentUrl: data.paymentUrl,
                transactionId: data.transactionId,
                message: data.message
            };
        }
        catch (error) {
            console.error('Erreur Wave Payment Service:', error);
            return {
                success: false,
                error: 'Erreur de connexion au service de paiement'
            };
        }
    }
    /**
     * Génère un lien de paiement Wave via notre backend (fallback)
     */
    async generateSimplePaymentLink(amount, giePhone) {
        try {
            // Utilisation de notre backend qui gère l'API Wave (évite les problèmes CORS)
            const response = await fetch(`${this.baseUrl}/payments/wave/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    period: 'fallback',
                    gieCode: 'FALLBACK-SIMPLE',
                    giePhone: giePhone,
                    description: `Paiement FEVEO 2050 - ${amount} FCFA`,
                    currency: 'XOF'
                })
            });
            const data = await response.json();
            if (response.ok && data.paymentUrl) {
                console.log('✅ Lien de paiement généré via backend:', data.paymentUrl);
                return data.paymentUrl;
            }
            else {
                console.warn('Backend indisponible, utilisation de l\'URL Wave de base');
                return this.generateBasicWaveUrl(amount, giePhone);
            }
        }
        catch (error) {
            console.error('Erreur génération lien via backend:', error);
            // En cas d'erreur complète, utiliser une URL Wave de base
            return this.generateBasicWaveUrl(amount, giePhone);
        }
    }
    /**
     * Génère une URL Wave de base en dernier recours
     */
    generateBasicWaveUrl(amount, giePhone) {
        // URL Wave générique qui devrait toujours fonctionner
        const baseUrl = 'https://pay.wave.com/quick-pay';
        const params = new URLSearchParams({
            amount: amount.toString(),
            currency: 'XOF'
        });
        if (giePhone) {
            params.append('phone', giePhone);
        }
        console.log('🔄 Utilisation de l\'URL Wave de base:', `${baseUrl}?${params.toString()}`);
        return `${baseUrl}?${params.toString()}`;
    }
    /**
     * Vérifie le statut d'un paiement
     */
    async checkPaymentStatus(transactionId) {
        try {
            const response = await fetch(`${this.baseUrl}/payments/wave/status/${transactionId}`, {
                method: 'GET',
                headers: {}
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: 'error',
                    message: data.message || 'Erreur lors de la vérification du statut'
                };
            }
            return {
                status: data.status,
                message: data.message
            };
        }
        catch (error) {
            console.error('Erreur vérification statut:', error);
            return {
                status: 'error',
                message: 'Erreur de connexion'
            };
        }
    }
}
export const wavePaymentService = new WavePaymentService();
//# sourceMappingURL=wavePaymentService.js.map