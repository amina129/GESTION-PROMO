import React, { useState, useEffect } from 'react';
import './base.css';
import './header.css';
import './buttons.css';
import './forms.css';
import './tables.css';
import './loading-empty.css';
import './responsive.css';

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

    // États pour les données dynamiques
    const [typesPromotion, setTypesPromotion] = useState([]);
    const [sousTypesPromotion, setSousTypesPromotion] = useState([]);
    const [categoriesClient, setCategoriesClient] = useState([]);
    const [typesUnite, setTypesUnite] = useState([]);
    const [unitesMesure, setUnitesMesure] = useState([]);
    const [pourcentagesRemise, setPourcentagesRemise] = useState([]);

    // Charger les données nécessaires
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [
                    typesResponse,
                    categoriesResponse,
                    typesUniteResponse,
                    pourcentagesResponse
                ] = await Promise.all([
                    fetch(`${API_BASE_URL}/promotion-types`),
                    fetch(`${API_BASE_URL}/categories-client`),
                    fetch(`${API_BASE_URL}/types-unite`).catch(() => ({ ok: false })), // API optionnelle
                    fetch(`${API_BASE_URL}/pourcentages-remise`).catch(() => ({ ok: false }))
                ]);

                // Traitement des réponses
                if (typesResponse.ok) {
                    const data = await typesResponse.json();
                    setTypesPromotion(data.map(item => ({ value: item.code, label: item.libelle })));
                } else {
                    throw new Error("Erreur lors du chargement des types");
                }

                if (categoriesResponse.ok) {
                    const data = await categoriesResponse.json();
                    setCategoriesClient(data.map(item => ({ value: item.code, label: item.libelle })));
                } else {
                    throw new Error("Erreur lors du chargement des catégories");
                }

                // Gestion des APIs optionnelles avec fallback
                if (typesUniteResponse.ok) {
                    const data = await typesUniteResponse.json();
                    setTypesUnite(data.map(item => ({ value: item.code, label: item.libelle })));
                } else {
                    setTypesUnite([
                        { value: 'DATA', label: '📊 DATA' },
                        { value: 'SMS', label: '💬 SMS' },
                        { value: 'APPEL', label: '📞 APPEL' }
                    ]);
                }

                if (pourcentagesResponse.ok) {
                    const data = await pourcentagesResponse.json();
                    setPourcentagesRemise(data.map(item => ({
                        value: item.valeur.toString(),
                        label: `${item.valeur}%`
                    })));
                } else {
                    setPourcentagesRemise([10, 20, 30, 40, 50].map(v => ({
                        value: v.toString(),
                        label: `${v}%`
                    })));
                }
            } catch (error) {
                console.error("Erreur:", error);
                setError?.(error.message);
            }
        };

        fetchInitialData();
    }, [API_BASE_URL, setError]);

    // Chargement des sous-types
    useEffect(() => {
        if (!formData.type) {
            setSousTypesPromotion([]);
            return;
        }

        const fetchSousTypes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/promotion-types/${formData.type}/sous-types`);
                if (!response.ok) throw new Error("Erreur lors du chargement des sous-types");
                const data = await response.json();
                setSousTypesPromotion(data.map(item => ({
                    value: item.code,
                    label: item.libelle
                })));
            } catch (error) {
                console.error("Erreur:", error);
                setError?.("Erreur lors du chargement des sous-types");
            }
        };

        fetchSousTypes();
    }, [formData.type, API_BASE_URL, setError]);

    // Chargement des unités de mesure
    useEffect(() => {
        if (!formData.typeUnite) {
            setUnitesMesure([]);
            return;
        }

        const fetchUnitesMesure = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/types-unite/${formData.typeUnite}/unites-mesure`);
                if (!response.ok) throw new Error("Erreur lors du chargement des unités");
                const data = await response.json();
                setUnitesMesure(data.map(item => ({
                    value: item.code,
                    label: item.libelle
                })));
            } catch (error) {
                console.error("Erreur:", error);
                const defaultUnites = {
                    'DATA': [
                        { value: 'MO', label: '📦 MO' },
                        { value: 'GO', label: '💽 GO' }
                    ],
                    'APPEL': [
                        { value: 'minutes', label: '⏱️ Minutes' },
                        { value: 'heures', label: '🕒 Heures' }
                    ],
                    'SMS': []
                };
                setUnitesMesure(defaultUnites[formData.typeUnite] || []);
            }
        };

        fetchUnitesMesure();
    }, [formData.typeUnite, API_BASE_URL, setError]);

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
                categorieClient: [promotionData.categorieClient],
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
            [name]: value,
            ...(name === 'type' && { sousType: '' }),
            ...(name === 'typeUnite' && { uniteMesure: '' })
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.nom) errors.push('Le nom est obligatoire');
        if (!formData.type) errors.push('Le type est obligatoire');
        if (!formData.sousType) errors.push('Le sous-type est obligatoire');
        if (!formData.categorieClient) errors.push('La catégorie client est obligatoire');

        if (formData.sousType === 'remise' && !formData.valeur) {
            errors.push('Pour une remise, la valeur est obligatoire');
        }

        if (formData.sousType === 'unite_gratuite') {
            if (!formData.typeUnite) errors.push('Le type d\'unité est obligatoire');
            if (!formData.valeur) errors.push('La quantité est obligatoire');
            if (formData.typeUnite !== 'SMS' && !formData.uniteMesure) {
                errors.push('L\'unité de mesure est obligatoire');
            }
        }

        if (formData.sousType === 'point_bonus' && !formData.valeur) {
            errors.push('La valeur des points est obligatoire');
        }

        if (!formData.dateDebut || !formData.dateFin) {
            errors.push('Les dates de début et fin sont obligatoires');
        } else if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
            errors.push('La date de début doit être antérieure à la date de fin');
        }

        if (errors.length > 0) {
            setError(errors.join('\n'));
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createPromotion(formData);
        }
    };

    return (
        <div >
            <form onSubmit={handleSubmit} className="search-container">
                {/* Section Informations générales */}
                <div className="search-group">
                    <h3 className="group-title">📝 Informations générales</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Nom *</label>
                            <input
                                type="text"
                                name="nom"
                                placeholder="Nom de la promotion"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required
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
                    <h3 className="group-title">🏷️ Catégorie promotion</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Type principal *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
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
                                required
                            >
                                <option value="">Sélectionner un sous-type</option>
                                {sousTypesPromotion.map(sousType => (
                                    <option key={sousType.value} value={sousType.value}>{sousType.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Détails promotion */}
                {formData.sousType === 'unite_gratuite' && (
                    <div className="search-group">
                        <h3 className="group-title">⚙️ Détails promotion</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>Type d'unité *</label>
                                <select
                                    name="typeUnite"
                                    value={formData.typeUnite}
                                    onChange={handleInputChange}
                                    required={formData.sousType === 'unite_gratuite'}
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
                {['remise', 'unite_gratuite', 'point_bonus'].includes(formData.sousType) && (
                    <div className="search-group">
                        <h3 className="group-title">💰 Valeur</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>
                                    {formData.sousType === 'remise' && 'Remise * (%)'}
                                    {formData.sousType === 'unite_gratuite' && 'Quantité *'}
                                    {formData.sousType === 'point_bonus' && 'Points bonus *'}
                                </label>
                                {formData.sousType === 'remise' ? (
                                    <select
                                        name="valeur"
                                        value={formData.valeur}
                                        onChange={handleInputChange}
                                        required
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
                                            formData.sousType === 'unite_gratuite' ? 'Quantité' : 'Points'
                                        }
                                        value={formData.valeur}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Unité de mesure */}
                {formData.sousType === 'unite_gratuite' && formData.typeUnite && formData.typeUnite !== 'SMS' && (
                    <div className="search-group">
                        <h3 className="group-title">📏 Unité de mesure</h3>
                        <div className="search-row">
                            <div className="search-field">
                                <label>Unité de mesure *</label>
                                <select
                                    name="uniteMesure"
                                    value={formData.uniteMesure}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner une unité</option>
                                    {unitesMesure.map(unite => (
                                        <option key={unite.value} value={unite.value}>{unite.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Catégorie client */}
                <div className="search-group">
                    <h3 className="group-title">👥 Catégorie client</h3>
                    <div className="search-row">
                        <div className="search-field search-field-full">
                            <label>Catégorie Client *</label>
                            <select
                                name="categorieClient"
                                value={formData.categorieClient}
                                onChange={handleInputChange}
                                required
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
                    <h3 className="group-title">📅 Période de validité</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Date de début *</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="search-field">
                            <label>Date de fin *</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Actions du formulaire */}
                <div className="search-actions">
                    <div className="action-buttons">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={onCancel}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={loading}
                        >
                            {loading ? '⏳ Création en cours...' : '✅ Créer la promotion'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePromotion;