import React, { useState } from 'react'
import axios from '../../views/auth/axios'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/password/email', { email })
      setMessage(response.data.message)
    } catch (error) {
      setMessage('An error occurred, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Reset Your Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Send Reset Link
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default ForgotPassword
