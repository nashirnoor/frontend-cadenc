import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from 'sonner';
import CustomButton from "../users/components/Custombutton";
import JobCard from "../users/components/JobCard";
import TextInput from "../users/components/TextInput";
import JobTypes from "./components/JobTypes";
import Header from "./RecruiterHeader";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/config";


const UploadJob = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState('');
  const [jobType, setJobType] = useState('full_time');
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobLocationType, setJobLocationType] = useState('on_site');


  let jwt_access = localStorage.getItem('access');
  jwt_access = JSON.parse(jwt_access);
  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/auth/skills/?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`,
        },
      });
      setSkills(response.data.results);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/auth/jobs/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/jobs/create/`,
        {
          job_title: data.jobTitle,
          job_type: jobType,
          job_location_type: jobLocationType,  // Add this line
          salary: data.salary,
          vacancies: data.vacancies,
          experience: data.experience,
          job_location: data.job_location,
          job_description: data.job_description,
          core_responsibilities: data.core_responsibilities,
          skill_ids: selectedSkills.map(skill => skill.id),
        },
        {
          headers: {
            'Authorization': `Bearer ${jwt_access}`,
          },
        }
      );
      toast.success('Job posted successfully!');
      reset();
      setSelectedSkills([]);
      console.log(response.data);
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.error) {
        setErrMsg(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setErrMsg('An error occurred while posting the job.');
        toast.error('Failed to post the job.');
      }
    }
  };

  return (
    <>
    <Header />
    <div className='bg-gradient-to-br  min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-2/3'>
            <div className='bg-white rounded-xl shadow-2xl overflow-hidden'>
              <div className='p-8'>
                <h2 className='text-3xl font-extrabold text-gray-900 mb-8'>Post a New Job</h2>
                <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
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
                      title='Post Job'
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
  
          <div className='w-full lg:w-1/3'>
            <div className='bg-white rounded-xl shadow-2xl overflow-hidden'>
              <div className='p-8'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>Recent Job Posts</h3>
                <div className='space-y-5 space px-8'>
                  {jobs.slice(0, 4).map((job, index) => (
                    <JobCard job={job} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default UploadJob;




  // useEffect(() => {
  //   const checkForm = async () => {
  //     try {
  //       const jwt_access = localStorage.getItem('access');
  //       const profileRes = await axios.get('http://localhost:8000/api/v1/auth/check-company-profile/', {
  //         headers: {
  //           'Authorization': `Bearer ${jwt_access}`
  //         }
  //       });
        
  //       if (profileRes.status === 204) {
  //         // No content means no company profile
  //         navigate("/company-form");
  //       } else {
  //         navigate("/upload-job")
  //       }
  //     } catch (error) {
  //       console.error('Error checking company profile:', error);
  //       // Handle error (e.g., redirect to login page if unauthorized)
  //       navigate("/login");
  //     }
  //   };

  //   checkForm();
  // }, [navigate]);
  