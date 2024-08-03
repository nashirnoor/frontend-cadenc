import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../utils/config';

const ChatPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { id: roomId } = useParams();
    const [userType, setUserType] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // ... existing useEffect code ...

        // Fetch user type
        const fetchUserType = async () => {
            try {
                let jwt_a = localStorage.getItem('access');
                jwt_a = JSON.parse(jwt_a);
                const response = await axios.get(`${BASE_URL}/api/v1/auth/user-type/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                    }
                });
                console.log(response.data.user_type,"kujhlkjhhhhhhhhhh")
                setUserType(response.data.user_type);
            } catch (error) {
                console.error('Error fetching user type:', error);
            }
        };

        fetchUserType();
    }, []);

    const handleBackClick = () => {
        if (userType === 'recruiter') {
            navigate('/recruiter-home');
        } else {
            navigate('/landing');
        }
    };

    const fetchChatHistory = async (roomId) => {
        try {
            let jwt_a = JSON.parse(localStorage.getItem('access'));
            const response = await axios.get(`${BASE_URL}/api/v1/auth/chat/history/${roomId}/`, {
                headers: {
                    'Authorization': `Bearer ${jwt_a}`,
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };
    const fetchUnreadCounts = async () => {
        try {
          const jwt_a = JSON.parse(localStorage.getItem('access'));
          const response = await axios.get(`${BASE_URL}/api/v1/auth/unread-message-counts/`, {
            headers: {
              'Authorization': `Bearer ${jwt_a}`,
            }
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching unread counts:', error);
          return {};
        }
      };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUser', JSON.stringify(user));
        navigate(`/chat/${user.room_id}`);
    };

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const jwt_a = JSON.parse(localStorage.getItem('access'));
                const response = await axios.get(`${BASE_URL}/api/v1/auth/chat-room/${roomId}/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                    }
                });
                setSelectedUser(response.data.other_user);
                fetchChatHistory(roomId);
            } catch (error) {
                console.error('Error fetching chat room:', error);
            }
        };

        if (roomId) {
            fetchChatRoom();
        }
    }, [roomId]);

    

    return (
          <div className="flex h-screen bg-gray-100">
            <div className="w-1/4 bg-white shadow-lg flex flex-col">
                <div className="bg-indigo-600 p-4 text-white h-16 flex-shrink-0">
                <button 
                    onClick={handleBackClick}
                    className="mr-4 text-white hover:text-gray-200"
                >
                    ← Back
                </button>
                </div>
                    <UserList setSelectedUser={handleUserSelect} fetchUnreadCounts={fetchUnreadCounts} />
            </div>
            <div className="flex-1 flex flex-col h-full">
                {selectedUser ? (
                    <ChatWindow selectedUser={selectedUser} messages={messages} setMessages={setMessages} />
                ) : (
                    <div className="flex items-center justify-center flex-1 bg-white text-gray-500 text-xl">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;