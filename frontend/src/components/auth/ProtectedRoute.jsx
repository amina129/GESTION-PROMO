// ProtectedRoute.js
const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!currentUser?.token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && currentUser.fonction !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};