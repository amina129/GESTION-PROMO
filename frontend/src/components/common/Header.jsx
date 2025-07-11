import { ChevronDown, User } from 'lucide-react';
import './Header.css'; // Create this file for CSS

const Header = ({ activeTab }) => (
    <header className="orange-header">
        <div className="header-container">
            <div className="header-left">
                <h2 className="header-title">
                    {activeTab === 'HomePage' && 'Tableau de Bord'}
                    {activeTab === 'promotions' && 'Gestion des Promotions'}
                    {activeTab === 'clients' && 'Gestion des Clients'}
                    {activeTab === 'fidelite' && 'Programme de Fidélité'}
                    {activeTab === 'statistiques' && 'Analyses & Rapports'}
                    {activeTab === 'parametres' && 'Paramètres du Système'}
                </h2>
            </div>

            <div className="header-right">
                <div className="system-name">Système de Gestion des Promotions</div>

                <div className="user-profile" role="button" tabIndex={0}>
                    <User className="user-icon" />
                    <span>Utilisateur</span>
                    <ChevronDown className="dropdown-icon" />
                </div>
            </div>
        </div>
    </header>
);

export default Header;