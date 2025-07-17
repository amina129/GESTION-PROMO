import React from 'react';
import { ChevronLeft } from 'lucide-react';
import './PromotionsManagement.css';

const PromotionsList = ({ promotions, loading, onBack }) => {
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
                <p>Aucune promotion trouvée.</p>
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
                    </tr>
                    </thead>
                    <tbody>
                    {promotions.map(p => (
                        <tr key={p.id} className="promotion-row">
                            <td className="promotion-name">{p.nom}</td>
                            <td className="promotion-description">{p.description}</td>
                            <td className="promotion-value">{formatValeur(p)}</td>
                            <td className="promotion-period">
                                <span className="date">{p.dateDebut}</span>
                                <span className="arrow">→</span>
                                <span className="date">{p.dateFin}</span>
                            </td>
                            <td className="promotion-type">{formatTypePromotion(p)}</td>
                            <td className="promotion-category">
                                    <span className={`category-badge ${
                                        p.categorieClient.toLowerCase()
                                    }`}>
                                        {p.categorieClient}
                                    </span>
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