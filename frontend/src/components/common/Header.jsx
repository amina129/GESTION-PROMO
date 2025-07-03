import { ChevronDown } from 'lucide-react';

const Header = ({ activeTab }) => (
    <header className="luxury-header">
        <div className="luxury-header-content">
            <div>
                <h2 className="luxury-header-title">
                    {activeTab === 'dashboard' && 'Tableau de Bord'}
                    {activeTab === 'promotions' && 'Gestion des Promotions'}
                    {activeTab === 'clients' && 'Gestion des Clients'}
                    {activeTab === 'fidelite' && 'Programme de Fidélité'}
                    {activeTab === 'statistiques' && 'Analyses & Rapports'}
                    {activeTab === 'parametres' && 'Paramètres du Système'}
                </h2>
                <p className="luxury-header-subtitle">Système de Gestion des Promotions - Opérateur Telecom</p>
            </div>

            <div className="luxury-header-actions">

                <div className="luxury-user-profile" role="button" tabIndex={0}>
                    <div className="luxury-avatar"></div>
                    <div className="luxury-user-name">
                        <span> utilisateur</span>
                        <ChevronDown size={16} color="var(--primary-dark)" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
