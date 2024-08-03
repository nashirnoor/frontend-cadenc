import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const RecruiterRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    phone_number: '',
    company_name: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, first_name, phone_number, company_name, password, password2 } = formData;

    if (!email || !first_name || !company_name || !password || !password2 || !phone_number) {
      setError('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (phone_number && !phoneRegex.test(phone_number)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }


    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    if (company_name !== company_name.trim()) {
      setError('Company name cannot have leading or trailing spaces');
      return;
    }

    if (/\s/.test(password) || /\s/.test(password2)) {
      setError('Passwords cannot contain white spaces');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/recruiter/`, formData);
      if (res.status === 201) {
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      setError(error.response.data.email || error.response.data.phone_number || 'An error occurred');
    }
  };

  const { email, first_name, phone_number, company_name, password, password2 } = formData;

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex items-center justify-center lg:w-1/2">
        <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-200">
          <h3 className="text-4xl font-semibold pl-5">Recruiter Signup</h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <div>
                <label className="text-base font-medium">Name</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  placeholder="Enter your name"
                  type="text"
                  name="first_name"
                  value={first_name}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="text-base font-medium">Phone Number</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  placeholder="Enter phone number"
                  type="text"
                  name="phone_number"
                  value={phone_number}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="text-base font-medium">Company Name</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  placeholder="Enter company name"
                  type="text"
                  name="company_name"
                  value={company_name}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="text-base font-medium">Email Address</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  placeholder="Enter your email"
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="text-base font-medium">Password</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <label className="text-base font-medium">Confirm Password</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                  placeholder="Enter your password again"
                  type="password"
                  name='password2'
                  value={password2}
                  onChange={handleOnChange}
                />
              </div>
              <p style={{ color: "red", padding: "1px" }}>{error ? error : ""}</p>

              <div className="mt-8 flex flex-col gap-y-4">
                <button
                  className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
                  type="submit"
                  value="submit"
                >
                  Sign up
                </button>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <p className="font-medium text-base">Have an account?</p>
                <div className="text-violet-500 text-base font-medium ml-2">
                  <Link to="/">Sign in</Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecruiterRegister;
