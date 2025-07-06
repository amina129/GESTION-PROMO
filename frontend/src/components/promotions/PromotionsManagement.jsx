import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/promotions";

const PromotionsManagement = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch promotions on mount and when filters change
    useEffect(() => {
        fetchPromotions();
    }, [searchTerm, filterStatus]);

    const fetchPromotions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_BASE_URL, {
                params: {
                    activeOnly: filterStatus === "ACTIVE" // Matches your backend's boolean parameter
                }
            });

            // Apply search term filter client-side
            const filtered = response.data.filter(promo =>
                promo.code.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from codePromotion to code
                promo.name.toLowerCase().includes(searchTerm.toLowerCase())  // Changed from nom to name
            );

            setPromotions(filtered);
        } catch (error) {
            console.error("Error fetching promotions", error);
            setError("Failed to fetch promotions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePromotion = async () => {
        // You'll need to implement this with a form/modal
        console.log("Create new promotion clicked");
    };

    const handleActivatePromotion = async (code, phoneNumber, rechargeAmount) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${code}/activate`, {
                numeroTelephone: phoneNumber,
                montantRecharge: rechargeAmount
            });
            console.log("Activation successful:", response.data);
            // Refresh promotions or show success message
            fetchPromotions();
        } catch (error) {
            console.error("Activation failed:", error);
            setError(error.response?.data?.message || "Activation failed");
        }
    };

    const handleCheckEligibility = async (code, phoneNumber) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${code}/check-eligibility`, {
                phoneNumber: phoneNumber
            });
            console.log("Eligibility result:", response.data);
            return response.data;
        } catch (error) {
            console.error("Eligibility check failed:", error);
            setError(error.response?.data?.message || "Eligibility check failed");
            return null;
        }
    };

    return (
        <div className="luxury-app-content space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
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
                    <button
                        onClick={fetchPromotions}
                        className="luxury-btn flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>

                <button
                    onClick={handleCreatePromotion}
                    className="luxury-btn flex items-center gap-2"
                >
                    <span>New Promotion</span>
                </button>
            </div>

            {error && (
                <div className="luxury-alert error">
                    {error}
                </div>
            )}

            {/* Promotions Table */}
            <div className="luxury-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="luxury-table min-w-full">
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {promotions.length > 0 ? (
                            promotions.map((promotion) => (
                                <tr key={promotion.code}>
                                    <td>{promotion.code}</td>
                                    <td>{promotion.name}</td>
                                    <td>
                                            <span className={`status-badge ${promotion.status.toLowerCase()}`}>
                                                {promotion.status}
                                            </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                // You might want to implement a modal for this
                                                const phoneNumber = prompt("Enter client phone number:");
                                                const rechargeAmount = prompt("Enter recharge amount:");
                                                if (phoneNumber && rechargeAmount) {
                                                    handleActivatePromotion(
                                                        promotion.code,
                                                        phoneNumber,
                                                        parseFloat(rechargeAmount)
                                                    );
                                                }
                                            }}
                                            className="luxury-btn-sm"
                                            disabled={promotion.status !== "ACTIVE"}
                                        >
                                            Activate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    {loading ? "Loading promotions..." : "No promotions found"}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PromotionsManagement;