// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [identifiants, setIdentifiants] = useState({
        username: '',
        password: ''
    });
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setIdentifiants({
            ...identifiants,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setChargement(true);
        setErreur('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', identifiants);

            // Stocker le jeton JWT dans le localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);

            // Rediriger vers le tableau de bord
            navigate('/dashboard');
        } catch (err) {
            setErreur('Identifiants invalides. Veuillez réessayer.');
            console.error('Erreur de connexion :', err);
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Connexion</h2>

                {erreur && <div className="error-message">{erreur}</div>}

                <div className="form-group">
                    <label>Nom d'utilisateur :</label>
                    <input
                        type="text"
                        name="username"
                        value={identifiants.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        name="password"
                        value={identifiants.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={chargement}>
                    {chargement ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
};

export default Login;
