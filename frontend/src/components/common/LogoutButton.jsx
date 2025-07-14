// components/common/LogoutButton.jsx
import { useAuth } from '../auth/AuthContext';

const LogoutButton = ({ className = "logout-btn" }) => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            await logout();
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className}
            style={{
                padding: '8px 16px',
                backgroundColor: '#FD7110',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            Se déconnecter
        </button>
    );
};

export default LogoutButton;