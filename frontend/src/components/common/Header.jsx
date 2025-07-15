import { ChevronDown, User } from 'lucide-react';
import './Header.css';
import LogoutButton from './LogoutButton';
import { useAuth } from '../auth/AuthContext';
import React from "react";

const Header = ({ activeTab }) => {
    console.log('Header rendu avec activeTab =', activeTab);
    const { currentUser } = useAuth();

    return (
        <header className="orange-header">
            <div className="header-container">
                <div className="header-left">
                    <img src="/OIP.png" alt="Logo Orange" className="login-logo" />
                    <h2 className="header-title">
                        {activeTab === 'HomePage' && 'Tableau de Bord'}
                        {activeTab === 'promotions' && 'Gestion des Promotions'}
                        {activeTab === 'clients' && 'Gestion des Clients'}
                        {activeTab === 'statistiques' && 'Analyses & Rapports'}
                    </h2>
                </div>

                <div className="header-right">
                    <LogoutButton />
                </div>
            </div>
        </header>
    );
};

export default Header;