import React from 'react'
import { Link } from 'react-router-dom';
import { Star, Briefcase, ClipboardCheck, User } from 'lucide-react';
import JobCard from './JobCard';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';



const LandingBody = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v1/auth/api/jobs/`);
        console.log("API Response:", response.data);
        console.log(response.data.results.salary)
        setJobs(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);



  return (
    <div>
      <div className='flex flex-col md:flex-row px-4 lg:px-28 mt-9'>
        <div className='w-full md:w-1/2 my-auto px-4 lg:px-20 text-left'>
          <h1 className=' font-semibold text-4xl md:text-7xl leading-tight  -mt-16 pt-6 md:pt-0'>One Step Closer To Your New Job</h1>
          <p className='text-slate-500 mt-3'>Welcome to our Job Portal, where talent meets opportunities. Find your dream job with ease. Employers, connect with qualified candidates. Start your journey today!</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mt-3 px-4 border border-blue-700 rounded">
            <Link to='/find-jobs'>Find Jobs</Link>
          </button>
        </div>
        <div className='w-full md:w-1/2 '>
          <img src={"/images/bannerlanding.png"} alt="" className='max-w-[70%]  h-full mx-auto' />
        </div>
      </div>
      {/* banner */}
      <div className='py-4 mt-6 bg-gray-50  flex flex-col px-4 lg:px-28 pb-32'>
        <div >
          <h1 className='text-left font-semibold text-2xl mb-5'>Most Demand Jobs Categories</h1>
        </div>
        <div className='flex justify-center flex-wrap'>
          <div className='h-44 w-44  mr-2 flex flex-col items-start justify-end bg-black p-3 rounded-md border-2 cursor-pointer shadow-sm hover:transform hover:scale-105 transition-transform duration-300'>

            <div>

              <span className='text-white font-medium text-xl'>Design</span><br />
              <span className='text-white'> New 186 Jobs Posted</span>
            </div>
          </div>
          <div className='h-44 w-44  flex flex-col items-start justify-between p-3 mr-2 shadow-sm hover:transform cursor-pointer hover:scale-105 transition-transform duration-300'>
            <div className='ml-auto'>
              <img src={"/images/technology.png"} alt="" className='w-10' />
            </div>
            <div className='text-left'>
              <span className=' font-medium text-xl pb-4'>Technolgy</span><br />
              <span className=''> New 186 Jobs Posted</span>
            </div>
          </div>
          <div className='h-44 w-44  flex flex-col items-start justify-between p-3 mr-2 shadow-sm hover:transform cursor-pointer hover:scale-105 transition-transform duration-300'>
            <div className='ml-auto'>
              <img src={"/images/technology.png"} alt="" className='w-10' />
            </div>
            <div className='text-left'>
              <span className=' font-medium text-xl pb-4'>Technolgy</span><br />
              <span className=''> New 186 Jobs Posted</span>
            </div>
          </div>
          <div className='h-44 w-44  flex flex-col items-start justify-between p-3 mr-2 shadow-sm hover:transform cursor-pointer hover:scale-105 transition-transform duration-300'>
            <div className='ml-auto'>
              <img src={"/images/merketting.png"} alt="" className='w-10' />
            </div>
            <div className='text-left'>
              <span className=' font-medium text-xl'>Marketting</span><br />
              <span className=''> New 186 Jobs Posted</span>
            </div>

          </div>
          <div className='h-44 w-44 flex flex-col items-start justify-between p-3 mr-2 shadow-sm hover:transform cursor-pointer hover:scale-105 transition-transform duration-300'>
            <div className='ml-auto'>
              <img src={"images/finance.png"} alt="" className='w-10' />
            </div>
            <div className='text-left'>
              <span className=' font-medium text-xl '>Finance</span><br />
              <span className=''> New 186 Jobs Posted</span>
            </div>

          </div>
          <div className='h-44 w-44 rounded-md flex flex-col items-start justify-center bg-slate-200 p-3 mr-2 cursor-pointer shadow-sm hover:transform hover:scale-105 transition-transform duration-300'>
            <div className='mx-auto'>
              <img src={"images/findmore.png"} alt="" className='w-14' />
            </div>
            <div className='mx-auto'>
              <span className=' font-medium text-xl '>Find More</span><br />

            </div>

          </div>
        </div>
      </div >
      {/* endofcategory */}
      <div className='mt-3 px-4 lg:px-28'>
        <div className='text-left font-semibold text-4xl mb-5'>
          Lastest Job Posts
        </div>

        <div className='flex flex-wrap justify-center'>
          
        <div className='w-full flex flex-wrap gap-8 px-28 pl-40'>
              {jobs?.slice(0, 6).map((job, index) => (
                <JobCard job={job} key={index} />
              ))}
            </div>

        </div>
      </div>



      <div className="container mx-auto px-4 py-12 max-w-6xl mt-7">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative">
              <div className="relative z-10 bg-white p-6 rounded-tl-3xl rounded-br-3xl shadow-lg">
                <img
                  src={"/images/home_page_img.png"}
                  alt="Smiling candidate"
                  className="w-full h-auto rounded-tl-2xl rounded-br-2xl"
                />
              </div>
            </div>
          </div>

          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-4xl font-semibold mb-12">
              Perfect for Candidates.<br />
              Beautiful for Employers.
            </h2>

            <div className="grid grid-cols-2 gap-8">
              <FeatureCard
                icon={<Star className="w-6 h-6 text-teal-black" />}
                title="Profile Highlighters"
                description="Get highlighted by the company that you've been worked"
              />
              <FeatureCard
                icon={<Briefcase className="w-6 h-6 text-teal-black" />}
                title="Career Booster"
                description="Boost your career journey faster than before"
              />
              <FeatureCard
                icon={<ClipboardCheck className="w-6 h-6 text-teal-black" />}
                title="Interactive Assesment"
                description="Work on the interactive assesment given from company"
              />
              <FeatureCard
                icon={<User className="w-6 h-6 text-teal-black" />}
                title="Featured Profile"
                description="Being featured makes your profile stands out from others"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingBody



const FeatureCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="bg-gray-100 p-3 rounded-full mb-2">
      {icon}
    </div>
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

