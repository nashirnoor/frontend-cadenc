import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { BASE_URL } from '../../utils/config';

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSkills(currentPage);
  }, [currentPage]);

  const fetchSkills = async (page) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/auth/skills/?page=${page}`);
      setSkills(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 9));
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) {
      alert('Skill name cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/skills/`, { name: newSkill });
      setSkills([...skills, response.data]);
      setNewSkill('');
      setErrorMessage('');
      fetchSkills(currentPage);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('Skill already exists');
      } else {
        console.error('Error adding skill:', error);
      }
    }
  };

  const deleteSkill = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/auth/skills/${id}/`);
      setSkills(skills.filter(skill => skill.id !== id));
      fetchSkills(currentPage);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const startEditing = (skill) => {
    setEditingSkill({ ...skill });
  };

  const cancelEditing = () => {
    setEditingSkill(null);
  };

  const updateSkill = async () => {
    if (!editingSkill.name.trim()) {
      alert('Skill name cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/api/v1/auth/skills-update/${editingSkill.id}/`, editingSkill);
      setSkills(skills.map(skill => skill.id === editingSkill.id ? response.data : skill));
      setEditingSkill(null);
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage('Skill already exists');
      } else {
        console.error('Error updating skill:', error);
      }
    }
  };

  return (
    <>
      <Navbar/>
      <Sidebar/>
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Skill Management</h1>
        
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter new skill"
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            onClick={addSkill}
            className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Add
          </button>
        </div>
        
        <ul className="space-y-2">
          {skills.map(skill => (
            <li key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition duration-200 hover:bg-gray-100">
              {editingSkill && editingSkill.id === skill.id ? (
                <>
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                  <div>
                    <button
                      onClick={updateSkill}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-700">{skill.name}</span>
                  <div>
                    <button
                      onClick={() => startEditing(skill)}
                      className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default SkillManagement;
