import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const jwt_access = localStorage.getItem('access');

    useEffect(() => {
        if (!jwt_access && !user) {
            navigate("/login");
        } else {
            getSomeData();
        }
    }, [jwt_access, user, navigate]);

    const refresh = JSON.parse(localStorage.getItem('refresh'));

    const getSomeData = async () => {
        try {
            const resp = await axiosInstance.get("/auth/profile/");
            if (resp.status === 200) {
                console.log(resp.data, "Profile data");
            } else {
                console.log(resp.status, "Error fetching profile data");
            }
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
    };

    const handleLogout = async () => {
        try {
            const refresh_token = JSON.parse(localStorage.getItem('refresh'));
            await axiosInstance.post("/auth/logout/", { refresh_token });
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            navigate('/login');
            toast.success("Logout successful");
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
        <div className='container mx-auto'>
        <h2 className="text-2xl font-bold mt-8">hello {user && user.names}</h2>
        <p className="text-center mt-4">Welcome to your profile</p>
        <button onClick={handleLogout} className="block mx-auto mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
     </div>
    
    );
}

export default Profile;
