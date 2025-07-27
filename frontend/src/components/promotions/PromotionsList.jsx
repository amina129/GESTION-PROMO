import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Edit, Calendar, Users, ChevronDown } from 'lucide-react';
import './base.css';
import './header.css';
import './buttons.css';
import './forms.css';
import './tables.css';
import './loading-empty.css';
import './responsive.css';

const PromotionsList = ({ promotions, loading, onBack, onEditPromotion }) => {
    const listRef = useRef(null);
    const [visiblePromotions, setVisiblePromotions] = useState([]);

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

    useEffect(() => {
        if (promotions && promotions.length > 0) {
            // Affiche seulement les 5 premières promotions
            setVisiblePromotions(promotions.slice(0, 5));
        } else {
            setVisiblePromotions([]);
        }

        if (listRef.current) {
            listRef.current.scrollTop = 0;
            window.scrollTo(0, 0);
        }
    }, [promotions]);

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

    if (loading) {
        return (
            <div className="promotions-loading">
                <div className="loading-spinner"></div>
                <p>Chargement des promotions...</p>
            </div>
        );
    }

    if (visiblePromotions.length === 0) {
        return (
            <div className="promotions-empty">
                <p>Utilisez la recherche ou créez une nouvelle promotion.</p>
            </div>
        );
    }

    return (
        <div className="promotions-list-container" ref={listRef}>
            {onBack && (
                <button onClick={onBack} className="back-button">
                    <ChevronLeft size={16} />
                    Retour
                </button>
            )}

            <div className="promotions-header">
                <h3>{visiblePromotions.length} promotion(s) affichée(s)</h3>
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
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {visiblePromotions.map(p => (
                        <tr key={p.id} className="promotion-row">
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
                            <td className="promotion-categories">
                                {p.categorieClient?.map(code => (
                                    <span key={code} className={`category-badge ${code.toLowerCase()}`}>
                                        {code}
                                    </span>
                                ))}
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
