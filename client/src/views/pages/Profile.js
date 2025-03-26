import React, { useEffect, useState, useRef } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
  CImage,
  CSpinner,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEdit } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'
import Cookies from 'js-cookie'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', username: '', email: '' })
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const sessionId = Cookies.get('dcims')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (sessionId) {
      api
        .post('/api/auth/verify-session', { session_id: sessionId })
        .then((response) => {
          setUser(response.data.user)
          setFormData({
            name: response.data.user.name,
            username: response.data.user.username,
            email: response.data.user.email,
          })
          fetchProfile(response.data.user.id)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const fetchProfile = (userId) => {
    api
      .get(`/api/profiles/${userId}`)
      .then((response) => {
        setProfile(response.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      handleUpload(file)
    }
  }

  const handleUpload = (file) => {
    if (!file) return

    const formData = new FormData()
    formData.append('profile', file)
    formData.append('user_id', user.id)

    api
      .post('/api/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setProfile(response.data.data)
        setAlert({
          visible: true,
          type: 'success',
          message: 'Profile picture updated successfully!',
        })
      })
      .catch(() => {
        setAlert({ visible: true, type: 'danger', message: 'Failed to update profile picture.' })
      })
  }

  const handleImageClick = () => fileInputRef.current.click()
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSave = () => {
    api
      .put(`/api/profiles/${user.id}`, formData)
      .then((response) => {
        setAlert({ visible: true, type: 'success', message: 'Profile updated successfully!' })
        setIsEditing(false)
        setUser(response.data.user)
      })
      .catch(() => {
        setAlert({ visible: true, type: 'danger', message: 'Failed to update profile.' })
      })
  }

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <CSpinner color="primary" />
      </div>
    )

  if (!user) return <div>You are not authenticated.</div>

  return (
    <CRow>
      <CCol>
        <CCard className="mb-2">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Profile</strong>
            <FontAwesomeIcon
              icon={faEdit}
              className="text-warning"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEditing(true)}
            />
          </CCardHeader>
          <CCardBody>
            {alert.visible && <CAlert color={alert.type}>{alert.message}</CAlert>}
            <div
              className="text-center mb-4"
              onClick={handleImageClick}
              style={{ cursor: 'pointer' }}
            >
              {profile?.profile_url ? (
                <CImage
                  src={profile.profile_url}
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                  style={{ width: '150px', height: '150px' }}
                >
                  <FontAwesomeIcon icon={faUser} size="3x" className="text-light" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <CForm>
              <CInputGroup className="mb-3">
                <CInputGroupText>Name</CInputGroupText>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Username</CInputGroupText>
                <CFormInput
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Email</CInputGroupText>
                <CFormInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </CInputGroup>

              <div className="text-center mt-4">
                {isEditing && (
                  <>
                    <CButton color="primary" className="me-2" onClick={handleSave}>
                      Save
                    </CButton>
                    <CButton color="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </CButton>
                  </>
                )}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
