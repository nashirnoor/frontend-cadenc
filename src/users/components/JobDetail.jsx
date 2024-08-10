import { useEffect, useState } from "react";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { jobs } from "../../utils/data";
import CustomButton from "./Custombutton";
import JobCard from "./JobCard";
import axios from "axios";
import Header from "./Header";
import { BASE_URL } from "../../utils/config";


const ApplicationModal = ({ isOpen, onClose, jobType, jobLocation,id,setIsApplied }) => {
  const [isImmediateJoinee, setIsImmediateJoinee] = useState(null);
  const [experience, setExperience] = useState('');
  const [isWillingToRelocate, setIsWillingToRelocate] = useState(null);
  const [errors, setErrors] = useState({});
  const [resume, setResume] = useState(null);


  if (!isOpen) return null;

  const clearError = (fieldName) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: null }));
  };

  const handleImmediateJoineeChange = (value) => {
    setIsImmediateJoinee(value);
    clearError('isImmediateJoinee');
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
    clearError('experience');
  };

  const handleWillingToRelocateChange = (value) => {
    setIsWillingToRelocate(value);
    clearError('isWillingToRelocate');
  };
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
    clearError('resume');
  };

  const validateForm = () => {
    const newErrors = {};

    if (isImmediateJoinee === null) {
      newErrors.isImmediateJoinee = 'Please select an option';
    }

    if (!experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    if (isWillingToRelocate === null) {
      newErrors.isWillingToRelocate = 'Please select an option';
    }
    if (!resume) {
      newErrors.resume = 'Please upload your resume';
    } else if (resume.size > 5 * 1024 * 1024) { // 5MB limit
      newErrors.resume = 'File size should not exceed 5MB';
    }
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append('isImmediateJoinee', isImmediateJoinee);
      formData.append('experience', experience);
      formData.append('isWillingToRelocate', isWillingToRelocate);
      formData.append('resume', resume);
  
      try {
        let jwt_a = localStorage.getItem('access');
        jwt_a = JSON.parse(jwt_a);
        const response = await axios.post(
          `${BASE_URL}/api/v1/auth/${id}/apply/`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${jwt_a}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('Application submitted:', response.data);
        setIsApplied(true); // Update the applied state
        onClose();
      } catch (error) {
        console.error('Error submitting application:', error);
      }
    } else {
      console.log('Form has errors');
    }
};

     

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div className="bg-black text-white p-8 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Job Application</h2>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition duration-150">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">Are you an immediate joinee?</label>
            <div className="flex space-x-6">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black"
                    name="immediateJoinee"
                    value={option.toLowerCase()}
                    onChange={() => handleImmediateJoineeChange(option === 'Yes')}
                    checked={isImmediateJoinee === (option === 'Yes')}
                  />
                  <span className="ml-3 text-gray-700 text-lg">{option}</span>
                </label>
              ))}
            </div>
            {errors.isImmediateJoinee && <p className="text-red-500 text-sm mt-1">{errors.isImmediateJoinee}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3" htmlFor="experience">
              How much experience do you have in this role?
            </label>
            <input
              type="text"
              id="experience"
              className="mt-1 block w-full border-b-2 border-gray-300 focus:border-black px-0.5 py-2 bg-transparent focus:outline-none text-lg"
              value={experience}
              onChange={handleExperienceChange}
              placeholder="e.g., 2 years"
            />
            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
          </div>

          {jobType === 'remote' ? (
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">Are you ready to work remotely?</label>
              <div className="flex space-x-6">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black"
                      name="remoteWork"
                      value={option.toLowerCase()}
                      onChange={() => handleWillingToRelocateChange(option === 'Yes')}
                      checked={isWillingToRelocate === (option === 'Yes')}
                    />
                    <span className="ml-3 text-gray-700 text-lg">{option}</span>
                  </label>
                ))}
              </div>
              {errors.isWillingToRelocate && <p className="text-red-500 text-sm mt-1">{errors.isWillingToRelocate}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">Are you ready to relocate to {jobLocation}?</label>
              <div className="flex space-x-6">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-black border-2 border-gray-300 focus:ring-2 focus:ring-black"
                      name="relocate"
                      value={option.toLowerCase()}
                      onChange={() => handleWillingToRelocateChange(option === 'Yes')}
                      checked={isWillingToRelocate === (option === 'Yes')}
                    />
                    <span className="ml-3 text-gray-700 text-lg">{option}</span>
                  </label>
                ))}
              </div>
              {errors.isWillingToRelocate && <p className="text-red-500 text-sm mt-1">{errors.isWillingToRelocate}</p>}
            </div>
          )}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3" htmlFor="resume">
              Upload Resume (PDF, max 5MB)
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf"
              onChange={handleResumeChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-black file:text-white
                hover:file:bg-gray-900"
            />
            {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
          </div>


          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 transition duration-300 transform hover:scale-105"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isApplied, setIsApplied] = useState(false);
 
  const { id } = useParams();
  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;
  const [selected, setSelected] = useState("0");
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')); // Assuming the user object is stored in localStorage

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
                {job.applicants_count || 0}
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

            <div className='w-full'>
            <CustomButton
                title={isApplied ? "Already Applied" : "Apply Now"}
                onClick={() => {
                  if (!isApplied) {
                    setIsModalOpen(true);
                  }
                }}
                containerStyles={`w-full flex items-center justify-center text-white ${isApplied ? "bg-gray-500" : "bg-black"} py-3 px-5 outline-none rounded-full text-base`}
                disabled={isApplied}
              />
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobType={job?.job_type}
        jobLocation={job?.job_location}
        id={id}
        setIsApplied={setIsApplied}
      />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0'>
            <p className='text-gray-500 font-semibold'>Similar Job Post</p>

            <div className='w-full flex flex-wrap gap-4'>
              {jobs?.slice(0, 6).map((job, index) => (
                <JobCard job={job} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default JobDetail;