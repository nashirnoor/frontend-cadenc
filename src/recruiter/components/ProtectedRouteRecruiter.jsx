import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteRecruiter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
    
  return user ? <Navigate to="/recruiter-home" /> : children;
};

export default ProtectedRouteRecruiter;
