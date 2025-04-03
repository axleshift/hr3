import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../hook/useAuthStatus'
import { CSpinner } from '@coreui/react'

const ProtectedRoute = () => {
  const status = useAuthStatus()

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
