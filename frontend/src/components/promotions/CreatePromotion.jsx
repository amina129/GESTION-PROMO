import React, { useState } from 'react';
import './PromotionsManagement.css';

const CreatePromotion = ({ onPromotionCreated, onCancel, setError, setLoading, API_BASE_URL, loading }) => {
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        valeur: '',
        dateDebut: '',
        dateFin: '',
        type: '',
        sousType: '',
        categorieClient: '',
        uniteMesure: '',
        typeUnite: ''
    });

    // Définitions des constantes
    const typesPromotion = [
        { value: 'relatif', label: 'Relatif' },
        { value: 'absolu', label: 'Absolu' }
    ];

    const sousTypesPromotion = {
        relatif: [{ value: 'remise', label: 'Remise' }],
        absolu: [
            { value: 'unite_gratuite', label: 'Unité gratuite' },
            { value: 'point_bonus', label: 'Point bonus' }
        ]
    };

    const typesUnite = [
        { value: 'DATA', label: 'DATA' },
        { value: 'SMS', label: 'SMS' },
        { value: 'APPEL', label: 'APPEL' }
    ];

    const unitesMesureParType = {
        DATA: [
            { value: 'MO', label: 'MO' },
            { value: 'GO', label: 'GO' }
        ],
        APPEL: [
            { value: 'minutes', label: 'Minutes' },
            { value: 'heures', label: 'Heures' }
        ]
    };

    const pourcentagesRemise = [
        { value: '10', label: '10%' },
        { value: '20', label: '20%' },
        { value: '30', label: '30%' },
        { value: '40', label: '40%' },
        { value: '50', label: '50%' }
    ];

    const categoriesClient = [
        { value: 'VIP', label: 'VIP' },
        { value: 'B2B', label: 'B2B' },
        { value: 'GP', label: 'GP' },
        { value: 'privé', label: 'Privé' }
    ];

    const createPromotion = async (promotionData) => {
        setLoading(true);
        setError(null);

        try {
            const dataToSend = {
                nom: promotionData.nom,
                description: promotionData.description,
                dateDebut: promotionData.dateDebut,
                dateFin: promotionData.dateFin,
                type: promotionData.type,
                sousType: promotionData.sousType,
                valeur: promotionData.valeur,
                categorieClient: [promotionData.categorieClient], // Wrap in array
                statut: "ACTIF",
                ...(promotionData.sousType === 'unite_gratuite' && {
                    typeUnite: promotionData.typeUnite,
                    ...(promotionData.typeUnite !== 'SMS' && {
                        uniteMesure: promotionData.uniteMesure
                    })
                })
            };

            const response = await fetch(`${API_BASE_URL}/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Erreur lors de la création');
            }

            const newPromotion = await response.json();
            onPromotionCreated(newPromotion);
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            description: '',
            valeur: '',
            dateDebut: '',
            dateFin: '',
            type: '',
            sousType: '',
            categorieClient: '',
            uniteMesure: '',
            typeUnite: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const shouldShowTypeUniteField = () => {
        return formData.sousType === 'unite_gratuite';
    };

    const shouldShowValeurField = () => {
        return formData.sousType && ['remise', 'unite_gratuite', 'point_bonus'].includes(formData.sousType);
    };

    const shouldShowUniteMesureField = () => {
        return formData.sousType === 'unite_gratuite' && formData.typeUnite && formData.typeUnite !== 'SMS';
    };

    const validateForm = () => {
        if (!formData.nom || !formData.type || !formData.sousType || !formData.categorieClient) {
            setError('Nom, type, sous-type et catégorie client sont obligatoires');
            return false;
        }

        if (formData.sousType === 'remise' && !formData.valeur) {
            setError('Pour une remise, la valeur est obligatoire');
            return false;
        }

        if (formData.sousType === 'unite_gratuite') {
            if (!formData.typeUnite) {
                setError('Pour une unité gratuite, le type d\'unité est obligatoire');
                return false;
            }
            if (!formData.valeur) {
                setError('Pour une unité gratuite, la quantité est obligatoire');
                return false;
            }
            if (formData.typeUnite !== 'SMS' && !formData.uniteMesure) {
                setError('L\'unité de mesure est obligatoire pour ce type d\'unité');
                return false;
            }
        }

        if (formData.sousType === 'point_bonus' && !formData.valeur) {
            setError('Pour les points bonus, la valeur est obligatoire');
            return false;
        }

        if (!formData.dateDebut || !formData.dateFin) {
            setError('Les dates de début et fin sont obligatoires');
            return false;
        }

        if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
            setError('La date de début doit être antérieure à la date de fin');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            createPromotion(formData);
        }
    };

    return (
        <div className="search-section">
            <div className="search-header">
                <h2>Créer une nouvelle promotion</h2>
            </div>

            <div className="search-container">
                {/* Section Informations générales */}
                <div className="search-group">
                    <h3 className="group-title">Informations générales</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Nom *</label>
                            <input
                                type="text"
                                name="nom"
                                placeholder="Nom de la promotion"
                                value={formData.nom}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="search-field">
                            <label>Description</label>
                            <textarea
                                className="search-textarea"
                                name="description"
                                placeholder="Description de la promotion"
                                rows="4"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Catégorie promotion */}
                <div className="search-group">
                    <h3 className="group-title">Catégorie promotion</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Type principal *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="">Sélectionner un type</option>
                                {typesPromotion.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search-field">
                            <label>Sous-type *</label>
                            <select
                                name="sousType"
                                value={formData.sousType}
                                onChange={handleInputChange}
                                disabled={!formData.type}
                            >
                                <option value="">Sélectionner un sous-type</option>
                                {formData.type && sousTypesPromotion[formData.type] &&
                                    sousTypesPromotion[formData.type].map(sousType => (
                                        <option key={sousType.value} value={sousType.value}>{sousType.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Détails promotion */}
                {shouldShowTypeUniteField() && (
                    <div className="search-group">
                        <h3 className="group-title">Détails promotion</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>Type d'unité *</label>
                                <select
                                    name="typeUnite"
                                    value={formData.typeUnite}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Sélectionner un type</option>
                                    {typesUnite.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Valeur */}
                {shouldShowValeurField() && (
                    <div className="search-group">
                        <h3 className="group-title">Valeur</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>
                                    Valeur *
                                    {formData.sousType === 'remise' && ' (%)'}
                                    {formData.sousType === 'unite_gratuite' && ' (quantité)'}
                                    {formData.sousType === 'point_bonus' && ' (points)'}
                                </label>
                                {formData.sousType === 'remise' ? (
                                    <select
                                        name="valeur"
                                        value={formData.valeur}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Sélectionner un pourcentage</option>
                                        {pourcentagesRemise.map(pct => (
                                            <option key={pct.value} value={pct.value}>{pct.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        name="valeur"
                                        placeholder={
                                            formData.sousType === 'unite_gratuite' ? 'Quantité' :
                                                formData.sousType === 'point_bonus' ? 'Points' : 'Valeur'
                                        }
                                        value={formData.valeur}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Unité de mesure */}
                {shouldShowUniteMesureField() && (
                    <div className="search-group">
                        <h3 className="group-title">Unité de mesure</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>Unité de mesure *</label>
                                <select
                                    name="uniteMesure"
                                    value={formData.uniteMesure}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Sélectionner une unité</option>
                                    {unitesMesureParType[formData.typeUnite] &&
                                        unitesMesureParType[formData.typeUnite].map(unite => (
                                            <option key={unite.value} value={unite.value}>{unite.label}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Catégorie client */}
                <div className="search-group">
                    <h3 className="group-title">Catégorie client</h3>
                    <div className="search-row">
                        <div className="search-field search-field-full">
                            <label>Catégorie Client *</label>
                            <select
                                name="categorieClient"
                                value={formData.categorieClient}
                                onChange={handleInputChange}
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categoriesClient.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Période */}
                <div className="search-group">
                    <h3 className="group-title">Période de validité</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Date de début *</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="search-field">
                            <label>Date de fin *</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions du formulaire */}
            <div className="search-actions">
                <div className="action-buttons">
                    <button
                        className="button button-secondary"
                        onClick={onCancel}
                    >
                        Annuler
                    </button>
                    <button
                        className="button button-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Création...' : 'Créer la promotion'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePromotion;