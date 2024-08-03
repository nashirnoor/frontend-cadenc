import React, { useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';
import Footer from './Footer';
import LandingBody from './LandingBody';



const Landing = () => {
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
        <div>
            {/* nav */}
            
            <Header />
            <LandingBody/>
            {/* nav */}
          
            {/* footer */}
           <Footer />
                    


        </div >
    )
}

export default Landing