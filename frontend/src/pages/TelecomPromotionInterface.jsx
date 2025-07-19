import { useState, useEffect } from 'react';
import Header from "../components/common/Header";
import Navbar from "../components/common/Navbar";
import PromotionsManagement from "../components/promotions/PromotionsManagement";
import ClientsManagement from '../components/Client/ClientsManagement';
import HomePage from "../components/HomePage/HomePage";
import { useAuth } from "../components/auth/AuthContext";

const TelecomPromotionInterface = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('HomePage');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [promotions] = useState([]);
    const [clients] = useState([]);
    const [stats] = useState({});
    const [allowedTabs, setAllowedTabs] = useState(['HomePage']);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser?.fonction === 'ADMIN') {
            setAllowedTabs(['HomePage', 'promotions', 'clients', 'statistiques']);
        } else if (currentUser?.fonction === 'CONSEILLER') {
            setAllowedTabs(['HomePage', 'clients', 'statistiques']);
        }
    }, [currentUser]);

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                allowedTabs={allowedTabs}
            />

            <Header activeTab={activeTab} />

            <main style={{ flex: 1, padding: '1rem' }}>
                {activeTab === 'HomePage' && <HomePage />}
                {activeTab === 'promotions' && allowedTabs.includes('promotions') && (
                    <PromotionsManagement
                        promotions={promotions}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                    />
                )}
                {activeTab === 'clients' && allowedTabs.includes('clients') && <ClientsManagement clients={clients} />}
                {activeTab === 'statistiques' && allowedTabs.includes('statistiques') && (
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