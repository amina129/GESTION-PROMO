import React, { useState, useMemo, useEffect } from 'react';

const StatisticsDashboard = () => {
    // États des filtres
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');

    // États backend
    const [rawData, setRawData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Options statiques
    const clientCategories = ['VIP', 'GP', 'Privé', 'B2B'];
    const promoTypes = ['relative', 'absolue'];
    const months = [
        { value: '2024-01', label: 'Janvier 2024' },
        { value: '2024-02', label: 'Février 2024' },
        { value: '2024-03', label: 'Mars 2024' },
        { value: '2024-04', label: 'Avril 2024' },
        { value: '2024-05', label: 'Mai 2024' },
        { value: '2024-06', label: 'Juin 2024' }
    ];

    const fetchPromotionData = async (filters = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.month) params.append('month', filters.month);
            if (filters.clientCategory) params.append('clientCategory', filters.clientCategory);
            if (filters.promoType) params.append('promoType', filters.promoType);

            const response = await fetch(`${API_BASE_URL}/statistics/stats/promotions?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            const transformedData = Object.entries(data).map(([id, activations]) => ({
                id: parseInt(id),
                promoName: `Promotion ${id}`,
                clientCategory: clientCategories[Math.floor(Math.random() * clientCategories.length)],
                promoType: promoTypes[Math.floor(Math.random() * promoTypes.length)],
                activations: activations,
                month: filters.month || '2024-01'
            }));

            setRawData(transformedData);
            setIsInitialLoad(false);
        } catch (err) {
            console.error('Erreur lors de la récupération des données:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotionData({
            month: selectedMonth,
            clientCategory: selectedClientCategory,
            promoType: selectedPromoType
        });
    }, [selectedMonth, selectedClientCategory, selectedPromoType]);

    const filteredData = useMemo(() => {
        return rawData.filter(item => {
            const monthMatch = !selectedMonth || item.month === selectedMonth;
            const categoryMatch = !selectedClientCategory || item.clientCategory === selectedClientCategory;
            const promoMatch = !selectedPromoType || item.promoType === selectedPromoType;
            return monthMatch && categoryMatch && promoMatch;
        });
    }, [selectedMonth, selectedClientCategory, selectedPromoType, rawData]);

    const statistics = useMemo(() => {
        if (filteredData.length === 0) return null;

        const totalActivations = filteredData.reduce((sum, item) => sum + item.activations, 0);
        const sortedByActivations = [...filteredData].sort((a, b) => b.activations - a.activations);

        return {
            totalActivations,
            topPromotions: sortedByActivations.slice(0, 3)
        };
    }, [filteredData]);

    const handleReset = () => {
        setSelectedMonth('');
        setSelectedClientCategory('');
        setSelectedPromoType('');
    };

    const handleExportEmail = () => {
        if (!statistics) return;

        const emailBody = `Rapport des statistiques de promotion

Filtres:
- Mois: ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Tous'}
- Catégorie client: ${selectedClientCategory || 'Toutes'}  
- Type de promotion: ${selectedPromoType || 'Tous'}

Résultats:
- Total des activations: ${statistics.totalActivations}

Top 3 des promotions:
${statistics.topPromotions.map((promo, i) =>
            `${i + 1}. ${promo.promoName} (${promo.clientCategory}) - ${promo.activations} activations`
        ).join('\n')}`;

        window.open(`mailto:?subject=Rapport des statistiques de promotion&body=${encodeURIComponent(emailBody)}`);
    };

    return (
        <div>
            <div>
                <div>
                    <h1>Statistiques des promotions</h1>
                    <p>Analyse des performances par client, promotion et période</p>
                </div>

                {/* Filtres de recherche */}
                <div>
                    <div>
                        <h2>Filtres de recherche</h2>
                    </div>

                    <div>
                        {/* Sélecteur de mois */}
                        <div>
                            <label>Période (Mois)</label>
                            <select
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
                            <label>Catégorie client</label>
                            <select
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
                            <label>Type de promotion</label>
                            <select
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

                    <div>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            Réinitialiser
                        </button>
                        {statistics && (
                            <button
                                onClick={handleExportEmail}
                            >
                                Exporter par email
                            </button>
                        )}
                    </div>
                </div>

                {/* Gestion des erreurs */}
                {error && (
                    <div>
                        <div>
                            <h3>Erreur de chargement des données</h3>
                            <p>{error}</p>
                            <button
                                onClick={() => fetchPromotionData({
                                    month: selectedMonth,
                                    clientCategory: selectedClientCategory,
                                    promoType: selectedPromoType
                                })}
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}

                {/* État de chargement */}
                {isInitialLoad && isLoading && (
                    <div>
                        <p>Chargement des données...</p>
                    </div>
                )}

                {/* Affichage des résultats */}
                {statistics && !isLoading && (
                    <div>
                        {/* Métriques clés */}
                        <div>
                            <div>
                                <h3>Total des activations</h3>
                                <p>{statistics.totalActivations}</p>
                            </div>
                        </div>

                        {/* Tableau des meilleures promotions */}
                        <div>
                            <h3>Top des promotions activées</h3>
                            <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Rang</th>
                                        <th>Promotion</th>
                                        <th>Catégorie</th>
                                        <th>Type</th>
                                        <th>Activations</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {statistics.topPromotions.map((promo, index) => (
                                        <tr key={promo.id}>
                                            <td>#{index + 1}</td>
                                            <td>{promo.promoName}</td>
                                            <td>{promo.clientCategory}</td>
                                            <td>{promo.promoType}</td>
                                            <td>{promo.activations}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* État vide */}
                {!statistics && !isLoading && !isInitialLoad && (
                    <div>
                        <h3>Aucune donnée disponible</h3>
                        <p>Essayez d'ajuster vos filtres ou revenez plus tard</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsDashboard;