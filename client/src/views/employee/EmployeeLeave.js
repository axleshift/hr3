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
  CAlert,
  CPagination,
  CPaginationItem,
  CCol,
  CRow,
  CFormInput,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const EmployeeLeave = () => {
  const [leave, setLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [leaveType, setLeaveType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [file, setFile] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [leaveTypes, setLeaveTypes] = useState([])
  const userId = sessionStorage.getItem('user_id')

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please log in again.')
      setLoading(false)
      return
    }
    fetchLeave()
    fetchLeaveTypes()
  }, [userId])

  const fetchLeave = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/leave/${userId}`)
      setLeave(response.data.leaveRequests || [])
    } catch (error) {
      setError('Failed to load leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const response = await api.get('/api/leave-types')
      setLeaveTypes(response.data)
    } catch (error) {
      console.error('Error fetching leave types:', error)
    }
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning'
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userId || isNaN(userId)) {
      setAlert({
        visible: true,
        type: 'danger',
        message: 'Invalid User ID. Please log in again.',
      })
      return
    }

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
    formData.append('user_id', userId)
    formData.append('name', sessionStorage.getItem('name') || '')
    formData.append('leave_type', leaveType)
    formData.append('start_date', startDate)
    formData.append('end_date', endDate)
    formData.append('reason', reason)

    if (file) {
      formData.append('document', file)
    }

    try {
      const response = await api.post('/api/leave-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setAlert({ visible: true, type: 'success', message: 'Leave request submitted successfully!' })
      setLeaveType('')
      setStartDate('')
      setEndDate('')
      setReason('')
      setFile(null)
      fetchLeave()
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = leave.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
        <strong>My Leave Requests</strong>
        <CButton className="float-end" color="primary" onClick={() => setModalVisible(true)}>
          Request Leave
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
          <>
            {alert.visible && (
              <CAlert color={alert.type} dismissible>
                {alert.message}
              </CAlert>
            )}
            <CTable hover responsive>
              <CTableHead>
                <CTableRow className="text-center">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Leave Type</CTableHeaderCell>
                  <CTableHeaderCell>Date Requested</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody className="text-center">
                {currentItems.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No leave requests available.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentItems.map((leave, index) => (
                    <CTableRow key={leave.id}>
                      <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                      <CTableDataCell>{leave.leave_type}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(leave.created_at).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(leave.status)}>{leave.status}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="info" size="sm" onClick={() => setSelectedLeave(leave)}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            <CPagination className="mt-3">
              {Array.from({ length: Math.ceil(leave.length / itemsPerPage) }, (_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
            </CPagination>
          </>
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
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
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
            <small className="text-muted">
              <strong>Notice:</strong> Please combine multiple files or images into a single PDF
              before uploading.
            </small>
            <br />
            <br />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" form="leaveForm">
            Submit Request
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={!!selectedLeave} onClose={() => setSelectedLeave(null)}>
        <CModalHeader>
          <CModalTitle>Leave Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedLeave && (
            <>
              <p>
                <strong>Leave Type:</strong> {selectedLeave.leave_type}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <p>
                <strong>Date Requested:</strong>{' '}
                {new Date(selectedLeave.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <CBadge color={getStatusBadge(selectedLeave.status)}>{selectedLeave.status}</CBadge>
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSelectedLeave(null)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default EmployeeLeave
