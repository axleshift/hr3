import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CButton, CFormInput, CAvatar } from '@coreui/react'
import avatar8 from './../../assets/images/avatars/8.jpg' // Default avatar

const Profile = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', profilePicture: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user')
        setUser(response.data)
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.')
      }
    }

    fetchUserData()
  }, [])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put('http://localhost:8000/api/user', user)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update user data. Please try again later.')
    }
  }

  return (
    <div className="profile-container" style={{ textAlign: 'center' }}>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Profile Avatar */}
      <div className="profile-pic-container" style={{ marginBottom: '20px' }}>
        <CAvatar src={user.profilePicture || avatar8} size="lg" />
      </div>

      {/* User Details */}
      <div className="user-details">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>{user.email}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        {/* Editable Fields */}
        <CFormInput
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="First Name"
          style={{ marginBottom: '10px' }}
        />
        <CFormInput
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Last Name"
          style={{ marginBottom: '10px' }}
        />
        <CFormInput
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Email"
          style={{ marginBottom: '10px' }}
        />

        {/* Profile Picture Upload */}
        <input
          type="file"
          onChange={handleFileChange}
          disabled={!isEditing}
          style={{ marginBottom: '10px' }}
        />
        {user.profilePicture && <img src={user.profilePicture} alt="Profile" width="100" />}

        {/* Edit / Save Button */}
        <div>
          <CButton type="button" onClick={handleEditToggle}>
            {isEditing ? 'Cancel' : 'Edit'}
          </CButton>
          {isEditing && (
            <CButton type="submit" style={{ marginLeft: '10px' }}>
              Save
            </CButton>
          )}
        </div>
      </form>
    </div>
  )
}

export default Profile
