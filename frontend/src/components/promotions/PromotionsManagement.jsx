import { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiPlus, FiChevronDown, FiChevronUp, FiCheck, FiX } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/promotions";

const PromotionsManagement = () => {
    // ... (keep all your existing state and logic)

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header Section */}
            <header className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white p-6 shadow-lg">
                <h1 className="text-3xl font-light tracking-wider">Promotions Management</h1>
                <p className="text-indigo-200 mt-2">Manage and activate customer promotions</p>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Filters Section - Collapsible */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 ease-in-out">
                    <div
                        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={toggleFilters}
                    >
                        <h2 className="text-xl font-light text-gray-800 flex items-center">
                            <span className="mr-3 bg-indigo-100 text-indigo-800 p-2 rounded-full">
                                <FiSearch className="text-lg" />
                            </span>
                            Filters & Search
                        </h2>
                        {showFilters ? <FiChevronUp className="text-gray-500 text-xl" /> : <FiChevronDown className="text-gray-500 text-xl" />}
                    </div>

                    {showFilters && (
                        <div className="border-t border-gray-100 p-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Search Input */}
                                <div className="relative col-span-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FiSearch />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search promotions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="EXPIRED">Expired</option>
                                </select>

                                {/* Action Buttons */}
                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={fetchPromotions}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <FiRefreshCw className="animate-spin" /> : null}
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setFilterStatus("all");
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
                    <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start shadow-sm">
                        <div className="flex-shrink-0 pt-0.5">
                            <FiX className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-1 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Promotions Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6 flex justify-between items-center border-b border-gray-100">
                        <h2 className="text-xl font-light text-gray-800">
                            Promotions <span className="text-indigo-600 font-medium">({promotions.length})</span>
                        </h2>
                        <button
                            onClick={() => alert("Create new promotion")}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <FiPlus className="text-lg" />
                            New Promotion
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-light">Code</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-light">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-light">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-light">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : promotions.length > 0 ? (
                                promotions.map((promotion) => (
                                    <tr key={promotion.code || promotion.codePromotion} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {promotion.code || promotion.codePromotion || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-gray-900">
                                                {promotion.name || promotion.nom || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                promotion.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    promotion.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                                        promotion.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                                {promotion.status || "UNKNOWN"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap space-x-2">
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
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    promotion.status === "ACTIVE"
                                                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                }`}
                                            >
                                                Activate
                                            </button>
                                            <button
                                                onClick={() => alert("Check eligibility")}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                                            >
                                                Check
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="text-gray-500 flex flex-col items-center">
                                            <FiSearch className="text-3xl text-gray-300 mb-3" />
                                            <p className="text-lg">No promotions found matching your criteria</p>
                                            <p className="text-sm mt-1">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Debug Section - Collapsible */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out">
                    <div
                        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={toggleDebug}
                    >
                        <h2 className="text-xl font-light text-gray-800 flex items-center">
                            <span className="mr-3 bg-gray-200 text-gray-800 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Debug Information
                        </h2>
                        {showDebug ? <FiChevronUp className="text-gray-500 text-xl" /> : <FiChevronDown className="text-gray-500 text-xl" />}
                    </div>
                    {showDebug && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <pre className="text-xs text-gray-700 overflow-x-auto p-4 bg-gray-100 rounded-lg font-mono">
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
                                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                            >
                                Test Connection
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PromotionsManagement;