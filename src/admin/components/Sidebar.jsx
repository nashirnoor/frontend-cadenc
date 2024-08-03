import React,{useState, useEffect} from 'react';
import {FaHome,FaRegFileAlt,FaUser} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';


const Sidebar = () => {
    const [notifications, setNotifications] = useState({ user_count: 0, recruiter_count: 0 });
    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${BASE_URL}/api/v1/auth/notifications/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        };
    
        fetchNotifications();
        // Set up an interval to fetch notifications periodically
        const intervalId = setInterval(fetchNotifications, 10000); // every minute
    
        return () => clearInterval(intervalId);
      }, []);

      const handleNotificationClick = async (userType) => {
        try {
          const token = localStorage.getItem('access_token');
          await axios.post(`${BASE_URL}/api/v1/auth/notifications/mark-read/`, 
            { user_type: userType },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Update local state
          setNotifications(prev => ({
            ...prev,
            [userType === 'normal' ? 'user_count' : 'recruiter_count']: 0
          }));
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };
  return (
    <div className='w-64 bg-gray-800 fixed h-full px-4 py-2'>
        <div className='my-2 mb-4'>
            <h1 className='text-2x text-white font-bold'>Admin Dashboard</h1>
        </div>    
        <hr/>
        <ul className='mt-3 text-white font-bold'>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a href='' className='px-3'>
                    <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                    <Link to="/dashboard">Dashboard</Link>
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
        <a onClick={() => handleNotificationClick('normal')} className='px-3'>
          <FaUser className='inline-block w-6 h-6 mr-2 -mt-2'></FaUser>
          <Link to="/admin-home">User</Link>
          {notifications.user_count > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {notifications.user_count}
            </span>
          )}
        </a>
      </li>
      <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
        <a onClick={() => handleNotificationClick('recruiter')} className='px-3'>
          <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
          <Link to='/recruiter-list'>Recruiter</Link>
          {notifications.recruiter_count > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {notifications.recruiter_count}
            </span>
          )}
        </a>
      </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a className='px-3'>
                    <FaHome className='inline-block w-6 h-6 mr-2 -mt-2'></FaHome>
                    <Link to='/recruiter-approval'>Approval</Link>
                    
                </a>
            </li>
            <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
                <a className='px-3'>
                    <FaRegFileAlt className='inline-block w-6 h-6 mr-2 -mt-2'></FaRegFileAlt>
                    <Link to='/skill-management'>Skills</Link>
                    
                </a>
            </li>
          
        </ul>  
    </div>
  )
}

export default Sidebar

