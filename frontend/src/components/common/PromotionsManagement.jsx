import { Search, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

const PromotionsManagement = ({ promotions, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => (
    <div className="luxury-app-content space-y-4">
        {/* Actions Bar - Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
                    <input
                        type="text"
                        placeholder="Search promotions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="luxury-input pl-10"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="luxury-input"
                >
                    <option value="all">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="EXPIRED">Expired</option>
                </select>
            </div>
            <button className="luxury-btn flex items-center gap-2">
                <Plus size={16} />
                <span>New Promotion</span>
            </button>
        </div>

        {/* Promotions Table */}
        <div className="luxury-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="luxury-table min-w-full">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Promotion</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Performance</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {promotions.map(promotion => (
                        <tr key={promotion.id}>
                            {/* Example Promotion Data Cell */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span>Budget:</span>
                                        <span>{promotion.budget.toLocaleString()} DT</span>
                                    </div>
                                    <div className="orange-progress">
                                        <div className="orange-progress-bar" style={{ width: `${(promotion.used / promotion.budget) * 100}%` }} />
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        promotion.status === 'ACTIVE' ? 'bg-green-600 text-white' :
                                            promotion.status === 'DRAFT' ? 'bg-yellow-600 text-white' :
                                                'bg-red-600 text-white'
                                    }`}>
                                        {promotion.status === 'ACTIVE' ? <CheckCircle size={12} className="mr-1" /> :
                                            promotion.status === 'DRAFT' ? <Clock size={12} className="mr-1" /> :
                                                <XCircle size={12} className="mr-1" />}
                                        {promotion.status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default PromotionsManagement;
