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

// Main Component
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
            <div className=" justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="luxury-clients-app orange-luxury-theme">

            <div className="max-w-7xl mx-auto">
                {/* Error Display */}
                {error && (
                    <div >
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div >
                    <div style={{backgroundColor: '#1a1a1a', color: '#f5f5f5', padding: '24px', borderRadius: '8px', textAlign: 'center', display: 'block', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(212, 175, 55, 0.2)', background: 'linear-gradient(145deg, #222222, #1a1a1a)'}}>
                        <div >
                            <label style={{color: '#AB5914', textAlign: 'center', display: 'block', fontSize: '1.25rem', fontWeight: '500', letterSpacing: '0.5px', marginBottom: '20px', textTransform: 'uppercase', fontFamily: '"Playfair Display", serif'}}>                                Recherche rapide</label>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', marginBottom: '24px'}}>
                                <Search style={{color: 'beige'}} />
                                <input
                                    style={{backgroundColor :'beige', color:'black' , width: '40%' , height: '30px'}}
                                    type="text"
                                    placeholder="Numéro de téléphone, nom, prénom..."
                                    value={searchFilters.numeroTelephone}
                                    onChange={(e) => handleFilterChange('numeroTelephone', e.target.value)}
                                />
                            </div>
                        </div>
                        <div  style={{background: 'transparent', cursor: 'pointer', fontFamily: '"Montserrat", sans-serif'}}>
                            <button style={{background: 'transparent', border: '1px solid #D4AF37', color: 'white', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', fontFamily: '"Montserrat", sans-serif'}} onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Filter className="w-4 h-4" />Filtrer
                            </button >
                            <button  style={{
                                background: 'transparent',
                                color: '#D4AF37',
                                padding: '12px 24px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: '1px solid #FFFFFF',
                                textTransform: 'uppercase',
                                fontFamily: '"Montserrat", sans-serif'
                            }}
                                onClick={handleSearch}
                                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                <Search className="w-4 h-4" />
                                Rechercher
                            </button>
                        </div>
                    </div>
1
                    {/* Advanced Filters */}
                    {showFilters && (
                        <div >
                            <div>
                                <div>
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        value={searchFilters.nom}
                                        onChange={(e) => handleFilterChange('nom', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label >Prénom</label>
                                    <input
                                        type="text"
                                        value={searchFilters.prenom}
                                        onChange={(e) => handleFilterChange('prenom', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label >Email</label>
                                    <input
                                        type="email"
                                        value={searchFilters.email}
                                        onChange={(e) => handleFilterChange('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Code Client</label>
                                    <input
                                        type="text"
                                        value={searchFilters.codeClient}
                                        onChange={(e) => handleFilterChange('codeClient', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label >Type d'abonnement</label>
                                    <select
                                        value={searchFilters.typeAbonnement}
                                        onChange={(e) => handleFilterChange('typeAbonnement', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Tous</option>
                                        <option value="PREPAYE">Prépayé</option>
                                        <option value="POSTPAYE">Postpayé</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                                    <select
                                        value={searchFilters.statut}
                                        onChange={(e) => handleFilterChange('statut', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Effacer les filtres
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                1
                {/* Clients Grid */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
                    {clients.map(client => (
                        <div key={client.id} onClick={() => handleClientClick(client)}  style={{background: 'rgba(30, 30, 30, 0.8)', borderRadius: '12px', padding: '24px', cursor: 'pointer', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.35)', transition: 'all 0.3s ease', color: 'white'}} >
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                    <div style={{width: '48px', height: '48px', background: 'linear-gradient(135deg, #D4AF37, #F4E5C2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: '600',  fontSize: '18px'}}>
                                        {client.nom ? client.nom.split(' ').map(n => n[0]).join('') : 'N/A'}
                                    </div>
                                    <div>
                                        <div >{client.nom} {client.prenom}</div>
                                        <div  style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)'}}>{client.numeroTelephone}</div>
                                    </div>
                                </div>
                                <span style={{display: 'inline-flex', alignItems: 'center', padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '999px', background: client.segment === 'VIP' ? 'rgba(212, 175, 55, 0.2)' : client.segment === 'PROFESSIONNEL' ? 'rgba(0, 100, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                                    color: client.segment === 'VIP' ? '#D4AF37' :
                                        client.segment === 'PROFESSIONNEL' ? '#6495ED' :
                                            'rgba(255,255,255,0.8)', border: client.segment === 'VIP' ? '1px solid rgba(212, 175, 55, 0.5)' :
                                        client.segment === 'PROFESSIONNEL' ? '1px solid rgba(0, 100, 255, 0.5)' :
                                            '1px solid rgba(255,255,255,0.2)'
                                }}
                                >   {client.segment || 's'}
                </span>
                            </div>

                            <div style={{display: 'grid', gap: '12px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span  style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)'}}>Type :</span>
                                    <span
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            borderRadius: '999px',
                                            background: client.typeAbonnement === 'PREPAYE' ? 'rgba(0, 200, 100, 0.2)' : 'rgba(0, 100, 255, 0.2)',
                                            color: client.typeAbonnement === 'PREPAYE' ? '#00C853' : '#6495ED',
                                            border: client.typeAbonnement === 'PREPAYE' ? '1px solid rgba(0, 200, 100, 0.5)' : '1px solid rgba(0, 100, 255, 0.5)'
                                        }}>{client.typeAbonnement || 'N/A'}
                                    </span>
                                </div>

                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} >
                                    <span className="text-sm text-gray-600">Solde :</span>
                                    <span className="font-semibold">{client.solde ? client.solde.toFixed(2) : '0.00'} DT</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Statut :</span>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                            client.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                    <CheckCircle className="w-3 h-3 mr-1" />
                                        {client.statut || 'N/A'}
                  </span>
                                </div>
                            </div>

                            <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <button onClick={(e) => {e.stopPropagation();setSelectedClient(client);setShowPromotions(true);}} style={{background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', fontWeight: '600', transition: 'all 0.3s ease'}}                                >
                                    Voir Promotions
                                </button>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`tel:${client.numeroTelephone}`, '_self');
                                        }}
                                        style={{padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}                                    >
                                        <Phone style={{color: 'white', width: '16px', height: '16px'}} />
                                    </button>
                                    <button
                                        onClick={(e) => {e.stopPropagation();handleGetBalance(client);}}
                                        style={{padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}                                    >
                                        <CreditCard style={{color: 'white', width: '16px', height: '16px'}} />                    </button>
                                    <button
                                        style={{padding: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedClient(client);
                                            setShowPromotions(true);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Gift style={{color: 'white', width: '16px', height: '16px'}} />                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {clients.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                    </div>
                )}

                {/* Promotions Modal */}
                {showPromotions && selectedClient && (
                    <div style={{position: 'fixed', inset: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: '50', backdropFilter: 'blur(4px)'}}>
                        <div style={{backgroundColor: 'rgba(30, 30, 30, 0.95)', borderRadius: '12px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)'}}>
                            <div style={{padding: '24px', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', position: 'sticky', top: '0', backgroundColor: 'rgba(30, 30, 30, 0.95)', zIndex: '10'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <h2 style={{fontSize: '20px', fontWeight: '600', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Promotions pour {selectedClient.nom} {selectedClient.prenom}</h2>
                                    <button onClick={() => setShowPromotions(false)} style={{color: 'rgba(255,255,255,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'all 0.2s ease'}} onMouseEnter={(e) => {e.currentTarget.style.color = '#D4AF37';e.currentTarget.style.transform = 'rotate(90deg)';}} onMouseLeave={(e) => {e.currentTarget.style.color = 'rgba(255,255,255,0.6)';e.currentTarget.style.transform = 'rotate(0deg)';}}>
                                        <X style={{ width: '24px', height: '24px' }} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '24px', '@media (min-width: 1024px)': {gridTemplateColumns: 'repeat(2, 1fr)'}}}>
                                    {/* Promotion Cards - Example structure */}
                                    <div style={{backgroundColor: 'rgba(40, 40, 40, 0.7)', borderRadius: '8px', padding: '20px', border: '1px solid rgba(212, 175, 55, 0.2)', transition: 'all 0.3s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#D4AF37';e.currentTarget.style.transform = 'translateY(-2px)';}} onMouseLeave={(e) => {e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';e.currentTarget.style.transform = 'translateY(0)';}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                                            <h3 style={{fontSize: '16px', fontWeight: '600', color: '#D4AF37'}}>
                                                Promotion VIP
                                            </h3>
                                            <span style={{padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '999px', background: 'rgba(0, 200, 100, 0.2)', color: '#00C853', border: '1px solid rgba(0, 200, 100, 0.5)'}}>
                                                Active
                                            </span>
                                        </div>
                                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px'}}>
                                            20% de réduction sur tous les services premium pour les clients VIP.
                                        </p>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>
                                                Valide jusqu'au 31/12/2023
                                            </span>
                                            <button style={{background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease'}} onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';}} onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';}}>Appliquer</button>
                                        </div>
                                    </div>

                                    {/* Eligible Promotions */}
                                    <div>
                                        <h3  style={{fontSize: '18px', fontWeight: '500', color: '#D4AF37', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Promotions Éligibles</h3>
                                        <div style={{ display: 'grid', gap: '12px' }}>{eligiblePromotions.map(promo => (
                                                <div key={promo.id} style={{border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', padding: '16px', background: 'rgba(40, 40, 40, 0.7)', transition: 'all 0.3s ease'}}>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                                                        <h4 style={{fontWeight: '500', color: 'white', fontSize: '16px'}}>
                                                            >{promo.nom}
                                                        </h4>
                                                        <span style={{fontSize: '12px', background: 'rgba(0, 200, 100, 0.2)', color: '#00C853', padding: '4px 8px', borderRadius: '999px', border: '1px solid rgba(0, 200, 100, 0.5)'}}>
                                                            Éligible
                                                        </span>
                                                    </div>
                                                    <p style={{fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', lineHeight: '1.5'     }}>
                                                            {promo.description}
                                                    </p>
                                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px'}}>
                                                        <span>Validité: {promo.dureeValidite} jours</span>
                                                        <span >{promo.montantMinimal} DT min</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {eligiblePromotions.length === 0 && (
                                                <p style={{color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '16px', fontStyle: 'italic'}}>Aucune promotion éligible</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Promotions */}
                                    <div>
                                        <h3  style={{
                                            fontSize: '18px',
                                            fontWeight: '500',
                                            color: '#D4AF37',
                                            marginBottom: '16px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                                            paddingBottom: '8px'
                                        }}>
                                            Promotions Actives</h3>
                                        <div style={{ display: 'grid', gap: '12px' }}>{activePromotions.map(activation => (
                                                <div key={activation.id}  style={{border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', padding: '16px', background: 'rgba(40, 40, 40, 0.7)', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'}}>
                                                    <div >
                                                        <h4  style={{fontWeight: '500', color: 'white', fontSize: '16px', maxWidth: '70%'}} >
                                                            {activation.promotion?.nom}
                                                        </h4>
                                                        <span   style={{fontSize: '12px', background: 'rgba(0, 100, 255, 0.2)', color: '#6495ED', padding: '4px 8px', borderRadius: '999px', border: '1px solid rgba(0, 100, 255, 0.5)', whiteSpace: 'nowrap'}} >
                                                            Active
                                                        </span>
                                                    </div>
                                                    <p >{activation.promotion?.description}</p>
                                                    <div >
                                                        <span >Activé: {new Date(activation.dateActivation).toLocaleDateString()}</span>
                                                        <span >Expire: {new Date(activation.dateExpiration).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                        ))}
                                            {activePromotions.length === 0 && (
                                                <p style={{color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '16px', fontStyle: 'italic'}}>
                                                    Aucune promotion active
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.3)'
                                }}>
                                    <h3 style={{fontSize: '18px', fontWeight: '500', color: '#D4AF37', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                                        Recharger le compte
                                    </h3>
                                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                        <input type="number" placeholder="Montant (DT)" value={balanceUpdate} onChange={(e) => setBalanceUpdate(e.target.value)} style={{flex: '1', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.5)', borderRadius: '6px', color: 'white', fontSize: '15px', transition: 'all 0.3s ease', outline: 'none'}} onFocus={(e) => {e.target.style.background = 'rgba(255, 255, 255, 0.1)';e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.3)';}} onBlur={(e) => {e.target.style.background = 'rgba(255, 255, 255, 0.05)';e.target.style.boxShadow = 'none';}}/>
                                        <button onClick={handleUpdateBalance} style={{padding: '12px 24px', background: 'linear-gradient(135deg, #D4AF37, #F4E5C2)', color: 'black', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = '0 6px 12px rgba(212, 175, 55, 0.4)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)';e.currentTarget.style.boxShadow = '0 4px 8px rgba(212, 175, 55, 0.3)';}}>
                                            Recharger
                                        </button>
                                    </div>
                                    <div style={{marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)'}}>
                                            Devise:
                                        </span>
                                        <select style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '4px', padding: '4px 8px', color: 'black', fontSize: '12px'}}>
                                            <option value="TND">TND (DT)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Loyalty Account */}
                                {loyaltyAccount && (
                                    <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.3)'}}>
                                        <h3 style={{fontSize: '18px', fontWeight: '500', color: '#D4AF37', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compte Fidélité</h3>
                                        <div style={{
                                            background: 'rgba(40, 40, 40, 0.7)',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            border: '1px solid rgba(212, 175, 55, 0.2)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                        }}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Points disponibles:</span>
                                                <span className="font-semibold text-gray-900">{loyaltyAccount.pointsDisponibles}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-gray-600">Points utilisés:</span>
                                                <span className="font-semibold text-gray-900">{loyaltyAccount.pointsUtilises}</span>
                                            </div>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    marginTop: '16px',
                                                    padding: '12px',
                                                    background: 'transparent',
                                                    border: '1px solid #D4AF37',
                                                    color: '#D4AF37',
                                                    borderRadius: '6px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
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
                        <div className="bg-white rounded-lg max-w-md w-full">
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
                                        <span className="text-2xl font-bold text-gray-900">{clientBalance.solde.toFixed(2)} DT</span>
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