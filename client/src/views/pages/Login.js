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
import axios from 'axios'
import Cookies from 'js-cookie'
import Footer from '../../components/landing/Footer'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(
        'https://backend-admin.axleshift.com/integ/external-login/HR',
        { email, password },
        {
          headers: {
            Authorization: 'Bearer admin1229102',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
          },
        },
      )

      const { token, user } = response.data

      if (!token || !user) {
        throw new Error('Invalid response from authentication server')
      }

      // Store the token in both cookie and sessionStorage
      const cookieOptions = {
        expires: 30,
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'strict',
      }

      Cookies.set('dcims', token, cookieOptions)
      sessionStorage.setItem('session_id', token)
      sessionStorage.setItem('role', user.role)
      sessionStorage.setItem('user_id', user.id)
      sessionStorage.setItem('name', user.name)
      sessionStorage.setItem('department', user.department)

      // Dispatch user data to Redux
      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_TOKEN', payload: token })

      navigate('/dashboard')
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
      setAlert({
        visible: true,
        type: 'danger',
        message,
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
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
      <Footer />
    </div>
  )
}

export default Login

// local user
// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CRow,
//   CCol,
//   CContainer,
//   CForm,
//   CAlert,
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CSpinner,
// } from '@coreui/react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
// import api from '../../util/api'
// import Cookies from 'js-cookie'
// import Footer from '../../components/landing/Footer'

// const Login = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const response = await api.post('/auth/login', { email, password })
//       dispatch({ type: 'SET_USER', payload: response.data.user })
//       dispatch({ type: 'SET_SESSION_ID', payload: response.data.session_id })
//       Cookies.set('dcims', response.data.session_id, { expires: 30 })

//       sessionStorage.setItem('session_id', response.data.session_id)
//       sessionStorage.setItem('role', response.data.user.role)
//       sessionStorage.setItem('user_id', response.data.user.id)
//       sessionStorage.setItem('name', response.data.user.name)

