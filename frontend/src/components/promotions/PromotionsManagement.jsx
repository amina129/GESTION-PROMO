import React, { useState } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [searchFields, setSearchFields] = useState({
        nom: '',
        type: '',
        sousType: '',
        dateDebut: '',
        dateFin: '',
        categorieClient: ''
    });
    const [showSearchFields, setShowSearchFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
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
        typeUnite: '' // nouveau champ pour DATA/SMS/APPEL
    });

    const API_BASE_URL = 'http://localhost:8080/api/promotions';
    // Options pour les catégories client
    const categoriesClient = [
        { value: 'VIP', label: 'VIP' },
        { value: 'B2B', label: 'B2B' },
        { value: 'JP', label: 'JP' },
        { value: 'privé', label: 'Privé' }
    ];

    // Types de promotion principaux
    const typesPromotion = [
        { value: 'relatif', label: 'Relatif' },
        { value: 'absolu', label: 'Absolu' }
    ];

    // Sous-types selon le type principal
    const sousTypesPromotion = {
        relatif: [
            { value: 'remise', label: 'Remise' }
        ],
        absolu: [
            { value: 'unite_gratuite', label: 'Unité gratuite' },
            { value: 'point_bonus', label: 'Point bonus' }
        ]
    };

    // Pourcentages prédéfinis pour les remises
    const pourcentagesRemise = [
        { value: '10', label: '10%' },
        { value: '20', label: '20%' },
        { value: '30', label: '30%' },
        { value: '40', label: '40%' },
        { value: '50', label: '50%' },
        { value: '60', label: '60%' },
        { value: '70', label: '70%' }
    ];

    // Types d'unités pour les unités gratuites
    const typesUnite = [
        { value: 'DATA', label: 'DATA' },
        { value: 'SMS', label: 'SMS' },
        { value: 'APPEL', label: 'APPEL' }
    ];

    // Options pour les unités de mesure selon le type d'unité
    const unitesMesureParType = {
        DATA: [
            { value: 'MO', label: 'MO' },
            { value: 'GO', label: 'GO' }
        ],
        APPEL: [
            { value: 'minutes', label: 'Minutes' },
            { value: 'heures', label: 'Heures' }
        ]
        // SMS n'a pas d'unité de mesure
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
            setPromotions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createPromotion = async (promotionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promotionData),
            });
            if (!response.ok) throw new Error('Erreur lors de la création de la promotion');
            const newPromotion = await response.json();
            setPromotions([...promotions, newPromotion]);
            setShowCreateForm(false);
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
        setShowCreateForm(false);
    };

    const resetAll = () => {
        setPromotions([]);
        setSearchFields({
            nom: '',
            type: '',
            sousType: '',
            dateDebut: '',
            dateFin: '',
            categorieClient: ''
        });
        setError(null);
        resetForm();
        setShowSearchFields(false);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Réinitialiser les champs dépendants
            if (name === 'type') {
                newData.sousType = '';
                newData.valeur = '';
                newData.uniteMesure = '';
                newData.typeUnite = '';
            }

            if (name === 'sousType') {
                newData.valeur = '';
                newData.uniteMesure = '';
                newData.typeUnite = '';
            }

            if (name === 'typeUnite') {
                newData.uniteMesure = '';
            }

            return newData;
        });

        // Réinitialiser l'erreur quand l'utilisateur modifie les champs
        if (error) setError(null);
    };

    const handleSearchChange = (field, value) => {
        setSearchFields(prev => {
            const newFields = { ...prev, [field]: value };

            // Réinitialiser le sous-type si le type principal change
            if (field === 'type') {
                newFields.sousType = '';
            }

            return newFields;
        });
    };

    const formatValeur = (promotion) => {
        if (promotion.sousType === 'remise') {
            return `${promotion.valeur}%`;
        } else if (promotion.sousType === 'unite_gratuite') {
            return `${promotion.valeur} ${promotion.uniteMesure || ''}`;
        } else if (promotion.sousType === 'point_bonus') {
            return `${promotion.valeur} points`;
        }
        return promotion.valeur;
    };

    const formatTypePromotion = (promotion) => {
        const typeLabel = promotion.type === 'relatif' ? 'Relatif' : 'Absolu';
        let sousTypeLabel = '';

        if (promotion.sousType === 'remise') sousTypeLabel = 'Remise';
        else if (promotion.sousType === 'unite_gratuite') sousTypeLabel = 'Unité gratuite';
        else if (promotion.sousType === 'point_bonus') sousTypeLabel = 'Point bonus';

        return `${typeLabel} - ${sousTypeLabel}`;
    };

    const shouldShowValeurField = () => {
        return formData.sousType && ['remise', 'unite_gratuite', 'point_bonus'].includes(formData.sousType);
    };

    const shouldShowTypeUniteField = () => {
        return formData.sousType === 'unite_gratuite';
    };

    const shouldShowUniteMesureField = () => {
        return formData.sousType === 'unite_gratuite' && formData.typeUnite && formData.typeUnite !== 'SMS';
    };

    return (
        <div>
            {/* Champs de recherche */}
            {showSearchFields && (
                <div >
                    <h2 >Rechercher une promotion</h2>
                    <div >
                        <div>
                            <label >Nom</label>
                            <input
                                type="text"
                                placeholder="Nom de la promotion"
                                value={searchFields.nom}
                                onChange={(e) => handleSearchChange('nom', e.target.value)}
                            />
                        </div>
                        <div>
                            <label >Type principal</label>
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
                        <div>
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
                        <div>
                            <label>Date début</label>
                            <input
                                type="date"
                                value={searchFields.dateDebut}
                                onChange={(e) => handleSearchChange('dateDebut', e.target.value)}
                            />
                        </div>
                        <div>
                            <label >Date fin</label>
                            <input
                                type="date"
                                value={searchFields.dateFin}
                                onChange={(e) => handleSearchChange('dateFin', e.target.value)}
                            />
                        </div>
                        <div>
                            <label >Catégorie client</label>
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
                    <div >
                        <button
                            onClick={searchPromotions}
                        >
                            Rechercher
                        </button>
                        <button
                            onClick={() => setSearchFields({
                                nom: '', type: '', sousType: '', dateDebut: '', dateFin: '', categorieClient: ''
                            })}
                        >
                            Réinitialiser filtres
                        </button>
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            <div >
                <button
                    onClick={() => setShowSearchFields(!showSearchFields)}
                >
                    <Search size={20} />
                    {showSearchFields ? 'Masquer la recherche' : 'Rechercher une promotion'}
                </button>
                <button
                    onClick={() => setShowCreateForm(true)}
                >
                    <Plus size={20} />
                    Créer une promotion
                </button>
                <button
                    onClick={resetAll}
                >
                    <RotateCcw size={20} />
                    Réinitialiser tout
                </button>
            </div>

            {/* Messages d'erreur */}
            {error && (
                <div >
                    {error}
                </div>
            )}

            {/* Formulaire de création */}
            {showCreateForm && (
                <div >
                    <h2 >Créer une nouvelle promotion</h2>
                    <div >
                        <div>
                            <label>Nom *</label>
                            <input
                                type="text"
                                name="nom"
                                placeholder="Nom de la promotion"
                                value={formData.nom}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div >
                            <label >Description</label>
                            <textarea
                                name="description"
                                placeholder="Description de la promotion"
                                rows="3"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label >Type principal *</label>
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
                        <div>
                            <label >Sous-type *</label>
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

                        {/* Champ Type d'unité - affiché seulement pour unité gratuite */}
                        {shouldShowTypeUniteField() && (
                            <div>
                                <label >Type d'unité *</label>
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
                        )}

                        {/* Champ Valeur - affiché seulement si un sous-type est sélectionné */}
                        {shouldShowValeurField() && (
                            <div>
                                <label >
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
                        )}

                        {/* Champ Unité de mesure - affiché selon le type d'unité */}
                        {shouldShowUniteMesureField() && (
                            <div>
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
                        )}
                        <div>
                            <label >Catégorie Client *</label>
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

                        <div>
                            <label >Date de début *</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label >Date de fin *</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>

                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer la promotion'}
                        </button>
                        <button
                            onClick={resetForm}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Tableau des résultats */}
            <div >
                {loading && <div >Chargement...</div>}

                {!loading && promotions.length > 0 && (
                    <div >
                        <table >
                            <thead >
                            <tr>
                                <th >Nom</th>
                                <th >Description</th>
                                <th >Valeur</th>
                                <th >Période</th>
                                <th >Type</th>
                                <th >Catégorie</th>
                            </tr>
                            </thead>
                            <tbody >
                            {promotions.map(p => (
                                <tr key={p.id} >
                                    <td >{p.nom}</td>
                                    <td >{p.description}</td>
                                    <td >{formatValeur(p)}</td>
                                    <td >{p.dateDebut} → {p.dateFin}</td>
                                    <td >{formatTypePromotion(p)}</td>
                                    <td >
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            p.categorieClient === 'VIP' ? 'bg-yellow-100 text-yellow-800' :
                                                p.categorieClient === 'B2B' ? 'bg-indigo-100 text-indigo-800' :
                                                    p.categorieClient === 'JP' ? 'bg-pink-100 text-pink-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}>
                                            {p.categorieClient}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && promotions.length === 0 && (
                    <div >
                        Aucune promotion trouvée. Utilisez la recherche ou créez une nouvelle promotion.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionsManagement;