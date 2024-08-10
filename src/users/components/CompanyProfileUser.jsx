import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3, FiUpload } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { companies } from "../../utils/data";
import Loading from "./Loading";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import { FaUsers } from "react-icons/fa";
import { toast } from 'sonner';
import JobCard from "./JobCard";
import { BASE_URL } from "../../utils/config";




const CompanyProfileUser = () => {
    const { id } = useParams();
    const params = useParams();
    const [info, setInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();
    const [about, setAbout] = useState(companyInfo?.about || '');

    useEffect(() => {
        setInfo(companies[parseInt(params?.id) - 1] ?? companies[0]);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [params]);

    const user = JSON.parse(localStorage.getItem('user'));
    const jwt_access = localStorage.getItem('access');

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCompanyJobs = async () => {
            try {
                let jwt_access = localStorage.getItem('access');
                jwt_access = JSON.parse(jwt_access);
    
                if (!jwt_access) {
                    throw new Error("JWT token is missing");
                }
    
                const response = await axios.get(`${BASE_URL}/api/v1/auth/company-jobs/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_access}`,
                    }
                });
                
                if (response.status === 200) {
                    setJobs(response.data);
                } else {
                    throw new Error('Failed to fetch company jobs');
                }
            } catch (error) {
                console.error('Error fetching company jobs:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCompanyJobs();
    }, [id]);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                let jwt_access = localStorage.getItem('access');
                jwt_access = JSON.parse(jwt_access);

                if (!jwt_access) {
                    throw new Error("JWT token is missing");
                }

                const response = await axios.get(`${BASE_URL}/api/v1/auth/company-profile-user/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${jwt_access}`,
                    }
                });

                if (response.status === 200) {
                    setCompanyInfo(response.data);
                } else {
                    throw new Error('Failed to fetch company profile');
                }
            } catch (error) {
                console.error('Error fetching company profile:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [id]);

    useEffect(() => {
        if (!jwt_access && !user) {
            navigate("/");
        } else {
        }
    }, [jwt_access, user, navigate]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-5">
                <div>
                    <div className="w-full flex flex-col md:flex-row gap-3 justify-between items-center">
                        <h2 className="text-gray-800 text-2xl font-semibold">
                            Welcome, {companyInfo?.company_name ?? 'Company'}
                        </h2>
                        <div className="flex items-center gap-4">
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between mt-8 space-y-4 md:space-y-0 md:space-x-4">
                        {companyInfo?.company_logo && (
                            <div className="company-logo">
                                <img src={companyInfo.company_logo} alt="Company Logo" className="w-24 h-24 object-cover rounded-full" />
                            </div>
                        )}
                        <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
                            <HiLocationMarker /> {companyInfo?.company_location ?? 'No Location'}
                        </p>
                        <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
                            <FiPhoneCall /> {companyInfo?.contact_number ?? 'No Contact'}
                        </p>
                        <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
                            <FaUsers /> {companyInfo?.company_strength ?? 'No Company Strength'} Employees
                        </p>
                        <p className="flex gap-1 items-center px-3 py-1 text-slate-600 rounded-full">
                            <AiOutlineMail /> {companyInfo?.email_address ?? 'No Email'}
                        </p>
                        <div>
                        </div>
                    </div>
                    {/* New About section */}
                    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">About</h3>
                        </div>
                        <p className="text-gray-700">{about || 'No company description available.'}</p>
                    </div>

                    <div className="flex flex-col items-center mt-10 md:mt-10">
                        <span className="text-xl font-bold">{jobs?.length}</span>
                        <p className="text-blue-600">Job Post</p>
                    </div>
                </div>

                <div className="w-full mt-20">
                    <p className="text-lg font-semibold mb-4">Jobs Posted</p>
                    <div className="flex flex-wrap gap-4">
                        {Array.isArray(jobs) ? (
                            jobs.length > 0 ? (
                                jobs.map(job => <JobCard key={job.id} job={{ ...job, companyInfo }} />)
                            ) : (
                                <p>No jobs found.</p>
                            )
                        ) : (
                            <p>Error: Jobs data is not an array.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompanyProfileUser;
