import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, RefreshCw, Calendar, Clock, X, Trash2 } from 'lucide-react';
import authService from '../auth/authService';
import PromotionAssignmentModal from './PromotionAssignmentModal';
import './ClientsManagement.css';

const ClientPromotionPage = ({ client, onBack }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    // Assignment states
    const [assignmentDates, setAssignmentDates] = useState({
        date_debut: '',
        date_fin: ''
    });
    const [availablePromotions, setAvailablePromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    // Assigned promotions states
    const [assignedPromotions, setAssignedPromotions] = useState([]);
    const [loadingAssigned, setLoadingAssigned] = useState(true);
    const [errorAssigned, setErrorAssigned] = useState(null);

    // Cancel assignment states
    const [showCancelMode, setShowCancelMode] = useState(false);
    const [selectedForCancellation, setSelectedForCancellation] = useState([]);
    const [cancelLoading, setCancelLoading] = useState(false);

    // Charger les promotions assignées
    const loadAssignedPromotions = async () => {
        setLoadingAssigned(true);
        setErrorAssigned(null);

        try {
            const response = await authService.api.get(`/clients/${client.id}/promotions/assigned`);
            setAssignedPromotions(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement des promotions assignées:", err);
            setErrorAssigned(err.response?.data?.message || "Erreur lors du chargement des promotions assignées");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoadingAssigned(false);
        }
    };

    // Charger les promotions assignées au montage du composant
    useEffect(() => {
        if (client?.id) {
            loadAssignedPromotions();
        }
    }, [client?.id]);

    const loadAvailablePromotions = async () => {
        if (!assignmentDates.date_debut || !assignmentDates.date_fin) {
            setError("Veuillez saisir les dates de début et de fin");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authService.api.get('/clients/available', {
                params: {
                    clientId: client.id,
                    dateDebut: assignmentDates.date_debut,
                    dateFin: assignmentDates.date_fin
                }
            });
            setAvailablePromotions(response.data);
            setSelectedPromotion(null);
        } catch (err) {
            console.error("Erreur lors du chargement des promotions:", err);
            setError(err.response?.data?.message || "Erreur lors du chargement des promotions");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const assignPromotion = async () => {
        if (!selectedPromotion || !assignmentDates.date_debut || !assignmentDates.date_fin) {
            setError("Veuillez compléter tous les champs");
            return;
        }

        setLoading(true);
        try {
            await authService.api.post(
                `/clients/${client.id}/promotions`,
                {
                    promotion_id: selectedPromotion.id,
                    date_debut: assignmentDates.date_debut,
                    date_fin: assignmentDates.date_fin
                }
            );

            // Reset after success
            handleCloseModal();

            // Recharger les promotions assignées
            loadAssignedPromotions();

            // Optionally show success message
            alert('Promotion assignée avec succès !');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'affectation");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    // Fonctions pour l'annulation d'assignement
    const handleCancelModeToggle = () => {
        setShowCancelMode(!showCancelMode);
        setSelectedForCancellation([]);
        setError(null);
    };

    const handlePromotionSelect = (activationId) => {
        setSelectedForCancellation(prev => {
            if (prev.includes(activationId)) {
                return prev.filter(id => id !== activationId);
            } else {
                return [...prev, activationId];
            }
        });
    };
    const extendPromotionValidity = async (activationId, currentEndDate) => {
        const newDate = prompt("Entrez la nouvelle date de fin (YYYY-MM-DD):", currentEndDate);

        if (!newDate) return; // L'utilisateur a annulé

        try {
            setLoading(true);
            await authService.api.put(
                `/clients/${client.id}/promotions/${activationId}/extend`,
                null,
                { params: { newDateFin: newDate } }
            );

            // Recharger les promotions assignées
            await loadAssignedPromotions();
            alert('Période de validité étendue avec succès !');
        } catch (err) {
            console.error("Erreur lors de l'extension:", err);
            alert(err.response?.data?.message || "Erreur lors de l'extension de la période");
        } finally {
            setLoading(false);
        }
    };

    const cancelSelectedPromotions = async () => {
        if (selectedForCancellation.length === 0) {
            setError("Veuillez sélectionner au moins une promotion à annuler");
            return;
        }

        const confirmMessage = `Êtes-vous sûr de vouloir annuler l'assignement de ${selectedForCancellation.length} promotion(s) ?`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setCancelLoading(true);
        setError(null);

        try {
            // Appel API pour annuler les assignements sélectionnés
            await authService.api.delete(`/clients/${client.id}/promotions/assignments`, {
                data: selectedForCancellation
            });

            // Recharger les promotions assignées
            await loadAssignedPromotions();

            // Reset
            setSelectedForCancellation([]);
            setShowCancelMode(false);

            alert(`${selectedForCancellation.length} promotion(s) annulée(s) avec succès !`);
        } catch (err) {
            console.error("Erreur lors de l'annulation:", err);
            setError(err.response?.data?.message || "Erreur lors de l'annulation des assignements");
            if (err.response?.status === 401) {
                authService.logout();
                window.location.href = '/login';
            }
        } finally {
            setCancelLoading(false);
        }
    };

    const handleDateChange = (field, value) => {
        setAssignmentDates(prev => ({ ...prev, [field]: value }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPromotion(null);
        setAssignmentDates({ date_debut: '', date_fin: '' });
        setAvailablePromotions([]);
        setError(null);
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setError(null);
    };

    // Fonction pour formater les dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fonction pour obtenir la classe CSS du statut
    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'status-active';
            case 'EXPIRED':
                return 'status-expired';
            case 'UPCOMING':
                return 'status-upcoming';
            default:
                return 'status-default';
        }
    };

    // Fonction pour obtenir le texte du statut
    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'Active';
            case 'EXPIRED':
                return 'Expirée';
            case 'UPCOMING':
                return 'À venir';
            default:
                return status;
        }
    };

    return (
        <div className="promotions-container">
            {/* Header avec bouton retour */}
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <button
                    className="button button-secondary"
                    onClick={onBack}
                    style={{ marginRight: '20px' }}
                >
                    <ArrowLeft className="button-icon" />
                    Retour
                </button>
                <h1>plus de detail sur les promo</h1>
            </div>

            {/* Informations du client */}
            <div className="client-info-section" style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px'
            }}>
                <h2 style={{ color: '#ff6600', marginBottom: '15px' }}>Informations du client</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <strong>Nom complet:</strong> {client.prenom} {client.nom}
                    </div>
                    <div>
                        <strong>Téléphone:</strong> {client.numero_telephone}
                    </div>
                    <div>
                        <strong>Email:</strong> {client.email}
                    </div>
                    <div>
                        <strong>Catégorie:</strong> {client.categorieClient}
                    </div>
                </div>
            </div>

            {/* Section des promotions assignées */}
            <div className="assigned-promotions-section" style={{ marginBottom: '30px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ color: '#ff6600', margin: 0 }}>Promotions assignées</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="button button-secondary"
                            onClick={loadAssignedPromotions}
                            disabled={loadingAssigned}
                            style={{ padding: '8px 16px' }}
                        >
                            <RefreshCw className={`button-icon ${loadingAssigned ? 'spinning' : ''}`} />
                            Actualiser
                        </button>
                        {assignedPromotions.length > 0 && (
                            <button
                                className={`button ${showCancelMode ? 'button-secondary' : 'button-danger'}`}
                                onClick={handleCancelModeToggle}
                                style={{ padding: '8px 16px' }}
                            >
                                {showCancelMode ? (
                                    <>
                                        <X className="button-icon" />
                                        Annuler sélection
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="button-icon" />
                                        Annuler assignements
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Actions d'annulation */}
                {showCancelMode && selectedForCancellation.length > 0 && (
                    <div style={{
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>
                            {selectedForCancellation.length} promotion(s) sélectionnée(s) pour annulation
                        </span>
                        <button
                            className="button button-danger"
                            onClick={cancelSelectedPromotions}
                            disabled={cancelLoading}
                            style={{ padding: '8px 16px' }}
                        >
                            {cancelLoading ? (
                                <>
                                    <RefreshCw className="button-icon spinning" />
                                    Annulation...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="button-icon" />
                                    Confirmer l'annulation
                                </>
                            )}
                        </button>
                    </div>
                )}

                {loadingAssigned && (
                    <div className="loading-message">
                        Chargement des promotions assignées...
                    </div>
                )}

                {errorAssigned && (
                    <div className="error-message">
                        {errorAssigned}
                    </div>
                )}

                {!loadingAssigned && !errorAssigned && (
                    <div className="assigned-promotions-list">
                        {assignedPromotions.length === 0 ? (
                            <div className="no-promotions-message" style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: '#666',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '2px dashed #ddd'
                            }}>
                                <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p>Aucune promotion assignée pour ce client</p>
                            </div>
                        ) : (
                            <div className="promotions-grid" style={{
                                display: 'grid',
                                gap: '16px',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
                            }}>
                                {assignedPromotions.map((promotion) => (
                                    <div
                                        key={promotion.activationId}
                                        className={`promotion-card ${showCancelMode ? 'selectable' : ''} ${
                                            selectedForCancellation.includes(promotion.activationId) ? 'selected' : ''
                                        }`}
                                        style={{
                                            border: selectedForCancellation.includes(promotion.activationId)
                                                ? '2px solid #e74c3c'
                                                : '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            backgroundColor: selectedForCancellation.includes(promotion.activationId)
                                                ? '#ffeaea'
                                                : '#fff',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            cursor: showCancelMode ? 'pointer' : 'default',
                                            position: 'relative'
                                        }}
                                        onClick={showCancelMode ? () => handlePromotionSelect(promotion.activationId) : undefined}
                                    >
                                        {showCancelMode && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: '2px solid #e74c3c',
                                                backgroundColor: selectedForCancellation.includes(promotion.activationId)
                                                    ? '#e74c3c'
                                                    : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {selectedForCancellation.includes(promotion.activationId) && (
                                                    <X size={12} color="white" />
                                                )}
                                            </div>
                                        )}

                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '8px'
                                            }}>
                                                <h3 style={{
                                                    margin: 0,
                                                    color: '#333',
                                                    fontSize: '18px',
                                                    paddingRight: showCancelMode ? '30px' : '0'
                                                }}>
                                                    {promotion.promotionNom}
                                                </h3>
                                                {!showCancelMode && (
                                                    <span
                                                        className={`status-badge ${getStatusClass(promotion.statut)}`}
                                                        style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {getStatusText(promotion.statut)}
                                                    </span>
                                                )}
                                            </div>

                                            {promotion.promotionDescription && (
                                                <p style={{
                                                    margin: '8px 0',
                                                    color: '#666',
                                                    fontSize: '14px'
                                                }}>
                                                    {promotion.promotionDescription}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            {promotion.promotionType && (
                                                <div style={{ marginBottom: '8px' }}>
                                                    <strong>Type:</strong> {promotion.promotionType}
                                                    {promotion.promotionValeur && (
                                                        <span style={{ marginLeft: '8px', color: '#ff6600' }}>
                                                            ({promotion.promotionValeur}
                                                            {promotion.promotionType === 'POURCENTAGE' ? '%' : '%'})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="promotion-dates" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                            marginBottom: '12px',
                                            padding: '12px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '6px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                                    DÉBUT
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                                    {formatDate(promotion.dateActivation)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                                    FIN
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                                                    {formatDate(promotion.dateExpiration)}
                                                </div>
                                            </div>
                                        </div>

                                        {!showCancelMode && promotion.statut === 'ACTIVE' && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                                {promotion.joursRestants !== null && (
                                                    <div style={{ display: 'flex', alignItems: 'center', color: promotion.joursRestants <= 7 ? '#e74c3c' : '#27ae60', fontSize: '14px', fontWeight: '500' }}>
                                                        <Clock size={16} style={{ marginRight: '6px' }} />
                                                        {promotion.joursRestants === 0
                                                            ? "Expire aujourd'hui"
                                                            : `${promotion.joursRestants} jour${promotion.joursRestants > 1 ? 's' : ''} restant${promotion.joursRestants > 1 ? 's' : ''}`
                                                        }
                                                    </div>
                                                )}
                                                <button
                                                    className="button button-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        extendPromotionValidity(promotion.activationId, promotion.dateExpiration);
                                                    }}
                                                    style={{ padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    Modifier la validité
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions disponibles */}
            <div className="actions-section" style={{ textAlign: 'center' }}>
                <button
                    className="button button-primary"
                    onClick={handleOpenModal}
                    disabled={showCancelMode}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        minWidth: '250px',
                        opacity: showCancelMode ? 0.6 : 1
                    }}
                >
                    <Search className="button-icon" />
                    Chercher une promotion
                </button>
            </div>

            {error && !showModal && (
                <div className="error-message" style={{ marginTop: '20px' }}>
                    {error}
                </div>
            )}

            {/* Modal de recherche et d'affectation */}
            {showModal && (
                <PromotionAssignmentModal
                    selectedClient={client}
                    onClose={handleCloseModal}
                    assignmentDates={assignmentDates}
                    onDateChange={handleDateChange}
                    availablePromotions={availablePromotions}
                    selectedPromotion={selectedPromotion}
                    onPromotionSelect={setSelectedPromotion}
                    onLoadPromotions={loadAvailablePromotions}
                    onAssignPromotion={assignPromotion}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
};

export default ClientPromotionPage;