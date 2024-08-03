import React from "react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => {
  return (
    <div className='w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded'>
      <div className='w-3/4 md:w-2/4 flex gap-4 items-center'>
    <Link to={`/company-profile-user/${company.id}`}>
          <img
            src={company?.company_logo}
            alt={company?.name}
            className='w-8 md:w-12 h-8 md:h-12 rounded'
          />
        </Link>
        <div className='h-full flex flex-col'>
          <Link
            to={`/company-profile/${company?._id}`}
            className='text-base md:text-lg font-semibold text-gray-600 truncate'
          >
            {company.company_name}
          </Link>
          <span className='text-sm text-blue-600'>{company?.email_address}</span>
        </div>
      </div>

      <div className='hidden w-1/4 h-full md:flex items-center'>
        <p className='text-base text-start'>{company?.company_location}</p>
      </div>

      <div className='w-1/4 h-full flex flex-col items-center'>
        <p className='text-blue-600 font-semibold'>{company.job_count}</p>
        <span className='text-xs md:base font-normal text-gray-600'>
          Jobs Posted
        </span>
      </div>
    </div>
  );
};

export default CompanyCard;