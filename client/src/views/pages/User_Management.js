import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
  CSpinner,
  CCardHeader,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const TwoFactorAuth = ({ email, tempSession, onSuccess, onBack }) => {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/verify-2fa', {
        email,
        token,
        temp_session: tempSession,
      })

      onSuccess(response.data)
    } catch (err) {
      setAlert({
        visible: true,
        type: 'danger',
        message: err.response?.data?.message || 'Verification failed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={5}>
            <CCard className="border-0 shadow-sm">
              <CCardHeader className="bg-white border-0 text-center py-4">
                <h3 className="mb-0">2-Step Verification</h3>
              </CCardHeader>
              <CCardBody className="p-4">
                <p className="text-muted text-center mb-4">
                  This extra step shows its really you trying to sign in
                  <br />
                  <strong>{email}</strong>
                </p>

                <CForm onSubmit={handleVerify}>
                  <h5 className="text-center mb-3">Enter your verification code</h5>

                  {alert.visible && (
                    <CAlert color={alert.type} className="mb-3">
                      {alert.message}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="6-digit code"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                      className="text-center"
                    />
                  </CInputGroup>

                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit" disabled={loading} className="py-2">
                      {loading ? <CSpinner size="sm" /> : 'Verify'}
                    </CButton>
                    <CButton color="link" onClick={onBack} className="text-muted">
                      Back to sign in
                    </CButton>
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

TwoFactorAuth.propTypes = {
  email: PropTypes.string.isRequired,
  tempSession: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default TwoFactorAuth
