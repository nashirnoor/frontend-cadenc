import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';

const UserProfileForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    position: '',
    photo: null,
    skills: [],
    resume: null
  });
  const [skillsList, setSkillsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  

  useEffect(() => {
    fetchSkills();
  }, [searchTerm]);

  const fetchSkills = () => {
    axios.get(`${BASE_URL}/api/v1/auth/skills/?search=${searchTerm}`)
      .then(response => setSkillsList(response.data.results))
      .catch(error => console.error('Error fetching skills:', error));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : value;

    if (name === 'photo') {
      if (file && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors({ ...errors, photo: 'Only JPEG, PNG, and JPG formats are allowed.' });
        return;
      } else {
        setErrors({ ...errors, photo: null });
      }
    } else if (name === 'resume') {
      if (file && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({ ...errors, resume: 'Only PDF, DOC, and DOCX formats are allowed.' });
        return;
      } else {
        setErrors({ ...errors, resume: null });
      }
    }

    if (name === 'photo' || name === 'resume') {
      setFormData({ ...formData, [name]: file });
      if (name === 'photo') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.find(s => s.id === skill.id)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillId) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s.id !== skillId) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.photo) {
      newErrors.photo = 'Profile photo is required.';
    }
    if (!formData.resume) {
      newErrors.resume = 'Resume is required.';
    }
    if (!formData.position) {
      newErrors.position = 'Position is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formSubmissionData = new FormData();
    formSubmissionData.append('photo', formData.photo);
    formSubmissionData.append('resume', formData.resume);
    formSubmissionData.append('position', formData.position);
    formSubmissionData.append('skills', JSON.stringify(formData.skills.map(skill => skill.id)));

    axios.post(`${BASE_URL}/api/v1/auth/create-user-profile/`, formSubmissionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('access'))}`,
      }
    })
    .then(response => {
      onSubmit(response.data);
      navigate('/experience');
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'There was an error submitting the form.' });
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Craft Your Dream Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Show the world what makes you unique!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-6">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="mt-1 flex items-center justify-center">
                <label htmlFor="photo" className="cursor-pointer">
                  <div className="w-32 h-32 border-2 border-gray-300 border-dashed rounded-full flex items-center justify-center hover:border-gray-400 focus-within:border-blue-500 overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <input id="photo" name="photo" type="file" onChange={handleChange} className="sr-only" accept="image/*" />
                </label>
              </div>
              {errors.photo && <p className="mt-2 text-sm text-red-600 text-center">{errors.photo}</p>}
              <p className="mt-2 text-sm text-gray-500 text-center">Click to upload a photo</p>
            </div>
            <div className="mb-6">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                placeholder='Enter your role'
                value={formData.position}
                onChange={handleChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.position && <p className="mt-2 text-sm text-red-600 text-center">{errors.position}</p>}
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
                    {skillsList.map(skill => (
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
                {formData.skills.map(skill => (
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
            <div className="mb-6">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="resume" name="resume" type="file" onChange={handleChange} className="sr-only" accept=".pdf,.doc,.docx" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 2MB</p>
                </div>
              </div>
              {errors.resume && <p className="mt-2 text-sm text-red-600 text-center">{errors.resume}</p>}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
