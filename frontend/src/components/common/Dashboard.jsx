import React, { useState, useEffect } from 'react';
import { Gift, Users, Zap, TrendingUp, Target, Star, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const [promotions, setPromotions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // API base URL - adjust this to match your backend
    const API_BASE_URL = 'http://localhost:8080/api';

    // Fetch promotions from the backend
    const fetchPromotions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/promotions?activeOnly=true`);
            if (!response.ok) throw new Error('Failed to fetch promotions');
            const data = await response.json();
            setPromotions(data);
            return data;
        } catch (err) {
            console.error('Error fetching promotions:', err);
            setError('Failed to load promotions');
            return [];
        }
    };

    // Calculate stats from promotions data
    const calculateStats = (promotionsData) => {
        const activePromotions = promotionsData.filter(p => p.statut === 'ACTIVE');

        // Calculate totals from promotion data
        const totalActivations = activePromotions.reduce((sum, p) => sum + (p.activations || 0), 0);
        const totalClients = activePromotions.reduce((sum, p) => sum + (p.clientsEligibles || 0), 0);
        const totalRevenue = activePromotions.reduce((sum, p) => sum + (p.chiffreAffaires || 0), 0);
        const avgConversionRate = activePromotions.length > 0
            ? activePromotions.reduce((sum, p) => sum + (p.taux || 0), 0) / activePromotions.length
            : 0;

        return {
            promotionsActives: activePromotions.length,
            clientsEligibles: totalClients,
            activationsAujourdhui: totalActivations,
            chiffreAffaires: totalRevenue,
            tauxConversion: avgConversionRate,
            pointsFidelite: Math.floor(totalRevenue * 0.1) // Example: 10% of revenue as points
        };
    };

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const promotionsData = await fetchPromotions();
                const calculatedStats = calculateStats(promotionsData);
                setStats(calculatedStats);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Refresh data
    const refreshData = async () => {
        setRefreshing(true);
        setError(null);

        try {
            const promotionsData = await fetchPromotions();
            const calculatedStats = calculateStats(promotionsData);
            setStats(calculatedStats);
        } catch (err) {
            setError('Failed to refresh data');
        } finally {
            setRefreshing(false);
        }
    };

    const safeStats = {
        promotionsActives: 0,
        clientsEligibles: 0,
        activationsAujourdhui: 0,
        chiffreAffaires: 0,
        tauxConversion: 0,
        pointsFidelite: 0,
        ...stats,
    };

    const formatNumber = (num) => num?.toLocaleString("fr-FR") ?? '0';
    const formatCurrency = (num) => `${(Number(num) / 1000).toFixed(0)}K DT`;
    const formatPercentage = (num) => `${Number(num).toFixed(1)}%`;

    const kpis = [
        { title: 'Promotions actives', value: safeStats.promotionsActives, icon: Gift, color: '#FF7900' },
        { title: 'Activations / jour', value: formatNumber(safeStats.activationsAujourdhui), icon: Zap, color: '#FF7900' },
        { title: 'Chiffre d\'affaires', value: formatCurrency(safeStats.chiffreAffaires), icon: TrendingUp, color: '#fd7110' },
    ];

    const activePromotions = promotions?.filter(p => p?.statut === 'ACTIVE') || [];

    if (loading) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '3rem', width: '3rem', border: '4px solid #FF7900', borderTopColor: 'transparent', margin: '0 auto 1rem auto'}}></div>
                    <p style={{ color: '#333', fontSize: '1.125rem' }}>Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: '"Helvetica Neue", Arial, sans-serif'}}>
            {/* Main Content */}
            <main style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 1.5rem'
            }}>
                {/* Error Alert */}
                {error && (
                    <div style={{backgroundColor: '#FFEBEE', borderLeft: '4px solid #F44336', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <AlertCircle color="#F44336" size={20} />
                        <span style={{ color: '#D32F2F', fontWeight: '500' }}>{error}</span>
                    </div>
                )}

                {/* KPI Cards */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                    {kpis.map((kpi, index) => (
                        <div key={index} style={{backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem', borderTop: `4px solid ${kpi.color}`, transition: 'transform 0.2s, box-shadow 0.2s', ':hover': {transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)'}}}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{width: '48px', height: '48px', backgroundColor: `${kpi.color}20`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <kpi.icon color={kpi.color} size={24} />
                                </div>
                                <div>
                                    <div style={{fontSize: '1.25rem', fontWeight: '600', color: '#333', marginBottom: '0.25rem'}}>{kpi.value}</div>
                                    <div style={{color: '#666', fontSize: '0.875rem', fontWeight: '500'}}>{kpi.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Sections */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                    {/* Promotions Performance */}
                    <div style={{backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
                        <div style={{ backgroundColor : '#1c1c1c', color : 'white' , padding: '1.25rem 1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0}}>
                                Performances des promotions</h3>
                            <div style={{fontSize: '0.875rem', color: '#666'}}>
                                {activePromotions.length} active(s)</div>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            {activePromotions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {activePromotions.map((promo) => (
                                        <div key={promo.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#f9f9f9', borderRadius: '4px', transition: 'background-color 0.2s', ':hover': {backgroundColor: '#f0f0f0'}}}>
                                            <div>
                                                <div style={{color: '#333', fontWeight: '500', marginBottom: '0.25rem'}}>
                                                    {promo.nom}</div>
                                                <div style={{color: '#666', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                                }}>
                                                    <span>{promo.codePromotion}</span>
                                                    <span style={{display: 'inline-block', width: '4px', height: '4px', backgroundColor: '#999', borderRadius: '50%'
                                                    }}></span>
                                                    <span>Créé le {new Date(promo.dateCreation).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{color: '#333', fontWeight: '600'}}>
                                                        {formatNumber(promo.activations || 0)}</div>
                                                    <div style={{color: '#666', fontSize: '0.75rem'}}>
                                                        activations</div>
                                                </div>
                                                <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor:
                                                        (promo.taux || 0) > 70 ? '#4CAF50' :
                                                            (promo.taux || 0) > 50 ? '#FFC107' : '#F44336'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{textAlign: 'center', padding: '2rem 1rem', color: '#666'}}>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div style={{backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
                        <div style={{ color : 'white', backgroundColor : '#1C1C1C',padding: '1.25rem 1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3 style={{fontSize: '1.125rem', fontWeight: '600', margin: 0}}>
                                Activités récentes
                            </h3>
                            <div style={{fontSize: '0.875rem', color: '#666'}}>
                                Aujourd'hui
                            </div>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            {activePromotions.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {activePromotions.slice(0, 5).map((promo, index) => (
                                        <div key={index} style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem', backgroundColor: '#f9f9f9', borderRadius: '4px'}}>
                                            <div style={{flexShrink: 0, width: '32px', height: '32px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <CheckCircle size={16} color="#4CAF50" />
                                            </div>
                                            <div>
                                                <div style={{color: '#333', fontSize: '0.875rem', marginBottom: '0.25rem'}}>

                                                    Promotion <strong>"{promo.nom}"</strong>
                                                </div>
                                                <div style={{color: '#666', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                    <span>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span style={{display: 'inline-block', width: '4px', height: '4px', backgroundColor: '#999', borderRadius: '50%'}}></span>
                                                    <span>{promo.activations || 0} activations totales</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{textAlign: 'center', padding: '2rem 1rem', color: '#666'
                                }}>
                                    <Zap size={48} color="#999" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ margin: 0 }}>Aucune activité récente</p>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>Les activités apparaîtront ici</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{textAlign: 'center', color: '#666', fontSize: '0.875rem', padding: '1rem 0', borderTop: '1px solid #eee', marginTop: '2rem'}}>
                    Dernière mise à jour: {new Date().toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                </div>
            </main>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;