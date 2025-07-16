import React, { useState } from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';
import SearchPromotions from './SearchPromotions';
import CreatePromotion from './CreatePromotion';
import PromotionsList from './PromotionsList';
import './PromotionsManagement.css';

const PromotionsManagement = () => {
    const [activeView, setActiveView] = useState('list'); // 'list', 'search', 'create'
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api';

    const handlePromotionCreated = (newPromotion) => {
        setPromotions([...promotions, newPromotion]);
        setActiveView('list');
    };

    const handleSearchResults = (results) => {
        setPromotions(results);
        setActiveView('list');
    };

    const resetAll = () => {
        setPromotions([]);
        setError(null);
        setActiveView('list');
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
            default:
                return (
                    <div className="results-container">
                        <PromotionsList
                            promotions={promotions}
                            loading={loading}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="promotions-container">
            {/* Barre de navigation modernisée */}
            <nav className="orange-navbar">
                <ul className="nav-menu">
                    <li className={`nav-item ${activeView === 'search' ? 'active' : ''}`}>
                        <button onClick={() => setActiveView('search')}>
                            <Search size={18} />
                            Rechercher
                        </button>
                    </li>
                    <li className={`nav-item ${activeView === 'create' ? 'active' : ''}`}>
                        <button onClick={() => setActiveView('create')}>
                            <Plus size={18} />
                            Créer
                        </button>
                    </li>
                    <li className="nav-item">
                        <button onClick={resetAll} className="reset-btn">
                            <RotateCcw size={18} />
                            Réinitialiser
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Messages d'erreur */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Contenu dynamique */}
            {renderContent()}
        </div>
    );
};

export default PromotionsManagement;