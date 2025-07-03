import { Search, Plus, CheckCircle, Clock, XCircle, Eye, Edit, BarChart3 } from 'lucide-react';

const PromotionsManagement = ({ promotions, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => (
    <div className="orange-telecom space-y-4">
        {/* Actions Bar - Orange Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search size={16} className="orange-icon absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search promotions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="orange-input w-full pl-10 pr-4 py-2 text-sm rounded-md outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="orange-input w-full sm:w-auto px-3 py-2 text-sm rounded-md outline-none"
                >
                    <option value="all">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="EXPIRED">Expired</option>
                </select>
            </div>
            <button className="orange-btn w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2">
                <Plus size={16} />
                <span>New Promotion</span>
            </button>
        </div>

        {/* Promotions Table - Orange Accents */}
        <div className="orange-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="orange-table min-w-full">
                    <thead>
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Promotion</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Period</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Performance</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Budget</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {promotions.map(promotion => (
                        <tr key={promotion.id}>
                            {/* ... other table cells ... */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span>Budget:</span>
                                        <span>{promotion.budget.toLocaleString()} DT</span>
                                    </div>
                                    <div className="orange-progress">
                                        <div className="orange-progress-bar"
                                             style={{ width: `${(promotion.used / promotion.budget) * 100}%` }}>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`status-badge inline-flex items-center ${
                                    promotion.status === 'ACTIVE' ? 'status-active' :
                                        promotion.status === 'DRAFT' ? 'status-draft' :
                                            'status-expired'
                                }`}>
                                    {promotion.status === 'ACTIVE' ? <CheckCircle size={12} className="mr-1" /> :
                                        promotion.status === 'DRAFT' ? <Clock size={12} className="mr-1" /> :
                                            <XCircle size={12} className="mr-1" />}
                                    {promotion.status}
                                </span>
                            </td>
                            {/* ... other table cells ... */}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default PromotionsManagement;