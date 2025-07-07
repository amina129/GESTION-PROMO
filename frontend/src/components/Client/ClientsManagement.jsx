import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Gift, BarChart3, CheckCircle, User, CreditCard, Award, Loader2, AlertCircle, X } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Service
const apiService = {
    // Search clients
    searchClients: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim()) {
                params.append(key, value);
            }
        });

        const response = await fetch(`${API_BASE_URL}/clients/search?${params}`);
        if (!response.ok) throw new Error('Failed to search clients');
        return response.json();
    },

    // Get client by phone number
    getClient: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}`);
        if (!response.ok) throw new Error('Client not found');
        return response.json();
    },

    // Get client by code
    getClientByCode: async (codeClient) => {
        const response = await fetch(`${API_BASE_URL}/clients/code/${codeClient}`);
        if (!response.ok) throw new Error('Client not found');
        return response.json();
    },

    // Get eligible promotions
    getEligiblePromotions: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/eligible-promotions`);
        if (!response.ok) throw new Error('Failed to fetch eligible promotions');
        return response.json();
    },

    // Get active promotions
    getActivePromotions: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/active-promotions`);
        if (!response.ok) throw new Error('Failed to fetch active promotions');
        return response.json();
    },

    // Update balance
    updateBalance: async (numeroTelephone, montant) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/balance`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ montant }),
        });
        if (!response.ok) throw new Error('Failed to update balance');
        return response.json();
    },

    // Get client balance
    getClientBalance: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/balance`);
        if (!response.ok) throw new Error('Failed to fetch balance');
        return response.json();
    },

    // Get loyalty account
    getLoyaltyAccount: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/loyalty`);
        if (!response.ok) throw new Error('Failed to fetch loyalty account');
        return response.json();
    },
};

const ClientsManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFilters, setSearchFilters] = useState({
        numeroTelephone: '',
        nom: '',
        prenom: '',
        email: '',
        codeClient: '',
        typeAbonnement: '',
        statut: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [eligiblePromotions, setEligiblePromotions] = useState([]);
    const [activePromotions, setActivePromotions] = useState([]);
    const [loyaltyAccount, setLoyaltyAccount] = useState(null);
    const [showPromotions, setShowPromotions] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [balanceUpdate, setBalanceUpdate] = useState('');
    const [clientBalance, setClientBalance] = useState(null);

    // Load clients on component mount
    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.searchClients(searchFilters);
            setClients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        await loadClients();
    };

    const handleFilterChange = (key, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setSearchFilters({
            numeroTelephone: '',
            nom: '',
            prenom: '',
            email: '',
            codeClient: '',
            typeAbonnement: '',
            statut: ''
        });
    };

    const handleClientClick = async (client) => {
        setSelectedClient(client);
        try {
            const [promotions, active, loyalty] = await Promise.all([
                apiService.getEligiblePromotions(client.numeroTelephone),
                apiService.getActivePromotions(client.numeroTelephone),
                apiService.getLoyaltyAccount(client.numeroTelephone).catch(() => null)
            ]);
            setEligiblePromotions(promotions);
            setActivePromotions(active);
            setLoyaltyAccount(loyalty);
        } catch (err) {
            console.error('Error loading client details:', err);
        }
    };

    const handleUpdateBalance = async () => {
        if (!selectedClient || !balanceUpdate) return;

        try {
            await apiService.updateBalance(selectedClient.numeroTelephone, parseFloat(balanceUpdate));
            setBalanceUpdate('');
            // Refresh client data
            await loadClients();
            await handleClientClick(selectedClient);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGetBalance = async (client) => {
        try {
            const balance = await apiService.getClientBalance(client.numeroTelephone);
            setClientBalance(balance);
            setShowBalance(true);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Orange Header */}
            <div className="bg-orange-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">Gestion Clients</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="bg-white text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-50 transition-colors">
                                Tableau de bord
                            </button>
                            <button className="bg-orange-700 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-800 transition-colors">
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recherche de clients</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Numéro de téléphone, nom, prénom..."
                                    value={searchFilters.numeroTelephone}
                                    onChange={(e) => handleFilterChange('numeroTelephone', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtrer
                                </button>
                                <button
                                    onClick={handleSearch}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Rechercher
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 bg-gray-50 p-4 rounded-md">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            value={searchFilters.nom}
                                            onChange={(e) => handleFilterChange('nom', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                        <input
                                            type="text"
                                            value={searchFilters.prenom}
                                            onChange={(e) => handleFilterChange('prenom', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={searchFilters.email}
                                            onChange={(e) => handleFilterChange('email', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Code Client</label>
                                        <input
                                            type="text"
                                            value={searchFilters.codeClient}
                                            onChange={(e) => handleFilterChange('codeClient', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type d'abonnement</label>
                                        <select
                                            value={searchFilters.typeAbonnement}
                                            onChange={(e) => handleFilterChange('typeAbonnement', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        >
                                            <option value="">Tous</option>
                                            <option value="PREPAYE">Prépayé</option>
                                            <option value="POSTPAYE">Postpayé</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                        <select
                                            value={searchFilters.statut}
                                            onChange={(e) => handleFilterChange('statut', e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        >
                                            <option value="">Tous</option>
                                            <option value="ACTIF">Actif</option>
                                            <option value="INACTIF">Inactif</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => (
                        <div
                            key={client.id}
                            onClick={() => handleClientClick(client)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 bg-orange-100 text-orange-800 rounded-full w-10 h-10 flex items-center justify-center font-medium">
                                            {client.nom ? client.nom.charAt(0) : 'N'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{client.nom} {client.prenom}</h3>
                                            <p className="text-sm text-gray-500">{client.numeroTelephone}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        client.segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                            client.segment === 'PROFESSIONNEL' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                        {client.segment || 'Standard'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className={`text-sm font-medium ${
                                            client.typeAbonnement === 'PREPAYE' ? 'text-green-600' : 'text-blue-600'
                                        }`}>
                                            {client.typeAbonnement || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Solde</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {client.solde ? client.solde.toFixed(2) : '0.00'} DT
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Statut</p>
                                        <p className={`text-sm font-medium ${
                                            client.statut === 'ACTIF' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {client.statut || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Code</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {client.codeClient || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedClient(client);
                                            setShowPromotions(true);
                                        }}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        <Gift className="w-3 h-3 mr-1" />
                                        Promotions
                                    </button>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`tel:${client.numeroTelephone}`, '_self');
                                            }}
                                            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGetBalance(client);
                                            }}
                                            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {clients.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                    </div>
                )}

                {/* Promotions Modal */}
                {showPromotions && selectedClient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Promotions pour {selectedClient.nom} {selectedClient.prenom}
                                    </h2>
                                    <button
                                        onClick={() => setShowPromotions(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Eligible Promotions */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                            Promotions Éligibles
                                        </h3>
                                        <div className="space-y-4">
                                            {eligiblePromotions.map(promo => (
                                                <div key={promo.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {promo.nom}
                                                        </h4>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Éligible
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {promo.description}
                                                    </p>
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>Validité: {promo.dureeValidite} jours</span>
                                                        <span>{promo.montantMinimal} DT min</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {eligiblePromotions.length === 0 && (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-500">Aucune promotion éligible</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Promotions */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                            Promotions Actives
                                        </h3>
                                        <div className="space-y-4">
                                            {activePromotions.map(activation => (
                                                <div key={activation.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {activation.promotion?.nom}
                                                        </h4>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Active
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {activation.promotion?.description}
                                                    </p>
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>Activé: {new Date(activation.dateActivation).toLocaleDateString()}</span>
                                                        <span>Expire: {new Date(activation.dateExpiration).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {activePromotions.length === 0 && (
                                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-500">Aucune promotion active</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recharge Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recharger le compte</h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <label htmlFor="recharge-amount" className="sr-only">Montant</label>
                                            <input
                                                type="number"
                                                id="recharge-amount"
                                                placeholder="Montant (DT)"
                                                value={balanceUpdate}
                                                onChange={(e) => setBalanceUpdate(e.target.value)}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handleUpdateBalance}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                        >
                                            Recharger
                                        </button>
                                    </div>
                                </div>

                                {/* Loyalty Account */}
                                {loyaltyAccount && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Compte Fidélité</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Points disponibles</p>
                                                    <p className="text-xl font-semibold text-gray-900">{loyaltyAccount.pointsDisponibles}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Points utilisés</p>
                                                    <p className="text-xl font-semibold text-gray-900">{loyaltyAccount.pointsUtilises}</p>
                                                </div>
                                            </div>
                                            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                                Convertir les points
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Balance Modal */}
                {showBalance && clientBalance && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-md max-w-md w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-900">Solde du compte</h2>
                                    <button
                                        onClick={() => setShowBalance(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Solde actuel:</span>
                                        <span className="text-2xl font-bold text-orange-600">{clientBalance.solde.toFixed(2)} DT</span>
                                    </div>
                                    {clientBalance.derniereRecharge && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Dernière recharge:</span>
                                            <span className="text-gray-900">{new Date(clientBalance.derniereRecharge).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientsManagement;