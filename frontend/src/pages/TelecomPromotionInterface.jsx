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
    const [promotions] = useState([
        // your promotions data here
    ]);
    const [clients] = useState([
        // your clients data here
    ]);
    const [stats] = useState({
        // your stats data here
    });

    return (
        <div className="app-container" style={{ display: 'flex' }}>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                <main style={{ padding: '1rem', flexGrow: 1 }}>
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
        </div>
    );
};

export default TelecomPromotionInterface;