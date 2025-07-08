import { useEffect, useState } from "react";
import {
    FiSearch,
    FiRefreshCw,
    FiPlus,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiX,
    FiHash,
    FiFileText,
    FiPercent,
    FiDollarSign,
    FiUser,
    FiCalendar,
    FiSave,
} from "react-icons/fi";


const API_BASE_URL = "http://localhost:8080/api/promotions";
const normalizePromotion = (promo) => {
    console.log('Normalizing promotion:', promo);
    // Handle different possible field names for code
    const code = promo.codePromotion || promo.code || promo.code_promotion || "N/A";
    const name = promo.nom || promo.name || promo.codePromotion || "N/A";
    const description = promo.description || promo.desc || "";
    let status = promo.status || promo.statut || promo.active || "";

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            console.error('Date parsing error:', error);
            return null;
        }
    };

    const dateDebut = formatDate(promo.date_debut || promo.dateDebut);
    const dateFin = formatDate(promo.date_fin || promo.dateFin);

    const soldeMinimum = promo.solde_minimum || promo.soldeMinimum || 0;
    const soldeMaximum = promo.solde_maximum || promo.soldeMaximum || null;
    const dureeValidite = promo.duree_validite || promo.dureeValidite || 0;
    const montantBonus = promo.montant_bonus || promo.montantBonus || 0;
    const pourcentageBonus = promo.pourcentage_bonus || promo.pourcentageBonus || 0;

    // Normalize status
    if (typeof promo.active === 'boolean') {
        status = promo.active ? "ACTIVE" : "DRAFT";
    } else if (typeof status === 'string') {
        const upperStatus = status.toUpperCase();
        if (upperStatus === "ACTIF" || upperStatus === "ACTIVE") {
            status = "ACTIVE";
        } else if (upperStatus === "BROUILLON" || upperStatus === "DRAFT") {
            status = "DRAFT";
        } else if (upperStatus === "EXPIRÉ" || upperStatus === "EXPIRE" || upperStatus === "EXPIRED") {
            status = "EXPIRÉ";
        } else {
            status = "non defini";
        }
    } else {
        status = "non defini";
    }

    const now = new Date();
    const isDateValid = dateDebut && dateFin && now >= dateDebut && now <= dateFin;
    const isEligible = status === "ACTIVE" && isDateValid;

    const normalized = {
        ...promo,
        code,
        name,
        description,
        status,
        dateDebut,
        dateFin,
        soldeMinimum,
        soldeMaximum,
        dureeValidite,
        montantBonus,
        pourcentageBonus,
        isEligible,
        // Add formatted display values
        displayValidite: dureeValidite > 0 ? `${dureeValidite} jours` : 'Illimitée',
        displayMinimum: soldeMinimum > 0 ? `${soldeMinimum} DT min` : 'Aucun minimum',
        displayExpiry: dateFin ? dateFin.toLocaleDateString('fr-FR') : 'Non définie'
    };

    console.log('Normalized promotion:', normalized);
    return normalized;
};
const checkUserEligibility = async (phoneNumber) => {
    try {
        const response = await fetch(`${API_BASE_URL}/eligible/${phoneNumber}`);
        const eligiblePromotions = await response.json();
        return eligiblePromotions.map(normalizePromotion);
    } catch (error) {
        console.error('Error checking eligibility:', error);
        return [];
    }
};
const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [showDebug, setShowDebug] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newPromotion, setNewPromotion] = useState({
        codePromotion: '',
        nom: '',
        description: '',
        soldeMinimum: '',
        soldeMaximum: '',
        segmentsClientsEligibles: [],  // On gérera comme input texte séparé par virgule
        montantBonus: null,
        pourcentageBonus: null,
        minutesBonus: '',
        smsBonus: '',
        dataBonusMb: '',
        pointsFidelite: '',
        utilisationsMaxParClient: '',
        utilisationsMaxGlobales: '',
        priorite: 1,
        estAutomatique: false,
        necessiteCode: true,
        creePar: null,
        approuvePar: null,
        dateModification: null,
        active: false,
        dureeValidite: '',
        type: 'percentage', // ou 'fixed'
        idCategoriePromotion: ''
    });


    useEffect(() => {
        fetchPromotions();
    }, [filterStatus]);

    const fetchPromotions = async () => {
        setLoading(true);
        setError(null);

        console.log("Fetching promotions with searchTerm:", searchTerm, "and filterStatus:", filterStatus);

        try {
            const activeOnly = filterStatus === "ACTIVE";
            const response = await fetch(`${API_BASE_URL}?activeOnly=${activeOnly}`);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log("Raw API response:", JSON.stringify(data, null, 2)); // Add this line


            if (!Array.isArray(data)) throw new Error("Invalid data format");

            const normalizedData = data.map((promo) => {
                console.log("Raw promo from API:", promo);  // <-- ✅ Add this line
                return normalizePromotion(promo);           // <-- Normalize afterward
            });

            // Filter normalized promotions
            const filtered = normalizedData.filter((promo) => {
                const matchesSearch =
                    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    promo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (promo.id?.toString() || "").includes(searchTerm);

                if (["DRAFT", "EXPIRED", "ACTIVE"].includes(filterStatus)) {
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
    const handleCreatePromotion = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError(null);

        try {
            // Prepare dates in correct format
            const formatDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                return date.toISOString().slice(0, 19).replace('T', ' ');
            };

            const payload = {
                codePromotion: newPromotion.codePromotion,
                nom: newPromotion.nom,
                description: newPromotion.description,
                soldeMinimum: newPromotion.soldeMinimum || null,
                soldeMaximum: newPromotion.soldeMaximum || null,
                segmentsClientsEligibles: newPromotion.segmentsClientsEligibles,
                montantBonus: newPromotion.type === 'fixed' ? newPromotion.montantBonus : null,
                pourcentageBonus: newPromotion.type === 'percentage' ? newPromotion.pourcentageBonus : null,
                minutesBonus: newPromotion.minutesBonus || null,
                smsBonus: newPromotion.smsBonus || null,
                dataBonusMb: newPromotion.dataBonusMb || null,
                pointsFidelite: newPromotion.pointsFidelite || null,
                utilisationsMaxParClient: newPromotion.utilisationsMaxParClient || null,
                utilisationsMaxGlobales: newPromotion.utilisationsMaxGlobales || null,
                priorite: newPromotion.priorite || 1,
                estAutomatique: Boolean(newPromotion.estAutomatique),
                necessiteCode: Boolean(newPromotion.necessiteCode),
                active: Boolean(newPromotion.active),
                dureeValidite: newPromotion.dureeValidite || null,
                type: newPromotion.type,
                idCategoriePromotion: newPromotion.idCategoriePromotion || null
            };

            console.log("Final payload being sent:", JSON.stringify(payload, null, 2));
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorDetails = '';
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData);
                } catch (e) {
                    errorDetails = await response.text();
                }
                throw new Error(`Server error: ${response.status} - ${errorDetails}`);
            }

            const result = await response.json();
            console.log('Promotion created:', result);

            // Reset form
            setNewPromotion({
                codePromotion: '',
                nom: '',
                description: '',
                soldeMinimum: '',
                soldeMaximum: '',
                segmentsClientsEligibles: [],
                montantBonus: null,
                pourcentageBonus: null,
                minutesBonus: '',
                smsBonus: '',
                dataBonusMb: '',
                pointsFidelite: '',
                dateDebut: '',
                dateFin: '',
                utilisationsMaxParClient: '',
                utilisationsMaxGlobales: '',
                priorite: 1,
                estAutomatique: false,
                necessiteCode: true,
                active: false,
                dureeValidite: '',
                type: 'percentage',
                idCategoriePromotion: '',
                valeurReduction: ''
            });

            setShowCreateModal(false);
            fetchPromotions();
            alert('Promotion créée avec succès!');

        } catch (error) {
            console.error('Create error:', error);
            setError(`Erreur lors de la création: ${error.message}`);
        } finally {
            setCreating(false);
        }
    };
    const handleInputChange = (field, value) => {
        // Cast numérique si besoin
        if ([
            "soldeMinimum", "soldeMaximum", "minutesBonus", "smsBonus", "dataBonusMb", "pointsFidelite",
            "utilisationsMaxParClient", "utilisationsMaxGlobales", "priorite", "dureeValidite", "idCategoriePromotion"
        ].includes(field)) {
            value = value === '' ? '' : Number(value);
        }

        setNewPromotion(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const validateForm = () => {
        const errors = [];

        if (!newPromotion.codePromotion) errors.push("Code promotion est requis");
        if (!newPromotion.nom) errors.push("Nom est requis");
        if (!newPromotion.description) errors.push("Description est requise");

        if (newPromotion.type === 'percentage' && !newPromotion.pourcentageBonus) {
            errors.push("Pourcentage bonus est requis");
        }
        if (newPromotion.type === 'fixed' && !newPromotion.montantBonus) {
            errors.push("Montant bonus est requis");
        }

        if (errors.length > 0) {
            setError(errors.join(", "));
            return false;
        }
        return true;
    };

    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        // Format as YYYY-MM-DD HH:MM:SS
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };


    const toggleFilters = () => setShowFilters(!showFilters);
    const toggleDebug = () => setShowDebug(!showDebug);

    return (
        <div  className="min-h-screen bg-gray-900 text-white p-6">
            {/* Header Section */}

            {/* Filters Section */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div  className="flex items-center justify-between cursor-pointer" onClick={toggleFilters}>
                    <h1
                        style={{
                            color: 'black',
                            fontSize: '1.25rem',
                            lineHeight: '1.75rem',
                            fontWeight: 600
                        }}
                    >Recherche & Filtrage </h1>
                    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {showFilters && (
                    <div className="filters-content">
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="taper le code de votre promo ..."
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
                            <option value="all">Toutes</option>
                            <option value="ACTIVE">Actives</option>
                            <option value="DRAFT">Broullions</option>
                            <option value="EXPIRED">Expirées</option>
                        </select>

                        <div className="filters-buttons">
                            <button
                                onClick={fetchPromotions}
                                disabled={loading}
                                style={{backgroundColor: '#f07c00'}}
                            >
                                Appliquer les filtres
                            </button>
                            <button onClick={() => {setSearchTerm("");setFilterStatus("all");}} className="btn btn-secondary">
                                Réinitialiser
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
                        <h3>Erreur</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Promotions Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold">Promotions ({promotions.length})</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-success"
                    >
                        <FiPlus />Nouvelle promotion
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table  className="w-full" style={{color : "black"}}>
                        <thead>
                        <tr className="bg-gray-700">
                            <th className="px-4 py-3 text-left" >Code</th>
                            <th className="px-4 py-3 text-left" >Nom</th>
                            <th className="px-4 py-3 text-left" >Status</th>
                            <th className="px-4 py-3 text-left" >Actions</th>
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
                              promotion.status === "ACTIF"
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
                                    </td >
                                    <td  className="px-4 py-3">
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
                                            Activer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-results">
                                    Aucune promotion ne correspond à vos critères
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
                            Tester Connection
                        </button>
                    </div>
                )}
                {/* Create Promotion Modal */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <div className="modal-header" >
                                <h2>
                                    <FiPlus className="modal-icon" />
                                    Créer une nouvelle promotion
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="modal-close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePromotion} className="modal-form">
                                <div className="form-grid">

                                    <div className="form-group">
                                        <label>Code promotion *</label>
                                        <input
                                            type="text"
                                            value={newPromotion.codePromotion}
                                            onChange={e => handleInputChange('codePromotion', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Nom *</label>
                                        <input
                                            type="text"
                                            value={newPromotion.nom}
                                            onChange={e => handleInputChange('nom', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Description *</label>
                                        <textarea
                                            value={newPromotion.description}
                                            onChange={e => handleInputChange('description', e.target.value)}
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Solde minimum</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newPromotion.soldeMinimum}
                                            onChange={e => handleInputChange('soldeMinimum', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Solde maximum</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newPromotion.soldeMaximum}
                                            onChange={e => handleInputChange('soldeMaximum', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Segments clients éligibles (séparés par une virgule)</label>
                                        <input
                                            type="text"
                                            value={newPromotion.segmentsClientsEligibles.join(', ')}
                                            onChange={e => handleInputChange('segmentsClientsEligibles', e.target.value.split(',').map(s => s.trim()))}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Type de réduction *</label>
                                        <select
                                            value={newPromotion.type}
                                            onChange={e => handleInputChange('type', e.target.value)}
                                            required
                                        >
                                            <option value="percentage">Pourcentage</option>
                                            <option value="fixed">Montant fixe</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Valeur de réduction *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newPromotion.type === 'percentage' ? newPromotion.pourcentageBonus ?? '' : newPromotion.montantBonus ?? ''}
                                            onChange={e => {
                                                const val = e.target.value;
                                                if(newPromotion.type === 'percentage'){
                                                    handleInputChange('pourcentageBonus', val ? parseFloat(val) : null);
                                                    handleInputChange('montantBonus', null);
                                                } else {
                                                    handleInputChange('montantBonus', val ? parseFloat(val) : null);
                                                    handleInputChange('pourcentageBonus', null);
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date début *</label>
                                        <input
                                            type="date"
                                            value={newPromotion.dateDebut || ''}
                                            onChange={e => handleInputChange('dateDebut', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Date fin *</label>
                                        <input
                                            type="date"
                                            value={newPromotion.dateFin || ''}
                                            onChange={e => handleInputChange('dateFin', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Minutes bonus</label>
                                        <input
                                            type="number"
                                            value={newPromotion.minutesBonus}
                                            onChange={e => handleInputChange('minutesBonus', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>SMS bonus</label>
                                        <input
                                            type="number"
                                            value={newPromotion.smsBonus}
                                            onChange={e => handleInputChange('smsBonus', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Data bonus (Mb)</label>
                                        <input
                                            type="number"
                                            value={newPromotion.dataBonusMb}
                                            onChange={e => handleInputChange('dataBonusMb', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Points fidélité</label>
                                        <input
                                            type="number"
                                            value={newPromotion.pointsFidelite}
                                            onChange={e => handleInputChange('pointsFidelite', e.target.value)}
                                        />
                                    </div>



                                    <div className="form-group">
                                        <label>Utilisations max par client</label>
                                        <input
                                            type="number"
                                            value={newPromotion.utilisationsMaxParClient}
                                            onChange={e => handleInputChange('utilisationsMaxParClient', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Utilisations max globales</label>
                                        <input
                                            type="number"
                                            value={newPromotion.utilisationsMaxGlobales}
                                            onChange={e => handleInputChange('utilisationsMaxGlobales', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Priorité</label>
                                        <input
                                            type="number"
                                            value={newPromotion.priorite}
                                            onChange={e => handleInputChange('priorite', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Durée validité (jours)</label>
                                        <input
                                            type="number"
                                            value={newPromotion.dureeValidite}
                                            onChange={e => handleInputChange('dureeValidite', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Catégorie promotion (ID)</label>
                                        <input
                                            type="number"
                                            value={newPromotion.idCategoriePromotion}
                                            onChange={e => handleInputChange('idCategoriePromotion', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={newPromotion.estAutomatique}
                                                onChange={e => handleInputChange('estAutomatique', e.target.checked)}
                                            />
                                            Est automatique
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={newPromotion.necessiteCode}
                                                onChange={e => handleInputChange('necessiteCode', e.target.checked)}
                                            />
                                            Nécessite code
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={newPromotion.active}
                                                onChange={e => handleInputChange('active', e.target.checked)}
                                            />
                                            Active
                                        </label>
                                    </div>

                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="btn btn-secondary"
                                        disabled={creating}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={creating}
                                    >
                                        {creating ? (
                                            <>
                                                <div className="spinner-small"></div>
                                                Création...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave />
                                                Créer la promotion
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}
            </div>


            <style>{`
  /* Container */


  /* Filters Section */


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
  /* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
}

.modal-container {
background: linear-gradient(135deg, #1C1C1C 0%, #3a4143 100%);
border: 1px solid #e67e22; /* orange border for contrast */    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
}

.modal-header h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.modal-icon {
    font-size: 1.5rem;
    color: #ffd700;
}

.modal-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.modal-form {
    padding: 32px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
}

.form-icon {
    font-size: 1rem;
    color: #ffd700;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 12px 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
}

.form-group select option {
    background: #4a5568;
    color: white;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.modal-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-actions .btn {
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #ffd700, #ffed4a);
    color: #2d3748;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
}



@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
    .modal-container {
        width: 95%;
        margin: 20px;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-header {
        padding: 20px;
    }
    
    .modal-form {
        padding: 20px;
    }
    
    .modal-actions {
        flex-direction: column;
    }
}
`}</style>


        </div>
    );
};

export default PromotionsManagement;
