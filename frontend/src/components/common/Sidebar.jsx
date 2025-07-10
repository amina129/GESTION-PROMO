import { Home, Gift, Users, Award, BarChart3, Settings} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed }) => (
    <div className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
        <div className="p-4 border-b border-blue-700">
            <div className="flex items-center justify-between">
                {!sidebarCollapsed && <h1 className="text-xl font-bold">Gestion Promotion</h1>}
            </div>
        </div>
        <nav className="sidebar-nav">
            {[
                { id: 'dashboard', icon: Home, label: 'Tableau de Bord' },
                { id: 'promotions', icon: Gift, label: 'Promotions' },
                { id: 'clients', icon: Users, label: 'Clients' },
                { id: 'statistiques', icon: BarChart3, label: 'Statistiques' },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={activeTab === item.id ? 'active' : ''}
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