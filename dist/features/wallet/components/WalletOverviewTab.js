import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { TrendingUp, DollarSign, Wallet as WalletIcon, Activity, ArrowUpRight, ArrowDownLeft, CreditCard, ExternalLink } from 'lucide-react';
import { TRANSACTION_TABS } from '../constants';
const WalletOverviewTab = ({ walletData, formatCurrency, displayedMonth, monthlyData, goToPreviousMonth, goToNextMonth, goToCurrentMonth, transactionStatusFilter, setTransactionStatusFilter, loadTransactions, transactionsLoading, filteredTransactions, emptyTransactionsMessage, transactions }) => {
    const rawSuccessDays = walletData.gieInfo?.daysInvestedSuccess;
    const successDaysCount = Array.isArray(rawSuccessDays)
        ? rawSuccessDays.length
        : typeof rawSuccessDays === 'number'
            ? Math.max(0, Math.floor(rawSuccessDays))
            : 0;
    const successDaysSet = new Set();
    if (Array.isArray(rawSuccessDays)) {
        rawSuccessDays.forEach((day) => {
            if (typeof day === 'number' && Number.isFinite(day) && day > 0) {
                successDaysSet.add(Math.floor(day));
            }
        });
    }
    else {
        for (let day = 1; day <= successDaysCount; day += 1) {
            successDaysSet.add(day);
        }
    }
    const booleanStatusValue = typeof walletData.gieInfo?.isActive === 'boolean'
        ? walletData.gieInfo.isActive
        : typeof walletData.gieInfo?.active === 'boolean'
            ? walletData.gieInfo.active
            : undefined;
    const normalizedStatus = (() => {
        const rawStatus = walletData.gieInfo?.status ?? walletData.gieInfo?.statut ?? walletData.gieInfo?.etat ?? '';
        if (typeof rawStatus !== 'string') {
            return '';
        }
        const trimmed = rawStatus.trim().toLowerCase();
        try {
            return trimmed
                .normalize('NFD')
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        catch (error) {
            return trimmed;
        }
    })();
    const isGieActive = typeof booleanStatusValue === 'boolean'
        ? booleanStatusValue
        : [normalizedStatus, normalizedStatus.replace(/\s+/g, '')].some((value) => ['active', 'activee', 'actif', 'encours', 'en cours', 'true', 'oui'].includes(value));
    const parseAmount = (value) => {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '.');
            const num = Number.parseFloat(cleaned);
            if (!Number.isNaN(num) && Number.isFinite(num)) {
                return num;
            }
        }
        return 0;
    };
    const successfulTransactions = transactions.filter((tx) => tx.status === 'SUCCESS');
    const successfulInvestments = successfulTransactions.filter((tx) => tx.type === 'investment');
    const successfulAdhesions = successfulTransactions.filter((tx) => tx.type === 'adhesion');
    const totalInvestmentAmount = successfulInvestments.reduce((sum, tx) => sum + parseAmount(tx.amount), 0);
    const totalAdhesionAmount = successfulAdhesions.reduce((sum, tx) => sum + parseAmount(tx.amount), 0);
    const feveo2050InvestmentValue = totalInvestmentAmount;
    const successfulGieTransactions = successfulTransactions.filter((tx) => tx.type === 'other' || (tx.description && tx.description.toLowerCase().includes('gie')));
    const totalGieAmount = successfulGieTransactions.reduce((sum, tx) => sum + parseAmount(tx.amount), 0);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium text-green-600", children: "Avec Investissements (FEVEO2050)" }), _jsx(TrendingUp, { className: "w-5 h-5 text-green-500" })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(feveo2050InvestmentValue) }), _jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Jour ", walletData.cycleInfo.currentDay, "/", walletData.cycleInfo.totalDays] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium text-blue-600", children: "Avec GIE" }), _jsx(TrendingUp, { className: "w-5 h-5 text-blue-500" })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(totalGieAmount) }), _jsxs("p", { className: "text-xs text-green-600 mt-1", children: ["Jour ", walletData.cycleInfo.currentDay, "/", walletData.cycleInfo.totalDays] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium text-orange-600", children: "Revenus" }), _jsx(DollarSign, { className: "w-5 h-5 text-orange-500" })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(0) }), _jsx("p", { className: "text-xs text-green-600 mt-1", children: "0 % rendement" })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-sm font-medium text-blue-600", children: "Solde Total" }), _jsx(WalletIcon, { className: "w-5 h-5 text-blue-500" })] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(walletData.balance.current + walletData.balance.invested + walletData.balance.returns * 0) }), _jsx("p", { className: "text-xs text-green-600 mt-1", children: "+2.5% ce mois" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Calendrier d'investissement" }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Cycle actuel: ", _jsxs("span", { className: "font-medium", children: ["Jour ", walletData.cycleInfo.currentDay] }), " sur ", _jsx("span", { className: "font-medium", children: walletData.cycleInfo.totalDays })] }), _jsx("p", { className: "text-sm text-green-600 font-medium", children: "D\u00E9but du cycle: 1 avril 2025" })] }), _jsxs("div", { className: "mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded", children: ["Progression: ", Math.round((walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100), "% compl\u00E9t\u00E9", _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-1", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${(walletData.cycleInfo.currentDay / walletData.cycleInfo.totalDays) * 100}%` } }) })] })] }), _jsx("div", { className: "p-6", children: (() => {
                                    const currentMonthKey = `${displayedMonth.getFullYear()}-${(displayedMonth.getMonth() + 1)
                                        .toString()
                                        .padStart(2, '0')}`;
                                    let currentMonthData = monthlyData[currentMonthKey];
                                    if (!currentMonthData) {
                                        const firstDay = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
                                        const lastDay = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0);
                                        const startDay = (firstDay.getDay() + 6) % 7;
                                        currentMonthData = {
                                            startDay,
                                            daysInMonth: lastDay.getDate(),
                                            investmentDays: []
                                        };
                                        monthlyData[currentMonthKey] = currentMonthData;
                                    }
                                    const [year, month] = currentMonthKey.split('-');
                                    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('fr-FR', {
                                        month: 'long',
                                        year: 'numeric'
                                    });
                                    return (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("button", { className: "p-2 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-gray-200 transition-colors", onClick: goToPreviousMonth, title: "Mois pr\u00E9c\u00E9dent", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M15 18l-6-6 6-6" }) }) }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("h4", { className: "text-lg font-bold text-gray-900 capitalize text-center", children: monthName }), _jsx("button", { onClick: goToCurrentMonth, className: "text-xs text-primary-600 hover:text-primary-800 mt-1", title: "Aller au mois courant", children: "Aujourd'hui" })] }), _jsx("button", { className: "p-2 rounded-lg text-primary-600 hover:text-primary-800 hover:bg-gray-200 transition-colors", onClick: goToNextMonth, title: "Mois suivant", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M9 18l6-6-6-6" }) }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (_jsx("div", { className: "text-center text-xs font-medium text-gray-500 p-1", children: day }, day))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1 mb-4", children: [Array.from({ length: currentMonthData.startDay }).map((_, index) => (_jsx("div", { className: "h-10" }, `empty-${index}`))), Array.from({ length: currentMonthData.daysInMonth }).map((_, index) => {
                                                        const day = index + 1;
                                                        const dateStr = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                                                        const currentDate = new Date(parseInt(year), parseInt(month) - 1, day);
                                                        const startCycleDate = new Date('2025-04-01');
                                                        const isInCycle = currentDate >= startCycleDate;
                                                        let cycleDay = 0;
                                                        if (isInCycle) {
                                                            const diffTime = currentDate.getTime() - startCycleDate.getTime();
                                                            cycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                                        }
                                                        const isInvestedSuccessfully = isInCycle && successDaysSet.has(cycleDay);
                                                        return (_jsx("div", { className: `h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${!isInCycle
                                                                ? 'bg-gray-100 text-gray-400'
                                                                : isToday
                                                                    ? 'bg-black text-white ring-2 ring-black shadow-lg'
                                                                    : isInvestedSuccessfully
                                                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                                                                        : cycleDay <= walletData.cycleInfo.totalDays
                                                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                            : 'bg-gray-200 text-gray-600'} cursor-pointer`, title: isInCycle
                                                                ? isToday
                                                                    ? `Aujourd'hui - Jour ${cycleDay}`
                                                                    : isInvestedSuccessfully
                                                                        ? `Jour ${cycleDay} - Investissement réussi ✓`
                                                                        : cycleDay <= walletData.cycleInfo.totalDays
                                                                            ? `Jour ${cycleDay}: À venir`
                                                                            : `Hors cycle d'investissement`
                                                                : `Avant le début du cycle d'investissement`, children: day }, day));
                                                    })] }), _jsxs("div", { className: "flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-3 h-3 bg-green-500 rounded shadow-sm" }), _jsx("span", { className: "text-gray-600", children: "Jour investi (6000 FCFA)" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-3 h-3 bg-black rounded ring-1 ring-black" }), _jsx("span", { className: "text-gray-600", children: "Aujourd'hui" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-100 rounded border border-red-300" }), _jsx("span", { className: "text-gray-600", children: "Jours \u00E0 venir" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-3 h-3 bg-gray-100 rounded border border-gray-300" }), _jsx("span", { className: "text-gray-600", children: "Hors cycle" })] })] }), _jsxs("div", { className: "mt-4 p-3 bg-gray-50 border border-gray-200 border-dashed rounded text-center text-xs text-gray-600", children: [_jsxs("p", { children: ["Cycle d'investissement: ", _jsx("span", { className: "font-medium", children: "1er avril 2025" }), " au ", _jsx("span", { className: "font-medium", children: "31 mars 2030" })] }), _jsx("p", { className: "mt-1", children: "1826 jours d'investissement \u00E0 6000 FCFA/jour" })] })] }));
                                })() })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900", children: "Journal des op\u00E9rations du GIE" }), _jsx("p", { className: "text-sm text-gray-500", children: "Filtrez les transactions selon leur statut" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-gray-100 rounded-full p-1 flex", children: TRANSACTION_TABS.map((tab) => (_jsx("button", { onClick: () => setTransactionStatusFilter(tab.id), className: `px-4 py-2 text-sm font-medium rounded-full transition-colors ${transactionStatusFilter === tab.id
                                                            ? tab.id === 'SUCCESS'
                                                                ? 'bg-green-500 text-white shadow'
                                                                : 'bg-yellow-500 text-white shadow'
                                                            : 'text-gray-600 hover:text-gray-800'}`, children: tab.label }, tab.id))) }), _jsxs("button", { onClick: loadTransactions, className: "flex items-center text-sm text-primary-600 hover:text-primary-700", disabled: transactionsLoading, children: [transactionsLoading ? (_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent mr-1" })) : (_jsx(Activity, { className: "w-4 h-4 mr-1" })), "Actualiser"] })] })] }) }), _jsxs("div", { className: "p-6", children: [transactionsLoading && filteredTransactions.length === 0 ? (_jsx("div", { className: "flex justify-center items-center h-40", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" }) })) : filteredTransactions.length === 0 ? (_jsxs("div", { className: "text-center py-6 text-gray-500", children: [_jsx(Activity, { className: "w-12 h-12 mx-auto text-gray-300 mb-3" }), _jsx("p", { children: emptyTransactionsMessage }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Essayez d'actualiser ou de consulter l'autre onglet." })] })) : (_jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto pr-1", children: filteredTransactions.slice(0, 10).map((transaction, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'investment'
                                                                ? 'bg-blue-100'
                                                                : transaction.type === 'adhesion'
                                                                    ? 'bg-amber-100'
                                                                    : 'bg-green-100'}`, children: transaction.type === 'investment' ? (_jsx(ArrowUpRight, { className: "w-5 h-5 text-blue-600" })) : transaction.type === 'adhesion' ? (_jsx(CreditCard, { className: "w-5 h-5 text-amber-600" })) : (_jsx(ArrowDownLeft, { className: "w-5 h-5 text-green-600" })) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center flex-wrap gap-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: transaction.description }), _jsx("span", { className: `ml-1 px-2 py-0.5 text-xs rounded-full ${transaction.status === 'SUCCESS'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : transaction.status === 'PENDING'
                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                    : transaction.status === 'FAILED'
                                                                                        ? 'bg-red-100 text-red-800'
                                                                                        : 'bg-gray-100 text-gray-800'}`, children: transaction.status === 'SUCCESS'
                                                                                ? 'Réussi'
                                                                                : transaction.status === 'PENDING'
                                                                                    ? 'En attente'
                                                                                    : transaction.status === 'FAILED'
                                                                                        ? 'Échoué'
                                                                                        : transaction.status })] }), _jsxs("p", { className: "text-sm text-gray-500", children: [transaction.date && transaction.date !== '' ? (new Date(transaction.date).toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })) : (_jsx("span", { className: "text-gray-400 italic", children: "Date inconnue" })), transaction.method && ` · ${transaction.method}`] })] })] }), _jsxs("div", { className: `font-bold text-lg ${transaction.type === 'investment' || transaction.type === 'adhesion'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'}`, children: [transaction.type === 'investment' || transaction.type === 'adhesion' ? '-' : '+', formatCurrency(transaction.amount)] })] }, transaction.id ?? index))) })), filteredTransactions.length > 0 && transactionsLoading && (_jsx("div", { className: "mt-4 flex justify-center", children: _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent mr-2" }), "Mise \u00E0 jour des transactions..."] }) })), transactions.length > 0 && (_jsx("button", { className: "w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center", onClick: () => alert('Cette fonctionnalité sera disponible prochainement'), disabled: transactionsLoading, children: _jsxs("span", { className: "flex items-center", children: [_jsx(ExternalLink, { className: "w-4 h-4 mr-2" }), "Voir toutes les transactions"] }) }))] })] })] })] }));
};
export default WalletOverviewTab;
//# sourceMappingURL=WalletOverviewTab.js.map