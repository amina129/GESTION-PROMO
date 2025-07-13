import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="container mt-5">
            <div className="alert alert-danger">
                <h4>Accès non autorisé</h4>
                <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                <Link to="/" className="btn btn-primary">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;