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
    // Filter states
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Data states
    const [chartData, setChartData] = useState(null);
    const [topPromosData, setTopPromosData] = useState(null);

    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    // Static options
    const clientCategories = ['VIP', 'GP', 'Privé', 'B2B'];
    const promoTypes = ['absolu', 'relatif'];

    // Fetch top promotions on component mount
    useEffect(() => {
        fetchTopPromos();
    }, []);
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function formatLabel(dayString, monthYearString) {
        // dayString exemple : "Day 11"
        // monthYearString exemple : "07/2025"

        const dayNumber = parseInt(dayString.replace('Day ', ''), 10);
        if (isNaN(dayNumber)) return dayString; // Sécurité

        const [month, year] = monthYearString.split('/');

        // Crée une date JS (mois indexé à 0)
        const date = new Date(year, parseInt(month, 10) - 1, dayNumber);

        // Format en français : jour numérique + mois complet
        const options = { day: 'numeric', month: 'long' };
        const formattedDate = date.toLocaleDateString('fr-FR', options);

        return `le ${capitalizeFirstLetter(formattedDate)}`;
    }

    const fetchTopPromos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/statistics/promotions/top?limit=5`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const json = await response.json();

            if (json.success && json.data) {
                const topPromos = json.data;
                setTopPromosData({
                    labels: topPromos.map(promo => promo.promoName),
                    datasets: [
                        {
                            label: "Nombre d'activations",
                            data: topPromos.map(promo => promo.activations),
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            } else {
                setError('Erreur lors du chargement des promotions');
            }
        } catch (err) {
            console.error('Erreur lors du chargement des top promos:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStatistics = async () => {
        if (!selectedClientCategory || !selectedPromoType || !selectedMonth) {
            setError('Veuillez sélectionner tous les filtres');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                clientCategory: selectedClientCategory,
                promoType: selectedPromoType,
                monthYear: selectedMonth,
            });

            const response = await fetch(`${API_BASE_URL}/statistics/promotions/activations?${params.toString()}`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const json = await response.json();

            if (json.success && json.data) {
                const trends = json.data;
                // In the fetchStatistics success handler:
                setChartData({
                    labels: trends.trends.map(t => formatLabel(t.month, selectedMonth)),
                    datasets: [
                        {
                            label: `Activations ${selectedClientCategory} - ${selectedPromoType}`,
                            data: trends.trends.map(t => t.activations),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.1
                        }
                    ]
                });


            } else {
                setChartData(null);
                setError('Pas de données disponibles pour ces filtres');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
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

                {/* Filtres de recherche */}
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
                                {clientCategories?.map(category => (
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
                                {promoTypes?.map(type => (
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

                {/* Section des résultats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    {/* Résultats principaux */}
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

                        {/* Graphique + tableau */}
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

                    {/* Top promos à droite */}
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
                                            title: { display: false },
                                            legend: { display: false }
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