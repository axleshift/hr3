import { useEffect, useState } from 'react'
import api from '../util/api'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

const useAuthStatus = () => {
  const dispatch = useDispatch()
  const [status, setStatus] = useState('loading')

  const verifySession = async (session_id) => {
    try {
      const response = await api.post('/auth/verify-session', { session_id })
      dispatch({ type: 'SET_USER', payload: response.data.user })
      dispatch({ type: 'SET_SESSION_ID', payload: session_id })
      setStatus('authenticated')
    } catch (error) {
      // Remove cookie only if it exists
      if (Cookies.get('dcims')) {
        Cookies.remove('dcims', {
          path: '/',
          secure: window.location.protocol === 'https:',
          sameSite: 'strict',
        })
      }
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    const isSecure = window.location.protocol === 'https:'
    const cookieOptions = {
      path: '/',
      secure: isSecure,
      sameSite: 'strict',
    }

    const sessionId = Cookies.get('dcims')
    if (sessionId) {
      verifySession(sessionId)
    } else {
      setStatus('unauthenticated')
    }

    // If you need to set the cookie somewhere else in your app
    const setCookie = (value) => {
      Cookies.set('dcims', value, cookieOptions)
    }

    return () => {
      // Cleanup if needed
    }
  }, [dispatch])

  return status
}

export default useAuthStatus

// import { useEffect, useState } from 'react'
// import api from '../util/api'
// import Cookies from 'js-cookie'
// import { useDispatch } from 'react-redux'

// const useAuthStatus = () => {
//   const dispatch = useDispatch()
//   const [status, setStatus] = useState('loading')

//   const useAuthStatus = async (session_id) => {
//     try {
//       const response = await api.post('/api/auth/verify-session', { session_id })
//       dispatch({ type: 'SET_USER', payload: response.data.user })
//       dispatch({ type: 'SET_SESSION_ID', payload: session_id })
//       setStatus('authenticated')
//     } catch (error) {
//       if (Cookies.get('dcims')) Cookies.remove('dcims')
//       setStatus('unauthenticated')
//     }
//   }

//   useEffect(() => {
//     const sessionId = Cookies.get('dcims')
//     if (sessionId) {
//       useAuthStatus(sessionId)
//     } else {
//       setStatus('unauthenticated')
//     }
//   }, [dispatch])

//   return status
// }

// export default useAuthStatus
