import { useEffect, useState } from "react";
import {
    FiSearch,
    FiRefreshCw,
    FiPlus,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiX,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/promotions";

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [showDebug, setShowDebug] = useState(false);

    useEffect(() => {
        fetchPromotions();
    }, [filterStatus]);

    const fetchPromotions = async () => {
        setLoading(true);
        setError(null);

        try {
            const activeOnly = filterStatus === "ACTIVE";
            const response = await fetch(`${API_BASE_URL}?activeOnly=${activeOnly}`);

            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (!Array.isArray(data)) throw new Error("Invalid data format");

            const filtered = data.filter((promo) => {
                const code = promo.code || promo.codePromotion || "";
                const name = promo.name || promo.nom || "";
                const description = promo.description || "";
                const id = promo.id?.toString() || "";

                const matchesSearch =
                    code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    id.includes(searchTerm);

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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numeroTelephone: phoneNumber,
                    montantRecharge: parseFloat(rechargeAmount),
                }),
            });

            if (!response.ok) {
                const errorMsg =
                    response.headers.get("error-message") ||
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
        <div className="container">
            {/* Header Section */}

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filters-header" onClick={toggleFilters}>
                    <h2>Filters & Search</h2>
                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {showFilters && (
                    <div className="filters-content">
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search promotions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="status-select"
                        >
                            <option value="all">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="DRAFT">Draft</option>
                            <option value="EXPIRED">Expired</option>
                        </select>

                        <div className="filters-buttons">
                            <button
                                onClick={fetchPromotions}
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterStatus("all");
                                }}
                                className="btn btn-secondary"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-box">
                    <FiX className="error-icon" />
                    <div>
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Promotions Table */}
            <div className="promotions-section">
                <div className="promotions-header">
                    <h2>Promotions ({promotions.length})</h2>
                    <button
                        onClick={() => alert("Create new promotion")}
                        className="btn btn-success"
                    >
                        <FiPlus /> New Promotion
                    </button>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="loading-cell">
                                    <div className="spinner"></div>
                                </td>
                            </tr>
                        ) : promotions.length > 0 ? (
                            promotions.map((promotion) => (
                                <tr key={promotion.code || promotion.codePromotion}>
                                    <td>{promotion.code || promotion.codePromotion || "N/A"}</td>
                                    <td>{promotion.name || promotion.nom || "N/A"}</td>
                                    <td>
                      <span
                          className={`status-badge ${
                              promotion.status === "ACTIVE"
                                  ? "active"
                                  : promotion.status === "DRAFT"
                                      ? "draft"
                                      : promotion.status === "EXPIRED"
                                          ? "expired"
                                          : "unknown"
                          }`}
                      >
                        {promotion.status || "UNKNOWN"}
                      </span>
                                    </td>
                                    <td className="actions-cell">
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
                                            className={`btn btn-activate ${
                                                promotion.status === "ACTIVE" ? "" : "disabled"
                                            }`}
                                        >
                                            Activate
                                        </button>
                                        <button
                                            onClick={() => alert("Check eligibility")}
                                            className="btn btn-check"
                                        >
                                            Check
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-results">
                                    No promotions found matching your criteria
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Debug Section */}
            <div className="debug-section">
                <div className="debug-header" onClick={toggleDebug}>
                    <h2>Debug Information</h2>
                    {showDebug ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {showDebug && (
                    <div className="debug-content">
            <pre>
              {JSON.stringify(
                  {
                      searchTerm,
                      filterStatus,
                      promotionsCount: promotions.length,
                      loading,
                      error,
                  },
                  null,
                  2
              )}
            </pre>
                        <button
                            onClick={() => {
                                fetch(API_BASE_URL)
                                    .then((res) =>
                                        alert(res.ok ? "Connection successful!" : `Connection failed: ${res.status}`)
                                    )
                                    .catch((err) => alert(`Connection error: ${err.message}`));
                            }}
                            className="btn btn-debug-test"
                        >
                            Test Connection
                        </button>
                    </div>
                )}
            </div>

            <style>{`
  /* Container */
  .container {
    background-color: #121212;
    color: #eee;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 30px 40px;
    max-width: 1100px;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(255, 124, 0, 0.3);
  }

  /* Filters Section */
  .filters-section {
    background-color: #1f1f1f;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: inset 0 0 10px rgba(255, 124, 0, 0.2);
    border: 1px solid #444;
  }

  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 18px 30px;
    font-size: 1.3rem;
    font-weight: 700;
    color: #f07c00; /* softer orange */
    user-select: none;
    transition: background-color 0.3s ease;
  }
  .filters-header:hover {
    background-color: #2b2b2b;
  }

  .filters-content {
    padding: 20px 30px 30px 30px;
    border-top: 1px solid #b35a00;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: flex-start;
  }

  .search-input-wrapper {
    position: relative;
    flex-grow: 1;
    max-width: 350px;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #f07c00;
    font-size: 1.2rem;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    border-radius: 8px;
    border: 1.5px solid #555;
    background-color: #2a2a2a;
    color: #eee;
    font-size: 1rem;
    outline-offset: 2px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .search-input::placeholder {
    color: #bbb;
  }
  .search-input:focus {
    border-color: #f07c00;
    box-shadow: 0 0 5px rgba(240, 124, 0, 0.5);
    background-color: #333;
  }

  .status-select {
    padding: 10px 16px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1.5px solid #555;
    background-color: #2a2a2a;
    color: #eee;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .status-select:hover,
  .status-select:focus {
    border-color: #f07c00;
    box-shadow: 0 0 5px rgba(240, 124, 0, 0.5);
    outline: none;
  }

  .filters-buttons {
    display: flex;
    gap: 15px;
  }

  .btn {
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    user-select: none;
    box-shadow: none;
  }
  .btn-primary {
    background: #f07c00;
    color: #121212;
    box-shadow: none;
  }
  .btn-primary:hover:not(:disabled) {
    background: #d66a00;
  }
  .btn-primary:disabled {
    background: #7a4a00;
    cursor: not-allowed;
    color: #c7a867;
  }
  .btn-secondary {
    background: #444444;
    color: #f07c00;
    font-weight: 600;
    box-shadow: none;
    border: 1.5px solid #f07c00;
  }
  .btn-secondary:hover {
    background: #555555;
  }
  .btn-success {
    background: #f07c00;
    color: #121212;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
  }
  .btn-success:hover {
    background: #d66a00;
  }
  .btn-activate {
    padding: 6px 16px;
    font-weight: 600;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    background-color: #f07c00;
    color: #121212;
    box-shadow: none;
  }
  .btn-activate:hover:not(:disabled) {
    background-color: #d66a00;
  }
  .btn-activate.disabled,
  .btn-activate:disabled {
    background-color: #664400;
    color: #c7a867;
    cursor: not-allowed;
  }
  .btn-check {
    padding: 6px 16px;
    background: #555555;
    color: #e6b77a;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: none;
    box-shadow: none;
  }
  .btn-check:hover {
    background: #666666;
  }

  /* Error Box */
  .error-box {
    display: flex;
    align-items: center;
    background-color: #2b0000;
    border-left: 5px solid #d94a00;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 25px;
    color: #e59e80;
    box-shadow: none;
  }
  .error-icon {
    font-size: 1.8rem;
    margin-right: 12px;
    color: #d94a00;
  }
  .error-box h3 {
    margin: 0;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  .error-box p {
    margin: 0;
    font-weight: 500;
  }

  /* Promotions Section */
  .promotions-section {
    background-color: #1f1f1f;
    border-radius: 10px;
    box-shadow: inset 0 0 12px rgba(240, 124, 0, 0.15);
    padding-bottom: 30px;
  }
  .promotions-header {
    padding: 18px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #f07c00;
    font-weight: 700;
    font-size: 1.35rem;
    user-select: none;
    border-bottom: 1px solid #b35a00;
  }

  .table-wrapper {
    overflow-x: auto;
    padding: 0 30px 30px 30px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    color: #eee;
    font-size: 0.95rem;
  }
  th,
  td {
    padding: 14px 20px;
    text-align: left;
    border-bottom: 1px solid #444;
  }
  thead tr {
    background-color: #2d2d2d;
    color: #f07c00;
    letter-spacing: 0.05em;
  }
  tbody tr {
    transition: background-color 0.2s ease;
  }
  tbody tr:hover {
    background-color: #323232;
  }

  .status-badge {
    padding: 6px 14px;
    font-weight: 700;
    border-radius: 12px;
    font-size: 0.85rem;
    user-select: none;
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .status-badge.active {
    background-color: #d66a00;
    color: #fff;
  }
  .status-badge.draft {
    background-color: #666666;
    color: #ccc;
  }
  .status-badge.expired {
    background-color: #a15e00;
    color: #f0e1b9;
  }
  .status-badge.unknown {
    background-color: #444444;
    color: #bbb;
  }

  .actions-cell button {
    margin-right: 12px;
  }

  .loading-cell {
    text-align: center;
    padding: 50px 0;
  }
  .spinner {
    border: 4px solid #f07c00;
    border-top: 4px solid #3b2400;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1.2s linear infinite;
    margin: auto;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .no-results {
    text-align: center;
    color: #aaa;
    padding: 50px 0;
    font-style: italic;
    font-weight: 600;
  }

  /* Debug Section */
  .debug-section {
    background-color: #2b2b2b;
    border-radius: 10px;
    box-shadow: inset 0 0 15px rgba(240, 124, 0, 0.15);
    margin-top: 40px;
    color: #f07c00;
    font-family: monospace;
    user-select: none;
  }
  .debug-header {
    padding: 18px 30px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.2rem;
    align-items: center;
    border-bottom: 1px solid #b35a00;
    user-select: none;
  }
  .debug-content {
    padding: 20px 30px;
    background-color: #3b2a00;
    color: #e6b77a;
  }
  .debug-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #f0d487;
    font-size: 0.85rem;
    margin-bottom: 15px;
  }
  .btn-debug-test {
    background-color: #f07c00;
    color: #3b2400;
    font-weight: 700;
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    box-shadow: none;
    transition: background-color 0.3s ease;
  }
  .btn-debug-test:hover {
    background-color: #d66a00;
  }
`}</style>


        </div>
    );
};

export default PromotionsManagement;
