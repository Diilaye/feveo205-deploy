import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { TrendingUp, Shield, Target, Award, CheckCircle, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import gieValidationService from './services/gieValidationService';
import { wavePaymentService } from './services/wavePaymentService';
const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3051/api';
const Investir = () => {
    // États simplifiés pour le formulaire d'investissement
    const [currentStep, setCurrentStep] = useState(1);
    const [gieData, setGieData] = useState({
        codeGIE: '',
        presidenteNom: '',
        presidenteEmail: ''
    });
    const [subscriptionData, setSubscriptionData] = useState({
        nombreParts: '',
        montantTotal: 0,
        typeInvestissement: ''
    });
    const [selectedPaymentPeriod, setSelectedPaymentPeriod] = useState('');
    // États pour la validation GIE
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [validatedGIE, setValidatedGIE] = useState(null);
    const [errors, setErrors] = useState({});
    // État pour le processus de paiement
    const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const paymentPeriods = [
        {
            id: 'day1',
            label: 'Paiement Journalier',
            description: 'Investissement quotidien',
            amount: 6000,
            period: '1 jour',
            color: 'bg-green-500'
        },
        {
            id: 'day10',
            label: 'Paiement 10 jours',
            description: 'Investissement pour 10 jours',
            amount: 60000,
            period: '10 jours',
            color: 'bg-blue-500'
        },
        {
            id: 'day15',
            label: 'Paiement 15 jours',
            description: 'Investissement pour 15 jours',
            amount: 90000,
            period: '15 jours',
            color: 'bg-orange-500'
        },
        {
            id: 'day30',
            label: 'Paiement 30 jours',
            description: 'Investissement pour 30 jours',
            amount: 180000,
            period: '30 jours',
            color: 'bg-purple-500'
        }
    ];
    const typesInvestissement = [
        { value: 'production', label: 'Production Agricole', min: 50000, max: 2000000 },
        { value: 'transformation', label: 'Transformation', min: 100000, max: 5000000 },
        { value: 'commerce', label: 'Commerce/Distribution', min: 25000, max: 1000000 },
        { value: 'mixte', label: 'Projet Mixte', min: 75000, max: 3000000 }
    ];
    const advantages = [
        {
            icon: TrendingUp,
            title: 'Rendement Attractif',
            description: 'Des retours sur investissement compétitifs avec une croissance soutenue',
            color: 'text-accent-500'
        },
        {
            icon: Shield,
            title: 'Investissement Sécurisé',
            description: 'Plateforme régulée avec garanties et transparence totale',
            color: 'text-primary-500'
        },
        {
            icon: Target,
            title: 'Impact Social',
            description: 'Contribuez directement à l\'autonomisation des femmes entrepreneures',
            color: 'text-success-500'
        },
        {
            icon: Award,
            title: 'Excellence Reconnue',
            description: 'Plateforme primée par les institutions financières africaines',
            color: 'text-accent-500'
        }
    ];
    const steps = [
        {
            number: '01',
            title: 'Code GIE',
            description: 'Saisissez votre code GIE'
        },
        {
            number: '02',
            title: 'Investissement',
            description: 'Investissement journalier avec Wave'
        }
    ];
    // Fonction pour valider le GIE avant de continuer
    const handleGIEValidation = async () => {
        if (!gieData.codeGIE.trim()) {
            setErrors({ codeGIE: 'Le code GIE est requis' });
            return;
        }
        setIsValidating(true);
        setValidationError(null);
        try {
            const result = await gieValidationService.validateGie(gieData.codeGIE);
            if (result.isValid && result.gie) {
                setValidatedGIE(result.gie);
                setErrors({});
                setCurrentStep(3); // Passer directement au step 3 (paiement)
            }
            else {
                setValidationError(result.error || 'GIE non valide');
            }
        }
        catch (error) {
            console.error('Erreur de validation GIE:', error);
            setValidationError('Erreur de connexion au serveur de validation');
        }
        finally {
            setIsValidating(false);
        }
    };
    // Fonction pour générer et initier le paiement Wave
    const handleWavePayment = async (selectedPeriod) => {
        setIsGeneratingPayment(true);
        setPaymentError(null);
        try {
            // Extraire le nombre de jours à partir de l'ID de la période
            const daysInvested = selectedPeriod.id === 'day1' ? 1 :
                selectedPeriod.id === 'day10' ? 10 :
                    selectedPeriod.id === 'day15' ? 15 : 30;
            // Créer une transaction d'investissement via l'API de transactions
            const transactionResponse = await fetch(`${BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: (6000 * daysInvested) + (6000 * daysInvested * 0.01),
                    method: 'WAVE',
                    gieCode: gieData.codeGIE,
                    operationType: 'INVESTISSEMENT',
                    daysInvested: daysInvested
                })
            });
            const transactionResult = await transactionResponse.json();
            console.log('🔗 Transaction créée:', transactionResult);
            if (transactionResult.status === 'OK' && transactionResult.data) {
                // Récupérer les informations de la transaction créée
                const transaction = transactionResult.data;
                const paymentUrl = transaction.urlWave;
                const transactionId = transaction.reference;
                if (paymentUrl) {
                    // Succès avec l'API de transactions
                    const message = `🎉 Transaction d'investissement créée avec succès !\n\nDétails :\n• Code GIE: ${gieData.codeGIE}\n• Montant: ${selectedPeriod.amount.toLocaleString()} FCFA\n• Période: ${selectedPeriod.period}\n• Transaction ID: ${transactionId}\n\nRedirection vers Wave...`;
                    alert(message);
                    window.open(paymentUrl, '_blank');
                }
                else {
                    // Fallback si le lien de paiement n'est pas disponible
                    console.warn('Lien de paiement non disponible dans la réponse de transaction');
                    // Préparer la requête de paiement via le service Wave fallback
                    const paymentRequest = {
                        montant: selectedPeriod.amount,
                        gieCode: gieData.codeGIE,
                        typePaiement: 'investissement'
                    };
                    const paymentResult = await wavePaymentService.generatePaymentLink(paymentRequest);
                    if (paymentResult.success && paymentResult.paymentUrl) {
                        const message = `🎉 Paiement initié avec succès !\n\nDétails :\n• Code GIE: ${gieData.codeGIE}\n• Montant: ${selectedPeriod.amount.toLocaleString()} FCFA\n• Type: ${selectedPeriod.label}\n• Transaction ID: ${transactionId || paymentResult.transactionId}\n\nRedirection vers Wave...`;
                        alert(message);
                        window.open(paymentResult.paymentUrl, '_blank');
                    }
                    else {
                        throw new Error("Impossible de générer le lien de paiement");
                    }
                }
            }
            else {
                // Fallback avec lien simple en cas d'échec de création de transaction
                console.warn('Échec de création de transaction, utilisation du fallback:', transactionResult.message);
            }
            // Reset du formulaire après redirection
            setTimeout(() => {
                setCurrentStep(1);
                setGieData({ codeGIE: '', presidenteNom: '', presidenteEmail: '' });
                setSubscriptionData({ nombreParts: '', typeInvestissement: '', montantTotal: 0 });
                setSelectedPaymentPeriod('');
                setErrors({});
                setPaymentError(null);
            }, 2000);
        }
        catch (error) {
            console.error('Erreur lors du paiement:', error);
            setPaymentError('Erreur lors de l\'initiation du paiement. Veuillez réessayer.');
        }
        finally {
            setIsGeneratingPayment(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsx(Header, {}), _jsxs("section", { className: "relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-20", children: _jsx("div", { className: "w-full h-full bg-repeat", style: { backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" } }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" }), _jsxs("div", { className: "relative z-10 container-max mx-auto px-6 py-16", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("div", { className: "inline-flex items-center bg-accent-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-accent-400 mr-3" }), _jsx("span", { className: "text-accent-400 font-medium", children: "Investir avec FEVEO 2050" })] }), _jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 leading-tight mb-6", children: ["Comment fonctionne", _jsx("span", { className: "block text-accent-400", children: "l'investissement journalier ?" })] }), _jsxs("p", { className: "text-xl text-neutral-200 max-w-4xl mx-auto leading-relaxed", children: ["FEVEO 2050 r\u00E9volutionne l'investissement des GIEs de femmes avec un syst\u00E8me simple et accessible \u00E0 tous ses membres affili\u00E9s \u00E0 la plateforme d'investissement \u00E9conomie organique. Cette plateforme permet a chaque GIE d'investir une somme de", _jsx("strong", { className: "text-accent-400", children: " 6 060 f.cfa par jour. " }), " Cette somme est constitu\u00E9e d'une \u00E9pargne investissement de 150 f.cfa par membre ."] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16", children: [_jsxs("div", { className: "bg-gradient-to-br from-accent-500/20 to-primary-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mr-4", children: _jsx(Target, { className: "w-8 h-8 text-white" }) }), _jsx("h2", { className: "text-2xl font-bold text-neutral-50", children: "Le Concept" })] }), _jsxs("div", { className: "space-y-4 text-neutral-200", children: [_jsxs("p", { className: "leading-relaxed", children: [_jsx("strong", { className: "text-accent-400", children: "6 060 FCFA/jour" }), "  = un investissement quotidien soutenable qui se transforme en force collective massive."] }), _jsx("p", { className: "leading-relaxed", children: "Chaque jour, votre contribution rejoint un fonds d'investissement international s\u00E9curis\u00E9 avec d'autres investisseurs du monde global pour financer des projets concrets men\u00E9s par des GIEs femmes s\u00E9n\u00E9galaises entrepreneures dans l'\u00E9conomie organique." }), _jsxs("p", { className: "leading-relaxed text-accent-300", children: ["\uD83D\uDCA1 ", _jsx("strong", { children: "L'id\u00E9e :" }), " Rendre structurante l'investissement des GIEs de femmes pour la transformation syst\u00E9mique des potentiels \u00E9conomiques territoriaux, \u00E0 partir d'un co\u00FBt moins on\u00E9reux que l'achat d'un sachet caf\u00E9 Touba vendu \u00E0 250 f.cfa"] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mr-4", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsx("h2", { className: "text-2xl font-bold text-neutral-50", children: "Le M\u00E9canisme" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", children: "1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-50 mb-1", children: "Investissement quotidien" }), _jsx("p", { className: "text-sm text-neutral-300", children: "6 000 FCFA transf\u00E9r\u00E9s automatiquement dans le compte Wave de FEVEO 2050, \u00E0 partir du N\u00B0 PAYMASTER Wave du GIE, indiqu\u00E9 dans la fiche d'adh\u00E9sion et d'affiliation" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", children: "2" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-50 mb-1", children: "Financement de projets" }), _jsx("p", { className: "text-sm text-neutral-300", children: "L'investissement des GIEs FEVEO contribue directement aux leviers financiers d'ordre international qui assurent le financement du projet global \u00E9conomie organique FEVEO 2050 port\u00E9 par les GIEs de femmes." })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm", children: "3" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-neutral-50 mb-1", children: "Retour sur investissement" }), _jsx("p", { className: "text-sm text-neutral-300", children: "Rendements attractifs + impact social mesurable" })] })] })] })] })] }), _jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-neutral-50/20 mb-16", children: [_jsx("h2", { className: "text-2xl font-bold text-neutral-50 text-center mb-8", children: "Vos options d'investissement" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsxs("div", { className: "text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10", children: [_jsx("div", { className: "text-3xl font-bold text-accent-400 mb-2", children: "6 000" }), _jsx("div", { className: "text-neutral-300 text-sm mb-2", children: "FCFA/jour" }), _jsx("div", { className: "text-xs text-neutral-400", children: "Paiement quotidien" })] }), _jsxs("div", { className: "text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10", children: [_jsx("div", { className: "text-3xl font-bold text-blue-400 mb-2", children: "60 000" }), _jsx("div", { className: "text-neutral-300 text-sm mb-2", children: "FCFA/10 jours" }), _jsx("div", { className: "text-xs text-neutral-400", children: "Plus pratique" })] }), _jsxs("div", { className: "text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10", children: [_jsx("div", { className: "text-3xl font-bold text-orange-400 mb-2", children: "90 000" }), _jsx("div", { className: "text-neutral-300 text-sm mb-2", children: "FCFA/15 jours" }), _jsx("div", { className: "text-xs text-neutral-400", children: "\u00C9quilibr\u00E9" })] }), _jsxs("div", { className: "text-center p-6 bg-white/5 rounded-xl border border-neutral-50/10", children: [_jsx("div", { className: "text-3xl font-bold text-purple-400 mb-2", children: "180 000" }), _jsx("div", { className: "text-neutral-300 text-sm mb-2", children: "FCFA/mois" }), _jsx("div", { className: "text-xs text-neutral-400", children: "Plus \u00E9conomique" })] })] }), _jsx("div", { className: "text-center mt-6", children: _jsxs("p", { className: "text-neutral-300 text-sm", children: ["\uD83D\uDCB0 ", _jsx("strong", { children: "Exemple :" }), " En 1 an = 2 211 900 FCFA investis = 365 000 femmes impact\u00E9es"] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-16", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-success-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx(Award, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-neutral-50 mb-3", children: "Impact Direct" }), _jsx("p", { className: "text-neutral-300 text-sm", children: "Chaque FCFA investi participe directement \u00E0 la consolidation et \u00E0 l'\u00E9panouissement \u00E9conomique et financier du pilier de la famille s\u00E9n\u00E9galaise, la femme. Au moins 691 250 familles % seront impact\u00E9s." })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-neutral-50 mb-3", children: "S\u00E9curis\u00E9" }), _jsx("p", { className: "text-neutral-300 text-sm", children: "Plateforme r\u00E9gul\u00E9e, paiements s\u00E9curis\u00E9s Wave, transparence totale sur l'utilisation des fonds" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: _jsx(TrendingUp, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "text-xl font-bold text-neutral-50 mb-3", children: "Rentable" }), _jsx("p", { className: "text-neutral-300 text-sm", children: "Rendements attractifs + impact social + contribution \u00E0 l'\u00E9conomie africaine" })] })] })] })] }), _jsx("section", { className: "py-20 bg-gradient-to-br from-neutral-50 to-neutral-100", children: _jsxs("div", { className: "container-max mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("div", { className: "inline-flex items-center bg-accent-500/10 rounded-full px-4 py-2 mb-4", children: [_jsx(Target, { className: "w-4 h-4 text-accent-600 mr-2" }), _jsx("span", { className: "text-accent-600 text-sm font-medium", children: "Investir maintenant" })] }), _jsx("h2", { className: "text-3xl md:text-4xl font-bold text-neutral-900 mb-6", children: "Investissement simplifi\u00E9" }), _jsx("p", { className: "text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed", children: "Un processus d'investissement en 2 \u00E9tapes simples. Pas de complications, juste l'essentiel." })] }), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-primary-500 to-accent-500 p-6", children: _jsx("div", { className: "text-center mt-4", children: _jsxs("h3", { className: "text-white text-lg font-semibold", children: [currentStep === 1 && "Code GIE", currentStep === 3 && "Investissement journalier"] }) }) }), _jsxs("div", { className: "p-8", children: [currentStep === 1 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold text-neutral-900 mb-2", children: "Code GIE et informations" }), _jsx("p", { className: "text-neutral-600", children: "Saisissez votre code GIE pour continuer" })] }), _jsx("div", { className: "space-y-6 max-w-md mx-auto", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-neutral-700 mb-2", children: "Code GIE *" }), _jsx("input", { type: "text", value: gieData.codeGIE, onChange: (e) => setGieData(prev => ({ ...prev, codeGIE: e.target.value.toUpperCase() })), className: `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors text-center font-mono text-lg ${errors.codeGIE
                                                                        ? 'border-red-300'
                                                                        : gieData.codeGIE.length >= 3
                                                                            ? 'border-green-300'
                                                                            : 'border-neutral-300'}`, placeholder: "Ex: FEVEO-XX-XX-XX-XXX", maxLength: 100 }), errors.codeGIE && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.codeGIE }), validationError && (_jsx("div", { className: "mt-2 p-3 bg-red-50 border border-red-200 rounded-lg", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-red-700 text-sm font-medium", children: "Erreur de validation" }), _jsx("p", { className: "text-red-600 text-sm mt-1", children: validationError }), _jsxs("div", { className: "mt-2 flex space-x-2", children: [_jsx("button", { onClick: handleGIEValidation, className: "text-red-600 text-sm underline hover:no-underline", children: "R\u00E9essayer" }), _jsx("button", { onClick: () => alert("Veuillez contacter le support FEVEO pour assistance."), className: "text-red-600 text-sm underline hover:no-underline", children: "Contacter le support" })] })] })] }) })), validatedGIE && (_jsxs("div", { className: "mt-2 p-3 bg-green-50 border border-green-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-green-700", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "GIE valid\u00E9 avec succ\u00E8s" })] }), _jsxs("p", { className: "text-sm text-green-600 mt-1", children: [validatedGIE.nom, " - ", validatedGIE.localisation] })] }))] }) }), _jsx("div", { className: "flex justify-center pt-6", children: _jsx("button", { onClick: handleGIEValidation, disabled: isValidating || !gieData.codeGIE.trim(), className: "btn-accent px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isValidating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Validation en cours..."] })) : ('Continuer') }) })] })), currentStep === 3 && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx(CheckCircle, { className: "w-16 h-16 text-success-500 mx-auto mb-4" }), _jsx("h3", { className: "text-2xl font-bold text-neutral-900 mb-2", children: "Commencez votre investissement journalier" }), _jsx("p", { className: "text-neutral-600", children: "Investissement quotidien de 6 000 FCFA avec Wave" })] }), _jsxs("div", { className: "bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200 mb-8", children: [_jsx("h4", { className: "text-lg font-bold text-neutral-900 mb-4", children: "R\u00E9capitulatif de votre investissement" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Code GIE:" }), _jsx("span", { className: "font-mono font-bold", children: gieData.codeGIE })] }), validatedGIE && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Nom GIE:" }), _jsx("span", { className: "font-medium", children: validatedGIE.nom })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Localisation:" }), _jsx("span", { className: "text-sm", children: validatedGIE.localisation })] }), validatedGIE.telephone && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "T\u00E9l\u00E9phone:" }), _jsx("span", { className: "font-mono", children: validatedGIE.telephone })] }))] }))] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-neutral-600", children: "Investissement:" }), _jsx("span", { className: "font-medium", children: "Journalier" })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-neutral-600", children: "Montant journalier:" }), _jsx("span", { className: "text-2xl font-bold text-accent-600", children: "6 000 FCFA" })] })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-bold text-neutral-900 mb-8 text-center", children: "Choisissez votre p\u00E9riode d'investissement" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto", children: paymentPeriods.map((period) => {
                                                                    return (_jsxs("button", { onClick: () => setSelectedPaymentPeriod(period.id), className: `p-6 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-lg hover:scale-105 ${selectedPaymentPeriod === period.id
                                                                            ? 'border-accent-500 bg-accent-50 shadow-lg scale-105'
                                                                            : 'border-neutral-200 hover:border-accent-300'}`, children: [_jsx("div", { className: `w-8 h-8 rounded-full ${period.color} mx-auto mb-3` }), _jsx("h5", { className: "font-bold text-neutral-900 mb-2 text-lg", children: period.label }), _jsx("p", { className: "text-neutral-600 mb-3 text-sm", children: period.description }), _jsx("div", { className: "text-2xl font-bold text-accent-600 mb-1", children: period.amount.toLocaleString() }), _jsxs("div", { className: "text-xs text-neutral-500 mb-3", children: ["FCFA \u2022 ", period.period] }), _jsxs("div", { className: "p-3 bg-green-50 rounded-lg border border-green-200", children: [_jsxs("div", { className: "text-xs text-green-800 font-medium mb-1", children: ["\uD83D\uDCB0 ", period.id === 'day1' ? 'Plus flexible' : period.id === 'day30' ? 'Plus économique' : 'Équilibré'] }), _jsxs("div", { className: "text-xs text-green-700", children: [period.id === 'day1' && 'Paiement quotidien', period.id === 'day10' && 'Bon compromis', period.id === 'day15' && 'Paiement bimensuel', period.id === 'day30' && 'Paiement mensuel'] })] })] }, period.id));
                                                                }) })] }), _jsxs("div", { className: "flex justify-between pt-6", children: [_jsx("button", { onClick: () => setCurrentStep(1), className: "btn-secondary px-6 py-3", children: "Retour" }), _jsx("button", { onClick: async () => {
                                                                    if (!selectedPaymentPeriod) {
                                                                        setErrors({ paymentPeriod: 'Veuillez sélectionner le mode d\'investissement' });
                                                                        return;
                                                                    }
                                                                    const selectedPeriod = paymentPeriods.find(p => p.id === selectedPaymentPeriod);
                                                                    if (selectedPeriod) {
                                                                        await handleWavePayment(selectedPeriod);
                                                                    }
                                                                }, disabled: !selectedPaymentPeriod || isGeneratingPayment, className: `px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${selectedPaymentPeriod && !isGeneratingPayment
                                                                    ? 'btn-success'
                                                                    : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'}`, children: isGeneratingPayment ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "G\u00E9n\u00E9ration du paiement..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "w-5 h-5" }), "Payer avec Wave"] })) })] }), paymentError && (_jsxs("div", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-700", children: [_jsx(AlertCircle, { className: "w-5 h-5" }), _jsx("span", { className: "font-medium", children: "Erreur de paiement" })] }), _jsx("p", { className: "text-red-600 mt-1", children: paymentError })] })), errors.paymentPeriod && (_jsx("p", { className: "text-red-500 text-center mt-4", children: errors.paymentPeriod }))] }))] })] }) }), _jsxs("div", { className: "mt-16 text-center", children: [_jsx("p", { className: "text-neutral-500 mb-6", children: "Processus s\u00E9curis\u00E9 et transparent" }), _jsx("div", { className: "flex items-center justify-center gap-8 opacity-60", children: [
                                        { name: 'Paiement sécurisé', icon: Shield },
                                        { name: 'Régulé BCEAO', icon: CheckCircle },
                                        { name: 'Support 24/7', icon: Award }
                                    ].map((trust, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(trust.icon, { className: "w-5 h-5 text-neutral-400" }), _jsx("span", { className: "text-sm text-neutral-500 font-medium", children: trust.name })] }, index))) })] })] }) }), _jsx(Footer, {})] }));
};
export default Investir;
//# sourceMappingURL=Investir.js.map