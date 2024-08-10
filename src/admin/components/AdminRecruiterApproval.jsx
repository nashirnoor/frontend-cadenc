import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from './Navbar';
import Sidebar from './Sidebar';  
import { NavLink } from 'react-router-dom';
import { BASE_URL } from '../../utils/config';

const AdminRecruiterApproval = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingRecruiterId, setRejectingRecruiterId] = useState(null);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
        let token = localStorage.getItem('access_token');

      const res = await axios.get(`${BASE_URL}/api/v1/auth/admin/recruiters/pending/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecruiters(res.data);
    } catch (error) {
        console.log(token)
      toast.error('Failed to fetch recruiters');
    }
  };

  const handleApproval = async (recruiterId, action) => {
    try {
      let token = localStorage.getItem('access_token');
      
      if (action === 'reject' && !rejectReason) {
        toast.error('Please provide a reason for rejection');
        return;
      }

      const data = action === 'reject' ? { action, reason: rejectReason } : { action };

      await axios.post(
        `${BASE_URL}/api/v1/auth/admin/recruiters/pending/${recruiterId}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRecruiters();
      toast.success(`Recruiter ${action}d successfully`);
      setRejectingRecruiterId(null);
      setRejectReason('');
    } catch (error) {
      toast.error(`Failed to ${action} recruiter`);
    }
  };

  return (
    <>
    <Navbar />
      <Sidebar active={'approve'}/>
    <div className="container mx-auto ml-56 p-20">
      <h2 className="text-2xl font-bold mb-4">Pending Recruiter Approvals</h2>
      {recruiters.length === 0 ? (
        <p className="text-gray-600">No pending recruiters</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Company Name</th>
                <th className="py-2 px-4 border-b">Approve / Reject</th>
              </tr>
            </thead>
            <tbody>
                {recruiters.map((recruiter) => (
                  <tr key={recruiter.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{recruiter.email}</td>
                    <td className="py-2 px-4 border-b">{recruiter.first_name}</td>
                    <td className="py-2 px-4 border-b">{recruiter.company_name}</td>
                    <td className="py-2 px-4 border-b mr-1">
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleApproval(recruiter.id, 'approve')}
                      >
                        Approve
                      </button>
                      {rejectingRecruiterId === recruiter.id ? (
                        <div>
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection"
                            className="border rounded px-2 py-1 mr-2"
                          />
                          <button
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                            onClick={() => handleApproval(recruiter.id, 'reject')}
                          >
                            Confirm Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          onClick={() => setRejectingRecruiterId(recruiter.id)}
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      )}
    </div>
  
    </>
  );
};

export default AdminRecruiterApproval;
