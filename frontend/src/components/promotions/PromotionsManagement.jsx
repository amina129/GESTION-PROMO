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
    const [previousView, setPreviousView] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api';

    const handleBack = () => {
        if (previousView) {
            setPromotions([]);
            setActiveView(previousView);
            setPreviousView(null);
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

    const resetAll = () => {
        setPromotions([]);
        setError(null);
        setActiveView('list');
        setPreviousView(null);
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
                            onBack={previousView ? handleBack : null}
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
                    <li className="nav-item">
                        <button onClick={resetAll} className="reset-btn">
                            <RotateCcw size={18} />
                            Réinitialiser
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

export default PromotionsManagement;