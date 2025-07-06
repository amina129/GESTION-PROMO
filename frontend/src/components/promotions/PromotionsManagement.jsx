import { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiPlus, FiChevronDown, FiChevronUp, FiCheck, FiX } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/promotions";

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    // Fetch promotions when filters change
    useEffect(() => {
        fetchPromotions();
    }, [filterStatus]);

    const fetchPromotions = async () => {
        setLoading(true);
        setError(null);

        try {
            const activeOnly = filterStatus === "ACTIVE";
            const response = await fetch(`${API_BASE_URL}?activeOnly=${activeOnly}`);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (!Array.isArray(data)) throw new Error("Invalid data format");

            const filtered = data.filter(promo => {
                const code = promo.code || promo.codePromotion || "";
                const name = promo.name || promo.nom || "";
                const matchesSearch = (
                    code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filterStatus === "DRAFT" || filterStatus === "EXPIRED") {
                    return matchesSearch && promo.status === filterStatus;
                }
                return matchesSearch;
            });

            setPromotions(filtered);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleActivatePromotion = async (code, phoneNumber, rechargeAmount) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${code}/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numeroTelephone: phoneNumber,
                    montantRecharge: parseFloat(rechargeAmount)
                })
            });

            if (!response.ok) {
                const errorMsg = response.headers.get('error-message') ||
                    (response.status === 404 ? "Not found" : "Activation failed");
                throw new Error(errorMsg);
            }

            alert("Promotion activated successfully!");
            fetchPromotions();
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleFilters = () => setShowFilters(!showFilters);
    const toggleDebug = () => setShowDebug(!showDebug);

    return (
        <div  style={{color : 'black'}}>
            {/* Header Section */}

            {/* Filters Section - Collapsible */}
            <div style={{ backgroundColor : '#242424' , color : 'white'}} >
                <div
                    onClick={toggleFilters}
                >
                    <h2>Filters & Search</h2>
                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {showFilters && (
                    <div >
                        <div>
                            {/* Search Input */}
                            <div className="relative">
                                <div >
                                    <FiSearch />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search promotions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="DRAFT">Draft</option>
                                <option value="EXPIRED">Expired</option>
                            </select>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchPromotions}
                                    disabled={loading}
                                    style={{color:'black'}}
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterStatus("all");
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiX className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Promotions Table */}
            <div >
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Promotions ({promotions.length})
                    </h2>
                    <button
                        onClick={() => alert("Create new promotion")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FiPlus />
                        New Promotion
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : promotions.length > 0 ? (
                            promotions.map((promotion) => (
                                <tr key={promotion.code || promotion.codePromotion} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {promotion.code || promotion.codePromotion || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {promotion.name || promotion.nom || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                promotion.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    promotion.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                                        promotion.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                                {promotion.status || "UNKNOWN"}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button
                                            onClick={() => {
                                                const phoneNumber = prompt("Client phone number:");
                                                const amount = prompt("Recharge amount:");
                                                if (phoneNumber && amount) {
                                                    handleActivatePromotion(
                                                        promotion.code || promotion.codePromotion,
                                                        phoneNumber,
                                                        amount
                                                    );
                                                }
                                            }}
                                            disabled={promotion.status !== "ACTIVE"}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                promotion.status === "ACTIVE"
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => alert("Check eligibility")}
                                            className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                                        >
                                            Check
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No promotions found matching your criteria
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Debug Section - Collapsible */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                    onClick={toggleDebug}
                >
                    <h2 className="text-lg font-semibold text-gray-800">Debug Information</h2>
                    {showDebug ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {showDebug && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <pre className="text-xs text-gray-700 overflow-x-auto p-3 bg-gray-100 rounded-lg">
                            {JSON.stringify({
                                searchTerm,
                                filterStatus,
                                promotionsCount: promotions.length,
                                loading,
                                error
                            }, null, 2)}
                        </pre>
                        <button
                            onClick={() => {
                                fetch(API_BASE_URL)
                                    .then(res => alert(res.ok ? "Connection successful!" : `Connection failed: ${res.status}`))
                                    .catch(err => alert(`Connection error: ${err.message}`));
                            }}
                            className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                            Test Connection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionsManagement;