import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Edit, Save, AlertCircle } from 'lucide-react';
import './base.css';
import './buttons.css';
import './forms.css';
import './responsive.css';
import './EditPromotionModal.css';  // ton CSS dédié modal


const EditPromotionModal = ({
                                promotion,
                                editMode,
                                onClose,
                                onSave,
                                loading,
                                error,
                                API_BASE_URL
                            }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        categorieClient: '',
        newCategories: []
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoriesClient, setCategoriesClient] = useState([]);

    // Charger les catégories client dynamiquement
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories-client`);
                if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
                const data = await response.json();
                const formatted = data.map(cat => ({
                    value: cat.code,
                    label: cat.libelle
                }));
                setCategoriesClient(formatted);
            } catch (error) {
                console.error("Erreur:", error);
                // Utiliser les catégories par défaut en cas d'erreur
                setCategoriesClient([
                    { value: 'GP', label: 'GP' },
                    { value: 'privé', label: 'Privé' },
                    { value: 'VIP', label: 'VIP' },
                    { value: 'B2B', label: 'B2B' }
                ]);
            }
        };

        fetchCategories();
    }, [API_BASE_URL]);

    useEffect(() => {
        if (promotion) {
            setFormData({
                nom: promotion.nom || '',
                description: promotion.description || '',
                dateDebut: promotion.dateDebut || '',
                dateFin: promotion.dateFin || '',
                categorieClient: promotion.categorieClient || '',
                newCategories: []
            });

            // Gestion des catégories existantes (peut être séparées par des virgules)
            const existingCategories = Array.isArray(promotion.categorieClient)
                ? promotion.categorieClient
                : (promotion.categorieClient ? promotion.categorieClient.split(',').map(cat => cat.trim()) : []);

            setSelectedCategories(existingCategories);
        }
    }, [promotion]);

    const validateForm = () => {
        const errors = {};

        if (editMode === 'period') {
            if (!formData.dateDebut) errors.dateDebut = 'La date de début est requise';
            if (!formData.dateFin) errors.dateFin = 'La date de fin est requise';
            if (formData.dateDebut && formData.dateFin && formData.dateDebut > formData.dateFin) {
                errors.dateFin = 'La date de fin doit être postérieure à la date de début';
            }
        }

        if (editMode === 'category') {
            if (selectedCategories.length === 0) {
                errors.categorieClient = 'Au moins une catégorie doit être sélectionnée';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (editMode === 'category') {
                // Dans handleSubmit (mode category):
                const nouvellesCategories = selectedCategories
                    .filter(cat => !promotion.categories?.some(c => c.code === cat));

                await onSave({
                    id: promotion.id,
                    categories: nouvellesCategories
                }, editMode);
            } else if (editMode === 'period') {
                // Mode period - mise à jour des dates
                await onSave({
                    id: promotion.id,
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin
                }, editMode);
            }

        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const getModalTitle = () => {
        switch (editMode) {
            case 'period': return 'Prolonger la période de validité';
            case 'category': return 'Étendre les catégories client';
            default: return 'Modifier la promotion';
        }
    };

    const getModalIcon = () => {
        switch (editMode) {
            case 'period': return <Calendar size={20} />;
            case 'category': return <Users size={20} />;
            default: return <Edit size={20} />;
        }
    };

    if (!promotion) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content edit-promotion-modal">
                <div className="modal-header">
                    <div className="modal-title">
                        {getModalIcon()}
                        <h2>{getModalTitle()}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Période de validité */}
                        {editMode === 'period' && (
                            <div className="form-section">
                                <h3>Période de validité</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date de début</label>
                                        <input
                                            type="date"
                                            value={formData.dateDebut}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                                            className={validationErrors.dateDebut ? 'error' : ''}
                                        />
                                        {validationErrors.dateDebut && <span className="error-text">{validationErrors.dateDebut}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Date de fin</label>
                                        <input
                                            type="date"
                                            value={formData.dateFin}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                                            className={validationErrors.dateFin ? 'error' : ''}
                                        />
                                        {validationErrors.dateFin && <span className="error-text">{validationErrors.dateFin}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Catégories client */}
                        {editMode === 'category' && (
                            <div className="form-section">
                                <h3>Catégories client ciblées</h3>
                                <div className="categories-selection">
                                    {categoriesClient.map(cat => (
                                        <label key={cat.value} className="category-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.value)}
                                                onChange={() => handleCategoryChange(cat.value)}
                                            />
                                            <span className="checkbox-label">{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {validationErrors.categorieClient &&
                                    <span className="error-text">{validationErrors.categorieClient}</span>
                                }
                            </div>
                        )}

                        {/* Résumé des modifications */}
                        <div className="form-section summary-section">
                            <h3>Résumé des modifications</h3>
                            <div className="summary-content">
                                <div className="summary-item">
                                    <strong>Promotion:</strong> {promotion.nom}
                                </div>
                                {editMode === 'period' && (
                                    <>
                                        <div className="summary-item">
                                            <strong>Ancienne période:</strong> {promotion.dateDebut} → {promotion.dateFin}
                                        </div>
                                        <div className="summary-item">
                                            <strong>Nouvelle période:</strong> {formData.dateDebut} → {formData.dateFin}
                                        </div>
                                    </>
                                )}
                                {editMode === 'category' && (
                                    <>
                                        <div className="summary-item">
                                            <strong>Catégories actuelles:</strong>
                                            {promotion.categories?.map(c => c.code).join(', ')}
                                        </div>
                                        <div className="summary-item">
                                            <strong>Nouvelles catégories:</strong> {selectedCategories.join(', ')}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="button button-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="button button-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-text">Sauvegarde...</span>
                        ) : (
                            <>
                                <Save size={16} />
                                Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPromotionModal;