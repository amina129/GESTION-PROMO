import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TelecomPromotionInterface from "./pages/TelecomPromotionInterface";
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from "./components/HomePage/HomePage";



function App() {

    return (

        <div>
            <Router>
                <Suspense fallback={<div>Chargement...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/telecom" element={<TelecomPromotionInterface />} />
                        <Route path="*" element={<div>404 - Page non trouvée</div>} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
}

export default App;
