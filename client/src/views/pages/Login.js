import React, { useState } from 'react'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'
import Cookies from 'js-cookie'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      let searchParams = new URLSearchParams(window.location.search)
      let rParam = searchParams.get('r')
      const response = await api.post('/auth/login', { username, password })

      dispatch({ type: 'SET_USER', payload: response.data.user })
      dispatch({ type: 'SET_SESSION_ID', payload: response.data.session_id })
      Cookies.set('dcims', response.data.session_id, { expires: 30 })

      sessionStorage.setItem('session_id', response.data.session_id)
      sessionStorage.setItem('role', response.data.user.role)
      sessionStorage.setItem('employee_id', response.data.user.employee_id)
      sessionStorage.setItem('name', response.data.user.name)

      navigate(rParam ? rParam : '/dashboard')
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5} lg={4} xl={5}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleLogin}>
                  <h1 className="text-center">Login</h1>
                  <p className="text-secondary text-center">Sign in to your account</p>

                  {error && <CAlert color="danger">{error}</CAlert>}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </CInputGroup>

                  <CButton type="submit" color="primary" className="w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
