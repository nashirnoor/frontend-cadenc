import React from 'react';
import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <Link to={`/job/${job.id}`} className="block">
      <div className='w-72 h-72 bg-white shadow-lg rounded-md p-4 flex flex-col overflow-hidden'>
        <div className='flex gap-3 mb-3'>
          <div className='company-logo flex-shrink-0'>
            <img src={companyLogo} alt="Company Logo" className='w-12 h-12 object-cover rounded-full' />
          </div>
          <div className='overflow-hidden'>
            <h1 className='text-sm font-medium truncate'>{truncateText(job.company_name, 20)}</h1>
            <p className='text-base font-semibold truncate'>{truncateText(job.job_title, 25)}</p>
            <span className='flex gap-1 items-center text-xs'>
              <GoLocation className='text-slate-900 flex-shrink-0' />
              <span className='truncate'>{truncateText(job.job_location, 20)}</span>
            </span>
          </div>
        </div>

        <div className="flex-grow overflow-hidden mb-3">
          <p className="text-sm line-clamp-6">
          {job.job_description}
          </p>
        </div>

        <div className='flex items-center justify-between text-xs'>
          <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold'>
            {truncateText(job.job_type, 15)}
          </p>
          <span className='text-gray-500'>
            {moment(job.created_at).fromNow()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;