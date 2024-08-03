import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormExperience = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    employment_type: 'full_time',
    location_type: 'on_site',
    start_date: '',
    end_date: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let jwt_access = localStorage.getItem('access');
    jwt_access = JSON.parse(jwt_access);
    axios.post(`${BASE_URL}/api/v1/auth/experience/`, formData, {
      headers: {
        'Authorization': `Bearer ${jwt_access}`
      }
    })
    .then(response => {
      navigate('/user-profile');
    })
    .catch(error => {
      console.error('There was an error submitting the form!', error);
    });
  };

  const handleSkip = () => {
    navigate('/user-profile');
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Experience Information
      </h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="self_employed">Self-Employed</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
              <option value="trainee">Trainee</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
              Location Type
            </label>
            <select
              id="location_type"
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="on_site">On-Site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Next
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="group relative flex-1 ml-3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default FormExperience
