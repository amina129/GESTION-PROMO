import React, { useState } from 'react';
import {Search, X} from 'lucide-react';
import styled from 'styled-components';

const API_BASE_URL = 'http://localhost:8080/api';

const apiService = {
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

    getEligiblePromotions: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/eligible-promotions`);
        if (!response.ok) throw new Error('Failed to fetch eligible promotions');
        return response.json();
    },

    getActivePromotions: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/active-promotions`);
        if (!response.ok) throw new Error('Failed to fetch active promotions');
        return response.json();
    },

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


    // Get loyalty account
    getLoyaltyAccount: async (numeroTelephone) => {
        const response = await fetch(`${API_BASE_URL}/clients/${numeroTelephone}/loyalty`);
        if (!response.ok) throw new Error('Failed to fetch loyalty account');
        return response.json();
    },
};

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
    const [selectedClient, setSelectedClient] = useState(null);
    const [eligiblePromotions, setEligiblePromotions] = useState([]);
    const [activePromotions, setActivePromotions] = useState([]);
    const [loyaltyAccount, setLoyaltyAccount] = useState(null);
    const [showPromotions, setShowPromotions] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [balanceUpdate, setBalanceUpdate] = useState('');
    const [clientBalance, setClientBalance] = useState(null);

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



    return (
        <OrangeContainer>
            <div className="max-w-7xl mx-auto px-4 py-8">
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