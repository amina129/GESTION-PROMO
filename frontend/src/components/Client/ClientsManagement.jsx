import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import './ClientsManagement.css'
const ClientsManagement = () => {
    // États pour la recherche
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

    // États pour l'affectation
    const [selectedClient, setSelectedClient] = useState(null);
    const [assignmentDates, setAssignmentDates] = useState({
        date_debut: '',
        date_fin: ''
    });
    const [availablePromotions, setAvailablePromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api';

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
            const queryParams = new URLSearchParams();
            Object.entries(searchCriteria).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await fetch(`${API_BASE_URL}/clients/search?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Erreur lors de la recherche");
            const data = await response.json();
            console.log("Données reçues:", data); // Ajoutez cette ligne
            setClients(data.slice(0, 5)); // Affiche uniquement les 5 premiers clients
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailablePromotions = async () => {
        if (!selectedClient) return;

        // Vérifier que les dates sont saisies
        if (!assignmentDates.date_debut || !assignmentDates.date_fin) {
            setError("Veuillez saisir les dates de début et de fin");
            return;
        }

        setLoading(true);
        setError(null); // Réinitialiser l'erreur

        try {
            // Construire l'URL avec les dates
            const url = `${API_BASE_URL}/clients/available?clientId=${selectedClient.id}&dateDebut=${assignmentDates.date_debut}&dateFin=${assignmentDates.date_fin}`;

            console.log("URL appelée:", url); // Pour debug

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            setAvailablePromotions(data);

            // Réinitialiser la sélection de promotion
            setSelectedPromotion(null);

        } catch (err) {
            console.error("Erreur lors du chargement des promotions:", err);
            setError("Erreur lors du chargement des promotions: " + err.message);
            setAvailablePromotions([]); // Vider la liste en cas d'erreur
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
            const response = await fetch(`${API_BASE_URL}/clients/${selectedClient.id}/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    promotion_id: selectedPromotion.id,
                    date_debut: assignmentDates.date_debut,
                    date_fin: assignmentDates.date_fin
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de l'affectation");

            // Réinitialiser après succès
            setSelectedClient(null);
            setError(null);            setSelectedPromotion(null);
            setAssignmentDates({ date_debut: '', date_fin: '' });
            searchClients();
        } catch (err) {
            setError(err.message);
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