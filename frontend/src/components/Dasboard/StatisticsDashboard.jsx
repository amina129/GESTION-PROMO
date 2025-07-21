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

const modalStyles = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
    margin: 0;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    color: #333;
    background-color: #f0f0f0;
    border-radius: 50%;
}

.modal-body {
    padding: 20px;
}

.modal-body ul {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
}

.modal-body li {
    margin: 5px 0;
}

.email-input-container {
    margin-top: 20px;
}

.email-input-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.email-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
}

.email-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    background-color: #f8f9fa;
}

.cancel-button, .send-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.cancel-button {
    background-color: #6c757d;
    color: white;
}

.cancel-button:hover {
    background-color: #5a6268;
}

.send-button {
    background-color: #007bff;
    color: white;
}

.send-button:hover:not(:disabled) {
    background-color: #0056b3;
}

.send-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
`;

const StatisticsDashboard = () => {
    // Filter states
    const [selectedClientCategory, setSelectedClientCategory] = useState('');
    const [selectedPromoType, setSelectedPromoType] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);

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

    const sendEmailToBackend = async (email) => {
        if (!email) {
            setError('Veuillez saisir une adresse email');
            return;
        }

        setIsEmailLoading(true);
        setShowEmailModal(false);

        try {
            const canvas = chartRef.current.canvas;
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/png', 1.0);
            });

            if (!blob) {
                throw new Error('Erreur lors de la génération de l\'image');
            }

            const formData = new FormData();
            const fileName = `statistiques_${selectedClientCategory}_${selectedPromoType}_${selectedMonth}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            formData.append('file', file);
            formData.append('email', email);
            formData.append('clientCategory', selectedClientCategory);
            formData.append('promoType', selectedPromoType);
            formData.append('period', selectedMonth);

            const response = await fetch(`${API_BASE_URL}/email/send-chart`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Email envoyé avec succès !');
                setEmailAddress('');
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi de l\'email');
            }

        } catch (err) {
            console.error('Erreur lors de l\'envoi par email:', err);
            setError(`Erreur lors de l'envoi de l'email: ${err.message}`);
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleEmailChart = async () => {
        if (!chartRef.current || !chartData) {
            setError('Aucun graphique disponible à envoyer');
            return;
        }
        setShowEmailModal(true);
    };

    const EmailModal = () => {
        if (!showEmailModal) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Envoyer le graphique par email</h3>
                        <button
                            className="modal-close"
                            onClick={() => setShowEmailModal(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="modal-body">
                        <p>Le graphique sera envoyé avec les informations suivantes :</p>
                        <ul>
                            <li><strong>Catégorie :</strong> {selectedClientCategory}</li>
                            <li><strong>Type de promotion :</strong> {selectedPromoType}</li>
                            <li><strong>Période :</strong> {selectedMonth}</li>
                        </ul>

                        <div className="email-input-container">
                            <label htmlFor="email-input">Adresse email du destinataire :</label>
                            <input
                                id="email-input"
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="exemple@domain.com"
                                className="email-input"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            onClick={() => setShowEmailModal(false)}
                            className="cancel-button"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => sendEmailToBackend(emailAddress)}
                            disabled={isEmailLoading || !emailAddress}
                            className="send-button"
                        >
                            {isEmailLoading ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </div>
                </div>
                <style>{modalStyles}</style>
            </div>
        );
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
                <div className="filters-section">
                    <h2 className="filters-title">Filtres de Recherche</h2>

                    <div className="filters-grid">
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

                <div className="results-section">
                    <div className="main-results">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

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

                        {!chartData && !isLoading && !error && (
                            <div className="empty-state">
                                <h3>Aucune donnée à afficher</h3>
                                <p>Veuillez sélectionner des critères de recherche et cliquer sur "Rechercher"</p>
                            </div>
                        )}
                    </div>

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
            <EmailModal />
        </div>
    );
};

export default StatisticsDashboard;