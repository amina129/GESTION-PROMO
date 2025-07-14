import { ChevronDown, User } from 'lucide-react';
import './Header.css';
import LogoutButton from './LogoutButton';
import { useAuth } from '../auth/AuthContext';

const Header = ({ activeTab }) => {
    const { currentUser } = useAuth();

    return (
        <header className="orange-header">
            <div className="header-container">
                <div className="header-left">
                    <h2 className="header-title">
                        {activeTab === 'HomePage' && 'Tableau de Bord'}
                        {activeTab === 'promotions' && 'Gestion des Promotions'}
                        {activeTab === 'clients' && 'Gestion des Clients'}
                        {activeTab === 'statistiques' && 'Analyses & Rapports'}
                    </h2>
                </div>

                <div className="header-right">
                    <div className="system-name">Système de Gestion des Promotions</div>

                    <div className="user-profile" role="button" tabIndex={0}>
                        <User className="user-icon" />
                        <span>{currentUser?.nom || 'Utilisateur'}</span>
                        <ChevronDown className="dropdown-icon" />
                    </div>
                </div>
            </div>
            <LogoutButton />
        </header>
    );
};

export default Header;