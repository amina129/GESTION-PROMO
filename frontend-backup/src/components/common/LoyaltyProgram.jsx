import { Users, Star, Award, TrendingUp } from 'lucide-react';

const LoyaltyProgram = () => (
    <div className="space-y-6">
        {/* Program Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
                { title: 'Membres Actifs', value: '28,450', icon: Users, color: 'bg-blue-500' },
                { title: 'Points Distribués', value: '1.25M', icon: Star, color: 'bg-yellow-500' },
                { title: 'Points Échangés', value: '890K', icon: Award, color: 'bg-green-500' },
                { title: 'Taux Engagement', value: '67%', icon: TrendingUp, color: 'bg-purple-500' }
            ].map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.title}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Loyalty Levels */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Niveaux de Fidélité</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { level: 'Bronze', points: '0-999', members: 15420, color: 'from-orange-400 to-orange-600', percentage: 54 },
                    { level: 'Argent', points: '1000-2999', members: 8750, color: 'from-gray-400 to-gray-600', percentage: 31 },
                    { level: 'Or', points: '3000-9999', members: 3580, color: 'from-yellow-400 to-yellow-600', percentage: 13 },
                    { level: 'Platine', points: '10000+', members: 700, color: 'from-purple-400 to-purple-600', percentage: 2 }
                ].map((tier, index) => (
                    <div key={index} className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white font-bold text-lg mb-3`}>
                            {tier.level[0]}
                        </div>
                        <h4 className="font-semibold text-gray-800">{tier.level}</h4>
                        <p className="text-sm text-gray-600 mb-2">{tier.points} points</p>
                        <p className="text-lg font-bold text-gray-800">{tier.members.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">membres ({tier.percentage}%)</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default LoyaltyProgram;