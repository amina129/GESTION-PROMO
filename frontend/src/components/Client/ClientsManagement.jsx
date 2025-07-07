import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    Phone,
    Gift,
    BarChart3,
    CheckCircle,
    User,
    CreditCard,
    Award,
    Loader2,
    AlertCircle,
    X
} from 'lucide-react';
import styled from 'styled-components';

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

// Styled components with Orange corporate style
const OrangeContainer = styled.div`
  font-family: 'Open Sans', Arial, sans-serif;
  background-color: #f8f8f8;
  color: #333;
`;

const OrangeHeader = styled.div`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 8px;
`;

const OrangeTitle = styled.h1`
  color: #ff7900;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const OrangeSearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const OrangeInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const OrangeButton = styled.button`
  background-color: #ff7900;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e66a00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OrangeTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const OrangeTableHeader = styled.thead`
  background-color: #f5f5f5;
`;

const OrangeTableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e0e0e0;
`;

const OrangeTableRow = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fafafa;
  }
`;

const OrangeTableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
`;

const OrangeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  background-color: ${props => {
    if (props.variant === 'success') return '#e6f4ea';
    if (props.variant === 'warning') return '#fff8e6';
    if (props.variant === 'error') return '#fde8e8';
    if (props.variant === 'info') return '#e6f2ff';
    return '#f0f0f0';
}};
  color: ${props => {
    if (props.variant === 'success') return '#0a7d48';
    if (props.variant === 'warning') return '#b35c00';
    if (props.variant === 'error') return '#d32f2f';
    if (props.variant === 'info') return '#1565c0';
    return '#666';
}};
`;

const OrangeModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const OrangeModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const OrangeModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrangeModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const OrangeModalClose = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  font-size: 20px;

  &:hover {
    color: #666;
  }
`;

const OrangeModalBody = styled.div`
  padding: 20px;
`;

const OrangeSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
`;

const PromotionCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border-color: #ff7900;
  }
`;

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
            <OrangeContainer className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des clients...</p>
                </div>
            </OrangeContainer>
        );
    }

    return (
        <OrangeContainer>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-red-700">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <OrangeHeader>
                    <OrangeTitle>Recherche</OrangeTitle>

                    <OrangeSearchBox>
                        <Search className="text-gray-400 mr-2" size={18} />
                        <OrangeInput
                            type="text"
                            placeholder="Rechercher par numéro, nom, prénom..."
                            value={searchFilters.numeroTelephone}
                            onChange={(e) => handleFilterChange('numeroTelephone', e.target.value)}
                        />
                        <OrangeButton onClick={handleSearch}>
                            <Search size={16} />
                            Rechercher
                        </OrangeButton>
                    </OrangeSearchBox>
                </OrangeHeader>

                {/* Clients Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <OrangeTable>
                            <OrangeTableHeader>
                                <tr>
                                    <OrangeTableHeaderCell>Nom</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Téléphone</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Type</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Segment</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Statut</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Solde</OrangeTableHeaderCell>
                                    <OrangeTableHeaderCell>Actions</OrangeTableHeaderCell>
                                </tr>
                            </OrangeTableHeader>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : clients.length > 0 ? (
                                clients.map((client) => (
                                    <OrangeTableRow key={client.id} onClick={() => handleClientClick(client)}>
                                        <OrangeTableCell>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center font-medium">
                                                    {client.nom ? client.nom.charAt(0) : 'N'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{client.nom} {client.prenom}</div>
                                                    <div className="text-sm text-gray-500">{client.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            <div className="text-sm text-gray-900">{client.numeroTelephone}</div>
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            <OrangeBadge variant={
                                                client.typeAbonnement === 'PREPAYE' ? 'success' : 'info'
                                            }>
                                                {client.typeAbonnement || 'N/A'}
                                            </OrangeBadge>
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            <OrangeBadge variant={
                                                client.segment === 'VIP' ? 'warning' :
                                                    client.segment === 'PROFESSIONNEL' ? 'info' : ''
                                            }>
                                                {client.segment || 'Standard'}
                                            </OrangeBadge>
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            <OrangeBadge variant={
                                                client.statut === 'ACTIF' ? 'success' : 'error'
                                            }>
                                                {client.statut || 'N/A'}
                                            </OrangeBadge>
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            {client.solde ? client.solde.toFixed(2) : '0.00'} DT
                                        </OrangeTableCell>
                                        <OrangeTableCell>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`tel:${client.numeroTelephone}`, '_self');
                                                    }}
                                                    className="text-orange-600 hover:text-orange-800 p-1 rounded"
                                                    title="Appeler"
                                                >
                                                    <Phone className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleGetBalance(client);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                    title="Voir solde"
                                                >
                                                    <CreditCard className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedClient(client);
                                                        setShowPromotions(true);
                                                    }}
                                                    className="text-purple-600 hover:text-purple-800 p-1 rounded"
                                                    title="Promotions"
                                                >
                                                    <Gift className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </OrangeTableCell>
                                    </OrangeTableRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Aucun client ne correspond à vos critères
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </OrangeTable>
                    </div>
                </div>

                {/* Empty State */}
                {clients.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-4">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                    </div>
                )}

                {/* Promotions Modal */}
                {showPromotions && selectedClient && (
                    <OrangeModal>
                        <OrangeModalContent>
                            <OrangeModalHeader>
                                <OrangeModalTitle>
                                    Promotions pour {selectedClient.nom} {selectedClient.prenom}
                                </OrangeModalTitle>
                                <OrangeModalClose onClick={() => setShowPromotions(false)}>
                                    <X size={20} />
                                </OrangeModalClose>
                            </OrangeModalHeader>
                            <OrangeModalBody>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Eligible Promotions */}
                                    <div>
                                        <OrangeSectionTitle>Promotions Éligibles</OrangeSectionTitle>
                                        <div className="space-y-4">
                                            {eligiblePromotions.map(promo => (
                                                <PromotionCard key={promo.id}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {promo.nom}
                                                        </h4>
                                                        <OrangeBadge variant="success">
                                                            Éligible
                                                        </OrangeBadge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {promo.description}
                                                    </p>
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Validité: {promo.dureeValidite} jours</span>
                                                        <span>{promo.montantMinimal} DT min</span>
                                                    </div>
                                                </PromotionCard>
                                            ))}
                                            {eligiblePromotions.length === 0 && (
                                                <p className="text-gray-500 text-center py-4 italic">
                                                    Aucune promotion éligible
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Promotions */}
                                    <div>
                                        <OrangeSectionTitle>Promotions Actives</OrangeSectionTitle>
                                        <div className="space-y-4">
                                            {activePromotions.map(activation => (
                                                <PromotionCard key={activation.id}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {activation.promotion?.nom}
                                                        </h4>
                                                        <OrangeBadge variant="info">
                                                            Active
                                                        </OrangeBadge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {activation.promotion?.description}
                                                    </p>
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Activé: {new Date(activation.dateActivation).toLocaleDateString()}</span>
                                                        <span>Expire: {new Date(activation.dateExpiration).toLocaleDateString()}</span>
                                                    </div>
                                                </PromotionCard>
                                            ))}
                                            {activePromotions.length === 0 && (
                                                <p className="text-gray-500 text-center py-4 italic">
                                                    Aucune promotion active
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Balance Update Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <OrangeSectionTitle>Recharger le compte</OrangeSectionTitle>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="number"
                                            placeholder="Montant (DT)"
                                            value={balanceUpdate}
                                            onChange={(e) => setBalanceUpdate(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <OrangeButton onClick={handleUpdateBalance}>
                                            Recharger
                                        </OrangeButton>
                                    </div>
                                </div>

                                {/* Loyalty Account */}
                                {loyaltyAccount && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <OrangeSectionTitle>Compte Fidélité</OrangeSectionTitle>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Points disponibles:</span>
                                                <span className="font-semibold">{loyaltyAccount.pointsDisponibles}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-600">Points utilisés:</span>
                                                <span className="font-semibold">{loyaltyAccount.pointsUtilises}</span>
                                            </div>
                                            <OrangeButton className="w-full">
                                                Convertir les points
                                            </OrangeButton>
                                        </div>
                                    </div>
                                )}
                            </OrangeModalBody>
                        </OrangeModalContent>
                    </OrangeModal>
                )}

                {/* Balance Modal */}
                {showBalance && clientBalance && (
                    <OrangeModal>
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <OrangeModalHeader>
                                <OrangeModalTitle>Solde du compte</OrangeModalTitle>
                                <OrangeModalClose onClick={() => setShowBalance(false)}>
                                    <X size={20} />
                                </OrangeModalClose>
                            </OrangeModalHeader>
                            <OrangeModalBody>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Solde actuel:</span>
                                        <span className="text-2xl font-bold text-gray-900">{clientBalance.solde.toFixed(2)} DT</span>
                                    </div>
                                    {clientBalance.derniereRecharge && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Dernière recharge:</span>
                                            <span className="text-gray-900">{new Date(clientBalance.derniereRecharge).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </OrangeModalBody>
                        </div>
                    </OrangeModal>
                )}
            </div>
        </OrangeContainer>
    );
};

export default ClientsManagement;