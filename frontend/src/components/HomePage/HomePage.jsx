import React from 'react';
import { User as UserIcon, Building2 } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <main className="main-content">
                {/* Promotions Section - Split Screen */}
                <section className="promotions-section">
                    <div className="split-screen">
                        {/* Particulier Promotion */}
                        <div className="promotion-half particulier-promotion">
                            <div className="promotion-content">
                                <div className="promotion-header">
                                    <div className="icon-container orange-gradient">
                                        <UserIcon className="category-icon" />
                                    </div>
                                    <h2 className="promotion-title">Promotions Particulier</h2>
                                </div>
                                <div className="promotion-list">
                                    <div className="promotion-item">
                                        <div className="promotion-image-container">
                                            <img src="/remise.jpg" alt="Offre 3jab" className="promotion-image" />
                                        </div>
                                        <div className="promotion-details">
                                            <h3>Offre 3jab</h3>
                                            <p>50Go à 50DT/mois au lieu de 70DT</p>
                                            <span className="promo-price">50 DT <span className="original-price">70 DT</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entreprise Promotion */}
                        <div className="promotion-half entreprise-promotion">
                            <div className="promotion-content">
                                <div className="promotion-header">
                                    <div className="icon-container black-gradient">
                                        <Building2 className="category-icon" />
                                    </div>
                                    <h2 className="promotion-title">Promotions Entreprise</h2>
                                </div>
                                <div className="promotion-list">
                                    <div className="promotion-item">
                                        <div className="promotion-image-container">
                                            <img src="/remise2.png" alt="Pack Communication" className="promotion-image" />
                                        </div>
                                        <div className="promotion-details">
                                            <h3>Pack Communication</h3>
                                            <p>Lignes illimitées à prix réduit pour PME</p>
                                            <span className="promo-badge">ÉCONOMISEZ 30%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;