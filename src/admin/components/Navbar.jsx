import React from 'react';
import { FaSearch, FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import axiosInstance from '../../users/utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        
        await axios.post(`${BASE_URL}/api/v1/auth/admin/logout/`, {
            refresh_token,
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/admin-login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
  return (
    <nav className='bg-gray-800 px-4 py-3 flex justify-between'>
      <div className='flex items-center text-xl'>
        <FaBars className="text-white me-4 cursor-pointer" />
        <span className='text-white font-semibold'>E-commerce</span>
      </div>
      <div className='flex items-center gap-x-5'>
        <div className='text-white'><FaBell className='w-6 h-6' /></div>
        <div className='relative group'>
          <button className='text-white'>
            <FaUserCircle className='w-6 h-6 mt-1' />
          </button>
          <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-hover:block top-full right-0'>
            <ul className='py-2 text-sm text-gray-800'>
              <li className='hover:bg-gray-200'><a href='#' className='block px-4 py-2'>Profile</a></li>
              <li className='hover:bg-gray-200'><a href='#' className='block px-4 py-2'>Settings</a></li>
              <li className='hover:bg-gray-200'><a href='#' className='block px-4 py-2' onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
