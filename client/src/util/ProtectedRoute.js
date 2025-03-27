import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hook/useAuthStatus'

const ProtectedRoute = () => {
  const status = useAuthStatus()

  if (status === 'unauthenticated') {
    return <Navigate to="/Login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
