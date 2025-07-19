import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import authService from '../auth/authService';
import './ClientsManagement.css';

const ClientsManagement = () => {
    // Search states
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

    // Assignment states
    const [selectedClient, setSelectedClient] = useState(null);
    const [assignmentDates, setAssignmentDates] = useState({
        date_debut: '',
        date_fin: ''
    });
    const [availablePromotions, setAvailablePromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const clientCategories = [
        { value: 'VIP', label: 'VIP' },
        { value: 'B2B', label: 'B2B' },
        { value: 'JP', label: 'JP' },
        { value: 'privé', label: 'Privé' }
    ];

    const searchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.api.get('/clients/search', {
                params: searchCriteria
            });
            setClients(response.data.slice(0, 5));
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la recherche");
            if (err.response?.status === 401) {
                // Handle unauthorized (token might be expired)
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const loadAvailablePromotions = async () => {
        if (!selectedClient) return;

        if (!assignmentDates.date_debut || !assignmentDates.date_fin) {
            setError("Veuillez saisir les dates de début et de fin");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authService.api.get('/clients/available', {
                params: {
                    clientId: selectedClient.id,
                    dateDebut: assignmentDates.date_debut,
                    dateFin: assignmentDates.date_fin
                }
            });
            setAvailablePromotions(response.data);
            setSelectedPromotion(null);
        } catch (err) {
            console.error("Erreur lors du chargement des promotions:", err);
            setError(err.response?.data?.message || "Erreur lors du chargement des promotions");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const assignPromotion = async () => {
        if (!selectedClient || !selectedPromotion || !assignmentDates.date_debut || !assignmentDates.date_fin) {
            setError("Veuillez compléter tous les champs");
            return;
        }

        setLoading(true);
        try {
            await authService.api.post(
                `/clients/${selectedClient.id}/promotions`,
                {
                    promotion_id: selectedPromotion.id,
                    date_debut: assignmentDates.date_debut,
                    date_fin: assignmentDates.date_fin
                }
            );

            // Reset after success
            setSelectedClient(null);
            setSelectedPromotion(null);
            setAssignmentDates({ date_debut: '', date_fin: '' });
            setError(null);
            await searchClients();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'affectation");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (field, value) => {
        setSearchCriteria(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (field, value) => {
        setAssignmentDates(prev => ({ ...prev, [field]: value }));
    };

    const getClientCategoryBadge = (category) => {
        switch (category) {
            case 'VIP': return 'vip-badge';
            case 'B2B': return 'b2b-badge';
            case 'JP': return 'jp-badge';
            default: return 'default-badge';
        }
    };
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
                            <td>{client.numero_telephone}</td>
                            <td>{client.email}</td>
                            <td>
                                {client.categorieClient}
                            </td>
                            <td>
                                <button className="button button-secondary" onClick={() => setSelectedClient(client)}>
                                    Affecter promotion
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="empty-message">Aucun client trouvé</div>
            )}

            {/* Modal d'affectation */}
            {selectedClient && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="create-form" style={{
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2>Affecter une promotion à {selectedClient.prenom} {selectedClient.nom}</h2>
                            <button className="button button-secondary" onClick={() => setSelectedClient(null)}>
                                <X />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label>Date de début</label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_debut}
                                    onChange={(e) => handleDateChange('date_debut', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Date de fin</label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_fin}
                                    onChange={(e) => handleDateChange('date_fin', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <button
                                className="button button-primary"
                                onClick={loadAvailablePromotions}
                                disabled={!assignmentDates.date_debut || !assignmentDates.date_fin}
                            >
                                Voir les promotions disponibles
                            </button>
                        </div>

                        {availablePromotions.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ color: '#ff6600', marginBottom: '15px' }}>Promotions disponibles</h3>
                                <div style={{
                                    display: 'grid',
                                    gap: '10px',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {availablePromotions.map(promo => (
                                        <div
                                            key={promo.id}
                                            onClick={() => setSelectedPromotion(promo)}
                                            style={{
                                                padding: '15px',
                                                border: selectedPromotion?.id === promo.id ? '2px solid #ff6600' : '1px solid #ddd',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedPromotion?.id === promo.id ? '#fff9f5' : 'white'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '5px'
                                            }}>
                                                <span style={{ fontWeight: '600' }}>{promo.nom}</span>
                                                {selectedPromotion?.id === promo.id && <Check style={{ color: '#ff6600' }} />}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{promo.description}</div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>Du {promo.date_debut} au {promo.date_fin}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            {selectedClient && error && (
                                <div className="error-message" style={{ marginBottom: '10px' }}>{error}</div>
                            )}

                            <button className="button button-secondary" onClick={() => setSelectedClient(null)}>
                                Annuler
                            </button>
                            <button
                                className="button button-primary"
                                onClick={assignPromotion}
                                disabled={!selectedPromotion || loading}
                            >
                                {loading ? 'En cours...' : 'Valider'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsManagement;