import React, { useState } from 'react'
import axios from 'axios'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    cpassword: '',
    npassword: '',
    cnpassword: '',
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!formData.cpassword.trim()) {
      errors.cpassword = 'Current Password is Required'
    }
    if (!formData.npassword.trim()) {
      errors.npassword = 'New Password is Required'
    }
    if (!formData.cnpassword.trim()) {
      errors.cnpassword = 'Confirm New Password is Required'
    } else if (formData.npassword !== formData.cnpassword) {
      errors.cnpassword = 'New Password and Confirm New Password do not match'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const response = await axios.post('/changepassword', {
        ...formData,
        userId: user.id,
      })

      if (response.data.status === 'success') {
        setAlert({ visible: true, type: 'success', message: 'Password changed successfully.' })
        setTimeout(() => {
          logout()
        }, 2000)
      } else {
        setAlert({
          visible: true,
          type: 'danger',
          message:
            response.data.message ||
            'An error occurred while processing your request. Please try again later.',
        })
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'danger',
        message: 'An error occurred while processing your request. Please try again later.',
      })
    }
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-2">
          <CCardHeader className="center-left">
            <strong>Change Password</strong>
          </CCardHeader>
          <CCardBody>
            {alert.visible && (
              <CAlert
                color={alert.type}
                onClose={() => setAlert({ ...alert, visible: false })}
                dismissible
              >
                {alert.message}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              <CFormInput
                type="password"
                name="cpassword"
                placeholder="Enter Current Password"
                onChange={handleChange}
                className="mb-4"
              />
              {validationErrors.cpassword && (
                <span className="text-danger">{validationErrors.cpassword}</span>
              )}

              <CFormInput
                type="password"
                name="npassword"
                placeholder="Enter New Password"
                onChange={handleChange}
                className="mb-4"
              />
              {validationErrors.npassword && (
                <span className="text-danger">{validationErrors.npassword}</span>
              )}

              <CFormInput
                type="password"
                name="cnpassword"
                placeholder="Confirm New Password"
                onChange={handleChange}
                className="mb-4"
              />
              {validationErrors.cnpassword && (
                <span className="text-danger">{validationErrors.cnpassword}</span>
              )}

              <div className="text-center mt-4">
                <CButton type="submit" color="primary">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ChangePassword
