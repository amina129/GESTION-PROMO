import { Gift, Users, Zap, TrendingUp, Target, Star } from 'lucide-react';

const Dashboard = ({ promotions = [], stats = {} }) => {
    /*
    Static variables and default values:
    ---------------------------
    safeStats default values:
        promotionsActives: 0,
        clientsEligibles: 0,
        activationsAujourdhui: 0,
        chiffreAffaires: 0,
        tauxConversion: 0,
        pointsFidelite: 0

    Activity list (static):
    [
        { action: 'Activation de la promotion RAMADAN2024', client: 'Ahmed Ben Ali', time: 'Il y a 2 min', type: 'success' },
        { action: 'Nouvelle promotion créée', details: 'BUSINESS50', time: 'Il y a 15 min', type: 'info' },
        { action: 'Client éligible détecté', client: 'Fatma Cherif', time: 'Il y a 23 min', type: 'warning' },
        { action: 'Seuil de budget atteint', details: 'STUDENT2024', time: 'Il y a 1h', type: 'alert' }
    ]

    KPI change values:
        Promotions actives: '+2'
        Clients éligibles: '+1.2K'
        Activations / jour: '+247'
        Chiffre d’affaires: '+15%'
        Taux de conversion: '+2.1%'
        Points fidélité: '+8%'
    */
        const safeStats = {
            promotionsActives: 0,
            clientsEligibles: 0,
            activationsAujourdhui: 0,
            chiffreAffaires: 0,
            tauxConversion: 0,
            pointsFidelite: 0,
            ...stats,
        };

        const formatNumber = (num) => num?.toLocaleString("fr-FR") ?? '0';
        const formatCurrency = (num) => `${(Number(num) / 1000).toFixed(0)}K DT`;
        const formatPercentage = (num) => `${Number(num).toFixed(1)}%`;

        const kpis = [
            { title: 'Promotions actives', value: safeStats.promotionsActives, icon: Gift, /* change: '+2' */ },
            { title: 'Clients éligibles', value: formatNumber(safeStats.clientsEligibles), icon: Users, /* change: '+1.2K' */ },
            { title: 'Activations / jour', value: formatNumber(safeStats.activationsAujourdhui), icon: Zap, /* change: '+247' */ },
            { title: 'Chiffre d’affaires', value: formatCurrency(safeStats.chiffreAffaires), icon: TrendingUp, /* change: '+15%' */ },
            { title: 'Taux de conversion', value: formatPercentage(safeStats.tauxConversion), icon: Target, /* change: '+2.1%' */ },
            { title: 'Points fidélité', value: formatNumber(safeStats.pointsFidelite), icon: Star, /* change: '+8%' */ },
        ];

        const activePromotions = promotions?.filter(p => p?.statut === 'ACTIVE');

        return (
            <div className="luxury-app-content">
                <div className="kpi-grid">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="luxury-card kpi-card">
                            <div className="kpi-icon">
                                <kpi.icon size={20} color="white" />
                            </div>
                            <div className="kpi-info">
                                <div className="kpi-value">{kpi.value}</div>
                                <div className="kpi-title">{kpi.title}</div>
                            </div>
                            {/* <div className="kpi-change">{kpi.change}</div> */}
                        </div>
                    ))}
                </div>

                <div className="promo-activity-grid">
                    <div className="luxury-card promo-performance">
                        <h3 className="section-title">Performances des meilleures promotions</h3>
                        {activePromotions.map((promo) => (
                            <div key={promo.id} className="promo-item">
                                <div>
                                    <div className="promo-name">{promo.nom}</div>
                                    <div className="promo-code">{promo.code}</div>
                                </div>
                                <div className="promo-metrics">
                                    <div>{formatNumber(promo.activations)}</div>
                                    <div>{formatPercentage(promo.taux)} taux</div>
                                </div>
                                <div
                                    className="promo-status-indicator"
                                    style={{
                                        backgroundColor:
                                            promo.taux > 70 ? '#00C853' :
                                                promo.taux > 50 ? '#FFA000' : '#FF5252'
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="luxury-card recent-activity">
                        <h3 className="section-title">Activités récentes</h3>
                        {/* {[
                        { action: 'Activation de la promotion RAMADAN2024', client: 'Ahmed Ben Ali', time: 'Il y a 2 min', type: 'success' },
                        { action: 'Nouvelle promotion créée', details: 'BUSINESS50', time: 'Il y a 15 min', type: 'info' },
                        { action: 'Client éligible détecté', client: 'Fatma Cherif', time: 'Il y a 23 min', type: 'warning' },
                        { action: 'Seuil de budget atteint', details: 'STUDENT2024', time: 'Il y a 1h', type: 'alert' }
                    ].map((activity, index) => (
                        <div key={index} className="activity-item">
                            <div className={`activity-dot ${activity.type}`} />
                            <div className="activity-content">
                                <div className="activity-action">{activity.action}</div>
                                {activity.client && <div className="activity-details">{activity.client}</div>}
                                {activity.details && <div className="activity-details">{activity.details}</div>}
                                <div className="activity-time">{activity.time}</div>
                            </div>
                        </div>
                    ))} */}
                    </div>
                </div>
            </div>
        );
    };

    export default Dashboard;
