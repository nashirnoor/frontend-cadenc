import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.user_type === 'recruiter') {
        const hasCompanyProfile = checkCompanyProfile();
        if (!hasCompanyProfile) {
            return <Navigate to="/company-form" />;
        }
    }

    return children;
};

const checkCompanyProfile = async () => {
    const token = JSON.parse(localStorage.getItem('access'));
    const response = await axios.get(`${BASE_URL}/api/v1/auth/company-profile/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.status === 200;
};

export default PrivateRoute;
