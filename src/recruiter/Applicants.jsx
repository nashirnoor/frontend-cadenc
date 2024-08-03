import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './RecruiterHeader';
import Footer from '../users/components/Footer';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/config';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('All'); // Add state for selected status

  const handleStartChat = async (applicantId) => {
    try {
      const jwt_a = JSON.parse(localStorage.getItem('access'));
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/create-chat-room/`,
        { applicant_id: applicantId },
        {
          headers: {
            'Authorization': `Bearer ${jwt_a}`,
          }
        }
      );
      const { room_id } = response.data;
      navigate(`/chat/${room_id}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };
   
  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const jwt_a = JSON.parse(localStorage.getItem('access'));
      await axios.post(
        `${BASE_URL}/api/v1/auth/update-application-status/`,
        { 
          applicant_id: applicantId,
          job_id: jobId,
          status: newStatus
        },
        {
          headers: {
            'Authorization': `Bearer ${jwt_a}`,
          }
        }
      );
      // Update the local state to reflect the change
      setApplicants(prevApplicants => 
        prevApplicants.map(applicant => 
          applicant.id === applicantId ? {...applicant, status: newStatus} : applicant
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };
  

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const jwt_a = JSON.parse(localStorage.getItem('access'));
        const response = await axios.get(`${BASE_URL}/api/v1/auth/${jobId}/applicants/`, {
          headers: {
            'Authorization': `Bearer ${jwt_a}`,
          }
        });
        console.log(response.data)
        setApplicants(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleDownload = async (resumeUrl) => {
    try {
      if (resumeUrl) {
        const response = await fetch(resumeUrl);
        console.log(response)

        if (!response.ok) {
          throw new Error("Error while fetching CV using URL");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        console.error("ERROR: Invalid CV URL");
      }
    } catch (error) {
      console.error("ERROR: Failed to download PDF", error);
    }
  };

   // Filter applicants based on selected status
   const filteredApplicants = applicants.filter(applicant => {
    if (selectedStatus === 'All') return true;
    return applicant.status === selectedStatus.toLowerCase();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray mb-8">Applicants</h1>
          <div className="mb-4 flex justify-end">
          <select 
              value={selectedStatus} // Bind selected value
              onChange={(e) => setSelectedStatus(e.target.value)} // Update selected status
              className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
              style={{ maxWidth: '200px' }} // Limit the width of the dropdown
            >
              <option value="All">All</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Await">Await</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
        </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Relocate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Immediate Joinee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Message</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {filteredApplicants.map((applicant, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{applicant.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.email}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.experience}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.is_willing_to_relocate ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.is_immediate_joinee ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                      {applicant.resume_url ? (
                        <button
                          onClick={() => handleDownload(applicant.resume_url)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Download resume
                        </button>
                      ) : 'No resume'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select 
                        value={applicant.status || 'pending'} 
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="await">Await</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-700">
                    <button
                      onClick={() => handleStartChat(applicant.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Start Chat
                    </button>
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

export default Applicants;