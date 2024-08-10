import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Header from './Header';
import CustomButton from "./Custombutton";
import ListBox from "./ListBox";
import axios from "axios";
import SearchHeader from "./SearchHeader";
import { useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Footer from "./Footer";
import JobCard from "./JobCard";
import { BASE_URL } from "../../utils/config";


const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [jobTypes, setJobTypes] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [locationTypes, setLocationTypes] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredTotalPages, setFilteredTotalPages] = useState(0);
  const [salaryRanges, setSalaryRanges] = useState([]);


  const [appliedJobs, setAppliedJobs] = useState(false); // State to track applied jobs filter

  const handleAppliedJobsChange = (e) => {
  setAppliedJobs(e.target.checked);
  filterJobs(); 
};



  const sortJobs = (jobs, sortOrder) => {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v1/auth/api/jobs/?page=${currentPage}&job_title=${searchTitle}&job_location=${searchLocation}`);
        console.log("API Response:", response.data);
        console.log(response.data.results.salary)
        setJobs(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, searchTitle, searchLocation]);

  

  useEffect(() => {
    const filteredAndSortedJobs = sortJobs(filterJobs(jobs), sort);
    setFilteredJobs(filteredAndSortedJobs);
  }, [jobs, jobTypes, experiences, locationTypes, sort, salaryRanges,appliedJobs]);

  useEffect(() => {
    setFilteredTotalPages(Math.ceil(filteredJobs.length / 10));
  }, [filteredJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTitle(searchQuery);
    setSearchLocation(location);
    setCurrentPage(1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [jobTypes, experiences, locationTypes]);

  const handleJobTypeChange = (e) => {
    const value = e.target.value;
    setJobTypes(prev => {
      const newJobTypes = e.target.checked ? [...prev, value] : prev.filter(type => type !== value);
      console.log('Updated job types:', newJobTypes);
      return newJobTypes;
    });
  };

  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setExperiences(prev =>
      e.target.checked ? [...prev, value] : prev.filter(exp => exp !== value)
    );
  };

  const handleLocationTypeChange = (e) => {
    const value = e.target.value;
    setLocationTypes(prev =>
      e.target.checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    setSalaryRanges(prev =>
      e.target.checked ? [...prev, value] : prev.filter(range => range !== value)
    );
  };


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filterJobs = (jobs) => {
    const userId = localStorage.getItem('user_id'); // or however you get the user ID

    console.log("Applied Jobs Filter:", appliedJobs);
    console.log("Jobs Data:", jobs);

    return jobs.filter(job => {
      const jobTypeMatch = jobTypes.length === 0 || jobTypes.includes(job.job_type);
      const experienceMatch = experiences.length === 0 || experiences.some(exp => {
        switch (exp) {
          case 'under 1':
            return parseInt(job.experience) < 1;
          case '1 - 3 years':
            return parseInt(job.experience) >= 1 && parseInt(job.experience) <= 3;
          case '3 - 5 years':
            return parseInt(job.experience) > 3 && parseInt(job.experience) <= 5;
          case '6+ years':
            return parseInt(job.experience) > 6;
          default:
            return false;
        }
      });
      const locationTypeMatch = locationTypes.length === 0 || locationTypes.includes(job.job_location_type);
      const salaryMatch = salaryRanges.length === 0 || salaryRanges.some(range => {
        const salary = parseFloat(job.salary);
        if (range === '300000-500000') return salary >= 300000 && salary <= 500000;
        if (range === '500000-700000') return salary >= 500000 && salary <= 700000;
        if (range === '700000-1000000') return salary >= 700000 && salary <= 1000000;
        if (range === '1000000+') return salary > 1000000;
        return false;
      });
      const appliedMatch = !appliedJobs || (userId && job.applications.some(app => app.id === parseInt(userId)));
  
      return jobTypeMatch && experienceMatch && locationTypeMatch && salaryMatch && appliedMatch;
    });
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      <SearchHeader
        title='Find Your Dream Job with Ease'
        type='home'
        handleClick={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
      />
      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm'>
          <p className='text-lg font-semibold text-slate-600'>Filter Search</p>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job Type
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {['full_time', 'part_time', 'contract', 'intern'].map((type) => (
                <div key={type} className='flex gap-2 text-sm md:text-base'>
                  <input
                    type='checkbox'
                    value={type}
                    className='w-4 h-4'
                    onChange={handleJobTypeChange}
                    checked={jobTypes.includes(type)}
                  />
                  <span>{type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {['under 1', '1 - 3 years', '3 - 5 years', '6+ years'].map((exp) => (
                <div key={exp} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={exp}
                    className='w-4 h-4'
                    onChange={handleExperienceChange}
                    checked={experiences.includes(exp)}
                  />
                  <span>{exp}</span>
                </div>
              ))}

            </div>
          </div>
          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Location Type
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>

              {['on_site', 'hybrid', 'remote'].map((type) => (
                <div key={type} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={type}
                    className='w-4 h-4'
                    onChange={handleLocationTypeChange}
                    checked={locationTypes.includes(type)}
                  />
                  <span>{type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Salary
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {['300000-500000', '500000-700000', '700000-1000000', '1000000+'].map((range) => (
                <div key={range} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={range}
                    className='w-4 h-4'
                    onChange={handleSalaryChange}
                    checked={salaryRanges.includes(range)}
                  />
                  <span>{range}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Applied
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
            <div key="" className='flex gap-2 text-sm md:text-base'>
          <input
            type='checkbox'
            value=""
            className='w-4 h-5'
            onChange={handleAppliedJobsChange}
            checked={appliedJobs}
          />
          <span>Applied</span>
        </div>
            </div>
          </div>

        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Showing: <span className='font-semibold'>{filteredJobs.length}</span> Jobs
              Available
            </p>
            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />

            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center'>
            {filteredJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>
          <div className='w-full flex items-center justify-center pt-16'>
            <Stack spacing={2}>
              <Pagination
                count={filteredTotalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindJobs;