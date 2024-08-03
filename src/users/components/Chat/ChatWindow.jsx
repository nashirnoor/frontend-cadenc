import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';

const ChatWindow = ({ selectedUser, messages, setMessages }) => {
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const { id: roomId } = useParams();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebSocket = () => {
            let jwt_a = localStorage.getItem('access');
            jwt_a = JSON.parse(jwt_a);

            const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/?token=${jwt_a}`);

            ws.onopen = () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);
            };

            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                console.log('Received message:', data);
                setMessages((prevMessages) => [...prevMessages, {
                  sender: data.sent ? 'You' : selectedUser.first_name,
                  text: data.message,
                  date: data.date || new Date().toISOString(),
                  file: data.file_url,
                  image: data.image_url
                }]);
              

            if (!data.sent) {
                try {
                  const jwt_a = JSON.parse(localStorage.getItem('access'));
                  await axios.post(`${BASE_URL}/api/v1/auth/mark-messages-as-read/${roomId}/`, {}, {
                    headers: {
                      'Authorization': `Bearer ${jwt_a}`,
                    }
                  });
                } catch (error) {
                  console.error('Error marking message as read:', error);
                }
              }
            };

            ws.onclose = () => {
                console.log('Disconnected from WebSocket server');
                setIsConnected(false);
            };

            return ws;
        };

        socketRef.current = connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [roomId, selectedUser, setMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                let jwt_a = localStorage.getItem('access');
                jwt_a = JSON.parse(jwt_a);
                const response = await axios.get(`${BASE_URL}/api/v1/auth/chat/history/${selectedUser.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                    }
                });
                setMessages(response.data.map(msg => ({
                    sender: msg.sender === selectedUser.id ? selectedUser.first_name : 'You',
                    text: msg.content,
                    date: msg.date,
                    file: msg.file_url,
                    image: msg.image_url
                })));
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [selectedUser, setMessages,messages]);

    const handleSendMessage = async () => {
        if ((newMessage.trim() !== '' || selectedFile || selectedImage) && socketRef.current) {
            const formData = new FormData();
            formData.append('message', newMessage);
            formData.append('receiver_id', selectedUser.id);
            
            if (selectedFile) {
                formData.append('file', selectedFile);
            }
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            try {
                let jwt_a = localStorage.getItem('access');
                jwt_a = JSON.parse(jwt_a);
                
                const response = await axios.post(`${BASE_URL}/api/v1/auth/chat/send/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${jwt_a}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log('Sending message:', response.data);

                // Create a new message object
                const newMessageObj = {
                    sender: 'You',
                    text: newMessage,
                    date: new Date().toISOString(),
                    file: response.data.file_url,
                    image: response.data.image_url
                };

                // Update the messages state
                setMessages(prevMessages => [...prevMessages, newMessageObj]);

                // Clear the input fields
                setNewMessage('');
                setSelectedFile(null);
                setSelectedImage(null);

                // Send the message through WebSocket
                socketRef.current.send(JSON.stringify({
                    message: newMessage,
                    receiver_id: selectedUser.id,
                    file_url: response.data.file_url,
                    image_url: response.data.image_url,
                    date: new Date().toISOString(),
                    sent: true
                }));
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-lg">
            <div className="bg-indigo-600 text-white p-4 flex items-center">
                <img
                    src={selectedUser.profile_photo || 'https://via.placeholder.com/40?text=No+Photo'}
                    alt={selectedUser.first_name}
                    className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-white"
                />
                <h2 className="text-xl font-semibold">{selectedUser.first_name}</h2>
            </div>
            <div className="flex-1 p-4 space-y-4 bg-gray-50 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg shadow ${
                            message.sender === 'You' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'
                        }`}>
                            <p>{message.text}</p>
                            {message.file && (
                                <div className="mt-2">
                                    <a href={message.file} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                                        View Attached File
                                    </a>
                                </div>
                            )}
                            {message.image && (
                                <div className="mt-2">
                                    <img src={message.image} alt="Uploaded" className="max-w-full h-auto rounded" />
                                </div>
                            )}
                            {message.date && (
                                <span className="text-xs opacity-75 mt-1 block">
                                    {new Date(message.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg ml-2 hover:bg-gray-300 transition duration-150 ease-in-out"
                    >
                        📎
                    </button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg ml-2 hover:bg-gray-300 transition duration-150 ease-in-out"
                    >
                        🖼️
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition duration-150 ease-in-out ml-2"
                    >
                        Send
                    </button>
                </form>
                {(selectedFile || selectedImage) && (
                    <div className="mt-2 text-sm text-gray-600">
                        {selectedFile && <span className="mr-2">File: {selectedFile.name}</span>}
                        {selectedImage && <span>Image: {selectedImage.name}</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;






