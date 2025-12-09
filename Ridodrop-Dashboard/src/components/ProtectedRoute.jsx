import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import Loader from '../ui-component/Loader';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, admin, loading } = useAdminAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && admin?.role !== requiredRole && admin?.role !== 'super_admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <h2>Access Denied</h2>
        <p>You don't have the required role to access this page.</p>
        <p>Required role: {requiredRole}</p>
        <p>Your role: {admin?.role}</p>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermission && admin?.role !== 'super_admin' && !admin?.permissions?.includes(requiredPermission)) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <h2>Access Denied</h2>
        <p>You don't have the required permission to access this page.</p>
        <p>Required permission: {requiredPermission}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
