import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireApproved?: boolean; // for bloodbank access
};

export default function ProtectedRoute({ children, allowedRoles, requireApproved }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const normalizedRole = user.userType;

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  if (requireApproved && normalizedRole === 'bloodbank') {
    const approved = !!user.approved;
    const status = (user.status || '').toString().toLowerCase();

    if (status === 'rejected') {
      return <Navigate to="/access-revoked" replace />;
    }
    if (!approved) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
