import React, { useState, useMemo } from 'react';
import { Search, Download, Mail, Calendar, Users, Tag, BarChart3, TrendingUp } from 'lucide-react';

const StatisticsDashboard = () => {
    // États pour les filtres
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    // Données simulées pour l'exemple
    const mockData = [
        { id: 1, clientCategory: 'VIP', promoType: 'Remise relative', promoName: 'Réduction 20%', activations: 45, month: '2024-02', revenue: 15000 },
        { id: 2, clientCategory: 'GP', promoType: 'Remise absolue', promoName: 'Réduction 50€', activations: 32, month: '2024-02', revenue: 8500 },
        { id: 3, clientCategory: 'Privé', promoType: 'Remise relative', promoName: 'Réduction 15%', activations: 28, month: '2024-02', revenue: 7200 },
        { id: 4, clientCategory: 'B2B', promoType: 'Remise absolue', promoName: 'Réduction 100€', activations: 67, month: '2024-02', revenue: 25000 },
        { id: 5, clientCategory: 'VIP', promoType: 'Remise relative', promoName: 'Réduction 25%', activations: 38, month: '2024-03', revenue: 12800 },
        { id: 6, clientCategory: 'GP', promoType: 'Remise absolue', promoName: 'Réduction 30€', activations: 55, month: '2024-03', revenue: 9200 },
        { id: 7, clientCategory: 'B2B', promoType: 'Remise relative', promoName: 'Réduction 18%', activations: 72, month: '2024-03', revenue: 28500 },
        { id: 8, clientCategory: 'Privé', promoType: 'Remise absolue', promoName: 'Réduction 25€', activations: 41, month: '2024-01', revenue: 6800 }
    ];

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

    // Filtrage des données
    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const monthMatch = !selectedMonth || item.month === selectedMonth;
            const categoryMatch = !selectedClientCategory || item.clientCategory === selectedClientCategory;
            const promoMatch = !selectedPromoType || item.promoType === selectedPromoType;
            return monthMatch && categoryMatch && promoMatch;
        });
    }, [selectedMonth, selectedClientCategory, selectedPromoType, mockData]);

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

    const handleSearch = () => {
        setSearchResults(statistics);
    };

    const handleReset = () => {
        setSelectedMonth('');
        setSelectedClientCategory('');
        setSelectedPromoType('');
        setSearchResults(null);
    };

    const handleExportEmail = () => {
        if (!searchResults) return;

        const emailBody = `Rapport Statistiques Promotions

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
    };

    return (
        <div>
            <div>
                <div>
                    <h1>
                        <BarChart3 />
                        Statistiques Promotions
                    </h1>
                    <p>Analyse des performances par client, promotion et période</p>
                </div>

                {/* Barre de recherche */}
                <div>
                    <div>
                        <Search />
                        <h2>Filtres de Recherche</h2>
                    </div>

                    <div>
                        {/* Sélection du mois */}
                        <div>
                            <label>
                                <Calendar />
                                Période (Mois)
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
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
                            <label>
                                <Users />
                                Catégorie Client
                            </label>
                            <select
                                value={selectedClientCategory}
                                onChange={(e) => setSelectedClientCategory(e.target.value)}
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
                            <label>
                                <Tag />
                                Type Promotion
                            </label>
                            <select
                                value={selectedPromoType}
                                onChange={(e) => setSelectedPromoType(e.target.value)}
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

                    <div>
                        <button
                            onClick={handleSearch}
                        >
                            <Search />
                            Rechercher
                        </button>
                        <button
                            onClick={handleReset}
                        >
                            Réinitialiser
                        </button>
                        {searchResults && (
                            <button
                                onClick={handleExportEmail}
                            >
                                <Mail />
                                Exporter par Email
                            </button>
                        )}
                    </div>
                </div>

                {/* Résultats */}
                {searchResults && (
                    <div>
                        {/* Métriques principales */}
                        <div>
                            <div>
                                <div>
                                    <h3>Total Activations</h3>
                                    <TrendingUp />
                                </div>
                                <p>{searchResults.totalActivations}</p>
                            </div>

                            <div>
                                <div>
                                    <h3>Chiffre d'Affaires</h3>
                                    <Download />
                                </div>
                                <p>{searchResults.totalRevenue.toLocaleString()}€</p>
                            </div>

                            <div>
                                <div>
                                    <h3>Moyenne Activations</h3>
                                    <BarChart3 />
                                </div>
                                <p>{searchResults.averageActivations}</p>
                            </div>
                        </div>

                        {/* Top promotions */}
                        <div>
                            <h3>Top Promotions les Plus Activées</h3>
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Rang</th>
                                        <th>Promotion</th>
                                        <th>Catégorie</th>
                                        <th>Type</th>
                                        <th>Activations</th>
                                        <th>Revenus</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchResults.topPromotions.map((promo, index) => (
                                        <tr key={promo.id}>
                                            <td>
                                                <span>#{index + 1}</span>
                                            </td>
                                            <td>{promo.promoName}</td>
                                            <td>
                                                <span>{promo.clientCategory}</span>
                                            </td>
                                            <td>{promo.promoType}</td>
                                            <td>
                                                <span>{promo.activations}</span>
                                            </td>
                                            <td>
                                                <span>{promo.revenue.toLocaleString()}€</span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Statistiques par catégorie */}
                        <div>
                            <h3>Statistiques par Catégorie Client</h3>
                            <div>
                                {searchResults.statsByCategory.map(stat => (
                                    <div key={stat.category}>
                                        <h4>{stat.category}</h4>
                                        <div>
                                            <div>
                                                <span>Activations:</span>
                                                <span>{stat.activations}</span>
                                            </div>
                                            <div>
                                                <span>Revenus:</span>
                                                <span>{stat.revenue.toLocaleString()}€</span>
                                            </div>
                                            <div>
                                                <span>Promotions:</span>
                                                <span>{stat.count}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!searchResults && (
                    <div>
                        <BarChart3 />
                        <h3>Prêt à analyser vos données</h3>
                        <p>Utilisez les filtres ci-dessus et cliquez sur "Rechercher" pour voir vos statistiques</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsDashboard;