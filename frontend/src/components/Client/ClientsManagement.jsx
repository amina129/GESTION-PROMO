import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search } from 'lucide-react';
import authService from '../auth/authService';
import ClientPromotionPage from './ClientPromotionPage';
import './ClientsManagement.css';

const ClientsManagement = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        numero_telephone: '',
        prenom: '',
        nom: '',
        email: '',
        categorie_client: ''
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientCategories, setClientCategories] = useState([]);

    const [currentView, setCurrentView] = useState('search');
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await authService.api.get('/categories-client');
                // Transform response if needed
                const options = response.data.map(cat => ({
                    value: cat.id,   // <-- envoyer l'id numérique (ex: 4)
                    label: cat.libelle
                }));

                setClientCategories(options);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories:", error);
            }
        };

        fetchCategories();
    }, []);

    const searchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.api.get('/clients/search', {
                params: searchCriteria
            });

            console.log('Response data:', response.data);
            console.log('Premier client:', response.data[0]);

            setClients(response.data.slice(0, 5));
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setCurrentView('promotion');
    };

    const handleBackToSearch = () => {
        setCurrentView('search');
        setSelectedClient(null);
        setError(null);
    };

    const handleSearchChange = (field, value) => {
        setSearchCriteria(prev => ({ ...prev, [field]: value }));
    };

    if (currentView === 'promotion' && selectedClient) {
        return (
            <ClientPromotionPage
                client={selectedClient}
                onBack={handleBackToSearch}
            />
        );
    }

    return (
        <div className="promotions-container">
            {/* Recherche */}
            <div className="search-section">
                <h2>Rechercher un client</h2>

                <div className="search-fields">
                    <div className="search-field">
                        <label>Numéro de téléphone</label>
                        <input
                            type="text"
                            value={searchCriteria.numero_telephone}
                            onChange={(e) => handleSearchChange('numero_telephone', e.target.value)}
                        />
                    </div>
                    <div className="search-field">
                        <label>Prénom</label>
                        <input
                            type="text"
                            value={searchCriteria.prenom}
                            onChange={(e) => handleSearchChange('prenom', e.target.value)}
                        />
                    </div>
                    <div className="search-field">
                        <label>Nom</label>
                        <input
                            type="text"
                            value={searchCriteria.nom}
                            onChange={(e) => handleSearchChange('nom', e.target.value)}
                        />
                    </div>
                    <div className="search-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={searchCriteria.email}
                            onChange={(e) => handleSearchChange('email', e.target.value)}
                        />
                    </div>
                    <div className="search-field">
                        <label>Catégorie</label>
                        <select
                            value={searchCriteria.categorie_client}
                            onChange={(e) => handleSearchChange('categorie_client', e.target.value)}
                        >
                            <option value="">Toutes catégories</option>
                            {clientCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>

                    </div>
                </div>

                <div className="search-actions">
                    <button className="button button-primary" onClick={searchClients} disabled={loading}>
                        <Search className="button-icon" />
                        {loading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && clients.length === 0 ? (
                <div className="loading-message">Chargement...</div>
            ) : clients.length > 0 ? (
                <table className="results-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Catégorie</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.prenom} {client.nom}</td>
                            <td>{client.numeroTelephone}</td>
                            <td>{client.email}</td>
                            <td>
                                {client.categorieClient?.libelle || 'N/A'}
                                {/* Or display code if preferred: */}
                                {/* {client.categorieClient?.code || 'N/A'} */}
                            </td>
                            <td>
                                <button className="buttonpromo" onClick={() => handleClientSelect(client)}>
                                    promo
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="empty-message">Aucun client trouvé</div>
            )}
        </div>
    );
};

export default ClientsManagement;