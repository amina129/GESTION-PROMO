import React, { useState } from 'react';
import { ChevronLeft, Edit, Calendar, Users, MoreVertical, ChevronDown } from 'lucide-react';
import './PromotionsManagement.css';

const PromotionsList = ({ promotions, loading, onBack, onEditPromotion }) => {
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

// Composant pour le menu d'actions de chaque promotion
    const PromotionActionMenu = ({ promotion, onEditPromotion }) => {
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const handleMenuToggle = () => {
            setIsMenuOpen(!isMenuOpen);
        };

        const handleOptionClick = (mode) => {
            onEditPromotion(promotion, mode);
            setIsMenuOpen(false);
        };

        return (
            <div className="action-menu-container">
                <button
                    className="action-menu-trigger"
                    onClick={handleMenuToggle}
                    title="Options de modification"
                >
                    <Edit size={14} />
                    <ChevronDown size={12} />
                </button>

                {isMenuOpen && (
                    <>
                        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
                        <div className="action-menu">
                            <button
                                className="menu-item"
                                onClick={() => handleOptionClick('period')}
                            >
                                <Calendar size={14} />
                                <span>Prolonger la période</span>
                            </button>
                            <button
                                className="menu-item"
                                onClick={() => handleOptionClick('category')}
                            >
                                <Users size={14} />
                                <span>Étendre les catégories</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const formatTypePromotion = (promotion) => {
        const typeLabel = promotion.type === 'relatif' ? 'Relatif' : 'Absolu';
        let sousTypeLabel = '';

        if (promotion.sousType === 'remise') sousTypeLabel = 'Remise';
        else if (promotion.sousType === 'unite_gratuite') sousTypeLabel = 'Unité gratuite';
        else if (promotion.sousType === 'point_bonus') sousTypeLabel = 'Point bonus';

        return `${typeLabel} - ${sousTypeLabel}`;
    };

    const isPromotionExpired = (dateFin) => {
        return new Date(dateFin) < new Date();
    };

    const isPromotionActive = (dateDebut, dateFin) => {
        const now = new Date();
        return new Date(dateDebut) <= now && new Date(dateFin) >= now;
    };

    const getPromotionStatus = (promotion) => {
        if (isPromotionExpired(promotion.dateFin)) return 'expired';
        if (isPromotionActive(promotion.dateDebut, promotion.dateFin)) return 'active';
        return 'upcoming';
    };

    if (loading) {
        return (
            <div className="promotions-loading">
                <div className="loading-spinner"></div>
                <p>Chargement des promotions...</p>
            </div>
        );
    }

    if (promotions.length === 0) {
        return (
            <div className="promotions-empty">
                <p>Utilisez la recherche ou créez une nouvelle promotion.</p>
            </div>
        );
    }

    return (
        <div className="promotions-list-container">
            {onBack && (
                <button onClick={onBack} className="back-button">
                    <ChevronLeft size={16} />
                    Retour
                </button>
            )}

            <div className="promotions-header">
                <h3>{promotions.length} promotion(s) trouvée(s)</h3>
            </div>

            <div className="promotions-table-container">
                <table className="promotions-table">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Valeur</th>
                        <th>Période</th>
                        <th>Type</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {promotions.map(p => (
                        <tr key={p.id} className={`promotion-row ${getPromotionStatus(p)}`}>
                            <td className="promotion-name">{p.nom}</td>
                            <td className="promotion-description">{p.description}</td>
                            <td className="promotion-value">{formatValeur(p)}</td>
                            <td className="promotion-period">
                                <div className="period-container">
                                    <span className="date">{p.dateDebut}</span>
                                    <span className="arrow">→</span>
                                    <span className="date">{p.dateFin}</span>
                                </div>
                            </td>
                            <td className="promotion-type">{formatTypePromotion(p)}</td>
                            <td className="promotion-category">
                                <span className={`category-badge ${p.categorieClient.toLowerCase()}`}>
                                    {p.categorieClient}
                                </span>
                            </td>
                            <td className="promotion-status">
                                <span className={`status-badge ${getPromotionStatus(p)}`}>
                                    {getPromotionStatus(p) === 'active' ? 'Active' :
                                        getPromotionStatus(p) === 'expired' ? 'Expirée' : 'À venir'}
                                </span>
                            </td>
                            <td className="promotion-actions">
                                <PromotionActionMenu
                                    promotion={p}
                                    onEditPromotion={onEditPromotion}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromotionsList;