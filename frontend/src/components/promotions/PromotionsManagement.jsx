import React, { useState } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import SearchPromotions from './SearchPromotions';
import CreatePromotion from './CreatePromotion';
import PromotionsList from './PromotionsList';
import './PromotionsManagement.css';

const PromotionsManagement = () => {
    const [activeView, setActiveView] = useState('list'); // 'list', 'search', 'create', 'edit'
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previousView, setPreviousView] = useState(null);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [editMode, setEditMode] = useState(null); // 'period' or 'category'

    const API_BASE_URL = 'http://localhost:8080/api';

    const handleBack = () => {
        if (previousView) {
            setPromotions([]);
            setActiveView(previousView);
            setPreviousView(null);
            setEditingPromotion(null);
            setEditMode(null);
        }
    };

    const handlePromotionCreated = (newPromotion) => {
        setPromotions([...promotions, newPromotion]);
        setActiveView('list');
        setPreviousView('create');
    };

    const handleSearchResults = (results) => {
        setPromotions(results);
        setActiveView('list');
        setPreviousView('search');
    };

    const handleEditPromotion = (promotion, mode) => {
        setEditingPromotion(promotion);
        setEditMode(mode);
        setActiveView('edit');
        setPreviousView('list');
    };

    const handlePromotionUpdated = (updatedPromotion) => {
        setPromotions(promotions.map(p =>
            p.id === updatedPromotion.id ? updatedPromotion : p
        ));
        setActiveView('list');
        setPreviousView('edit');
        setEditingPromotion(null);
        setEditMode(null);
    };

    const resetAll = () => {
        setPromotions([]);
        setError(null);
        setActiveView('list');
        setPreviousView(null);
        setEditingPromotion(null);
        setEditMode(null);
    };

    const prolongerPeriode = async (promotionId, nouvelleDateFin) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}/prolonger`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nouvelleDateFin: nouvelleDateFin
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la prolongation de la promotion');
            }

            const updatedPromotion = await response.json();
            handlePromotionUpdated(updatedPromotion);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const etendreCategories = async (promotionId, nouvellesCategories) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}/etendre-categories`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send as raw array (not wrapped in object) to match backend List<String> parameter
                body: JSON.stringify(nouvellesCategories)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'extension des catégories');
            }

            const updatedPromotion = await response.json();
            handlePromotionUpdated(updatedPromotion);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderEditForm = () => {
        if (!editingPromotion || !editMode) return null;

        if (editMode === 'period') {
            return (
                <div className="edit-form-container">
                    <h3>Prolonger la période - {editingPromotion.nom}</h3>
                    <ProlongationForm
                        promotion={editingPromotion}
                        onSubmit={prolongerPeriode}
                        onCancel={() => setActiveView('list')}
                        loading={loading}
                    />
                </div>
            );
        } else if (editMode === 'category') {
            return (
                <div className="edit-form-container">
                    <h3>Étendre les catégories - {editingPromotion.nom}</h3>
                    <ExtensionCategoriesForm
                        promotion={editingPromotion}
                        onSubmit={etendreCategories}
                        onCancel={() => setActiveView('list')}
                        loading={loading}
                    />
                </div>
            );
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'search':
                return (
                    <div className="search-section">
                        <SearchPromotions
                            onSearchResults={handleSearchResults}
                            onCancel={() => setActiveView('list')}
                            setError={setError}
                            setLoading={setLoading}
                            API_BASE_URL={API_BASE_URL}
                        />
                    </div>
                );
            case 'create':
                return (
                    <div className="search-section">
                        <CreatePromotion
                            onPromotionCreated={handlePromotionCreated}
                            onCancel={() => setActiveView('list')}
                            setError={setError}
                            setLoading={setLoading}
                            API_BASE_URL={API_BASE_URL}
                        />
                    </div>
                );
            case 'edit':
                return renderEditForm();
            default:
                return (
                    <div className="results-container">
                        <PromotionsList
                            promotions={promotions}
                            loading={loading}
                            onBack={previousView ? handleBack : null}
                            onEditPromotion={handleEditPromotion}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="promotions-container">
            <nav className="orange-navbar">
                <ul className="nav-menu">
                    <li className={`nav-item ${activeView === 'search' ? 'active' : ''}`}>
                        <button onClick={() => {
                            setActiveView('search');
                            setPreviousView('list');
                        }}>
                            <Search size={18} />
                            Rechercher
                        </button>
                    </li>
                    <li className={`nav-item ${activeView === 'create' ? 'active' : ''}`}>
                        <button onClick={() => {
                            setActiveView('create');
                            setPreviousView('list');
                        }}>
                            <Plus size={18} />
                            Créer
                        </button>
                    </li>
                </ul>
            </nav>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {renderContent()}
        </div>
    );
};

// Composant pour le formulaire de prolongation
const ProlongationForm = ({ promotion, onSubmit, onCancel, loading }) => {
    const [nouvelleDateFin, setNouvelleDateFin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nouvelleDateFin) {
            onSubmit(promotion.id, nouvelleDateFin);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
                <label>Date de fin actuelle:</label>
                <input type="date" value={promotion.dateFin} disabled />
            </div>
            <div className="form-group">
                <label>Nouvelle date de fin:</label>
                <input
                    type="date"
                    value={nouvelleDateFin}
                    onChange={(e) => setNouvelleDateFin(e.target.value)}
                    min={promotion.dateFin}
                    required
                />
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} disabled={loading}>
                    Annuler
                </button>
                <button type="submit" disabled={loading || !nouvelleDateFin}>
                    {loading ? 'Prolongation...' : 'Prolonger'}
                </button>
            </div>
        </form>
    );
};

// Composant pour le formulaire d'extension des catégories
const ExtensionCategoriesForm = ({ promotion, onSubmit, onCancel, loading }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const availableCategories = ['GP', 'privé', 'VIP', 'B2B'];

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCategories.length > 0) {
            const allCategories = [...new Set([promotion.categorieClient, ...selectedCategories])];
            onSubmit(promotion.id, allCategories);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
                <label>Catégorie actuelle:</label>
                <span className={`category-badge ${promotion.categorieClient.toLowerCase()}`}>
                    {promotion.categorieClient}
                </span>
            </div>
            <div className="form-group">
                <label>Ajouter les catégories:</label>
                <div className="categories-grid">
                    {availableCategories
                        .filter(cat => cat !== promotion.categorieClient)
                        .map(category => (
                            <label key={category} className="category-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryToggle(category)}
                                />
                                <span className={`category-badge ${category.toLowerCase()}`}>
                                    {category}
                                </span>
                            </label>
                        ))}
                </div>
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} disabled={loading}>
                    Annuler
                </button>
                <button type="submit" disabled={loading || selectedCategories.length === 0}>
                    {loading ? 'Extension...' : 'Étendre'}
                </button>
            </div>
        </form>
    );
};

export default PromotionsManagement;