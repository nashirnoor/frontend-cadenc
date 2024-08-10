import { useEffect, useState } from "react";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useParams } from "react-router-dom";
import CustomButton from "../users/components/Custombutton";
import axios from "axios";
import Header from "./RecruiterHeader";
import { BASE_URL } from "../utils/config";



const JobDetailRecruiter = () => {
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isApplied, setIsApplied] = useState(false);
 
  const { id } = useParams();
  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;
  const [selected, setSelected] = useState("0");
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/api/jobs`);
        console.log("API Response:", response.data);
        setJobs(response.data.results);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      }
    };

    fetchJobs();
  }, []);


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/api/jobs/${id}/`);
        const jobData = response.data;
        setJob(jobData);
        const user = JSON.parse(localStorage.getItem('user')); // Parse user object from local storage


        // Check if the user has applied
        const userId = localStorage.getItem('user_id'); // Assuming you store user ID in local storage
        const hasApplied = jobData.applications?.some(application => application.user_id === user.id);
        setIsApplied(hasApplied);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [id]);
  if (!job) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className='container mx-auto'>
        <div className='w-full flex flex-col md:flex-row gap-10'>
          {/* LEFT SIDE */}
          <div className='w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md'>
            <div className='w-full flex items-center justify-between'>
              <div className='w-3/4 flex gap-2'>
                <img
                  src={companyLogo}
                  alt={job?.company?.name}
                  className='w-20 h-20 md:w-20 md:h-20 rounded'
                />

                <div className='flex flex-col'>
                  <p className='text-xl font-semibold text-gray-600'>
                    {job?.job_title}
                  </p>
                  <span className='text-base'>{job?.job_location}</span>

                  <span className='text-base text-blue-600'>
                    {job?.company_name}
                  </span>

                  <span className='text-gray-500 text-sm'>
                    {moment(job?.createdAt).fromNow()}
                  </span>
                </div>
              </div>

              <div className=''>
                <AiOutlineSafetyCertificate className='text-3xl text-blue-500' />
              </div>
            </div>

            <div className='w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10'>
              <div className='bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
                <span className='text-sm'>Salary</span>
                <p className='text-lg font-semibold text-gray-700'>
                  Rs {job?.salary}
                </p>
              </div>

              <div className='bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
                <span className='text-sm'>Job Type</span>
                <p className='text-lg font-semibold text-gray-700'>
                  {job?.job_type}
                </p>
              </div>

              <div className='bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
                <span className='text-sm'>No. of Applicants</span>
                <p className='text-lg font-semibold text-gray-700'>
                  {job?.applicants?.length}1
                </p>
              </div>

              <div className='bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
                <span className='text-sm'>No. of Vacancies</span>
                <p className='text-lg font-semibold text-gray-700'>
                  {job?.vacancies}
                </p>
              </div>
            </div>

            <div className='w-full flex gap-4 py-5'>
              <CustomButton
                onClick={() => setSelected("0")}
                title='Job Description'
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${selected === "0"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300"
                  }`}
              />

              <CustomButton
                onClick={() => setSelected("1")}
                title='Company'
                containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${selected === "1"
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300"
                  }`}
              />
            </div>

            <div className='my-6'>
              {selected === "0" ? (
                <>
                  <p className='text-xl font-semibold'>Job Decsription</p>

                  <span className='text-base'>{job.job_description}</span>

                  <>
                    <p className='text-xl font-semibold mt-8'>Requirement</p>
                    <span className='text-base'>
                      {job.core_responsibilities}
                    </span>
                  </>

                </>
              ) : (
                <>
                  <div className='mb-6 flex flex-col'>
                    <p className='text-xl text-blue-600 font-semibold'>
                      {job?.company?.name}
                    </p>
                    <span className='text-base'>{job?.company?.location}</span>
                    <span className='text-sm'>{job?.company?.email}</span>
                  </div>

                  <p className='text-xl font-semibold'>About Company</p>
                  <span>Microsoft Corporation and its contributors are available at http://www.microsoft.com and at http://www.microsoft.com for more information about the contributors and contributors to the Microsoft Corporation and its contributors to the Microsoft Corporation and its contributors to the Microsoft Corporation.Microsoft Corporation and its contributors are available at http://www.microsoft.com and at http://www.microsoft.com for more information about the contributors and contributors to the Microsoft Corporation.Microsoft Corporation and its contributors are available at http://www.microsoft.com and at http://www.microsoft.com for more information about the contributors and contributors to the Microsoft Corporation . </span>
                </>
              )}
            </div>

         
          </div>

          {/* RIGHT SIDE */}
          {/* <div className='w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0'>
            <p className='text-gray-500 font-semibold'>Similar Job Post</p>

            <div className='w-full flex flex-wrap gap-4'>
              {jobs?.slice(0, 6).map((job, index) => (
                <JobCard job={job} key={index} />
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </>

  );
};

export default JobDetailRecruiter;