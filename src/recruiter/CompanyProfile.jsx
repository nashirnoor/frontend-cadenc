import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3, FiUpload } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { companies, jobs } from "../utils/data";
import CustomButton from "../users/components/Custombutton";
import Loading from "../users/components/Loading";
import TextInput from "../users/components/TextInput";
import Footer from "../users/components/Footer";
import { useNavigate } from "react-router-dom";
import Header from "./RecruiterHeader";
import axios from "axios";
import { FaUsers } from "react-icons/fa";
import axiosInstance from '../users/utils/axiosInstance';
import JobCardRecuiter from "./components/JobCardRecuiter";
import { FaEdit } from 'react-icons/fa'; 
import { toast } from 'sonner';
import { BASE_URL } from "../utils/config";


const CompanyForm = ({ open, setOpen, companyInfo, onSubmit, onUpdate, getCompanyProfile }) => {
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: companyInfo,
  });

  useEffect(() => {
    if (companyInfo) {
      setValue("company_name", companyInfo.company_name);
      setValue("company_location", companyInfo.company_location);
      setValue("contact_number", companyInfo.contact_number);
      setValue("email_address", companyInfo.email_address);
      setValue("company_strength", companyInfo.company_strength);
      setValue("company_logo", companyInfo.company_logo);
    }
  }, [companyInfo, setValue]);

  const closeModal = () => setOpen(false);
  

  const handleFormSubmit = (data) => {

    const formData = new FormData();
    for (const key in data) {
      if (key === "company_logo") {
        if (data[key] instanceof FileList && data[key].length > 0) {
          formData.append(key, data[key][0]);
        } else if (typeof data[key] === 'string' && data[key].startsWith('http')) {
          // If it's a URL, don't append it to formData
          continue;
        }
      } else {
        formData.append(key, data[key]);
      }
    } 
    const jwt_access = localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access')) : null;
    console.log(jwt_access)
    

    axiosInstance.put(`${BASE_URL}/api/v1/auth/company-profile/update/${companyInfo.id}/`, formData, {
      headers: {
        'Authorization': `Bearer ${jwt_access}`,
      },
    })
      .then(response => {
        if (typeof onSubmit === 'function') {
          onSubmit(response.data);
          console.log("pppppppppp",response.data)
          
        } else {
          console.log(response.data,"lllllll");
        }
        closeModal();
        if (response.status === 200) {
          // Call the onUpdate function with the updated data
          onUpdate(formData);
          setOpen(false);
          toast.success('Company profile updated successfully');
          getCompanyProfile();
        }
      })
      .catch(error => {
        console.error('Error encountered:', error);
      });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={closeModal}></div>
            <div className="relative bg-white rounded-2xl text-left shadow-xl transform transition-all max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Edit Company Profile
              </h3>
              <form className="w-full mt-2 flex flex-col gap-5" onSubmit={handleSubmit(handleFormSubmit)} encType="multipart/form-data">
                <TextInput
                  name='company_name'
                  label='Company Name'
                  type='text'
                  register={register("company_name", { required: "Company Name is required" })}
                  error={errors.company_name ? errors.company_name.message : ""}
                />
                <TextInput
                  name='company_location'
                  label='Location/Address'
                  placeholder='eg. California'
                  type='text'
                  register={register("company_location", { required: "Address is required" })}
                  error={errors.company_location ? errors.company_location.message : ""}
                />
                <TextInput
                  name='contact_number'
                  label='Contact'
                  placeholder='Phone Number'
                  type='text'
                  register={register("contact_number", { required: "Contact is required!" })}
                  error={errors.contact_number ? errors.contact_number.message : ""}
                />
                <TextInput
                  name='email_address'
                  label='Email'
                  placeholder='Company Email'
                  type='email'
                  register={register("email_address", {
                    required: "Email is required!",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email_address ? errors.email_address.message : ""}
                />
                <TextInput
                  name='company_strength'
                  label='Company Strength'
                  placeholder='Company Strength'
                  type='text'
                  register={register("company_strength", { required: "Company Strength is required!" })}
                  error={errors.company_strength ? errors.company_strength.message : ""}
                />

                <div className='w-full mt-2'>
                  <label className='text-gray-600 text-sm mb-1'>Company Profile Photo</label>
                  {companyInfo && companyInfo.company_logo && (
                    <div className='mb-4'>
                      <img
                        src={companyInfo.company_logo}
                        alt='Company Logo'
                        className='w-16 h-16 object-cover rounded-md cursor-pointer'
                        onClick={() => document.getElementById('fileInput').click()}
                      />
                    </div>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    id='fileInput'
                    style={{ display: 'none' }}
                    {...register("company_logo")}
                    className='w-full border border-gray-300 rounded-md p-2'
                  />
                  {errors.company_logo && (
                    <span className='text-xs text-red-500 mt-0.5'>
                      {errors.company_logo.message}
                    </span>
                  )}
                </div>
                <div className='mt-4'>
                  <CustomButton
                    type='submit'
                    containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none'
                    title={"Submit"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const CompanyProfile = () => {
  const params = useParams();
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const navigate = useNavigate();
  const [jobs2, setJobs2] = useState([]);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about, setAbout] = useState(companyInfo?.about || '');
  const [editingJob, setEditingJob] = useState(null);


  useEffect(() => {
    // setInfo(companies[parseInt(params?.id) - 1 ?? 0]);
    setInfo(companies[parseInt(params?.id) - 1] ?? companies[0]);

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    getCompanyProfile();
  }, [params]);

  const user = JSON.parse(localStorage.getItem('user'));
  const jwt_access = localStorage.getItem('access');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkForm = async () => {
      try {
        const jwt_access = JSON.parse(localStorage.getItem('access'));
        const profileRes = await axios.get(`${BASE_URL}/api/v1/auth/check-company-profile/`, {
          headers: {
            'Authorization': `Bearer ${jwt_access}`
          }
        });
        
        if (profileRes.status === 204) {
          // No content means no company profile
          navigate("/company-form");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking company profile:', error);
        // Handle error (e.g., redirect to login page if unauthorized)
        navigate("/login");
      }
    };

    checkForm();
    if (companyInfo) {
      setAbout(companyInfo.about || '');
    }
  }, [navigate,companyInfo]);

  useEffect(() => {
    let jwt_a = localStorage.getItem('access');
    jwt_a = JSON.parse(jwt_a);
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/jobs/`, {
          headers: {
            'Authorization': `Bearer ${jwt_a}`,
          }
        });
        console.log(response)
        setJobs(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  const handleAboutUpdate = async () => {
    try {
      let jwt_access = localStorage.getItem('access');
      jwt_access = JSON.parse(jwt_access);

      const response = await axios.patch(
       `${BASE_URL}/api/v1/auth/company-profile-update/`,
        { about },
        {
          headers: {
            'Authorization': `Bearer ${jwt_access}`,
          }
        }
      );

      if (response.status === 200) {
        setCompanyInfo({ ...companyInfo, about });
        setIsEditingAbout(false);
        toast.success('About section updated successfully');
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      toast.error('Failed to update about section');
    }
  };

  
  const handleDelete = async (jobId) => {
    let jwt_a = localStorage.getItem('access');
    jwt_a = JSON.parse(jwt_a);
    try {
      await axios.delete(`${BASE_URL}/api/v1/auth/jobs/delete/${jobId}/`, {
        headers: {
          'Authorization': `Bearer ${jwt_a}`,
        }
      });
      // Remove the deleted job from the state
      setJobs(jobs.filter(job => job.id !== jobId));
      // Show success message
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error('Failed to delete job');
    }
  };

  const getCompanyProfile = async () => {
    try {
      let jwt_access = localStorage.getItem('access');
      jwt_access = JSON.parse(jwt_access);

      if (!jwt_access) {
        throw new Error("JWT token is missing");
      }

      const response = await axios.get(`${BASE_URL}/api/v1/auth/company-profile-get/`, {

        headers: {
          'Authorization': `Bearer ${jwt_access}`,
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        setCompanyInfo(response.data);
        setIsLoading(false);
      } else {
        console.error('Error fetching company profile:', response.status, response.statusText);
      }

    } catch (error) {
      console.error('Error fetching company profile:', error);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!jwt_access && !user) {
      navigate("/login");
    } else {
    }
  }, [jwt_access, user, navigate]);

  const updateCompanyInfo = (updatedInfo) => {
    setCompanyInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }));
  };


  const handleLogout = async () => {
    try {
      const refresh_token = JSON.parse(localStorage.getItem('refresh'));
      await axiosInstance.post("/auth/logout/", { refresh_token });
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      navigate('/login');
      toast.success("Logout successful");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      const jwt_a = JSON.parse(localStorage.getItem('access'));
      await axios.put(`${BASE_URL}/api/v1/auth/jobs/${updatedJob.id}/`, updatedJob, {
        headers: {
          'Authorization': `Bearer ${jwt_a}`,
        }
      });
      setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      setEditingJob(null);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };



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
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
              <Link to="/upload-job">
                <CustomButton
                  title="Upload Job"
                  containerStyles="text-blue-600 py-1.5 px-3 md:px-5 focus:outline-none rounded text-sm md:text-base border border-blue-600"
                />
              </Link>
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
            <button
              onClick={() => setOpenForm(true)}
              className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-150 ease-in-out"
            >
              Edit Profile
            </button>
            </div>
             
           
          </div>
         

          <CompanyForm open={openForm} setOpen={setOpenForm} companyInfo={companyInfo} onUpdate={updateCompanyInfo } getCompanyProfile={getCompanyProfile} />
           {/* New About section */}
           <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">About</h3>
        <button
          onClick={() => setIsEditingAbout(!isEditingAbout)}
          className="text-blue-500 hover:text-blue-600"
        >
          <FaEdit size={20} />
        </button>
      </div>
      {isEditingAbout ? (
        <div>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="4"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleAboutUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">{about || 'No company description available.'}</p>
      )}
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
                jobs.map(job =>   <JobCardRecuiter
                  key={job.id}
                  job={{ ...job, companyInfo }}
                  onDelete={handleDelete}
                  onEdit={() => handleEdit(job)}
                />)
              ) : (
                <p>No jobs found.</p>
              )
            ) : (
              <p>Error: Jobs data is not an array.</p>
            )}
          </div>
        </div>
        {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <EditJobForm job={editingJob} onSubmit={handleUpdateJob} />
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;



const EditJobForm = ({ job, onSubmit}) =>{
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [jobType, setJobType] = useState(job.job_type);
  const [jobLocationType, setJobLocationType] = useState(job.job_location_type);
  const [selectedSkills, setSelectedSkills] = useState(job.skills || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([]);
  
  useEffect(() => {
    // Set initial form values
    setValue('jobTitle', job.job_title);
    setValue('salary', job.salary);
    setValue('vacancies', job.vacancies);
    setValue('experience', job.experience);
    setValue('job_location', job.job_location);
    setValue('job_description', job.job_description);
    setValue('core_responsibilities', job.core_responsibilities);
    setSelectedSkills(job.skills || []);
  }, [job, setValue]);

  // Implement skill search and selection logic here

  const onFormSubmit = (data) => {
    const updatedJob = {
      ...job,
      ...data,
      job_type: jobType,
      job_location_type: jobLocationType,
      skill_ids: selectedSkills.map(skill => skill.id),
    };
    onSubmit(updatedJob);
  };



return (
  <div className='w-full lg:w-2/3'>
           <div className='bg-white rounded-xl shadow-2xl overflow-hidden'>
             <div className='p-8'>
               <h2 className='text-3xl font-extrabold text-gray-900 mb-8'>Post a New Job</h2>
               <form className='space-y-6' onSubmit={handleSubmit(onFormSubmit)}>
                 <TextInput
                   name='jobTitle'
                   label='Job Title'
                   placeholder='e.g. Senior Software Engineer'
                   type='text'
                   register={register('jobTitle', {
                     required: 'Job Title is required',
                     validate: (value) => value.trim() !== '' || 'Job Title cannot be empty'
                   })}
                   error={errors.jobTitle ? errors.jobTitle?.message : ''}
                   styles='w-full'
                 />
 
                 <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                 <div className='flex flex-col mt-2'>
                     <p className='text-gray-600 text-sm mb-1'>Job Type</p>
                     <select
                       className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2'
                       value={jobType}
                       onChange={(e) => setJobType(e.target.value)}
                     >
                       <option value='full_time'>Full-time</option>
                       <option value='part_time'>Part-time</option>
                       <option value='contract'>Contract</option>
                       <option value='intern'>Intern</option>
                     </select>
                   </div>
                     
                   <TextInput
                     name='salary'
                     label='Salary (INR)'
                     placeholder='e.g. 150000'
                     type='number'
                     register={register('salary', {
                       required: 'Salary is required',
                       min: { value: 0, message: 'Salary must be 0 or greater' },
                       validate: (value) => parseInt(value) >= 0 || 'Salary must be 0 or greater'
                     })}
                     error={errors.salary ? errors.salary?.message : ''}
                   />
                 </div>
 
                 <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                   <TextInput
                     name='vacancies'
                     label='No. of Vacancies'
                     placeholder='Number of open positions'
                     type='number'
                     register={register('vacancies', {
                       required: 'Vacancies is required!',
                       min: { value: 0, message: 'Vacancies must be 0 or greater' },
                       validate: (value) => parseInt(value) >= 0 || 'Vacancies must be 0 or greater'
                     })}
                     error={errors.vacancies ? errors.vacancies?.message : ''}
                   />
 
                   <TextInput
                     name='experience'
                     label='Years of Experience'
                     placeholder='Required experience'
                     type='number'
                     register={register('experience', {
                       required: 'Experience is required',
                       min: { value: 0, message: 'Experience must be 0 or greater' },
                       validate: (value) => parseInt(value) >= 0 || 'Experience must be 0 or greater'
                     })}
                     error={errors.experience ? errors.experience?.message : ''}
                   />
                 </div>
                 <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                 <TextInput
                   name='location'
                   label='Job Location'
                   placeholder='e.g. New York'
                   type='text'
                   register={register('job_location', {
                     required: 'Job Location is required',
                     validate: (value) => value.trim() !== '' || 'Job Location cannot be empty'
                   })}
                   error={errors.job_location ? errors.job_location?.message : ''}
                   styles='w-full'
                 />
                   <div className='flex flex-col mt-2'>
                       <p className='text-gray-600 text-sm mb-1'>Job Location Type</p>
                       <select
                         className='rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2'
                         value={jobLocationType}
                         onChange={(e) => setJobLocationType(e.target.value)}
                       >
                         <option value='on_site'>On-site</option>
                         <option value='hybrid'>Hybrid</option>
                         <option value='remote'>Remote</option>
                       </select>
                     </div>
                     </div>

                 <div>
                   <label className='block text-sm font-medium text-gray-700 mb-1'>Job Description</label>
                   <textarea
                     className='w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                     rows={4}
                     {...register('job_description', {
                       required: 'Job Description is required!',
                       validate: (value) => value.trim() !== '' || 'Job Description cannot be empty'
                     })}
                     aria-invalid={errors.job_description ? 'true' : 'false'}
                   ></textarea>
                   {errors.job_description && (
                     <p className='mt-1 text-sm text-red-600'>{errors.job_description?.message}</p>
                   )}
                 </div>
                 <div className="mb-6">
                     <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                       Skills
                     </label>
                     <div className="relative">
                       <input
                         type="text"
                         value={searchTerm}
                         onChange={handleSearchChange}
                         placeholder="Search and select skills"
                         className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                       />
                       {searchTerm && (
                         <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                           {skills.map(skill => (
                             <li
                               key={skill.id}
                               onClick={() => handleSkillSelect(skill)}
                               className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                             >
                               {skill.name}
                             </li>
                           ))}
                         </ul>
                       )}
                     </div>
                     <div className="mt-2 flex flex-wrap">
                       {selectedSkills.map(skill => (
                         <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                           {skill.name}
                           <button
                             type="button"
                             onClick={() => handleRemoveSkill(skill.id)}
                             className="ml-1 text-blue-400 hover:text-blue-600 focus:outline-none"
                           >
                             &times;
                           </button>
                         </span>
                       ))}
                     </div>
                   </div>
 
                 <div>
                   <label className='block text-sm font-medium text-gray-700 mb-1'>Core Responsibilities</label>
                   <textarea
                     className='w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                     rows={4}
                     {...register('core_responsibilities', {
                       validate: (value) => !value || value.trim() !== '' || 'Core Responsibilities cannot be empty if provided'
                     })}
                   ></textarea>
                   {errors.core_responsibilities && (
                     <p className='mt-1 text-sm text-red-600'>{errors.core_responsibilities?.message}</p>
                   )}
                 </div>
 
                 {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
 
                 <div>
                   <CustomButton
                     type='submit'
                     containerStyles='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                     title='Update Job'
                   />
                 </div>
               </form>
             </div>
           </div>
         </div>
         )
}
