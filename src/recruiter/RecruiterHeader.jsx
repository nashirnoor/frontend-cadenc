import React, { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../users/utils/axiosInstance';
import axios from 'axios';
import { HiMenu, HiX } from 'react-icons/hi';




const CustomButton = styled(Button)({
    backgroundColor: 'black',
    color: 'white',
});


const Header = () => {
    const navigate = useNavigate();
    const user =localStorage.getItem('user');
    const jwt_access = localStorage.getItem('access');
    const [companyProfile, setCompanyInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);


    const toggleMenu = () => {
        setIsOpen(!isOpen);
      };


    useEffect(() => {
        if (!jwt_access && !user) {
            navigate("/");
        } else {
            getSomeData();
            getCompanyProfile();
        }
    }, [jwt_access,user, navigate]);

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
    const getCompanyProfile = async () => {
        try {
            let jwt_access = localStorage.getItem('access');
            jwt_access = JSON.parse(jwt_access);

            if (!jwt_access) {
                throw new Error("JWT token is missing");
            }

            const response = await axios.get(`${BASE_URL}/api/v1/auth/company-profile-get/`, {

                headers: {
                    'Authorization': `Bearer ${jwt_access}`,
                }
            });

            if (response.status === 200) {
                console.log(response.data);
                setCompanyInfo(response.data);
                setIsLoading(false);
            } else {
                console.error('Error fetching company profile:', response.status, response.statusText);
            }

        } catch (error) {
            console.error('Error fetching company profile:', error);
            setIsLoading(false);
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
        <nav className="px-4 lg:px-28">
        <div className="flex justify-between items-center h-24">
          <h1 className="font-semibold text-4xl">
            <Link to="/recruiter-home"><img src={"/images/official_logo.png"}className="h-16" alt="Cadenc"/>
</Link>
          </h1>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about-recruiter" className="font-bold">About</Link>
            <Link to="/upload-job" className="font-bold">Post Job</Link>
            {/* <Link to="/company-list" className="font-bold">Company List</Link> */}
            <Link to="/company-profile" className="font-bold">Profile</Link>
            <Link to="/job-posted" className="font-bold">Job posted</Link>
            <Link to="/chat" className="font-bold">Message</Link>


          </div>
          
          <div className="hidden md:flex items-center">
            {jwt_access && user ? (
              <Link to="/company-profile">
                <img
                  src={companyProfile?.company_logo || "/images/profile-user.png"}
                  alt="Company Logo"
                  className="h-10 w-10 object-cover rounded-full"
                />
              </Link>
            ) : (
              <>
                <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Login</Link>
                <Link to="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Signup</Link>
              </>
            )}
          </div>
  
          <div className="md:hidden flex items-center">
            {jwt_access && user && (
              <Link to="/company-profile" className="mr-4">
                <img
                  src={companyProfile?.company_logo || "/images/profile-user.png"}
                  alt="Company Logo"
                  className="h-8 w-8 object-cover rounded-full"
                />
              </Link>
            )}
            <button onClick={toggleMenu} className="text-2xl">
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
  
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/about-recruiter" className="block px-3 py-2 rounded-md text-base font-medium">About</Link>
              <Link to="/upload-job" className="block px-3 py-2 rounded-md text-base font-medium">Post Job</Link>
              <Link to="/company-list" className="block px-3 py-2 rounded-md text-base font-medium">Company List</Link>
              <Link to="/job-posted" className="block px-3 py-2 rounded-md text-base font-medium">Job posted</Link>

              {!jwt_access && !user && (
                <>
                  <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium">Signup</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    );
};

export default Header;



