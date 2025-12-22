import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import AppRoutes from './routes/AppRoutes';
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(AdminAuthProvider, { children: _jsx(AppRoutes, {}) }) }) }));
}
export default App;
//# sourceMappingURL=App.js.map