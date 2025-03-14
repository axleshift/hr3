import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hook/checkAuthStatus '

const ProtectedRoute = () => {
  const status = useAuthStatus()

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
