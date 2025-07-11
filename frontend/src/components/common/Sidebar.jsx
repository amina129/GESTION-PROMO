import { Home, Gift, Users, BarChart3 } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed }) => (
    <div>
        <div>
            <div>
                {!sidebarCollapsed && <h1>Gestion Promotion</h1>}
            </div>
        </div>
        <nav>
            {[
                { id: 'dashboard', icon: Home, label: 'Tableau de Bord' },
                { id: 'promotions', icon: Gift, label: 'Promotions' },
                { id: 'clients', icon: Users, label: 'Clients' },
                { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={item.label}
                >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    </div>
);

export default Sidebar;
