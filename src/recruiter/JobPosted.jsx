import React,{ useEffect,useState } from 'react';
import Header from './RecruiterHeader';
import Footer from '../users/components/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/config';

const JobPosted = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        let jwt_a = localStorage.getItem('access');
        jwt_a = JSON.parse(jwt_a);
        const fetchJobs = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/v1/auth/job-posted/`, {
              headers: {
                'Authorization': `Bearer ${jwt_a}`,
              }
            });
            console.log(response.data)
            setJobs(response.data);
          } catch (err) {
            setError(err);
            console.log(err,"errro")
          } finally {
            setLoading(false);
          }
        };
    
        fetchJobs();
      }, []);

      

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray mb-8">Posted Jobs</h1>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Job Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">View Applicants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.job_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.jobType === 'Full-time' ? 'bg-green-100 text-green-800' :
                        job.jobType === 'Remote' ? 'bg-blue-100 text-blue-800' :

                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.job_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applicants_count || 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.job_location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  <Link to={`/applicants/${job.id}`}>view</Link>
</td>               
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobPosted;