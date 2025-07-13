import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Gift, Users, BarChart3 } from 'lucide-react'; // Add missing icon imports
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, allowedTabs }) => {
    const navItems = [
        { id: 'HomePage', icon: <Home size={18} />, label: 'Tableau de Bord' },
        { id: 'promotions', icon: <Gift size={18} />, label: 'Promotions' },
        { id: 'clients', icon: <Users size={18} />, label: 'Clients' },
        { id: 'statistiques', icon: <BarChart3 size={18} />, label: 'Statistiques' },
    ];

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">Gestion Promotion</div>
                <nav className="navbar-links">
                    {navItems.filter(item => allowedTabs.includes(item.id)).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`navbar-button ${activeTab === item.id ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Navbar; // Make sure default export exists