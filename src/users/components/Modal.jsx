import React from 'react';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-white w-full h-full mx-auto rounded-lg shadow-lg p-6 max-h-screen overflow-hidden">
        <div className="absolute top-3 right-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mt-4 overflow-y-auto max-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
