import React, { Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import ProtectedRoute from './util/ProtectedRoute'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/Login'))
const Register = React.lazy(() => import('./views/pages/Register'))
const ForgotPassword = React.lazy(() => import('./views/pages/ForgotPassword'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="loading-overlay">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/Login" name="Login" element={<Login />} />
          <Route path="/Register" name="Register" element={<Register />} />
          <Route path="/ForgotPassword" name="ForgotPassword" element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
