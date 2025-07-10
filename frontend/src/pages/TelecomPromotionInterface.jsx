import React, { useState } from 'react';
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Dashboard from "../components/common/Dashboard";
import PromotionsManagement from "../components/promotions/PromotionsManagement";
import ClientsManagement from "../components/Client/ClientsManagement";

const TelecomPromotionInterface = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [promotions] = useState([
        // ... same promotions data as before
    ]);

    const [clients] = useState([
        // ... same clients data as before
    ]);

    const [stats] = useState({
        // ... same stats data as before
    });

    return (
        <div className="orange-telecom flex min-h-screen bg-orange-50">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            <div className={`flex-1 transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
                <Header activeTab={activeTab} />

                <main className="orange-card p-6 mx-4 my-2">
                    {activeTab === 'dashboard' && (
                        <Dashboard
                            promotions={promotions}
                            stats={stats}
                        />
                    )}
                    {activeTab === 'promotions' && (
                        <PromotionsManagement
                            promotions={promotions}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                        />
                    )}
                    {activeTab === 'clients' && (
                        <ClientsManagement
                            clients={clients}
                        />
                    )}

                    {activeTab === 'statistiques' && (
                        <div className="orange-card p-4">
                            <h3 className="text-lg font-semibold text-orange-800 mb-4">Analytics Dashboard</h3>
                            {/* Analytics content would go here */}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default TelecomPromotionInterface;