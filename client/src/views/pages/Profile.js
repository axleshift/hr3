import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    profile_picture: '',
  })
  const [file, setFile] = useState(null)
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/{employeeId}')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      setAlert({ visible: true, type: 'danger', message: 'Please select an image.' })
      return
    }

    const formData = new FormData()
    formData.append('profile_picture', file)

    try {
      const response = await api.post('/profile/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setUser((prev) => ({ ...prev, profile_picture: response.data.profile_picture }))
      setAlert({ visible: true, type: 'success', message: 'Profile picture updated successfully!' })
    } catch (error) {
      console.error('Upload failed:', error)
      setAlert({ visible: true, type: 'danger', message: 'Failed to upload image.' })
    }
  }

  return (
    <CRow>
      <CCol xs={12} md={6} className="mx-auto">
        <CCard>
          <CCardHeader>
            <strong>Profile</strong>
          </CCardHeader>
          <CCardBody>
            {alert.visible && (
              <CAlert color={alert.type} dismissible>
                {alert.message}
              </CAlert>
            )}
            <div className="text-center mb-4">
              <img
                src={user.profile_picture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="rounded-circle"
                width="150"
                height="150"
              />
            </div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <CFormInput type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <CButton color="primary" onClick={handleUpload}>
              Upload Profile Picture
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
