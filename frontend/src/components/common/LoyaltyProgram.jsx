import { Users, Star, Award, TrendingUp } from 'lucide-react';

const LoyaltyProgram = ({
                            stats = [],
                            loyaltyLevels = []
                        }) => (
    <div className="luxury-app-content">
        {/* Program Overview */}
        <div className="kpi-grid">
            {(stats.length ? stats : [
                // on affiche rien si stats pas fournis
            ]).map((stat, index) => (
                <div key={index} className="luxury-card kpi-card" style={{ borderColor: `rgba(253, 113, 16, 0.3)` }}>
                    <div className="kpi-icon" style={{ backgroundColor: stat.color || 'var(--primary)' }}>
                        <stat.icon size={24} className="text-white" />
                    </div>
                    <div className="kpi-info">
                        <div className="kpi-value">{stat.value ?? '—'}</div>
                        <div className="kpi-title">{stat.title ?? ''}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Loyalty Levels */}
        <div className="luxury-card p-6">
            <h3 className="section-title">Niveaux de Fidélité</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {(loyaltyLevels.length ? loyaltyLevels : []).map((tier, index) => (
                    <div key={index} className="text-center">
                        <div
                            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white font-bold text-lg mb-3 luxury-card-shadow`}
                        >
                            {tier.level ? tier.level[0] : '—'}
                        </div>
                        <h4 className="font-semibold text-gray-200">{tier.level ?? '—'}</h4>
                        <p className="text-sm text-gray-400 mb-1">{tier.points ?? '—'} points</p>
                        <p className="text-lg font-bold text-gray-200">{tier.members != null ? tier.members.toLocaleString() : '—'}</p>
                        <p className="text-sm text-gray-400">membres ({tier.percentage != null ? tier.percentage : '—'}%)</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default LoyaltyProgram;
