import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import useAuthStatus from '../../hook/checkAuthStatus '

const Leave = () => {
  const [leaveType, setLeaveType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [file, setFile] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const navigate = useNavigate()
  const authStatus = useAuthStatus()

  const employee = {
    employee_id: sessionStorage.getItem('employee_id') || '',
    name: sessionStorage.getItem('name') || '',
  }

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!leaveType.trim()) errors.leaveType = 'Leave Type is required'
    if (!startDate.trim()) errors.startDate = 'Start Date is required'
    if (!endDate.trim()) errors.endDate = 'End Date is required'
    else if (new Date(startDate) > new Date(endDate))
      errors.endDate = 'End Date must be after Start Date'
    if (!reason.trim()) errors.reason = 'Reason is required'

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors({})

    const formData = new FormData()
    formData.append('employee_id', employee.employee_id)
    formData.append('name', employee.name)
    formData.append('leave_type', leaveType)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('reason', reason)

    if (file) {
      formData.append('document', file)
    }

    try {
      const response = await api.post('/leave-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Response:', response.data)
      setAlert({ visible: true, type: 'success', message: 'Leave request submitted successfully!' })
      setLeaveType('')
      setStartDate('')
      setEndDate('')
      setReason('')
      setFile(null)
    } catch (error) {
      console.error('Error Response:', error.response?.data)
      setAlert({
        visible: true,
        type: 'danger',
        message: error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : 'Failed to submit leave request.',
      })
    }
  }

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  if (authStatus === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Leave Request</strong>
          </CCardHeader>
          <CCardBody>
            {alert.visible && (
              <CAlert color={alert.type} dismissible>
                {alert.message}
              </CAlert>
            )}
            <CForm onSubmit={handleSubmit}>
              <CFormSelect
                label="Leave Type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation Leave">Vacation Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </CFormSelect>
              {validationErrors.leaveType && (
                <span className="text-danger">{validationErrors.leaveType}</span>
              )}
              <br />
              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  {validationErrors.startDate && (
                    <span className="text-danger">{validationErrors.startDate}</span>
                  )}
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  {validationErrors.endDate && (
                    <span className="text-danger">{validationErrors.endDate}</span>
                  )}
                </CCol>
              </CRow>
              <br />
              <CFormTextarea
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
              {validationErrors.reason && (
                <span className="text-danger">{validationErrors.reason}</span>
              )}
              <br />
              <CFormInput
                type="file"
                label="Upload Document"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
              />
              <br />
              <CButton type="submit" color="primary">
                Submit Request
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Leave
