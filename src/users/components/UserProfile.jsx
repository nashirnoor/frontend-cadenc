import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EducationAdd from './EducationAdd';
import Experienceadd from './Experienceadd';
import Modal from './Modal';
import { BASE_URL } from '../../utils/config';


const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    photo: null,
    skills: [],
    resume: null,
    fullName: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [about, setAbout] = useState("No About section");
  const navigate = useNavigate();
  const [educations, setEducations] = useState([]);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [editingEducation, setEditingEducation] = useState(null);

  const handleAddEducation = () => {
    setEditingEducation(null);
    setShowEducationModal(true);
  };

  const handleEditEducation = (educationId) => {
    const educationToEdit = educations.find(edu => edu.id === educationId);
    setEditingEducation(educationToEdit);
    setShowEducationModal(true);
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setShowExperienceModal(true);
  };

  const handleEditExperience = (experienceId) => {
    const experienceToEdit = experiences.find(exp => exp.id === experienceId);
    setEditingExperience(experienceToEdit);
    setShowExperienceModal(true);
  };

  const fetchExperiences = async () => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      const response = await axios.get(`${BASE_URL}/api/v1/auth/experience/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });
      setExperiences(response.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  useEffect(() => {
    fetchExperiences();
    
  }, []);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const jwt_access = JSON.parse(localStorage.getItem('access'));

        const response = await axios.get(`${BASE_URL}/api/v1/auth/education/`, {
          headers: {
            'Authorization': `Bearer ${jwt_access}`
          }
        });
        setEducations(response.data);
      } catch (error) {
        console.error('There was an error fetching the education data!', error);
      }
    };

    fetchEducationData();
  }, []);


  useEffect(() => {
    checkprofile();
    fetchProfileData();
  }, []);



  const fetchProfileData = async () => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      const response = await axios.get(`${BASE_URL}/api/v1/auth/user-profile/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });
      console.log(response.data)
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const checkprofile = () => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      const userProfileRes = axios.get(`${BASE_URL}/api/v1/auth/check-user-profile/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });

      if (userProfileRes.status === 204) {
        // No profile exists, redirect to profile form
        console.log("To user profile form")
        navigate("/user-detail-form");
      } else {
        // Profile exists, proceed to landing page
        console.log(userProfileRes.status)
        navigate("/user-profile");
      }
    } catch (profileError) {
      console.error('Error checking user profile:', profileError);
      // If there's an error, we'll assume no profile and redirect to the form
      navigate("/user-detail-form");
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));

      const response = await fetch(`${BASE_URL}/api/v1/auth/update-profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Include your authentication token here
          'Authorization': `Bearer ${jwt_access}`
        },
        body: JSON.stringify({ about })
      });

      if (response.ok) {
        setIsEditing(false);
        // Optionally, you can update the about text with the response from the server
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      await axios.delete(`${BASE_URL}/api/v1/auth/education/${educationId}/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });
      // Remove the deleted education from the state
      setEducations(educations.filter(edu => edu.id !== educationId));
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      const jwt_access = JSON.parse(localStorage.getItem('access'));
      await axios.delete(`${BASE_URL}/api/v1/auth/experience/${experienceId}/`, {
        headers: {
          'Authorization': `Bearer ${jwt_access}`
        }
      });
      // Remove the deleted experience from the state
      setExperiences(experiences.filter(exp => exp.id !== experienceId));
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };
  

  return (
    <>
      <Header />
      <div className="bg-white flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] h-auto sm:h-[271px] bg-white rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden">
          {/* Left side - Profile Photo */}
          <div className="w-full sm:w-[271px] h-[271px] bg-gray-100 flex-shrink-0 flex items-center justify-center p-4">
            <div className="w-48 h-48 rounded-full border-4 border-indigo-500 overflow-hidden">
              {profileData.photo ? (
                <img
                  src={profileData.photo}
                  alt="Profile Photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                  No Photo
                </div>
              )}
            </div>
          </div>

          {/* Middle section - Name, Position, Education, Contact Info */}
          <div className="flex-grow p-6 sm:p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{profileData.full_name}</h2>
            <p className="text-xl text-indigo-600 mb-4">{profileData.position}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                {educations.length > 0 && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-gray-700">{`${educations[0].degree} in ${educations[0].field_of_study}, ${educations[0].university}`}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">3 years of experience</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">+91 7389210293</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">{profileData.email}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Right section - Skills */}
          <div className="w-full sm:w-[300px] bg-gray-50 p-6 sm:p-8 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* About Section */}
      <div className="bg-white flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8 relative">
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <button onClick={handleSave} className="text-blue-500 hover:text-blue-700">
                Save
              </button>
            ) : (
              <button onClick={handleEdit} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
          {isEditing ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full h-32 p-2 border rounded"
            />
          ) : (
            <p className="text-gray-600">{about}</p>
          )}
        </div>
      </div>
      {/* Experience Section */}

      <div className="bg-white flex items-start justify-center p-4">
        <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
            <button
              onClick={handleAddExperience}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md"
              title="Add Experience"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
              <div className="absolute top-4 right-4 flex space-x-2">
              <button
                    onClick={() => handleEditExperience(experience.id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full p-2 transition duration-300 ease-in-out"
                    title="Edit Experience"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(experience.id)}
                    className="bg-red-200 hover:bg-red-600 text-red-600 hover:text-red-800 rounded-full p-2 transition duration-300 ease-in-out"
                    title="Delete Experience"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
                  </button>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{experience.title}</h3>
                <p className="text-gray-600">{experience.user_profile.company} | {experience.start_date} - {experience.end_date || 'Present'}</p>
                <p className="text-gray-600">{experience.location_type} | {experience.employment_type}</p>
                <p className="text-gray-600">{experience.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

     {/* Education Section */}
<div className="bg-white flex items-start justify-center p-4">
  <div className="w-full max-w-[1120px] bg-white rounded-xl shadow-lg p-8 relative">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Education</h2>
      <button
        onClick={handleAddEducation}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md"
        title="Add Education"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
    <div className="space-y-6">
      {educations.map((education, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => handleEditEducation(education.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full p-2 transition duration-300 ease-in-out"
              title="Edit Education"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteEducation(education.id)}
              className="bg-red-200 hover:bg-red-300 text-red-600 hover:text-red-800 rounded-full p-2 transition duration-300 ease-in-out"
              title="Delete Education"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{education.degree}</h3>
          <p className="text-gray-600">
            {education.university} | {new Date(education.start_date).toLocaleString('default', { month: 'short' })} {new Date(education.start_date).getFullYear()} - {education.end_date ? `${new Date(education.end_date).toLocaleString('default', { month: 'short' })} ${new Date(education.end_date).getFullYear()}` : 'Present'}
          </p>
          <p className="text-gray-600">{education.field_of_study}</p>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Education Modal */}
      {showEducationModal && (
  <Modal onClose={() => setShowEducationModal(false)}>
    <EducationAdd
      onSubmit={() => {
        setShowEducationModal(false);
        fetchEducationData(); // Refresh education data after submit
      }} 
      educationData={editingEducation}
    />
  </Modal>
)}
     {/* Experience Modal */}
{showExperienceModal && (
  <Modal onClose={() => setShowExperienceModal(false)}>
    <Experienceadd 
      onSubmit={() => {
        setShowExperienceModal(false);
        fetchExperiences(); // Now this function is defined
      }} 
      experienceData={editingExperience}
    />
  </Modal>
)}  
      <Footer />
    </>
  );
};

export default UserProfile;
