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
        { title: 'Promotions actives', value: safeStats.promotionsActives, icon: Gift },
        { title: 'Clients éligibles', value: formatNumber(safeStats.clientsEligibles), icon: Users },
        { title: 'Activations / jour', value: formatNumber(safeStats.activationsAujourdhui), icon: Zap },
        { title: 'Chiffre d\'affaires', value: formatCurrency(safeStats.chiffreAffaires), icon: TrendingUp },
        { title: 'Taux de conversion', value: formatPercentage(safeStats.tauxConversion), icon: Target },
        { title: 'Points fidélité', value: formatNumber(safeStats.pointsFidelite), icon: Star },
    ];

    const activePromotions = promotions?.filter(p => p?.statut === 'ACTIVE') || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Tableau de bord des promotions</h1>
                    <button
                        onClick={refreshData}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-600 rounded-lg">
                                    <kpi.icon size={24} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{kpi.value}</div>
                                    <div className="text-gray-300 text-sm">{kpi.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Promotions Performance */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">Performances des promotions</h3>
                        <div className="space-y-4">
                            {activePromotions.length > 0 ? (
                                activePromotions.map((promo) => (
                                    <div key={promo.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                        <div>
                                            <div className="text-white font-medium">{promo.nom}</div>
                                            <div className="text-gray-400 text-sm">{promo.codePromotion}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-semibold">{formatNumber(promo.activations || 0)}</div>
                                            <div className="text-gray-400 text-sm">{formatPercentage(promo.taux || 0)} taux</div>
                                        </div>
                                        <div
                                            className="w-3 h-3 rounded-full ml-4"
                                            style={{
                                                backgroundColor:
                                                    (promo.taux || 0) > 70 ? '#00C853' :
                                                        (promo.taux || 0) > 50 ? '#FFA000' : '#FF5252'
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Gift className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Aucune promotion active</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">Activités récentes</h3>
                        <div className="space-y-4">
                            {activePromotions.length > 0 ? (
                                activePromotions.slice(0, 5).map((promo, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm">Promotion "{promo.nom}" activée</div>
                                            <div className="text-gray-400 text-xs">
                                                {promo.activations || 0} activations au total
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Aucune activité récente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;