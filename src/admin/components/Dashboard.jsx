import Sidebar from './Sidebar';
import Navbar from './Navbar';
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { FaUsers, FaUserTie, FaFileAlt } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { BASE_URL } from '../../utils/config';



const Dashboard = () => {
  const [userData, setUserData] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalPosts: 0
  });

  const [monthlyUserData, setMonthlyUserData] = useState([]);
  const chartRef = useRef(null); // Ref to store the Chart instance

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('access_token');

      try {
        const userStatsResponse = await axios.get(`${BASE_URL}/api/v1/auth/api/user-stats/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });
        setUserData(userStatsResponse.data);

        const monthlyStatsResponse = await axios.get(`${BASE_URL}/api/v1/auth/monthly-user-stats/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the header
          },
        });
        setMonthlyUserData(monthlyStatsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (monthlyUserData.length > 0) {
      const ctx = document.getElementById('myChart').getContext('2d');

      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the previous Chart instance if it exists
      }

      chartRef.current = new Chart(ctx, {
        type: 'line', // You can change this to 'bar' or other types
        data: {
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          datasets: [{
            label: 'New Users',
            data: monthlyUserData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Clean up on component unmount
      }
    };
  }, [monthlyUserData]);

  return (
    <>
      <Navbar />
      <Sidebar props={'dashboard'} />
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Users"
            value={userData.totalUsers}
            icon={<FaUsers />}
            color="bg-blue-500"
          />
          <DashboardCard
            title="Total Recruiters"
            value={userData.totalRecruiters}
            icon={<FaUserTie />}
            color="bg-green-500"
          />
          <DashboardCard
            title="Total Posts"
            value={userData.totalPosts}
            icon={<FaFileAlt />}
            color="bg-purple-500"
          />
        </div>

        {/* Chart.js Chart */}
        <h1 className="text-3xl font-bold mt-8">New Users</h1>

        <div className="mt-8">
          <canvas id="myChart" width="800" height="200"></canvas>
        </div>
      </div>
    </>
  );
};

const DashboardCard = ({ title, value, icon, color }) => {
    return (
      <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="text-3xl">{icon}</div>
        </div>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    );
  };


export default Dashboard
