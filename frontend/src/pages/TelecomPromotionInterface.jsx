import React, { useState } from 'react';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
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
            {/* Sidebar at the top */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Header below Sidebar */}
            <Header activeTab={activeTab} />

            {/* Main content (HomePage, Promotions, Clients, etc.) */}
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
                        {/* Analytics content */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TelecomPromotionInterface;