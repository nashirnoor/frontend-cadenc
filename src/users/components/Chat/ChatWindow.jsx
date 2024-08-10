import React, { useState, useEffect, useRef,useCallback } from 'react';
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
    const [, forceUpdate] = useState();
 
    useEffect(() => {
        const jwt_a = JSON.parse(localStorage.getItem('access'));
        const wsUrl = `ws://localhost:8000/ws/chat/${selectedUser.id}/?token=${jwt_a}`;
    
        socketRef.current = new WebSocket(wsUrl);
    
        socketRef.current.onopen = () => {
            console.log('WebSocket Connected');
        };

        socketRef.current.onmessage = (e) => {
            fetchChatHistory()
        };
        socketRef.current.onerror = (e) => {
            console.error('WebSocket error:', e);
        };
    
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [selectedUser, setMessages]);
    

    const fetchChatHistory = async () => {
        try {
            let jwt_a = JSON.parse(localStorage.getItem('access'));
            const response = await axios.get(`${BASE_URL}/api/v1/auth/chat/history/${selectedUser.id}/`, {
                headers: {
                    'Authorization': `Bearer ${jwt_a}`,
                }
            });
            const formattedMessages = response.data.map(msg => ({
                sender: msg.sender === selectedUser.id ? selectedUser.first_name : 'You',
                text: msg.content,
                date: msg.date,
                file: msg.file_url,
                image: msg.image_url,
                id: msg.id
            }));
            setMessages(formattedMessages);
            forceUpdate({}); // Force a re-render
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };
    useEffect(() => {
        fetchChatHistory();
    }, [selectedUser, setMessages]);

   
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, forceUpdate]);

 

    const handleSendMessage = () => {
        if (newMessage.trim() !== '' || selectedFile || selectedImage) {
            const messageData = {
                message: newMessage,
                receiver_id: selectedUser.id,
            };
    
            const processFileOrImage = (file, type) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        messageData[type] = {
                            name: file.name,
                            type: file.type,
                            data: e.target.result.split(',')[1] // Base64 encoded data
                        };
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            };
    
            const sendMessageData = async () => {
                if (selectedFile) {
                    await processFileOrImage(selectedFile, 'file');
                }
                if (selectedImage) {
                    await processFileOrImage(selectedImage, 'image');
                }
                sendMessage(messageData);
            };
    
            sendMessageData();
        }
    };
    
    const sendMessage = (messageData) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(messageData));
            setNewMessage('');
            setSelectedFile(null);
            setSelectedImage(null);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
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

export default React.memo(ChatWindow);








