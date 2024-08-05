import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axiosInstance from '../users/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Footer from '../users/components/Footer';
import Header from './RecruiterHeader';
import LandingBodyRecruiter from './LandingbodyRecruiter';
import { BASE_URL } from '../utils/config';



const CustomButton = styled(Button)({
    backgroundColor: 'black',
    color: 'white',
});


const RecruiterHome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const jwt_access = localStorage.getItem('access');

    useEffect(() => {
        if (!jwt_access && !user) {
            navigate("/");
        } else {
            getSomeData();
        }
    }, [jwt_access, user, navigate]);
  
    const refresh = JSON.parse(localStorage.getItem('refresh'));
    console.log(jwt_access)
    console.log(refresh,"dddddddddd")
  
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
            navigate('/');
            toast.success("Logout successful");
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Logout failed. Please try again.");
        }
    };

    return (
      <>
           <Header/>
            <LandingBodyRecruiter />
            
            <Footer/>
            </>
    );
};

export default RecruiterHome;



