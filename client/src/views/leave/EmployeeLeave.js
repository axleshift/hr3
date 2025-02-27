import React, { useEffect, useState } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CButton,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'
import { format } from 'date-fns'

const EmployeeLeave = () => {
  const [leave, setLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [leaveType, setLeaveType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const employeeId = sessionStorage.getItem('employee_id')

  const employee = {
    employee_id: sessionStorage.getItem('employee_id') || '',
    name: sessionStorage.getItem('name') || '',
  }

  useEffect(() => {
    if (!employeeId) {
      setError('Employee ID not found. Please log in again.')
      setLoading(false)
      return
    }
    fetchLeave()
  }, [employeeId])

  const fetchLeave = async () => {
    try {
      const response = await api.get(`/leave-requests/${employeeId}`)
      setLeave(response.data.leaveRequests)
    } catch (error) {
      console.error('Error fetching leave list:', error)
      setError('Failed to load leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'primary'
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!leaveType || !startDate || !endDate || !reason) {
      setAlert({ visible: true, type: 'danger', message: 'All fields are required.' })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setAlert({ visible: true, type: 'danger', message: 'End Date must be after Start Date.' })
      return
    }

    try {
      const response = await api.post('/leave-request', {
        employee_id: employee.employee_id,
        name: employee.name,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        status: 'Pending',
      })
      console.log('Response:', response.data)
      setAlert({ visible: true, type: 'success', message: 'Leave request submitted successfully!' })

      setLeaveType('')
      setStartDate('')
      setEndDate('')
      setReason('')
      fetchLeave()

      setTimeout(() => {
        setModalVisible(false)
      }, 2000)
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

  return (
    <CCard>
      <CCardHeader>
        <strong>My Leave Requests</strong>
        <CButton className="float-end" color="primary" onClick={() => setModalVisible(true)}>
          Request
        </CButton>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger">
            <p>{error}</p>
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Leave Type</CTableHeaderCell>
                <CTableHeaderCell>Start Date</CTableHeaderCell>
                <CTableHeaderCell>End Date</CTableHeaderCell>
                <CTableHeaderCell>Days</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leave.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No leave requests available.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                leave.map((leave, index) => (
                  <CTableRow key={leave.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{leave.leave_type}</CTableDataCell>
                    <CTableDataCell>{leave.start_date}</CTableDataCell>
                    <CTableDataCell>{leave.end_date}</CTableDataCell>
                    <CTableDataCell>{leave.total_days}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(leave.status)}>{leave.status}</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      {/* Leave Request Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Leave Request</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {alert.visible && (
            <CAlert color={alert.type} dismissible>
              {alert.message}
            </CAlert>
          )}
          <CForm onSubmit={handleSubmit} id="leaveForm">
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
              </CCol>
              <CCol className="mb-3">
                <CFormInput
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </CCol>
            </CRow>
            <CFormTextarea
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
            <br />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" form="leaveForm">
            Submit Request
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default EmployeeLeave
