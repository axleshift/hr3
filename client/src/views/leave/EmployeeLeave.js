import React, { useEffect, useState, useCallback } from 'react'
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
  CFormTextarea,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'

const EmployeeLeave = () => {
  const [leave, setLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [leaveType, setLeaveType] = useState('')
  const [reason, setReason] = useState('')
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const employeeId = sessionStorage.getItem('employee_id')

  useEffect(() => {
    if (!employeeId) {
      setError('Employee ID not found. Please log in again.')
      setLoading(false)
      return
    }
    fetchLeave()
  }, [employeeId])

  const fetchLeave = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/leave-requests/${employeeId}`)
      setLeave(response.data.leaveRequests)
    } catch (error) {
      setError('Failed to load leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [employeeId])

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

    if (!leaveType || !reason) {
      setAlert({ visible: true, type: 'danger', message: 'Leave Type and Reason are required.' })
      return
    }

    try {
      const response = await api.post('/leave-request', {
        employee_id: employeeId,
        leave_type: leaveType,
        reason: reason,
        status: 'Pending',
      })
      setAlert({ visible: true, type: 'success', message: 'Leave request submitted successfully!' })

      setLeaveType('')
      setReason('')
      fetchLeave()

      setTimeout(() => {
        setModalVisible(false)
      }, 2000)
    } catch (error) {
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
        {/* <CButton className="float-end" color="primary" onClick={() => setModalVisible(true)}>
          Request
        </CButton> */}
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
                <CTableHeaderCell>Approved Date</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leave.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="4" className="text-center">
                    No leave requests available.
                  </CTableDataCell>
                </CTableRow>
              ) : (
                leave.map((leave, index) => (
                  <CTableRow key={leave.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{leave.leave_type}</CTableDataCell>
                    <CTableDataCell>{leave.approved_date || 'N/A'}</CTableDataCell>
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
