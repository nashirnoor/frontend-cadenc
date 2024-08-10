import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [newPasswords, setNewPasswords] = useState({
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes timer
  const { password, confirm_password } = newPasswords;

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setError("Password reset link has expired");
    }
  }, [timeLeft]);

  const handleChange = (e) => {
    setNewPasswords({ ...newPasswords, [e.target.name]: e.target.value });
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      password: password,
      confirm_password: confirm_password,
      uidb64: uid,
      token: token,
    };

    try {
      const response = await axiosInstance.patch('auth/set-new-password/', data);
      if (response.status === 200) {
        toast.success("Password reset successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Enter your New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">New Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="confirm_password" className="block text-gray-700 font-medium mb-2">Confirm Password:</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Submit
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Password reset link expires in: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
