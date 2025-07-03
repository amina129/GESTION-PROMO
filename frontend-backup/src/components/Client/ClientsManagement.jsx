import { Search, Filter, Plus, Phone, Gift, BarChart3, CheckCircle } from 'lucide-react';

const ClientsManagement = ({ clients }) => (
    <div className="space-y-6">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou numéro..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    <span>Filtres</span>
                </button>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus size={16} />
                <span>Activer Promotion</span>
            </button>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clients.map(client => (
                <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {client.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">{client.nom}</div>
                                <div className="text-sm text-gray-600">{client.telephone}</div>
                            </div>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            client.segment === 'VIP' ? 'bg-gold-100 text-gold-800' :
                                client.segment === 'PROFESSIONNEL' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
              {client.segment}
            </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Type:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                client.type === 'PREPAYE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                {client.type}
              </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Solde:</span>
                            <span className="font-semibold text-gray-800">{client.solde.toFixed(2)} DT</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Statut:</span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                client.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                <CheckCircle size={10} className="mr-1" />
                                {client.statut}
              </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Voir Promotions Éligibles
                            </button>
                            <div className="flex items-center space-x-1">
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                    <Phone size={14} />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                    <Gift size={14} />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                                    <BarChart3 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ClientsManagement;