import React, { useState } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import './PromotionsManagement.css';

const SearchPromotions = ({ onSearchResults, onCancel, setError, setLoading, API_BASE_URL }) => {
    const [searchFields, setSearchFields] = useState({
        nom: '',
        type: '',
        sousType: '',
        dateDebut: '',
        dateFin: '',
        categorieClient: ''
    });

    const categoriesClient = [
        { value: 'VIP', label: 'VIP' },
        { value: 'B2B', label: 'B2B' },
        { value: 'GP', label: 'GP' },
        { value: 'privé', label: 'Privé' }
    ];

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

    const searchPromotions = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            if (searchFields.nom) queryParams.append("nom", searchFields.nom);
            if (searchFields.type) queryParams.append("type", searchFields.type);
            if (searchFields.sousType) queryParams.append("sousType", searchFields.sousType);
            if (searchFields.dateDebut) queryParams.append("dateDebut", searchFields.dateDebut);
            if (searchFields.dateFin) queryParams.append("dateFin", searchFields.dateFin);
            if (searchFields.categorieClient) queryParams.append("categorieClient", searchFields.categorieClient);

            const response = await fetch(`${API_BASE_URL}/promotions/search?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Erreur lors du chargement des promotions");
            const data = await response.json();
            onSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (field, value) => {
        setSearchFields(prev => {
            const newFields = { ...prev, [field]: value };
            if (field === 'type') {
                newFields.sousType = '';
            }
            return newFields;
        });
    };

    const resetSearch = () => {
        setSearchFields({
            nom: '',
            type: '',
            sousType: '',
            dateDebut: '',
            dateFin: '',
            categorieClient: ''
        });
    };


    return (
        <div className="search-section">
            <div className="search-header">
                <h2>Rechercher une promotion</h2>
            </div>

            <div className="search-container">
                {/* Section Informations générales */}
                <div className="search-group">
                    <h3 className="group-title">Nom de la promotion</h3>
                    <div className="search-row">
                        <div className="search-field search-field-full">
                            <input
                                type="text"
                                placeholder="Saisissez le nom de la promotion"
                                value={searchFields.nom}
                                onChange={(e) => handleSearchChange('nom', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Types de promotion */}
                <div className="search-group">
                    <h3 className="group-title">Types de promotion</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Type principal</label>
                            <select
                                value={searchFields.type}
                                onChange={(e) => handleSearchChange('type', e.target.value)}
                            >
                                <option value="">Tous les types</option>
                                {typesPromotion.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search-field">
                            <label>Sous-type</label>
                            <select
                                value={searchFields.sousType}
                                onChange={(e) => handleSearchChange('sousType', e.target.value)}
                                disabled={!searchFields.type}
                            >
                                <option value="">Tous les sous-types</option>
                                {searchFields.type && sousTypesPromotion[searchFields.type] &&
                                    sousTypesPromotion[searchFields.type].map(sousType => (
                                        <option key={sousType.value} value={sousType.value}>{sousType.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Période */}
                <div className="search-group">
                    <h3 className="group-title">Période de validité</h3>
                    <div className="search-row">
                        <div className="search-field">
                            <label>Date de début</label>
                            <input
                                type="date"
                                value={searchFields.dateDebut}
                                onChange={(e) => handleSearchChange('dateDebut', e.target.value)}
                            />
                        </div>
                        <div className="search-field">
                            <label>Date de fin</label>
                            <input
                                type="date"
                                value={searchFields.dateFin}
                                onChange={(e) => handleSearchChange('dateFin', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Catégorie client */}
                <div className="search-group">
                    <h3 className="group-title">Catégorie client</h3>
                    <div className="search-row">
                        <div className="search-field search-field-full">
                            <label>Catégorie client ciblée</label>
                            <select
                                value={searchFields.categorieClient}
                                onChange={(e) => handleSearchChange('categorieClient', e.target.value)}
                            >
                                <option value="">Toutes les catégories</option>
                                {categoriesClient.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-actions">
                <div className="search-summary">
                    <span className="filter-count">
                        {Object.values(searchFields).filter(val => val !== '').length} filtres actifs
                    </span>
                </div>
                <div className="action-buttons">
                    <button className="button button-secondary" onClick={onCancel}>
                        Annuler
                    </button>
                    <button className="button button-secondary" onClick={resetSearch}>
                        Réinitialiser
                    </button>
                    <button className="button button-primary" onClick={searchPromotions}>
                        Rechercher
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPromotions;