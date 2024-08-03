import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BASE_URL } from '../../utils/config';

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); 
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            setError("OTP has expired");
        }
    }, [timeLeft]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message
        if (otp) {
            setIsLoading(true);
            try {
                const response = await axios.post(`${BASE_URL}/api/v1/auth/verify-email/`, { 'otp': otp });
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate("/");
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setError("OTP is not correct");
                } else {
                    setError("An error occurred. Please try again.");
                }
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/resend-otp/`);
            if (response.status === 200) {
                toast.success("OTP has been resent to your email");
                setTimeLeft(60); // Reset timer
            }
        } catch (error) {
            setError("Failed to resend OTP. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                            Enter your OTP code:
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        disabled={isLoading || timeLeft === 0}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                <button
                    onClick={handleResendOtp}
                    className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                    disabled={isLoading || timeLeft > 0}
                >
                    {isLoading ? 'Resending...' : `Resend OTP (${timeLeft}s)`}
                </button>
            </div>
        </div>
    )
}

export default VerifyEmail;
