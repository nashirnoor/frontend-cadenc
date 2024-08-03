import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

const CustomButton = styled(Button)({
  backgroundColor: 'black',
  color: 'white',
});

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const jwt_access = localStorage.getItem('access');
  const profileData = JSON.parse(localStorage.getItem('profileData'));


  const fetchProfileData = async () => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      const response = await axios.get(`${BASE_URL}/api/v1/auth/user-profile/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });
      console.log(response.data);
      localStorage.setItem('profileData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  

  useEffect(() => {
    if (!jwt_access && !user) {
      navigate("/");
    } else {
      getSomeData();
      fetchProfileData();

    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [jwt_access, user, navigate]);

  const getSomeData = async () => {
    try {
      const resp = await axiosInstance.get("/auth/profile/");
      if (resp.status === 200) {
        console.log(resp.data, "Profile data");
      } else {
        console.log(resp.status, "Error fetching profile data");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const refresh_token = JSON.parse(localStorage.getItem('refresh'));
      await axiosInstance.post("/auth/logout/", { refresh_token });
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      localStorage.removeItem('profileData');

      navigate('/');
      toast.success("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="px-4 lg:px-28 flex justify-between items-center h-24 bg-white relative">
<h1 className="font-semibold text-4xl">
            <Link to="/landing"><img src={"/images/official_logo.png"}className="h-16" alt="Cadenc"/>
</Link>
          </h1>
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        <Link to="/about" className="font-bold hover:text-blue-500">About</Link>
        <Link to="/user-profile" className="font-bold hover:text-blue-500">Profile</Link>
        <Link to="/company-list" className="font-bold hover:text-blue-500">Companies</Link>
        <Link to="/chat" className="font-bold hover:text-blue-500">Message</Link>
        <Link to="/find-jobs" className="font-bold hover:text-blue-500">Find Job</Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden absolute top-8 right-4" onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop User Profile and Auth Buttons */}
      <div className="hidden md:flex items-center">
        {jwt_access && user ? (
          <div className="relative" ref={dropdownRef}>
              <img
              src={profileData?.photo || "/images/profile-user.png"}
              alt="profile"
              className="h-11 w-11 cursor-pointer rounded-full"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link to="/user-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="inline-block mr-2" size={18} /> Profile
                </Link>
                {/* <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="inline-block mr-2" size={18} /> Settings
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="inline-block mr-2" size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ml-4">
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">Login</Link>
            <Link to="/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Signup</Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-white shadow-md z-10">
          <Link to="/about" className="block py-2 px-4 text-sm hover:bg-gray-200">About</Link>
          <Link to="/company-list" className="block py-2 px-4 text-sm hover:bg-gray-200">Companies</Link>
          <Link to="/find-jobs" className="block py-2 px-4 text-sm hover:bg-gray-200">Find Job</Link>
          {jwt_access && user ? (
            <>
              <Link to="/user-profile" className="block py-2 px-4 text-sm hover:bg-gray-200">
                <User className="inline-block mr-2" size={18} /> Profile
              </Link>
              <Link to="/settings" className="block py-2 px-4 text-sm hover:bg-gray-200">
                <Settings className="inline-block mr-2" size={18} /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-200"
              >
                <LogOut className="inline-block mr-2" size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Login</Link>
              <Link to="/signup" className="block py-2 px-4 text-sm hover:bg-gray-200">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
