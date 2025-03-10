import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import AuthService from './authService'

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      try {
        await AuthService.verifySession()
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Session verification failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifySession()
  }, [])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
