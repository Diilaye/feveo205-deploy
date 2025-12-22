import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock, Calendar, User, CheckCircle, DollarSign, Filter, Download, ArrowUpCircle, ArrowDownCircle, RefreshCw, CreditCard, Plus, Edit, } from 'lucide-react';
const TransactionHistory = ({ historique, transactions, activeTab, onTabChange, onTransactionSelect }) => {
    // Fonction pour déterminer l'icône et les couleurs en fonction du type d'action
    const getEventStyle = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('création') || actionLower.includes('creat')) {
            return {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                iconBgColor: 'bg-green-100',
                iconColor: 'text-green-600',
                icon: _jsx(Plus, { className: "w-4 h-4" })
            };
        }
        if (actionLower.includes('modif') || actionLower.includes('update') || actionLower.includes('edit')) {
            return {
                bgColor: 'bg-primary-50',
                borderColor: 'border-primary-200',
                iconBgColor: 'bg-primary-100',
                iconColor: 'text-primary-600',
                icon: _jsx(Edit, { className: "w-4 h-4" })
            };
        }
        if (actionLower.includes('activ') || actionLower.includes('valid')) {
            return {
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                iconBgColor: 'bg-purple-100',
                iconColor: 'text-purple-600',
                icon: _jsx(CheckCircle, { className: "w-4 h-4" })
            };
        }
        // Par défaut
        return {
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            iconBgColor: 'bg-gray-100',
            iconColor: 'text-gray-600',
            icon: _jsx(Clock, { className: "w-4 h-4" })
        };
    };
    // Fonction pour déterminer le style selon le type de transaction
    const getTransactionStyle = (transactionType) => {
        const type = transactionType.toLowerCase();
        if (type.includes('depot') || type.includes('reception')) {
            return {
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                icon: _jsx(ArrowUpCircle, { className: "w-4 h-4" })
            };
        }
        if (type.includes('retrait') || type.includes('paiement')) {
            return {
                bgColor: 'bg-amber-100',
                textColor: 'text-amber-800',
                icon: _jsx(ArrowDownCircle, { className: "w-4 h-4" })
            };
        }
        if (type.includes('transfert')) {
            return {
                bgColor: 'bg-primary-100',
                textColor: 'text-primary-800',
                icon: _jsx(RefreshCw, { className: "w-4 h-4" })
            };
        }
        // Par défaut
        return {
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800',
            icon: _jsx(CreditCard, { className: "w-4 h-4" })
        };
    };
    return (_jsxs("div", { className: "bg-white p-6 shadow-sm rounded-b-xl border-t-0 border border-gray-100", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 flex items-center", children: [_jsx(Clock, { className: "w-5 h-5 mr-2 text-primary-600" }), "Historique du GIE"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "bg-primary-50 text-primary-600 px-3 py-1 rounded-lg text-sm font-medium", children: [historique ? historique.length : 0, " \u00E9v\u00E9nements"] }), _jsxs("span", { className: "bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium", children: [transactions?.filter(t => t.statut === 'succes').length || 0, " transactions"] })] })] }), _jsx("div", { className: "mb-6 border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-6", children: [_jsx("button", { onClick: () => onTabChange('evenements'), className: `pb-3 px-1 ${activeTab === 'evenements'
                                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                                : 'text-gray-500 hover:text-primary-600'}`, children: "\u00C9v\u00E9nements" }), _jsx("button", { onClick: () => onTabChange('transactions'), className: `pb-3 px-1 ${activeTab === 'transactions'
                                ? 'border-b-2 border-purple-500 text-purple-600 font-medium'
                                : 'text-gray-500 hover:text-purple-600'}`, children: "Transactions" })] }) }), activeTab === 'evenements' ? (!historique || historique.length === 0 ? (_jsxs("div", { className: "bg-gray-50 rounded-xl p-12 text-center border border-gray-200", children: [_jsx(Clock, { className: "w-10 h-10 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500 mb-1", children: "Aucun \u00E9v\u00E9nement enregistr\u00E9" }), _jsx("p", { className: "text-sm text-gray-400", children: "L'historique des actions du GIE sera visible ici." })] })) : (_jsx("div", { className: "relative py-6 pl-8 border-l-2 border-primary-200", children: historique.map((item, index) => {
                    const style = getEventStyle(item.action);
                    return (_jsxs("div", { className: "relative mb-8 last:mb-0", children: [_jsx("div", { className: "absolute -left-[41px] w-8 h-8 rounded-full border-2 border-primary-500 bg-white flex items-center justify-center shadow-sm", children: _jsx("div", { className: `w-6 h-6 rounded-full ${style.iconBgColor} ${style.iconColor} flex items-center justify-center`, children: style.icon }) }), _jsxs("div", { className: `${style.bgColor} rounded-lg p-5 shadow-sm border ${style.borderColor} ml-3`, children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3", children: [_jsx("h4", { className: "font-medium text-gray-800 mb-1 sm:mb-0", children: item.action }), _jsxs("div", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs bg-white bg-opacity-60 shadow-sm", children: [_jsx(Calendar, { className: "w-3.5 h-3.5 mr-1.5 text-primary-600" }), _jsxs("span", { children: [new Date(item.date).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(item.date).toLocaleTimeString('fr-FR')] })] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600 mb-2", children: [_jsx(User, { className: "w-4 h-4 mr-1.5 text-gray-500" }), _jsxs("span", { children: ["Effectu\u00E9 par ", item.utilisateur] })] }), item.details && (_jsx("div", { className: "mt-2 p-3 bg-white bg-opacity-60 rounded-md text-sm text-gray-600", children: item.details }))] })] }, index));
                }) }))) : (!transactions || transactions.filter(t => t.statut === 'succes').length === 0 ? (_jsxs("div", { className: "bg-gray-50 rounded-xl p-12 text-center border border-gray-200", children: [_jsx(DollarSign, { className: "w-10 h-10 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500 mb-1", children: "Aucune transaction r\u00E9ussie" }), _jsx("p", { className: "text-sm text-gray-400", children: "Les transactions r\u00E9ussies du GIE seront visibles ici." })] })) : (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "w-4 h-4 text-purple-600" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Transactions r\u00E9ussies" })] }), _jsxs("button", { className: "text-purple-600 hover:text-purple-700 text-sm flex items-center", children: [_jsx(Download, { className: "w-4 h-4 mr-1" }), "Exporter"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-purple-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider", children: "Date" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider", children: "Type" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider", children: "Montant" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider", children: "R\u00E9f\u00E9rence" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider", children: "D\u00E9tails" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: transactions
                                        .filter(transaction => transaction.statut === 'succes')
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((transaction) => {
                                        const style = getTransactionStyle(transaction.type);
                                        return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-700", children: new Date(transaction.date).toLocaleDateString('fr-FR') }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bgColor} ${style.textColor}`, children: [style.icon, _jsx("span", { className: "ml-1.5", children: transaction.type })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "font-semibold text-gray-900", children: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(transaction.montant) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: transaction.reference || '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsx("button", { onClick: () => onTransactionSelect(transaction), className: "text-purple-600 hover:text-purple-800 font-medium", children: "D\u00E9tails" }) })] }, transaction._id));
                                    }) })] }) })] })))] }));
};
export default TransactionHistory;
//# sourceMappingURL=TransactionHistory.js.map