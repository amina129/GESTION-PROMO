import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/telecom');
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        }
    };

    return (
        <div className="login-page">
            {/* Black Navigation Bar */}
            <nav className="login-navbar">
                <div className="navbar-content">
                    <span className="welcome-message">Bienvenue dans l'application de gestion de promotion !</span>
                </div>
            </nav>

            {/* Enhanced Login Container */}
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <div className="logo-container">
                        <img src="/OIP.png" alt="Logo Orange" className="login-logo" />
                    </div>
                    <h2 className="login-title">Identifiez-vous</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-login">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;