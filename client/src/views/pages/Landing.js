import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect directly without checking for session cookie
    window.location.href = 'https://axleshift.com'
  }, [])

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <div className="body flex-grow-1">
        <div className="loading-overlay">
          <CSpinner color="primary" variant="grow" />
        </div>
      </div>
    </div>
  )
}

export default Landing
