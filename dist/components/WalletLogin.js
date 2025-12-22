import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, MessageCircle, Hash, ArrowLeft, Shield, CheckCircle, CreditCard, ExternalLink } from 'lucide-react';
import { setSessionToken } from '../features/wallet/services/walletApi';
const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3051/api';
const WalletLogin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('gie-code');
    const [gieCode, setGieCode] = useState('');
    const [whatsappCode, setWhatsappCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [backupCode, setBackupCode] = useState('');
    const [whatsappFailed, setWhatsappFailed] = useState(false);
    const [paymentRequired, setPaymentRequired] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const handleGieCodeSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/wallet/verify-gie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gieCode }),
            });
            const data = await response.json();
            console.log('Données GIE:', data);
            if (data.success) {
                // Vérifier si le statut d'enregistrement n'est pas validé
                if (data.data.gieInfo && data.data.gieInfo.statutEnregistrement !== 'valide') {
                    console.log('GIE non validé, création d\'une transaction d\'adhésion');
                    try {
                        // Initialisation d'une transaction d'adhésion
                        const transactionResponse = await fetch(`${BASE_URL}/transactions`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                amount: 20200, // Montant des frais d'adhésion
                                method: 'WAVE', // Méthode de paiement par défaut
                                gieCode: gieCode, // Code du GIE
                                operationType: 'ADHESION' // Type d'opération pour l'adhésion
                            })
                        });
                        const transactionResult = await transactionResponse.json();
                        if (transactionResult.status === 'OK' && transactionResult.data) {
                            // Mettre à jour les données de paiement avec la nouvelle transaction
                            setPaymentRequired(true);
                            setPaymentData({
                                ...data.data,
                                payment: {
                                    ...data.data.payment,
                                    transactionId: transactionResult.data.reference,
                                    paymentUrl: transactionResult.data.paymentInfo?.links?.payment
                                }
                            });
                            setStep('whatsapp-code'); // Afficher l'interface de paiement
                            return;
                        }
                        else {
                            setError(transactionResult.message || 'Erreur lors de la création de la transaction d\'adhésion');
                            setIsLoading(false);
                            return;
                        }
                    }
                    catch (transactionError) {
                        console.error('Erreur création transaction:', transactionError);
                        setError('Erreur lors de la création de la transaction d\'adhésion. Veuillez réessayer.');
                        setIsLoading(false);
                        return;
                    }
                }
                // Vérifier si un paiement est requis (cas standard)
                if (data.requiresPayment) {
                    setPaymentRequired(false);
                    // setPaymentData(data.data);
                    setStep('whatsapp-code'); // Utiliser l'étape 2 pour afficher le paiement
                    setError(''); // Nettoyer les erreurs
                    return;
                }
                setWhatsappNumber(data.data.whatsappNumber || '+221 7X XXX XX XX');
                setStep('whatsapp-code');
                // Gérer l'affichage du code selon presidenteEmail
                if (data.data.emailSent) {
                    // GIE avec email : envoyer par email sans afficher le code
                    setError(`Code de vérification envoyé par email à ${data.data.email || 'votre adresse'}`);
                }
                else if (data.data.whatsappSent && data.data.backupCode) {
                    // GIE sans email : envoyer par WhatsApp ET afficher le code
                    setBackupCode(data.data.backupCode);
                    setWhatsappFailed(true);
                    setError(`Code envoyé par WhatsApp. Le code est aussi affiché ci-dessous.`);
                }
                else if (data.data.showCode && data.data.backupCode) {
                    // Échec d'envoi : afficher le code de secours
                    setBackupCode(data.data.backupCode);
                    setWhatsappFailed(true);
                    setError(`Utilisez le code affiché ci-dessous pour vous connecter.`);
                }
            }
            else {
                setError(data.message || 'Code GIE invalide. Veuillez vérifier et réessayer.');
            }
        }
        catch (error) {
            setError('Erreur de connexion. Veuillez réessayer.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleWhatsappCodeSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/wallet/verify-whatsapp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gieCode, whatsappCode }),
            });
            const data = await response.json();
            if (data.success) {
                // Stocker les données du wallet pour le dashboard
                localStorage.setItem('walletData', JSON.stringify(data.data.wallet));
                // Utiliser le helper pour stocker le token de session
                setSessionToken(data.data.sessionToken);
                navigate('/wallet/dashboard');
            }
            else {
                // Gérer les différents types d'erreurs
                if (data.message?.includes('expiré') || data.message?.includes('invalide')) {
                    setError('Le code a expiré ou est invalide. Cliquez sur "Renvoyer le code" pour en générer un nouveau.');
                }
                else if (data.message?.includes('Code WhatsApp invalide')) {
                    setError('Code incorrect. Vérifiez le code à 6 chiffres et réessayez.');
                }
                else {
                    setError(data.message || 'Erreur de vérification. Veuillez réessayer.');
                }
            }
        }
        catch (error) {
            // En cas d'erreur de connexion, gérer automatiquement avec code de secours
            setWhatsappFailed(true);
            const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
            setBackupCode(tempCode);
            setError('Erreur de connexion ou code expiré. Utilisez le code de secours affiché ci-dessous ou recommencez avec votre code GIE.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const resendWhatsappCode = async () => {
        setIsLoading(true);
        setError('');
        setWhatsappFailed(false);
        try {
            const response = await fetch(`${BASE_URL}/wallet/resend-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gieCode }),
            });
            const data = await response.json();
            if (data.success) {
                // Gérer l'affichage du code selon presidenteEmail
                if (data.data.emailSent) {
                    // GIE avec email : envoyer par email sans afficher le code
                    setError(`Code renvoyé par email à ${data.data.email || 'votre adresse'}`);
                }
                else if (data.data.whatsappSent && data.data.backupCode) {
                    // GIE sans email : envoyer par WhatsApp ET afficher le code
                    setWhatsappFailed(true);
                    setBackupCode(data.data.backupCode);
                    setError(`Code renvoyé par WhatsApp. Le code est aussi affiché ci-dessous.`);
                }
                else if (data.data.showCode && data.data.backupCode) {
                    // Échec d'envoi : afficher le code de secours
                    setWhatsappFailed(true);
                    setBackupCode(data.data.backupCode);
                    setError(`Utilisez le code affiché ci-dessous pour vous connecter.`);
                }
            }
            else {
                setError('Erreur lors du renvoi du code');
            }
        }
        catch (error) {
            setWhatsappFailed(true);
            // Générer un code temporaire en cas d'erreur de connexion
            const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
            setBackupCode(tempCode);
            setError('Erreur de connexion. Utilisez le code temporaire affiché ci-dessous.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center p-4 relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("div", { className: "absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" }), _jsx("div", { className: "absolute top-40 right-20 w-72 h-72 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000" }), _jsx("div", { className: "absolute -bottom-8 left-40 w-72 h-72 bg-success-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-4000" })] }), _jsxs("div", { className: "relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg", children: _jsx(Wallet, { className: "w-10 h-10 text-white" }) }), _jsx("div", { className: "absolute -top-1 -right-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full p-1", children: _jsx(Shield, { className: "w-4 h-4 text-white" }) })] }) }), _jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3", children: step === 'gie-code' ? 'Wallet FEVEO 2050' : 'Vérification Sécurisée' }), _jsx("p", { className: "text-neutral-600 leading-relaxed", children: step === 'gie-code'
                                    ? 'Accédez à votre portefeuille numérique sécurisé avec votre code GIE'
                                    : 'Confirmez votre identité avec le code reçu par WhatsApp' })] }), _jsx("div", { className: "flex items-center justify-center mb-8", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'gie-code'
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                                        : 'bg-success-500 text-white'}`, children: step === 'whatsapp-code' ? _jsx(CheckCircle, { className: "w-4 h-4" }) : '1' }), _jsx("div", { className: `w-16 h-1 rounded-full ${step === 'whatsapp-code' ? 'bg-success-500' : 'bg-neutral-200'}` }), _jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'whatsapp-code'
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                                        : 'bg-neutral-200 text-neutral-500'}`, children: "2" })] }) }), error && (_jsx("div", { className: `border-l-4 px-4 py-3 rounded-r-lg mb-6 ${error.includes('Code de secours') || error.includes('temporaire') || whatsappFailed
                            ? 'bg-amber-50 border-amber-400 text-amber-800'
                            : error.includes('succès')
                                ? 'bg-success-50 border-success-400 text-success-800'
                                : 'bg-red-50 border-red-400 text-red-700'}`, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: error.includes('Code de secours') || error.includes('temporaire') || whatsappFailed ? (_jsx(Shield, { className: "w-5 h-5 text-amber-500 mt-0.5" })) : error.includes('succès') ? (_jsx(CheckCircle, { className: "w-5 h-5 text-success-500 mt-0.5" })) : (_jsx("div", { className: "w-5 h-5 bg-red-400 rounded-full flex items-center justify-center mt-0.5", children: _jsx("span", { className: "text-white text-xs font-bold", children: "!" }) })) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm leading-relaxed", children: error }) })] }) })), step === 'gie-code' ? (_jsxs("form", { onSubmit: handleGieCodeSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-neutral-700 mb-3", children: "Code d'Identification GIE" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-4 top-1/2 transform -translate-y-1/2", children: _jsx(Hash, { className: "text-primary-500 w-5 h-5" }) }), _jsx("input", { type: "text", required: true, value: gieCode, onChange: (e) => setGieCode(e.target.value.toUpperCase()), className: "w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 uppercase tracking-wider text-lg font-mono transition-all duration-200 bg-neutral-50/50", placeholder: "FEVEO-XX-XX-XX-XX-XXX", pattern: "FEVEO-\\d{2}-\\d{2}-\\d{2}-\\d{2}-\\d{3}" })] }), _jsxs("div", { className: "text-xs text-neutral-500 mt-2 flex items-center", children: [_jsx("div", { className: "w-2 h-2 bg-primary-400 rounded-full mr-2" }), "Format attendu : FEVEO-01-01-01-01-001"] })] }), _jsx("button", { type: "submit", disabled: isLoading || gieCode.length < 19, className: "w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5", children: isLoading ? (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" }), _jsx("span", { children: "V\u00E9rification..." })] })) : (_jsxs(_Fragment, { children: [_jsx(MessageCircle, { className: "w-5 h-5 mr-3" }), "Envoyer code WhatsApp"] })) })] })) : (_jsx("div", { className: "space-y-6", children: paymentRequired ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 p-6 rounded-xl", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx("div", { className: "bg-amber-500 p-3 rounded-full", children: _jsx(CreditCard, { className: "w-6 h-6 text-white" }) }) }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "font-bold text-amber-800 text-lg mb-2", children: "Paiement d'activation requis" }), _jsxs("p", { className: "text-amber-700 mb-4", children: ["Votre GIE ", _jsx("strong", { children: paymentData?.gieInfo?.nom }), " n\u00E9cessite un paiement d'activation pour acc\u00E9der au wallet."] }), error && (_jsx("div", { className: "bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4", children: _jsx("p", { className: "text-red-700 text-sm", children: error }) })), _jsxs("div", { className: "bg-white/70 border-2 border-amber-300 rounded-lg p-4 mb-4", children: [_jsxs("div", { className: "text-2xl font-bold text-amber-900 mb-2", children: [paymentData?.payment?.amount?.toLocaleString(), " FCFA"] }), _jsx("p", { className: "text-sm text-amber-700", children: "Frais d'adh\u00E9sion FEVEO 2050" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: async () => {
                                                                setIsLoading(true);
                                                                setError('');
                                                                try {
                                                                    console.log('Création de la transaction...');
                                                                    // Créer une transaction d'adhésion
                                                                    const response = await fetch(`${BASE_URL}/transactions`, {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            amount: 20200, // Montant des frais d'adhésion
                                                                            method: 'WAVE', // Méthode de paiement par défaut
                                                                            gieCode: gieCode, // Code du GIE
                                                                            operationType: 'ADHESION' // Type d'opération pour l'adhésion
                                                                        })
                                                                    });
                                                                    const result = await response.json();
                                                                    console.log('Résultat création transaction:', result);
                                                                    if (result.status === 'OK' && result.data) {
                                                                        // Mettre à jour les données de paiement
                                                                        const fallbackUrl = result.data.urlWave;
                                                                        window.open(fallbackUrl, '_blank');
                                                                    }
                                                                    else {
                                                                        setError(result.message || 'Erreur lors de la création de la transaction');
                                                                    }
                                                                }
                                                                catch (error) {
                                                                    console.error('Erreur transaction:', error);
                                                                    setError('Erreur de connexion. Veuillez réessayer.');
                                                                }
                                                                finally {
                                                                    setIsLoading(false);
                                                                }
                                                            }, disabled: isLoading, className: "w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-xl hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-500/30 flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed", children: [isLoading ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" })) : (_jsx(CreditCard, { className: "w-5 h-5 mr-3" })), "Payer avec Wave", _jsx(ExternalLink, { className: "w-4 h-4 ml-2" })] }), _jsxs("p", { className: "text-xs text-amber-600", children: ["Transaction ID: ", paymentData?.payment?.transactionId] })] })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-neutral-600 mb-4", children: "Apr\u00E8s avoir effectu\u00E9 le paiement, revenez ici et cliquez sur \"V\u00E9rifier le paiement\"" }), _jsxs("button", { onClick: async () => {
                                                // Fonction pour vérifier le paiement
                                                setIsLoading(true);
                                                try {
                                                    // Vérifier si nous avons une transaction créée localement
                                                    const transactionId = paymentData?.payment?.transactionId;
                                                    if (!transactionId) {
                                                        setError('Aucune transaction à vérifier. Veuillez créer un paiement d\'abord.');
                                                        setIsLoading(false);
                                                        return;
                                                    }
                                                    // Vérifier le statut de la transaction
                                                    const response = await fetch(`${BASE_URL}/wallet/confirm-payment`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            transactionId: transactionId,
                                                            gieCode: gieCode
                                                        })
                                                    });
                                                    const result = await response.json();
                                                    if (result.success) {
                                                        setError('');
                                                        setPaymentRequired(false);
                                                        // Relancer la vérification GIE pour obtenir le code WhatsApp
                                                        handleGieCodeSubmit({ preventDefault: () => { } });
                                                    }
                                                    else {
                                                        setError(result.message || 'Paiement non confirmé. Veuillez vérifier votre transaction.');
                                                    }
                                                }
                                                catch (error) {
                                                    console.error('Erreur vérification:', error);
                                                    setError('Erreur lors de la vérification du paiement.');
                                                }
                                                finally {
                                                    setIsLoading(false);
                                                }
                                            }, disabled: isLoading, className: "bg-gradient-to-r from-success-600 to-success-700 text-white py-3 px-6 rounded-xl hover:from-success-700 hover:to-success-800 focus:outline-none focus:ring-4 focus:ring-success-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 mx-auto", children: [isLoading ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" })) : (_jsx(CheckCircle, { className: "w-5 h-5 mr-3" })), "V\u00E9rifier le paiement"] })] }), _jsx("div", { className: "text-center pt-4 border-t border-neutral-100", children: _jsxs("button", { onClick: () => {
                                            setStep('gie-code');
                                            setPaymentRequired(false);
                                            setPaymentData(null);
                                            setError('');
                                        }, className: "text-neutral-600 hover:text-primary-600 font-semibold flex items-center justify-center mx-auto transition-all duration-200 px-4 py-2 rounded-lg hover:bg-neutral-50", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Retour au code GIE"] }) })] })) : (_jsxs("div", { className: "space-y-6", children: [whatsappFailed ? (_jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 p-5 rounded-xl", children: [_jsx("div", { className: "flex items-center justify-center mb-3", children: _jsx("div", { className: "bg-amber-500 p-2 rounded-full", children: _jsx(Shield, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-semibold text-amber-800 mb-2", children: "Code de s\u00E9curit\u00E9 temporaire" }), _jsx("p", { className: "text-amber-700 text-sm mb-4", children: "L'envoi par WhatsApp a \u00E9chou\u00E9. Utilisez ce code :" }), _jsx("div", { className: "bg-white/70 border-2 border-amber-300 rounded-lg p-4 mb-3", children: _jsx("div", { className: "text-3xl font-mono font-bold text-amber-900 tracking-[0.3em]", children: backupCode || '------' }) }), _jsx("p", { className: "text-xs text-amber-600", children: "Saisissez ce code dans le champ ci-dessous" })] })] })) : (_jsxs("div", { className: "bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 p-5 rounded-xl", children: [_jsx("div", { className: "flex items-center justify-center mb-3", children: _jsx("div", { className: "bg-success-500 p-2 rounded-full", children: _jsx(MessageCircle, { className: "w-5 h-5 text-white" }) }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-semibold text-success-800 mb-1", children: "Code envoy\u00E9 avec succ\u00E8s" }), _jsxs("p", { className: "text-success-700 text-sm", children: ["V\u00E9rifiez votre WhatsApp au ", _jsx("span", { className: "font-mono font-bold", children: whatsappNumber })] }), backupCode && (_jsxs("div", { className: "mt-3 pt-3 border-t border-success-200", children: [_jsx("p", { className: "text-xs text-success-600 mb-2", children: "Code de secours :" }), _jsx("div", { className: "bg-white/70 border border-success-300 rounded px-3 py-1 inline-block", children: _jsx("span", { className: "font-mono font-bold text-success-800", children: backupCode }) })] }))] })] })), _jsxs("form", { onSubmit: handleWhatsappCodeSubmit, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-neutral-700 mb-3", children: "Code de v\u00E9rification WhatsApp" }), _jsx("input", { type: "text", required: true, value: whatsappCode, onChange: (e) => setWhatsappCode(e.target.value.replace(/\D/g, '').slice(0, 6)), className: "w-full px-4 py-5 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-center text-2xl tracking-[0.5em] font-mono font-bold transition-all duration-200 bg-neutral-50/50", placeholder: "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022", maxLength: 6 }), _jsx("p", { className: "text-xs text-neutral-500 mt-2 text-center", children: "Saisissez le code \u00E0 6 chiffres re\u00E7u par WhatsApp" })] }), _jsxs("div", { className: "mt-6 flex space-x-3", children: [_jsxs("button", { type: "button", onClick: () => setStep('gie-code'), className: "flex-1 bg-neutral-100 text-neutral-700 py-4 px-4 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-neutral-300/30 flex items-center justify-center font-semibold transition-all duration-200 border-2 border-neutral-200", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Retour"] }), _jsx("button", { type: "submit", disabled: isLoading || whatsappCode.length !== 6, className: "flex-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[140px]", children: isLoading ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" })) : ('Accéder au Wallet') })] })] }), _jsxs("div", { className: "text-center pt-4 border-t border-neutral-100 space-y-3", children: [_jsxs("div", { className: "flex justify-center space-x-4", children: [_jsx("button", { onClick: resendWhatsappCode, disabled: isLoading, className: "text-primary-600 hover:text-primary-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200", children: "Renvoyer le code" }), _jsx("button", { onClick: () => {
                                                        setStep('gie-code');
                                                        setWhatsappCode('');
                                                        setBackupCode('');
                                                        setWhatsappFailed(false);
                                                        setError('');
                                                    }, className: "text-amber-600 hover:text-amber-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-200", children: "Recommencer" })] }), !whatsappFailed && (_jsx("div", { children: _jsx("button", { onClick: () => {
                                                    setWhatsappFailed(true);
                                                    // Générer un code de secours si pas déjà disponible
                                                    if (!backupCode) {
                                                        const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
                                                        setBackupCode(tempCode);
                                                    }
                                                    setError('Code de secours affiché. Utilisez-le si vous ne recevez pas le message WhatsApp.');
                                                }, className: "block text-amber-600 hover:text-amber-800 font-medium text-xs px-3 py-1 rounded hover:bg-amber-50 transition-all duration-200 mx-auto", children: "Probl\u00E8me avec WhatsApp ? Afficher le code de secours" }) })), whatsappFailed && (_jsx("div", { children: _jsx("button", { onClick: () => {
                                                    setWhatsappFailed(false);
                                                    setError('');
                                                    resendWhatsappCode();
                                                }, className: "block text-success-600 hover:text-success-800 font-medium text-xs px-3 py-1 rounded hover:bg-success-50 transition-all duration-200 mx-auto", children: "R\u00E9essayer l'envoi WhatsApp" }) }))] })] })) })), _jsxs("div", { className: "mt-8 text-center pt-6 border-t border-neutral-100", children: [_jsxs("button", { onClick: () => navigate('/'), className: "text-neutral-600 hover:text-primary-600 font-medium text-sm transition-colors duration-200 flex items-center justify-center mx-auto", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Retour \u00E0 l'accueil"] }), step === 'gie-code' && (_jsx("div", { className: "mt-4", children: _jsx("button", { onClick: () => navigate('/forgot-password'), className: "text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-200", children: "Mot de passe oubli\u00E9 ?" }) }))] })] })] }));
};
export default WalletLogin;
//# sourceMappingURL=WalletLogin.js.map