import React, { useState, useEffect, useRef } from 'react';
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
import './StatisticsDashboard.css';

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
    const [selectedMonth, setSelectedMonth] = useState('');

    // Data states
    const [chartData, setChartData] = useState(null);
    const [topPromosData, setTopPromosData] = useState(null);

    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEmailLoading, setIsEmailLoading] = useState(false);

    // Chart reference for email functionality
    const chartRef = useRef(null);

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
        const dayNumber = parseInt(dayString.replace('Day ', ''), 10);
        if (isNaN(dayNumber)) return dayString;

        const [month, year] = monthYearString.split('/');
        const date = new Date(year, parseInt(month, 10) - 1, dayNumber);
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

    const handleEmailChart = async () => {
        if (!chartRef.current || !chartData) {
            setError('Aucun graphique disponible à envoyer');
            return;
        }

        setIsEmailLoading(true);

        try {
            // Get the chart canvas and convert to blob
            const canvas = chartRef.current.canvas;

            // Convert canvas to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Create a file from the blob
                    const file = new File([blob], `statistiques_${selectedClientCategory}_${selectedPromoType}_${selectedMonth}.png`, {
                        type: 'image/png'
                    });

                    // Create email content
                    const subject = encodeURIComponent(`Statistiques - ${selectedClientCategory} ${selectedPromoType} (${selectedMonth})`);
                    const body = encodeURIComponent(`Bonjour,

Veuillez trouver ci-joint le graphique des statistiques d'activations de promotions pour :
- Catégorie client : ${selectedClientCategory}
- Type de promotion : ${selectedPromoType}
- Période : ${selectedMonth}

Cordialement`);

                    // For Gmail web interface with attachment, we need to use a different approach
                    // Since we can't directly attach files via URL, we'll copy the image to clipboard
                    // and provide instructions to the user

                    canvas.toBlob((blob) => {
                        navigator.clipboard.write([
                            new ClipboardItem({
                                'image/png': blob
                            })
                        ]).then(() => {
                            // Open Gmail compose window
                            const gmailUrl = `https://mail.google.com/mail/u/0/#compose?subject=${subject}&body=${body}`;
                            window.open(gmailUrl, '_blank');

                            // Show success message with instructions
                            alert('Le graphique a été copié dans le presse-papiers. Gmail va s\'ouvrir dans un nouvel onglet. Vous pouvez coller l\'image (Ctrl+V) dans votre email.');
                        }).catch((err) => {
                            console.error('Erreur lors de la copie:', err);
                            // Fallback: download the image
                            const url = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.download = `statistiques_${selectedClientCategory}_${selectedPromoType}_${selectedMonth}.png`;
                            link.href = url;
                            link.click();

                            // Open Gmail
                            const gmailUrl = `https://mail.google.com/mail/u/0/#compose?subject=${subject}&body=${body}`;
                            window.open(gmailUrl, '_blank');

                            alert('Le graphique a été téléchargé. Gmail va s\'ouvrir dans un nouvel onglet. Vous pouvez attacher le fichier téléchargé à votre email.');
                        });
                    }, 'image/png');
                } else {
                    setError('Erreur lors de la génération de l\'image');
                }
                setIsEmailLoading(false);
            }, 'image/png');

        } catch (err) {
            console.error('Erreur lors de l\'envoi par email:', err);
            setError('Erreur lors de la préparation de l\'email');
            setIsEmailLoading(false);
        }
    };

    const handleSearch = () => {
        fetchStatistics();
    };

    const handleReset = () => {
        setSelectedClientCategory('');
        setSelectedPromoType('');
        setSelectedMonth('');
        setChartData(null);
        setError(null);
    };

    return (
        <div className="dashboard-container">
            <div>
                {/* Filtres de recherche */}
                <div className="filters-section">
                    <h2 className="filters-title">Filtres de Recherche</h2>

                    <div className="filters-grid">
                        {/* Catégorie client */}
                        <div className="filter-field">
                            <label className="filter-label">
                                Catégorie Client
                            </label>
                            <select
                                value={selectedClientCategory}
                                onChange={(e) => setSelectedClientCategory(e.target.value)}
                                className="filter-select"
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
                        <div className="filter-field">
                            <label className="filter-label">
                                Type de Promotion
                            </label>
                            <select
                                value={selectedPromoType}
                                onChange={(e) => setSelectedPromoType(e.target.value)}
                                className="filter-select"
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
                        <div className="filter-field">
                            <label className="filter-label">
                                Mois et Année
                            </label>
                            <MonthPicker
                                className="month-picker"
                                placeholder="Sélectionnez mois/année"
                                format="MM/YYYY"
                                onChange={(date, dateString) => setSelectedMonth(dateString)}
                            />
                        </div>
                    </div>

                    <div className="buttons-container">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="search-button"
                        >
                            {isLoading ? 'Recherche en cours...' : 'Rechercher'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="reset-button"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Section des résultats */}
                <div className="results-section">
                    {/* Résultats principaux */}
                    <div className="main-results">
                        {/* Gestion des erreurs */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* Graphique + tableau */}
                        {chartData && !isLoading && (
                            <div className="chart-container">
                                <div className="chart-header">
                                    <h2 className="chart-title">
                                        Statistiques pour {selectedClientCategory} - {selectedPromoType} ({selectedMonth})
                                    </h2>

                                    <button
                                        onClick={handleEmailChart}
                                        disabled={isEmailLoading}
                                        className="email-button"
                                    >
                                        {isEmailLoading ? (
                                            <>
                                                <span>⏳</span>
                                                Préparation...
                                            </>
                                        ) : (
                                            <>
                                                Envoyer par Email
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="chart-wrapper">
                                    <Line
                                        ref={chartRef}
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
                                                    },
                                                    // Ajoutez cette configuration pour forcer les nombres entiers
                                                    ticks: {
                                                        stepSize: 1,
                                                        precision: 0,
                                                        callback: function(value) {
                                                            return Number.isInteger(value) ? value : '';
                                                        }
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
                            <div className="empty-state">
                                <h3>Aucune donnée à afficher</h3>
                                <p>Veuillez sélectionner des critères de recherche et cliquer sur "Rechercher"</p>
                            </div>
                        )}
                    </div>

                    {/* Top promos à droite */}
                    {topPromosData && (
                        <div className="top-promos-sidebar">
                            <h3 className="top-promos-title">Promotions Absolues les Plus Activées</h3>
                            <div className="top-promos-chart">
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
                                                },
                                                ticks: {
                                                    stepSize: 1,
                                                    precision: 0,
                                                    callback: function(value) {
                                                        return Number.isInteger(value) ? value : '';
                                                    }
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