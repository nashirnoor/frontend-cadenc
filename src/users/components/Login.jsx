import React, { useState,useEffect } from 'react';
import { Link, json, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '../../utils/config';

const Login = () => {
    const navigate = useNavigate();
    const [logindata, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOnchange = (e) => {
        setLoginData({ ...logindata, [e.target.name]: e.target.value });
        setError(""); // Reset error when user starts typing
    }

    const handleSignInWithGoogle = async (response) => {
        const payload = response.credential;
        console.log("Google OAuth payload:", payload); // Log the token

        const server_res = await axios.post(`${BASE_URL}/google/`, { 'access_token': payload });
        console.log(server_res.data, 'server');
        const user = {
            "email": server_res.data.email,
            "names": server_res.data.full_name
        };
        print(server_res.status)
        if (server_res.status === 200) {
            console.table(server_res.data);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user_token", JSON.stringify(server_res.data.tokens));
            navigate("/landing");
            toast.success("Login successful");
        }
    };
    useEffect(() => {
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_CLIENT_ID,
            callback: handleSignInWithGoogle,
        });
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large", text: "continue_with", width: "350" }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = logindata;
        if (!email || !password) {
            setError("Email and password are required");
        } else {
            setIsLoading(true);
            try {
                const res = await axios.post(`${BASE_URL}/api/v1/auth/login/`, logindata);
                const response = res.data;
                console.log(response);
                setIsLoading(false);

                const user = {
                    "email": response.email,
                    "names": response.full_name,
                    "user_type": response.user_type  // Add user_type to local storage
                };
                if (res.status === 200) {
                    localStorage.setItem("user", JSON.stringify(user));

                    localStorage.setItem("access", JSON.stringify(response.access_token));
                    localStorage.setItem("refresh", JSON.stringify(response.refresh_token));
                    if (response.user_type === "recruiter") {
                        const jwt_access = JSON.parse(localStorage.getItem('access'));
                        console.log(jwt_access)

                        const profileRes = await axios.get(`${BASE_URL}/api/v1/auth/check-company-profile/`, {
                            headers: {
                                'Authorization': `Bearer ${jwt_access}`
                            }
                        });

                        if (profileRes.status === 204) {
                            // No content means no company profile
                            navigate("/company-form");
                        } else {
                            navigate("/recruiter-home");
                        }
                    } else {
                        try {
                            const jwt_access = JSON.parse(localStorage.getItem('access'));
                            const userProfileRes = await axios.get(`${BASE_URL}/api/v1/auth/check-user-profile/`, {
                                headers: {
                                    'Authorization': `Bearer ${jwt_access}`
                                }
                            });
                            
                            if (userProfileRes.status === 204) {
                                // No profile exists, redirect to profile form
                                console.log("To user profile form")
                                navigate("/user-detail-form");
                            } else {
                                // Profile exists, proceed to landing page
                                navigate("/landing");
                            }
                        } catch (profileError) {
                            console.error('Error checking user profile:', profileError);
                            // If there's an error, we'll assume no profile and redirect to the form
                            navigate("/user-detail-form");
                        }
                    }

                    toast.success("Login successful");
                }
            } catch (error) {
                setIsLoading(false);
                if (error.response) {
                  if (error.response.status === 401) {
                    setError("Invalid email or password");
                  } else if (error.response.status === 403) {
                    if (error.response.data.error === "Your account has been blocked. Please contact support.") {
                      setError(error.response.data.error);
                    } else {
                      setError("Enter valid details");
                    }
                  } else {
                    setError("Login failed. Please try again.");
                  }} else {
                    console.error('Error message:', error.message);
                    setError("Login failed. Please try again.");
                }
            }
        }
    };

    return (
        <div className="flex w-full h-screen justify-center items-center">
        <div className="w-full flex items-center justify-center lg:w-1/2">
            <div className="bg-white px-8 py-16 rounded-2xl border-2 border-gray-200">
                <div className="ml-8">
                    <img src={"images/official_logo.png"} className="w-60 h-20" />
                </div>
                <p className="font-medium text-lg text-gray-500 mt-4">Welcome back! Please enter your details</p>
                <div className="mt-6">
                    <form onSubmit={handleSubmit}>
                        {isLoading && (
                            <p>Loading...</p>
                        )}
                        {error && (
                            <p className="text-red-500">{error}</p>
                        )}
                        <div>
                            <label className="text-lg font-medium">Email</label>
                            <input className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                                placeholder="Enter your email"
                                type="text"
                                name="email"
                                value={logindata.email}
                                onChange={handleOnchange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="text-lg font-medium">Password</label>
                            <input className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
                                type="password" placeholder="Enter your password" name="password"
                                value={logindata.password}
                                onChange={handleOnchange}
                                required
                            />
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                            <div>
                                <input type="checkbox" id="remember" />
                                <label className="ml-2 font-medium text-base" htmlFor="remember">Remember me</label>
                            </div>
                            <button className="font-medium text-base text-violet-500"><Link to={"/forgot-password"}>Forgot password?</Link></button>
                        </div>
                        <div className="mt-6 flex flex-col gap-y-3">
                            <button className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-2.5 rounded-xl bg-violet-500 text-white text-lg font-bold" type="submit">Sign in</button>
                            {/* <button className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all flex rounded-xl py-2.5 border-2 border-gray-200 items-center justify-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335" />
                                    <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853" />
                                    <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2" />
                                    <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05" />
                                </svg>
                                Sign in with Google
                            </button> */}
                              {/* <div className="googleContainer"
                                id='signInDiv'
                            >
                                <button>
                                    Sign up with Google
                                </button>
                            </div> */}
                        </div>
                        <div className="mt-6 flex justify-center items-center">
                            <p className="font-medium text-base">Don't have an account?</p>
                            <div className="text-violet-500 text-base font-medium ml-2"><Link to="/signup">Sign up</Link></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
    )
}

export default Login;
