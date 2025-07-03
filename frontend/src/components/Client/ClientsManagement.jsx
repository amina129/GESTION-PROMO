import { Search, Filter, Plus, Phone, Gift, BarChart3, CheckCircle } from 'lucide-react';

const ClientsManagement = ({ clients }) => (
    <div className="orange-luxury-theme space-y-6 luxury-app-content">
        {/* Barre de recherche et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou numéro..."
                        className="luxury-input pl-10 pr-4 py-2 text-sm rounded-md"
                    />
                </div>
                <button className="luxury-btn flex items-center space-x-2 px-4 py-2 rounded-md">
                    <Filter size={16} />
                    <span>Filtres</span>
                </button>
            </div>
            <button className="luxury-btn bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary flex items-center space-x-2 px-4 py-2 rounded-md">
                <Plus size={16} />
                <span>Activer Promotion</span>
            </button>
        </div>

        {/* Grille des clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map(client => (
                <div
                    key={client.id}
                    className="luxury-card p-6 cursor-pointer hover:shadow-lg transition-shadow rounded-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {client.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div className="font-semibold text-primary">{client.nom}</div>
                                <div className="text-sm text-text-secondary">{client.telephone}</div>
                            </div>
                        </div>
                        <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                client.segment === 'VIP'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : client.segment === 'PROFESSIONNEL'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                            }`}
                        >
              {client.segment}
            </span>
                    </div>

                    <div className="space-y-3 text-text-primary">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-text-secondary">Type :</span>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                    client.type === 'PREPAYE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                {client.type}
              </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-text-secondary">Solde :</span>
                            <span className="font-semibold">{client.solde.toFixed(2)} DT</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-text-secondary">Statut :</span>
                            <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                    client.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                            >
                <CheckCircle size={10} className="mr-1" />
                                {client.statut}
              </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-card-bg flex items-center justify-between">
                        <button className="text-primary hover:text-primary-light text-sm font-medium">
                            Voir Promotions Éligibles
                        </button>
                        <div className="flex items-center space-x-2 text-text-secondary">
                            <button className="p-1 hover:bg-card-bg rounded">
                                <Phone size={14} />
                            </button>
                            <button className="p-1 hover:bg-card-bg rounded">
                                <Gift size={14} />
                            </button>
                            <button className="p-1 hover:bg-card-bg rounded">
                                <BarChart3 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ClientsManagement;
