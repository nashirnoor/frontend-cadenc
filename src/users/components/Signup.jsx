import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BASE_URL } from '../../utils/config';


const Signup = () => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        email: "",
        first_name: "",
        phone_number: "",
        password: "",
        password2: ""
    });



    const handleOnchange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value });
    };


    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, first_name, phone_number, password, password2 } = formdata;

        if (!email || !first_name || !password || !password2 || !phone_number) {
            setError("All fields are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone_number)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        if (password !== password2) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/v1/auth/register/`, formdata);
            const response = res.data;
            console.log(res.data)
            console.log(response);
            if (res.status === 201) {
                navigate("/otp/verify");
                toast.success(response.message);
            }
        } catch (error) {
            setError(error.response.data.email || error.response.data.phone_number || 'An error occurred');
        }
    };

    const { email, first_name, phone_number, password, password2 } = formdata;

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <div className="w-full flex items-center justify-center lg:w-1/2">
                <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-200">
                    <h3 className="text-5xl font-semibold pl-5">Register Now</h3>
                    <form onSubmit={handleSubmit}>

                        <div className="mt-8">
                            <div>
                                <label className="text-base font-medium">Name</label>
                                <input
                                    className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                                    placeholder="Enter the name"
                                    type="text"
                                    name="first_name"
                                    value={first_name}
                                    onChange={handleOnchange}
                                />
                            </div>
                            <div>
                                <label className="text-base font-medium">Phone Number</label>
                                <input
                                    className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent text-base"
                                    placeholder="Enter your phone number"
                                    type="text"
                                    name="phone_number"
                                    value={phone_number}
                                    onChange={handleOnchange}
                                    pattern="[0-9]*"
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
                                    onChange={handleOnchange}
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
                                    onChange={handleOnchange}
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
                                    onChange={handleOnchange}
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
                            {/* <div className="googleContainer"
                                id='signInDiv'
                            >
                                <button>
                                    Sign up with Google
                                </button>
                            </div> */}

                            <div className="mt-4 flex flex-col items-center">
                                <div className="flex items-center">
                                    <p className="font-medium text-base">Have an account?</p>
                                    <div className="text-violet-500 text-base font-medium ml-2">
                                        <Link to="/">Sign in</Link>
                                    </div>


                                </div>
                                <div className="text-violet-500 text-base font-medium ml-2 mt-2 ">
                                    <Link to="/recruiter-register">Register as Recruiter</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;


