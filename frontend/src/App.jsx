import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TelecomPromotionInterface from "./pages/TelecomPromotionInterface";
import './styles/App.css';
import './styles/orange-telecom.css';
import './styles/orange-theme.css';
import './styles/luxury-clients.css';

function App() {
    return (
        <div styles className="luxury-app orange-luxury-theme">
            <Router>
                <Suspense fallback={<div className="luxury-loading">Chargement...</div>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/telecom" replace />} />
                        <Route path="/telecom" element={<TelecomPromotionInterface />} />
                        <Route path="*" element={<div className="luxury-error">404 - Page non trouvée</div>} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}

export default App;
