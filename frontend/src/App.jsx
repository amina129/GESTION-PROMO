import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import TelecomPromotionInterface from "./pages/TelecomPromotionInterface";
import Login from './components/auth/Login';
import Unauthorized from './components/Unauthorized';

function App() {
    return (
        <AuthProvider> {/* No Router here - it's already in index.js */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/telecom" element={<TelecomPromotionInterface />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;