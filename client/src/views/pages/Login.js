import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'
import Cookies from 'js-cookie'
import Footer from './Footer'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      dispatch({ type: 'SET_USER', payload: response.data.user })
      dispatch({ type: 'SET_SESSION_ID', payload: response.data.session_id })
      Cookies.set('dcims', response.data.session_id, { expires: 30 })

      sessionStorage.setItem('session_id', response.data.session_id)
      sessionStorage.setItem('role', response.data.user.role)
      sessionStorage.setItem('user_id', response.data.user.id)
      sessionStorage.setItem('name', response.data.user.name)

      navigate('/dashboard')
    } catch (err) {
      setAlert({
        visible: true,
        type: 'danger',
        message: 'Login failed. Please check your credentials.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <CContainer className="flex-grow-1 d-flex flex-column justify-content-center">
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={5}>
            <CCard className="shadow-sm p-4 border-0 rounded">
              <CCardBody>
                <CForm onSubmit={handleLogin}>
                  <h2 className="text-left fw-bold">Login</h2>
                  <p className="text-left text-muted">Sign in to your account</p>
                  {alert.visible && (
                    <CAlert color={alert.type} className="mb-3">
                      {alert.message}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol>
                      <CButton type="submit" color="primary" className="w-100" disabled={loading}>
                        {loading ? (
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                        ) : (
                          'Login'
                        )}
                      </CButton>
                    </CCol>
                  </CRow>

                  <div className="text-center mt-3">
                    <Link to="/ForgotPassword" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <Footer /> {/* Add the Footer component here */}
    </div>
  )
}

export default Login
