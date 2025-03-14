import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
  CForm,
  CAlert,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/forgot-password', { email })
      setSuccess(response.data.message)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset password email.')
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={4} sm={10} xs={12}>
            <CCard className="mx-2">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1 className="text-center mb-4">Forgot Password</h1>
                  <p className="text-secondary text-center mb-4">
                    Enter your email to reset your password.
                  </p>

                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && <CAlert color="success">{success}</CAlert>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </CInputGroup>

                  <CButton type="submit" color="primary" className="w-100 mb-3" disabled={loading}>
                    {loading ? 'Sending...' : 'Reset Password'}
                  </CButton>

                  <div className="text-center">
                    <Link to="/" className="text-decoration-none">
                      Back to Login
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
