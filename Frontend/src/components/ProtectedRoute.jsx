import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  // Remove the large loader per user request for instant transition
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A', color: '#00D4FF' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '500', animation: 'pulse 1.5s infinite' }}>Initializing Node...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
