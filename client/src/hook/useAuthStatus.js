import { useEffect, useState } from 'react'
import api from '../util/api'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

const useAuthStatus = () => {
  const dispatch = useDispatch()
  const [status, setStatus] = useState('loading')

  const useAuthStatus = async (session_id) => {
    try {
      const response = await api.post('/api/auth/verify-session', { session_id })
      dispatch({ type: 'SET_USER', payload: response.data.user })
      dispatch({ type: 'SET_SESSION_ID', payload: session_id })
      setStatus('authenticated')
    } catch (error) {
      if (Cookies.get('dcims')) Cookies.remove('dcims')
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    const sessionId = Cookies.get('dcims')
    if (sessionId) {
      useAuthStatus(sessionId)
    } else {
      setStatus('unauthenticated')
    }
  }, [dispatch])

  return status
}

export default useAuthStatus
