import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axiosInstance from '../../users/utils/axiosInstance';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BeatLoader } from 'react-spinners';
import { BASE_URL } from '../../utils/config';

const RecruiterList = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 8;

  const fetchRecruiters = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }
      const response = await axiosInstance.get(`${BASE_URL}/api/v1/auth/recruiters/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Log the response data to verify its structure
      setRecruiters(response.data.results); // Adjust according to the actual response structure
      setTotalPages(Math.ceil(response.data.count / itemsPerPage)); // Calculate total pages
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      setError('Error fetching recruiters');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (recruiterId, currentStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const endpoint = currentStatus ? 'unblock-recruiter' : 'block-recruiter';
      await axiosInstance.post(`${BASE_URL}/api/v1/auth/${endpoint}/${recruiterId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the recruiter list
      fetchRecruiters();
    } catch (error) {
      console.error('Error blocking/unblocking recruiter:', error);
      setError('Error blocking/unblocking recruiter');
    }
  };


  useEffect(() => {
    
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    fetchRecruiters();

    return () => clearTimeout(loaderTimer);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    setLoading(true);
    setShowLoader(true);
  };

  if (loading || showLoader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader color="#1263ad" size={15} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <Sidebar active={'recruiter'} />

      <div className="card ml-56 p-20">
        <div className="relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Is Staff</th>
                <th scope="col" className="px-6 py-3">Is Superuser</th>
                <th scope="col" className="px-6 py-3">Company Name</th>
                <th scope="col" className="px-6 py-3">Date Joined</th>
                <th scope="col" className="px-6 py-3">Last Login</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(recruiters) ? recruiters.map(recruiter => (
                <tr key={recruiter.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-white">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{recruiter.id}</td>
                  <td className="px-6 py-4">{recruiter.email}</td>
                  <td className="px-6 py-4">{recruiter.first_name}</td>
                  <td className="px-6 py-4">{recruiter.is_staff ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{recruiter.is_superuser ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4">{recruiter.company_name}</td>
                  <td className="px-6 py-4">{new Date(recruiter.date_joined).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{new Date(recruiter.last_login).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleBlockUnblock(recruiter.id, recruiter.is_blocked)}
                    className={`font-medium ${recruiter.is_blocked ? 'text-green-600' : 'text-red-600'} hover:underline`}
                  >
                    {recruiter.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
                </tr>
              )) : null}
            </tbody>
          </table>
         
        </div>
        <div className='ml-96 mt-12'>
            <Stack spacing={2}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Stack>
          </div>
      </div>
    </>
  );
};

export default RecruiterList;
