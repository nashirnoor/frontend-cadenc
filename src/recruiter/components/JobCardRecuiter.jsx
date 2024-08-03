import React from 'react'
import { useState } from 'react';
import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdDelete,MdEdit } from 'react-icons/md'; // Import delete icon from react-icons/md
import Modal from 'react-modal';
import { toast } from 'sonner';



Modal.setAppElement('#root');

const JobCardRecuiter = ({ job,onDelete,onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const defaultImage = "/images/company-image-default.png";
  const companyLogo = job?.company_logo ? job.company_logo : defaultImage;

  const truncateText = (text, length) => {
    if (!text) return ''; // Handle cases where text is undefined or null
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  
  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent link navigation
    setShowConfirm(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await onDelete(job.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting job:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    onEdit(job);
  };


  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
    <Link to={`/job/${job.id}`}>
      <div className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg rounded-md px-3 py-5 relative'>
        <div className='flex gap-3'>
          <div className='company-logo'>
            <img src={companyLogo} alt="Company Logo" className='w-16 h-16 object-cover rounded-full' />
          </div>
          <div>
            <h1>{job.company_name}</h1>
            <p className='text-lg font-semibold truncate'>{truncateText(job.job_title, 15)}</p>
            <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {job.job_location}
            </span>
          </div>
        </div>

        <div className="py-3">
          <p className="text-sm line-clamp-6">
            {job.job_description}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='bg-[#1d4fd826] text-[#1d4fd8] py-0.5 px-1.5 rounded font-semibold text-sm'>
            {job.job_type}
          </p>
          <span className='text-gray-500 text-sm'>
            {moment(job.created_at).fromNow()}
          </span>
        </div>

        {/* Delete icon and confirmation */}
        <button
              className='text-gray-400 hover:text-blue-500'
              onClick={handleEditClick}
            >
              <MdEdit size={20} />
            </button>
        <button
            className='absolute top-2 right-2 text-gray-400 hover:text-red-500'
            onClick={handleDeleteClick}
          >
            <MdDelete size={20} />
          </button>
        </div>
      </Link>
      <ConfirmDialog
        isOpen={showConfirm}
        title='Confirm Delete'
        message='Are you sure you want to delete this job?'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  )
}

export default JobCardRecuiter




const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false} 
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};