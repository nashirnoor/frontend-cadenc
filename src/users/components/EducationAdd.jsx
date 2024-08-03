import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
const API_BASE_URL = `${BASE_URL}/api/v1/auth`;

const EducationAdd = ({ onSubmit, educationData = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: ''
  });
  useEffect(() => {
    if (educationData) {
      setFormData(educationData);
    }
  }, [educationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let jwt_access = localStorage.getItem('access');
    jwt_access = JSON.parse(jwt_access);
    
    const userData = JSON.parse(localStorage.getItem('user'));
    const dataToSend = { ...formData, user_email: userData.email };
  
    const url = educationData 
      ? `${API_BASE_URL}/education/${educationData.id}/`
      : `${API_BASE_URL}/education/`;

    const method = educationData ? 'put' : 'post';

    axios[method](url, dataToSend, {
      headers: {
        'Authorization': `Bearer ${jwt_access}`
      }
    })
    .then(response => {
      console.log(response.data);
      onSubmit();
    //   navigate('/landing');
    })
    .catch(error => {
      console.error('There was an error submitting the form!', error);
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
    {educationData ? 'Edit Education' : 'Add Education'}    </h2>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
            University
          </label>
          <input
            id="university"
            name="university"
            type="text"
            value={formData.university}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
            Degree
          </label>
          <input
            id="degree"
            name="degree"
            type="text"
            value={formData.degree}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <input
            id="field_of_study"
            name="field_of_study"
            type="text"
            value={formData.field_of_study}
            onChange={handleChange}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
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
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
        >
           {educationData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default EducationAdd;