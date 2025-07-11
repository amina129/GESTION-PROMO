import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';

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
            setClients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailablePromotions = async () => {
        if (!selectedClient) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/clients/available?clientId=${selectedClient.id}`
            );

            if (!response.ok) throw new Error("Erreur lors du chargement");
            const data = await response.json();
            setAvailablePromotions(data);
        } catch (err) {
            setError(err.message);
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
            setSelectedPromotion(null);
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

    return (
        <div>
            <h1>Gestion des Clients</h1>

            {/* Recherche */}
            <div>
                <h2>Rechercher un client</h2>

                <div>
                    <div>
                        <label>Numéro de téléphone</label>
                        <input
                            type="text"
                            value={searchCriteria.numero_telephone}
                            onChange={(e) => handleSearchChange('numero_telephone', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Prénom</label>
                        <input
                            type="text"
                            value={searchCriteria.prenom}
                            onChange={(e) => handleSearchChange('prenom', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Nom</label>
                        <input
                            type="text"
                            value={searchCriteria.nom}
                            onChange={(e) => handleSearchChange('nom', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={searchCriteria.email}
                            onChange={(e) => handleSearchChange('email', e.target.value)}
                        />
                    </div>
                    <div>
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

                <button onClick={searchClients} disabled={loading}>
                    <Search />
                    {loading ? 'Recherche...' : 'Rechercher'}
                </button>
            </div>

            {error && <div>{error}</div>}

            {loading && clients.length === 0 ? (
                <div>Chargement...</div>
            ) : clients.length > 0 ? (
                <table>
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
                            <td>{client.categorie_client}</td>
                            <td>
                                <button onClick={() => setSelectedClient(client)}>
                                    Affecter promotion
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div>Aucun client trouvé</div>
            )}

            {/* Modal d'affectation */}
            {selectedClient && (
                <div>
                    <div>
                        <div>
                            <h2>Affecter une promotion à {selectedClient.prenom} {selectedClient.nom}</h2>
                            <button onClick={() => setSelectedClient(null)}>
                                <X />
                            </button>
                        </div>

                        <div>
                            <div>
                                <label>Date de début</label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_debut}
                                    onChange={(e) => handleDateChange('date_debut', e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Date de fin</label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_fin}
                                    onChange={(e) => handleDateChange('date_fin', e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={loadAvailablePromotions}
                            disabled={!assignmentDates.date_debut || !assignmentDates.date_fin}
                        >
                            Voir les promotions disponibles
                        </button>

                        {availablePromotions.length > 0 && (
                            <div>
                                <h3>Promotions disponibles</h3>
                                <div>
                                    {availablePromotions.map(promo => (
                                        <div
                                            key={promo.id}
                                            onClick={() => setSelectedPromotion(promo)}
                                        >
                                            <div>
                                                <span>{promo.nom}</span>
                                                {selectedPromotion?.id === promo.id && <Check />}
                                            </div>
                                            <div>{promo.description}</div>
                                            <div>Du {promo.date_debut} au {promo.date_fin}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <button onClick={() => setSelectedClient(null)}>
                                Annuler
                            </button>
                            <button
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