//       navigate('/dashboard')
//     } catch (err) {
//       const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
//       setAlert({
//         visible: true,
//         type: 'danger',
//         message,
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (alert.visible) {
//       const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [alert])

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <CContainer className="flex-grow-1 d-flex flex-column justify-content-center">
//         <CRow className="justify-content-center">
//           <CCol xs={12} sm={10} md={8} lg={5}>
//             <CCard className="shadow-sm p-4 border-0 rounded">
//               <CCardBody>
//                 <CForm onSubmit={handleLogin}>
//                   <h2 className="text-left fw-bold">Login</h2>
//                   <p className="text-left text-muted">Sign in to your account</p>
//                   {alert.visible && (
//                     <CAlert color={alert.type} className="mb-3">
//                       {alert.message}
//                     </CAlert>
//                   )}

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <FontAwesomeIcon icon={faUser} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="text"
//                       placeholder="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>
//                       <FontAwesomeIcon icon={faLock} />
//                     </CInputGroupText>
//                     <CFormInput
//                       type="password"
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                   </CInputGroup>

//                   <CRow>
//                     <CCol>
//                       <CButton type="submit" color="primary" className="w-100" disabled={loading}>
//                         {loading ? (
//                           <CSpinner component="span" size="sm" aria-hidden="true" />
//                         ) : (
//                           'Login'
//                         )}
//                       </CButton>
//                     </CCol>
//                   </CRow>

//                   <div className="text-center mt-3">
//                     <Link to="/ForgotPassword" className="text-decoration-none">
//                       Forgot password?
//                     </Link>
//                   </div>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//       <Footer />
//     </div>
//   )
// }

// export default Login

// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CRow,
//   CCol,
//   CContainer,
//   CForm,
//   CAlert,
//   CInputGroup,
//   CInputGroupText,
//   CFormInput,
//   CSpinner,
//   CCardHeader,
// } from '@coreui/react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUser, faLock, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
// import api from '../../util/api'
// import Cookies from 'js-cookie'
// import Footer from '../../components/landing/Footer'

// const Login = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [token, setToken] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
//   const [twoFactorMode, setTwoFactorMode] = useState(false)
//   const [tempSession, setTempSession] = useState(null)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const handleLogin = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const response = await api.post('/auth/login', { email, password })

//       if (response.data.requires_2fa) {
//         // Show 2FA verification
//         setTwoFactorMode(true)
//         setTempSession(response.data.temp_session)
//       } else {
//         // Direct login if 2FA not required
//         completeLogin(response.data)
//       }
//     } catch (err) {
//       const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
//       setAlert({
//         visible: true,
//         type: 'danger',
//         message,
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerify2FA = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const response = await api.post('/auth/verify-2fa', {
//         email,
//         token,
//         temp_session: tempSession,
//       })
//       completeLogin(response.data)
//     } catch (err) {
//       setAlert({
//         visible: true,
//         type: 'danger',
//         message: err.response?.data?.message || 'Verification failed. Please try again.',
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const completeLogin = (data) => {
//     dispatch({ type: 'SET_USER', payload: data.user })
//     dispatch({ type: 'SET_SESSION_ID', payload: data.session_id })
//     Cookies.set('dcims', data.session_id, { expires: 30 })

//     sessionStorage.setItem('session_id', data.session_id)
//     sessionStorage.setItem('role', data.user.role)
//     sessionStorage.setItem('user_id', data.user.id)
//     sessionStorage.setItem('name', data.user.name)

//     navigate('/dashboard')
//   }

//   const handleBackToLogin = () => {
//     setTwoFactorMode(false)
//     setTempSession(null)
//     setToken('')
//     setAlert({ visible: false, type: '', message: '' })
//   }

//   useEffect(() => {
//     if (alert.visible) {
//       const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [alert])

//   return (
//     <div className="bg-light min-vh-100 d-flex flex-column">
//       <CContainer className="flex-grow-1 d-flex flex-column justify-content-center">
//         <CRow className="justify-content-center">
//           <CCol xs={12} sm={10} md={8} lg={5}>
//             {!twoFactorMode ? (
//               <CCard className="shadow-sm p-4 border-0 rounded">
//                 <CCardBody>
//                   <CForm onSubmit={handleLogin}>
//                     <h2 className="text-left fw-bold">Login</h2>
//                     <p className="text-left text-muted">Sign in to your account</p>
//                     {alert.visible && (
//                       <CAlert color={alert.type} className="mb-3">
//                         {alert.message}
//                       </CAlert>
//                     )}

//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <FontAwesomeIcon icon={faUser} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         placeholder="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </CInputGroup>

//                     <CInputGroup className="mb-3">
//                       <CInputGroupText>
//                         <FontAwesomeIcon icon={faLock} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                     </CInputGroup>

//                     <CRow>
//                       <CCol>
//                         <CButton type="submit" color="primary" className="w-100" disabled={loading}>
//                           {loading ? (
//                             <CSpinner component="span" size="sm" aria-hidden="true" />
//                           ) : (
//                             'Login'
//                           )}
//                         </CButton>
//                       </CCol>
//                     </CRow>

//                     <div className="text-center mt-3">
//                       <Link to="/ForgotPassword" className="text-decoration-none">
//                         Forgot password?
//                       </Link>
//                     </div>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             ) : (
//               <CCard className="border-0 shadow-sm">
//                 <CCardHeader className="bg-white border-0 text-center py-4">
//                   <h3 className="mb-0">2-Step Verification</h3>
//                 </CCardHeader>
//                 <CCardBody className="p-4">
//                   <p className="text-muted text-center mb-4">
//                     This extra step shows its really you trying to sign in
//                     <br />
//                     <strong>{email}</strong>
//                   </p>

//                   <CForm onSubmit={handleVerify2FA}>
//                     <h5 className="text-center mb-3">Enter your verification code</h5>

//                     {alert.visible && (
//                       <CAlert color={alert.type} className="mb-3">
//                         {alert.message}
//                       </CAlert>
//                     )}

//                     <CInputGroup className="mb-4">
//                       <CInputGroupText>
//                         <FontAwesomeIcon icon={faShieldAlt} />
//                       </CInputGroupText>
//                       <CFormInput
//                         type="text"
//                         placeholder="6-digit code"
//                         value={token}
//                         onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                         maxLength={6}
//                         required
//                         className="text-center"
//                       />
//                     </CInputGroup>

//                     <div className="d-grid gap-2">
//                       <CButton color="primary" type="submit" disabled={loading} className="py-2">
//                         {loading ? <CSpinner size="sm" /> : 'Verify'}
//                       </CButton>
//                       <CButton color="link" onClick={handleBackToLogin} className="text-muted">
//                         Back to sign in
//                       </CButton>
//                     </div>
//                   </CForm>
//                 </CCardBody>
//               </CCard>
//             )}
//           </CCol>
//         </CRow>
//       </CContainer>
//       <Footer />
//     </div>
//   )
// }

// export default Login
