import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { DatePicker } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const { MonthPicker } = DatePicker;

const StatisticsDashboard = () => {
    // États des filtres
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [topPromosData, setTopPromosData] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Options statiques
    const clientCategories = ['VIP', 'GP', 'Privé', 'B2B'];
    const promoTypes = ['absolu', 'relatif'];

    // Charger les promos les plus activées au montage du composant
    useEffect(() => {
        fetchTopPromos();
    }, []);

    // Mock data pour les promos les plus activées
    const fetchTopPromos = async () => {
        try {
            // Simulation de délai d'API
            await new Promise(resolve => setTimeout(resolve, 800));

            // Données mock pour les top promos absolues
            const topPromos = [
                { promoName: 'Promo Été 2023', activations: 1250 },
                { promoName: 'Black Friday', activations: 980 },
                { promoName: 'Soldes Hiver', activations: 870 },
                { promoName: 'Rentrée scolaire', activations: 750 },
                { promoName: 'Fête des mères', activations: 620 },
            ];

            setTopPromosData({
                labels: topPromos.map(promo => promo.promoName),
                datasets: [
                    {
                        label: 'Nombre d\'activations',
                        data: topPromos.map(promo => promo.activations),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            });

        } catch (err) {
            console.error('Erreur lors du chargement des top promos:', err);
        }
    };

    // Mock data - À remplacer par votre appel API réel
    const fetchStatistics = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulation de délai d'API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Génération de données aléatoires pour la démo
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
            const dataPoints = months.map(() => Math.floor(Math.random() * 100) + 20);

            setChartData({
                labels: months,
                datasets: [
                    {
                        label: `Activations ${selectedClientCategory} - ${selectedPromoType}`,
                        data: dataPoints,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    }
                ]
            });

        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (!selectedClientCategory || !selectedPromoType || !selectedMonth) {
            setError('Veuillez sélectionner tous les filtres');
            return;
        }
        fetchStatistics();
    };

    const handleReset = () => {
        setSelectedClientCategory('');
        setSelectedPromoType('');
        setSelectedMonth(null);
        setChartData(null);
        setError(null);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ color: '#333' }}>Statistiques des Promotions</h1>
                    <p style={{ color: '#666' }}>Visualisation des performances par catégorie client et type de promotion</p>
                </div>

                {/* Filtres de recherche - Déplacé en haut */}
                <div style={{
                    margin: '20px 0',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginTop: 0 }}>Filtres de Recherche</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        {/* Catégorie client */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Catégorie Client
                            </label>
                            <select
                                value={selectedClientCategory}
                                onChange={(e) => setSelectedClientCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da'
                                }}
                            >
                                <option value="">Sélectionnez...</option>
                                {clientCategories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Type de promotion */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Type de Promotion
                            </label>
                            <select
                                value={selectedPromoType}
                                onChange={(e) => setSelectedPromoType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ced4da'
                                }}
                            >
                                <option value="">Sélectionnez...</option>
                                {promoTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Période */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                Mois et Année
                            </label>
                            <MonthPicker
                                style={{ width: '100%', padding: '8px' }}
                                placeholder="Sélectionnez mois/année"
                                format="MM/YYYY"
                                onChange={(date, dateString) => setSelectedMonth(dateString)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            {isLoading ? 'Recherche en cours...' : 'Rechercher'}
                        </button>

                        <button
                            onClick={handleReset}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Section des top promos - Rendu plus petit et positionné */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    {/* Conteneur principal pour les résultats */}
                    <div style={{ flex: 1 }}>
                        {/* Gestion des erreurs */}
                        {error && (
                            <div style={{
                                color: '#721c24',
                                backgroundColor: '#f8d7da',
                                borderColor: '#f5c6cb',
                                padding: '15px',
                                borderRadius: '4px',
                                marginBottom: '20px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Visualisation des données */}
                        {chartData && !isLoading && (
                            <div style={{
                                padding: '20px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <h2 style={{ marginTop: 0 }}>
                                    Statistiques pour {selectedClientCategory} - {selectedPromoType} ({selectedMonth})
                                </h2>

                                <div style={{ height: '400px', marginTop: '30px' }}>
                                    <Line
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Évolution des Activations'
                                                },
                                                tooltip: {
                                                    mode: 'index',
                                                    intersect: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: "Nombre d'activations"
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                {/* Tableau récapitulatif */}
                                <div style={{ marginTop: '40px' }}>
                                    <h3>Détails par Mois</h3>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        marginTop: '15px'
                                    }}>
                                        <thead>
                                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Mois</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Activations</th>
                                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Variation</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {chartData.labels.map((month, index) => (
                                            <tr key={month} style={{ border: '1px solid #ddd' }}>
                                                <td style={{ padding: '12px' }}>{month}</td>
                                                <td style={{ padding: '12px' }}>{chartData.datasets[0].data[index]}</td>
                                                <td style={{
                                                    padding: '12px',
                                                    color: index > 0 && chartData.datasets[0].data[index] > chartData.datasets[0].data[index-1] ?
                                                        '#52c41a' : '#f5222d'
                                                }}>
                                                    {index > 0 ?
                                                        `${Math.round(
                                                            ((chartData.datasets[0].data[index] - chartData.datasets[0].data[index-1]) /
                                                                chartData.datasets[0].data[index-1]) * 100
                                                        )}%` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* État vide */}
                        {!chartData && !isLoading && !error && (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px'
                            }}>
                                <h3>Aucune donnée à afficher</h3>
                                <p>Veuillez sélectionner des critères de recherche et cliquer sur "Rechercher"</p>
                            </div>
                        )}
                    </div>

                    {/* Section des top promos - Positionnée à droite */}
                    {topPromosData && (
                        <div style={{
                            width: '350px',
                            padding: '15px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ marginTop: 0, fontSize: '16px' }}>Promotions Absolues les Plus Activées</h3>
                            <div style={{ height: '250px', marginTop: '15px' }}>
                                <Bar
                                    data={topPromosData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: false
                                            },
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: "Activations"
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    autoSkip: false,
                                                    maxRotation: 45,
                                                    minRotation: 45
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;