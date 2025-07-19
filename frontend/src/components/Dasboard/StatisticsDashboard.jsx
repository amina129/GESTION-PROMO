import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Mail, Calendar, Users, Tag, BarChart3, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const StatisticsDashboard = () => {
    // États pour les filtres
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    // États pour la gestion backend
    const [rawData, setRawData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Configuration API
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

    // Options statiques (peuvent aussi venir du backend)
    const clientCategories = ['VIP', 'GP', 'Privé', 'B2B'];
    const promoTypes = ['Remise relative', 'Remise absolue'];
    const months = [
        { value: '2024-01', label: 'Janvier 2024' },
        { value: '2024-02', label: 'Février 2024' },
        { value: '2024-03', label: 'Mars 2024' },
        { value: '2024-04', label: 'Avril 2024' },
        { value: '2024-05', label: 'Mai 2024' },
        { value: '2024-06', label: 'Juin 2024' }
    ];

    // Fonction pour appeler l'API
    const fetchPromotionData = async (filters = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            // Construction des paramètres de requête
            const params = new URLSearchParams();
            if (filters.month) params.append('month', filters.month);
            if (filters.clientCategory) params.append('clientCategory', filters.clientCategory);
            if (filters.promoType) params.append('promoType', filters.promoType);

            const response = await fetch(`${API_BASE_URL}/promotions/statistics?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` // Si authentification nécessaire
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setRawData(data);
            setIsInitialLoad(false);
        } catch (err) {
            console.error('Erreur lors de la récupération des données:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Chargement initial des données
    useEffect(() => {
        fetchPromotionData();
    }, []);

    // Filtrage des données (maintenant basé sur les données du backend)
    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            const monthMatch = !selectedMonth || item.month === selectedMonth;
            const categoryMatch = !selectedClientCategory || item.clientCategory === selectedClientCategory;
            const promoMatch = !selectedPromoType || item.promoType === selectedPromoType;
            return monthMatch && categoryMatch && promoMatch;
        });
    }, [selectedMonth, selectedClientCategory, selectedPromoType, rawData]);

    // Calcul des statistiques
    const statistics = useMemo(() => {
        if (filteredData.length === 0) return null;

        const totalActivations = filteredData.reduce((sum, item) => sum + item.activations, 0);
        const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
        const averageActivations = Math.round(totalActivations / filteredData.length);

        // Promotions les plus activées
        const sortedByActivations = [...filteredData].sort((a, b) => b.activations - a.activations);

        // Statistiques par catégorie client
        const statsByCategory = clientCategories.map(category => {
            const categoryData = filteredData.filter(item => item.clientCategory === category);
            const activations = categoryData.reduce((sum, item) => sum + item.activations, 0);
            const revenue = categoryData.reduce((sum, item) => sum + item.revenue, 0);
            return { category, activations, revenue, count: categoryData.length };
        }).filter(item => item.count > 0);

        return {
            totalActivations,
            totalRevenue,
            averageActivations,
            topPromotions: sortedByActivations.slice(0, 5),
            statsByCategory
        };
    }, [filteredData]);

    const handleSearch = async () => {
        // Recherche avec filtres via API
        await fetchPromotionData({
            month: selectedMonth,
            clientCategory: selectedClientCategory,
            promoType: selectedPromoType
        });
        setSearchResults(statistics);
    };

    const handleReset = async () => {
        setSelectedMonth('');
        setSelectedClientCategory('');
        setSelectedPromoType('');
        setSearchResults(null);

        // Recharger toutes les données
        await fetchPromotionData();
    };

    const handleExportEmail = async () => {
        if (!searchResults) return;

        try {
            // Appel API pour générer un rapport détaillé
            const response = await fetch(`${API_BASE_URL}/promotions/export-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify({
                    filters: {
                        month: selectedMonth,
                        clientCategory: selectedClientCategory,
                        promoType: selectedPromoType
                    },
                    statistics: searchResults
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la génération du rapport');
            }

            const reportData = await response.json();

            // Créer l'email avec le rapport détaillé du backend
            const emailBody = reportData.emailContent || `Rapport Statistiques Promotions

Filtres appliqués:
- Mois: ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Tous'}
- Catégorie client: ${selectedClientCategory || 'Toutes'}  
- Type promotion: ${selectedPromoType || 'Tous'}

Résultats:
- Total activations: ${searchResults.totalActivations}
- Chiffre d'affaires total: ${searchResults.totalRevenue.toLocaleString()}€
- Moyenne activations: ${searchResults.averageActivations}

Top 3 promotions:
${searchResults.topPromotions.slice(0, 3).map((promo, i) =>
                `${i + 1}. ${promo.promoName} (${promo.clientCategory}) - ${promo.activations} activations`
            ).join('\n')}`;

            const mailtoLink = `mailto:?subject=Rapport Statistiques Promotions&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoLink);
        } catch (err) {
            console.error('Erreur lors de l\'export:', err);
            // Fallback vers l'export local si l'API échoue
            const emailBody = `Rapport Statistiques Promotions (Export local)

Filtres appliqués:
- Mois: ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Tous'}
- Catégorie client: ${selectedClientCategory || 'Toutes'}  
- Type promotion: ${selectedPromoType || 'Tous'}

Résultats:
- Total activations: ${searchResults.totalActivations}
- Chiffre d'affaires total: ${searchResults.totalRevenue.toLocaleString()}€
- Moyenne activations: ${searchResults.averageActivations}`;

            const mailtoLink = `mailto:?subject=Rapport Statistiques Promotions&body=${encodeURIComponent(emailBody)}`;
            window.open(mailtoLink);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="flex items-center text-3xl font-bold text-gray-900 mb-2">
                        <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
                        Statistiques Promotions
                    </h1>
                    <p className="text-gray-600">Analyse des performances par client, promotion et période</p>
                </div>

                {/* Barre de recherche */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <Search className="mr-2 h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">Filtres de Recherche</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Sélection du mois */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="mr-1 h-4 w-4" />
                                Période (Mois)
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Tous les mois</option>
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Catégorie client */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Users className="mr-1 h-4 w-4" />
                                Catégorie Client
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedClientCategory}
                                onChange={(e) => setSelectedClientCategory(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Toutes les catégories</option>
                                {clientCategories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Type de promotion */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Tag className="mr-1 h-4 w-4" />
                                Type Promotion
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedPromoType}
                                onChange={(e) => setSelectedPromoType(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Tous les types</option>
                                {promoTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="mr-2 h-4 w-4" />
                            )}
                            {isLoading ? 'Recherche...' : 'Rechercher'}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Réinitialiser
                        </button>
                        {searchResults && (
                            <button
                                onClick={handleExportEmail}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Exporter par Email
                            </button>
                        )}
                    </div>
                </div>

                {/* Gestion des erreurs */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">
                                    Erreur lors du chargement des données
                                </h3>
                                <p className="mt-1 text-sm text-red-700">{error}</p>
                                <button
                                    onClick={() => fetchPromotionData()}
                                    className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Indicateur de chargement initial */}
                {isInitialLoad && isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600">Chargement des données...</p>
                    </div>
                )}

                {/* Résultats */}
                {searchResults && !isLoading && (
                    <div className="space-y-6">
                        {/* Métriques principales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Total Activations</h3>
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{searchResults.totalActivations}</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Chiffre d'Affaires</h3>
                                    <Download className="h-5 w-5 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{searchResults.totalRevenue.toLocaleString()}€</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Moyenne Activations</h3>
                                    <BarChart3 className="h-5 w-5 text-purple-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{searchResults.averageActivations}</p>
                            </div>
                        </div>

                        {/* Top promotions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Promotions les Plus Activées</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activations</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenus</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {searchResults.topPromotions.map((promo, index) => (
                                        <tr key={promo.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        #{index + 1}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.promoName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {promo.clientCategory}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.promoType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {promo.activations}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        {promo.revenue.toLocaleString()}€
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statistiques par catégorie */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques par Catégorie Client</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {searchResults.statsByCategory.map(stat => (
                                    <div key={stat.category} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h4 className="font-medium text-gray-900 mb-3">{stat.category}</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Activations:</span>
                                                <span className="text-sm font-medium">{stat.activations}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Revenus:</span>
                                                <span className="text-sm font-medium">{stat.revenue.toLocaleString()}€</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Promotions:</span>
                                                <span className="text-sm font-medium">{stat.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!searchResults && !isLoading && !isInitialLoad && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Prêt à analyser vos données</h3>
                        <p className="text-gray-600">Utilisez les filtres ci-dessus et cliquez sur "Rechercher" pour voir vos statistiques</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsDashboard;