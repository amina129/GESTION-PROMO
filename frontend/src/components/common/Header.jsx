import { ChevronDown } from 'lucide-react';

const Header = ({ activeTab }) => (
    <header>
        <div>
            <div>
                <h2>
                    {activeTab === 'dashboard' && 'Tableau de Bord'}
                    {activeTab === 'promotions' && 'Gestion des Promotions'}
                    {activeTab === 'clients' && 'Gestion des Clients'}
                    {activeTab === 'fidelite' && 'Programme de Fidélité'}
                    {activeTab === 'statistiques' && 'Analyses & Rapports'}
                    {activeTab === 'parametres' && 'Paramètres du Système'}
                </h2>
                <p>Système de Gestion des Promotions - Opérateur Telecom</p>
            </div>

            <div>
                <div role="button" tabIndex={0}>
                    <div></div>
                    <div>
                        <span> utilisateur</span>
                        <ChevronDown size={16} color="var(--primary-dark)" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
