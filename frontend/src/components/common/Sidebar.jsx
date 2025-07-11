import { Home, Gift, Users, BarChart3 } from 'lucide-react';
import './Sidebar.css'; // Create this CSS file

const Sidebar = ({ activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed }) => (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
            {!sidebarCollapsed && <h1 className="sidebar-title">Gestion Promotion</h1>}
        </div>
        <nav className="sidebar-nav">
            {[
                { id: 'HomePage', icon: Home, label: 'Tableau de Bord' },
                { id: 'promotions', icon: Gift, label: 'Promotions' },
                { id: 'clients', icon: Users, label: 'Clients' },
                { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
            ].map(item => (
                <button
                    key={item.id}
                    className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                >
                    <item.icon className="nav-icon" size={20} />
                    {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </button>
            ))}
        </nav>
    </div>
);

export default Sidebar;