import React, { useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { toast } from 'sonner';
import { BASE_URL } from '../../utils/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(email){
      const res = await axiosInstance.post("/auth/password-reset/",{"email":email})
      if(res.status === 200){
        toast.success("A link send to you email to reset password")
      }
      console.log(res)
      setEmail("")

    }


  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Enter your registered Email Address</h2>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
