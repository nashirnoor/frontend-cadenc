import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const UserList = ({ setSelectedUser, fetchUnreadCounts }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate()

  const fetchChatRooms = async () => {
    try {
      const jwt_a = JSON.parse(localStorage.getItem('access'));
      const response = await axios.get(`${BASE_URL}/api/v1/auth/chat-rooms/`, {
        headers: {
          'Authorization': `Bearer ${jwt_a}`,
        }
      });
      setChatRooms(response.data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const updateUnreadCounts = async () => {
    try {
      const counts = await fetchUnreadCounts();
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error updating unread counts:', error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
    updateUnreadCounts();

    const intervalId = setInterval(updateUnreadCounts, 50000);

    return () => clearInterval(intervalId);
  }, [fetchUnreadCounts]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUser', JSON.stringify(user));
    console.log(user,"This is the selected userrr")
    
    try {
      const jwt_a = JSON.parse(localStorage.getItem('access'));
      await axios.post(`${BASE_URL}/api/v1/auth/mark-messages-as-read/${user.room_id}/`, {}, {
        headers: {
          'Authorization': `Bearer ${jwt_a}`,
        }
      });
      setUnreadCounts(prevCounts => ({
        ...prevCounts,
        [user.room_id]: { ...prevCounts[user.room_id], count: 0 }
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
    navigate(`/chat/`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200 bg-gray-50">Chats</h2>
      <ul className="divide-y divide-gray-200">
        {chatRooms.sort((a, b) => {
          const countA = unreadCounts[a.id]?.count || 0;
          const countB = unreadCounts[b.id]?.count || 0;
          return countB - countA;
        }).map((room) => (
          <li
            key={room.id}
            className="flex items-center p-4 hover:bg-indigo-50 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => handleUserSelect(room.other_user)}
          >
            <img
              src={room.other_user.profile_photo || 'https://via.placeholder.com/40?text=No+Photo'}
              alt={room.other_user.first_name}
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-200"
            />
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{room.other_user.first_name}</h3>
              <p className="text-sm text-gray-500 truncate">{room.last_message || 'No messages yet'}</p>
            </div>
            {unreadCounts[room.other_user.room_id]?.count > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCounts[room.other_user.room_id].count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

