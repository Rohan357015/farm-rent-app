import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuthStore();

  // If no user is logged in, redirect to appropriate login
  if (!user) {
    toast.error('Please login to access this page');
    return <Navigate to={allowedRole === 'farmer' ? '/farmer-login' : '/supplier-login'} replace />;
  }

  // If user role doesn't match, redirect to their dashboard
  if (user.role !== allowedRole) {
    toast.error(`Access denied. ${allowedRole === 'farmer' ? 'Farmers' : 'Suppliers'} only.`);
    return <Navigate to={user.role === 'farmer' ? '/farmer-dashboard' : '/supplier-dashboard'} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;
