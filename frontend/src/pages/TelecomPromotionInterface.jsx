import React, { useState } from 'react';
import Header from "../components/common/Header";
import Navbar from "../components/common/Navbar";  // renommé ici
import PromotionsManagement from "../components/promotions/PromotionsManagement";
import ClientsManagement from "../components/Client/ClientsManagement";
import HomePage from "../components/HomePage/HomePage";

const TelecomPromotionInterface = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('HomePage');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [promotions] = useState([]);
    const [clients] = useState([]);
    const [stats] = useState({});

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar en haut */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Header en dessous de la Navbar */}
            <Header activeTab={activeTab} />

            {/* Contenu principal */}
            <main style={{ flex: 1, padding: '1rem' }}>
                {activeTab === 'HomePage' && <HomePage />}
                {activeTab === 'promotions' && (
                    <PromotionsManagement
                        promotions={promotions}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />
                )}
                {activeTab === 'clients' && <ClientsManagement clients={clients} />}
                {activeTab === 'statistiques' && (
                    <div>
                        <h3>Analytics Dashboard</h3>
                        {/* Contenu analytique ici */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TelecomPromotionInterface;
