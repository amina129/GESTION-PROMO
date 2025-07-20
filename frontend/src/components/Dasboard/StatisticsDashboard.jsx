import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StatisticsDashboard = () => {
    // États des filtres
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promotionStats, setPromotionStats] = useState({});
    const [trendsData, setTrendsData] = useState(null);
    const [period, setPeriod] = useState('monthly');
    const [metric, setMetric] = useState('activations');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Options statiques
    const clientCategories = ['VIP', 'GP', 'Privé', 'B2B'];
    const promoTypes = ['relative', 'absolue'];
    const periodOptions = [
        { value: 'daily', label: 'Journalier' },
        { value: 'weekly', label: 'Hebdomadaire' },
        { value: 'monthly', label: 'Mensuel' },
        { value: 'yearly', label: 'Annuel' }
    ];
    const metricOptions = [
        { value: 'activations', label: 'Activations' },
        { value: 'revenue', label: 'Revenue' }
    ];

    // Mock data for trends (to be replaced with actual API call)
    const mockTrendsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Activations',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const fetchPromotionData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/statistics/stats/promotions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setPromotionStats(data);
        } catch (err) {
            console.error('Erreur lors de la récupération des données:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTrendsData = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/statistics/trends?period=${period}&metric=${metric}`
            );

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();
            // For now using mock data until backend is implemented
            setTrendsData(mockTrendsData);
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchPromotionData();
        fetchTrendsData();
    }, []);

    useEffect(() => {
        fetchTrendsData();
    }, [period, metric]);

    const transformedData = useMemo(() => {
        return Object.entries(promotionStats).map(([id, activations]) => ({
            id: parseInt(id),
            promoName: `Promotion ${id}`,
            clientCategory: clientCategories[Math.floor(Math.random() * clientCategories.length)],
            promoType: promoTypes[Math.floor(Math.random() * promoTypes.length)],
            activations: activations
        }));
    }, [promotionStats]);

    const filteredData = useMemo(() => {
        return transformedData.filter(item => {
            const categoryMatch = !selectedClientCategory || item.clientCategory === selectedClientCategory;
            return categoryMatch;
        });
    }, [selectedClientCategory, transformedData]);

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
        setSelectedClientCategory('');
        setPeriod('monthly');
        setMetric('activations');
    };

    const handleExportEmail = () => {
        if (!statistics) return;

        const emailBody = `Rapport des statistiques de promotion

Filtres:
- Catégorie client: ${selectedClientCategory || 'Toutes'}  
- Période: ${periodOptions.find(p => p.value === period)?.label || period}
- Métrique: ${metricOptions.find(m => m.value === metric)?.label || metric}

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
                    <p>Analyse des performances par client et promotion</p>
                </div>

                {/* Filtres de recherche */}
                <div>
                    <div>
                        <h2>Filtres de recherche</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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

                        {/* Période */}
                        <div>
                            <label>Période</label>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                disabled={isLoading}
                            >
                                {periodOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Métrique */}
                        <div>
                            <label>Métrique</label>
                            <select
                                value={metric}
                                onChange={(e) => setMetric(e.target.value)}
                                disabled={isLoading}
                            >
                                {metricOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            style={{ marginRight: '10px' }}
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
                    <div style={{ color: 'red', margin: '20px 0' }}>
                        <div>
                            <h3>Erreur de chargement des données</h3>
                            <p>{error}</p>
                            <button
                                onClick={() => {
                                    fetchPromotionData();
                                    fetchTrendsData();
                                }}
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                )}

                {/* État de chargement */}
                {isLoading && (
                    <div style={{ margin: '20px 0' }}>
                        <p>Chargement des données...</p>
                    </div>
                )}

                {/* Trends Visualization */}
                {trendsData && !isLoading && (
                    <div style={{ margin: '40px 0', maxWidth: '800px' }}>
                        <h2>Tendances des {metricOptions.find(m => m.value === metric)?.label.toLowerCase()}</h2>
                        <div style={{ height: '400px' }}>
                            <Line
                                data={trendsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        title: {
                                            display: true,
                                            text: `Tendances ${periodOptions.find(p => p.value === period)?.label.toLowerCase()}`
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Affichage des résultats */}
                {statistics && !isLoading && (
                    <div style={{ marginTop: '40px' }}>
                        {/* Métriques clés */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '200px' }}>
                                <h3>Total des activations</h3>
                                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.totalActivations}</p>
                            </div>
                        </div>

                        {/* Tableau des meilleures promotions */}
                        <div>
                            <h2>Top des promotions activées</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rang</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Promotion</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Catégorie</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Activations</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {statistics.topPromotions.map((promo, index) => (
                                        <tr key={promo.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '12px' }}>#{index + 1}</td>
                                            <td style={{ padding: '12px' }}>{promo.promoName}</td>
                                            <td style={{ padding: '12px' }}>{promo.clientCategory}</td>
                                            <td style={{ padding: '12px' }}>{promo.promoType}</td>
                                            <td style={{ padding: '12px' }}>{promo.activations}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* État vide */}
                {!statistics && !isLoading && (
                    <div style={{ margin: '20px 0' }}>
                        <h3>Aucune donnée disponible</h3>
                        <p>Essayez d'ajuster vos filtres ou revenez plus tard</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsDashboard;