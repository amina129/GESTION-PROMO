import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TelecomPromotionInterface from "./pages/TelecomPromotionInterface";

function App() {
    return (
        <div>
            <Router>
                <Suspense fallback={<div>Chargement...</div>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/telecom" replace />} />
                        <Route path="/telecom" element={<TelecomPromotionInterface />} />
                        <Route path="*" element={<div>404 - Page non trouvée</div>} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}

export default App;
