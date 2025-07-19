import React from 'react';
import { Check, X } from 'lucide-react';

const PromotionAssignmentModal = ({
                                      selectedClient,
                                      onClose,
                                      assignmentDates,
                                      onDateChange,
                                      availablePromotions,
                                      selectedPromotion,
                                      onPromotionSelect,
                                      onLoadPromotions,
                                      onAssignPromotion,
                                      loading,
                                      error
                                  }) => {
    if (!selectedClient) return null;

    return (
        <>
            {/* Overlay - arrière-plan sombre */}
            <div
                className="modal-overlay"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Contenu du modal */}
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()} // Empêcher la fermeture en cliquant sur le contenu
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                        position: 'relative'
                    }}
                >
                    {/* Header avec bouton de fermeture */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '25px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '15px'
                    }}>
                        <h2 style={{
                            margin: 0,
                            color: '#ff6600',
                            fontSize: '20px'
                        }}>
                            Rechercher les promos disponibles
                        </h2>
                        <button
                            className="modal-close-btn"
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666',
                                padding: '5px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Informations client */}
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        <p style={{
                            margin: 0,
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Client: {selectedClient.prenom} {selectedClient.nom}
                        </p>
                        <p style={{
                            margin: '5px 0 0 0',
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            {selectedClient.email} • {selectedClient.numero_telephone}
                        </p>
                    </div>

                    {/* Sélection des dates */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{
                            color: '#333',
                            marginBottom: '15px',
                            fontSize: '16px'
                        }}>
                            Période désirée :
                        </h3>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px'
                        }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '5px',
                                    fontWeight: '500',
                                    color: '#555'
                                }}>
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_debut}
                                    onChange={(e) => onDateChange('date_debut', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '5px',
                                    fontWeight: '500',
                                    color: '#555'
                                }}>
                                    Date de fin
                                </label>
                                <input
                                    type="date"
                                    value={assignmentDates.date_fin}
                                    onChange={(e) => onDateChange('date_fin', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bouton de recherche */}
                    <div style={{ marginBottom: '25px' }}>
                        <button
                            className="button button-primary"
                            onClick={onLoadPromotions}
                            disabled={!assignmentDates.date_debut || !assignmentDates.date_fin || loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#ff6600',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: !assignmentDates.date_debut || !assignmentDates.date_fin || loading ? 'not-allowed' : 'pointer',
                                opacity: !assignmentDates.date_debut || !assignmentDates.date_fin || loading ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {loading ? 'Recherche en cours...' : 'Voir les promotions disponibles'}
                        </button>
                    </div>

                    {/* Liste des promotions disponibles */}
                    {availablePromotions.length > 0 && (
                        <div style={{ marginBottom: '25px' }}>
                            <h3 style={{
                                color: '#ff6600',
                                marginBottom: '15px',
                                fontSize: '16px'
                            }}>
                                Promotions disponibles ({availablePromotions.length})
                            </h3>
                            <div style={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #eee',
                                borderRadius: '6px',
                                padding: '10px'
                            }}>
                                {availablePromotions.map(promo => (
                                    <div
                                        key={promo.id}
                                        onClick={() => onPromotionSelect(promo)}
                                        style={{
                                            padding: '12px',
                                            border: `2px solid ${selectedPromotion?.id === promo.id ? '#ff6600' : '#f0f0f0'}`,
                                            borderRadius: '6px',
                                            marginBottom: '10px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedPromotion?.id === promo.id ? '#fff5f0' : 'white',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            if (selectedPromotion?.id !== promo.id) {
                                                e.currentTarget.style.borderColor = '#ff6600';
                                                e.currentTarget.style.backgroundColor = '#fafafa';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (selectedPromotion?.id !== promo.id) {
                                                e.currentTarget.style.borderColor = '#f0f0f0';
                                                e.currentTarget.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '5px'
                                        }}>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#333'
                                            }}>
                                                {promo.nom}
                                            </span>
                                            {selectedPromotion?.id === promo.id && (
                                                <Check size={18} style={{ color: '#ff6600' }} />
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '5px'
                                        }}>
                                            {promo.description}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#999'
                                        }}>
                                            Période: {promo.date_debut} → {promo.date_fin}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages d'erreur */}
                    {error && (
                        <div style={{
                            backgroundColor: '#fee',
                            color: '#c33',
                            padding: '12px',
                            borderRadius: '6px',
                            marginBottom: '20px',
                            border: '1px solid #fcc'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                        borderTop: '1px solid #eee',
                        paddingTop: '20px'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onAssignPromotion}
                            disabled={!selectedPromotion || loading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ff6600',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: !selectedPromotion || loading ? 'not-allowed' : 'pointer',
                                opacity: !selectedPromotion || loading ? 0.6 : 1,
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                if (!(!selectedPromotion || loading)) {
                                    e.target.style.backgroundColor = '#e55a00';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!(!selectedPromotion || loading)) {
                                    e.target.style.backgroundColor = '#ff6600';
                                }
                            }}
                        >
                            {loading ? 'Assignation...' : 'Assigner la promotion'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromotionAssignmentModal;