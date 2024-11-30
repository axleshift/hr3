import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { CButton, CCard, CCardBody, CCardHeader, CAlert } from '@coreui/react'

const EmailVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [verificationToken, setVerificationToken] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')

    if (token) {
      setVerificationToken(token)

      axios
        .post('http://127.0.0.1:8000/api/verify-email', { token })
        .then((response) => {
          setVerificationStatus(response.data.status)
          if (response.data.status === 'success' && response.data.token) {
            localStorage.setItem('token', response.data.token)
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
          setVerificationStatus('error') // Handle error state
        })
    }
  }, [location.search, navigate])

  const handleGoToHomePage = () => {
    navigate('/login')
  }

  const handleResendEmail = () => {
    console.log('Resending verification email...')
    // Implement the logic to resend the email if needed
  }

  return (
    <CCard>
      <CCardHeader>
        <h1>Email Verification</h1>
      </CCardHeader>
      <CCardBody>
        {verificationStatus === 'success' && (
          <CAlert color="success">
            Email verified successfully!
            <div className="mt-3">
              <CButton onClick={handleGoToHomePage} color="primary">
                Login
              </CButton>
            </div>
          </CAlert>
        )}
        {verificationStatus === 'error' && (
          <CAlert color="danger">
            Email verification failed. Please try again or contact support.
            <div className="mt-3">
              <CButton onClick={handleResendEmail} color="primary">
                Resend Email
              </CButton>
            </div>
          </CAlert>
        )}
        {verificationStatus === '' && <p>Verifying your email...</p>}
      </CCardBody>
    </CCard>
  )
}

export default EmailVerification
