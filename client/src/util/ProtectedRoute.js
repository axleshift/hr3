import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hook/useAuthStatus'

const ProtectedRoute = () => {
  const status = useAuthStatus()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
