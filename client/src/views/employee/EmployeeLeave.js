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
  const [file, setFile] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
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
      const response = await api.get(`/leave/${userId}`)
      setLeave(response.data.leaveRequests || [])
    } catch (error) {
      setError('Failed to load leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const response = await api.get('/leave-types')
      console.log('Leave types response:', response.data)
      if (response.data && Array.isArray(response.data)) {
        setLeaveTypes(response.data)
      } else {
        console.error('Leave types data is not an array:', response.data)
        setLeaveTypes([])
      }
    } catch (error) {
      console.error('Error fetching leave types:', error)
      setAlert({
        visible: true,
        type: 'danger',
        message: 'Failed to load leave types. Please try again later.',
      })
      setLeaveTypes([])
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
    setFile(e.target.files)
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

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('user_id', userId)
      formData.append('name', sessionStorage.getItem('name') || '')
      formData.append('leave_type', leaveType)
      formData.append('start_date', startDate)
      formData.append('end_date', endDate)
      formData.append('reason', reason)

      if (file && file.length > 0) {
        Array.from(file).forEach((fileItem) => {
          formData.append('documents[]', fileItem)
        })
      }

      const response = await api.post('/leave-requests', formData, {
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
      setModalVisible(false)
      await fetchLeave() // Wait for the fetch to complete
    } catch (error) {
      console.error('Error Response:', error.response?.data)
      setAlert({
        visible: true,
        type: 'danger',
        message:
          error.response?.data?.message ||
          (error.response?.data?.errors
            ? Object.values(error.response.data.errors).flat().join(' ')
            : 'Failed to submit leave request.'),
      })
    } finally {
      setLoading(false)
    }
  }

  const getDocumentPaths = (documentPath) => {
    if (!documentPath) return []

    try {
      // If it's already an array, return it
      if (Array.isArray(documentPath)) return documentPath

      // If it's a string, try to parse it as JSON
      if (typeof documentPath === 'string') {
        const parsed = JSON.parse(documentPath)
        return Array.isArray(parsed) ? parsed : []
      }

      return []
    } catch (e) {
      console.error('Error parsing document paths:', e)
      return []
    }
  }

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
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody className="text-center">
                {leave.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="5" className="text-center">
                      No leave requests available.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  leave.map((leaveItem, index) => (
                    <CTableRow key={leaveItem.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{leaveItem.leave_type}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(leaveItem.created_at).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Date(leaveItem.start_date).toLocaleDateString()} -{' '}
                        {new Date(leaveItem.end_date).toLocaleDateString()}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={getStatusBadge(leaveItem.status)}>{leaveItem.status}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          onClick={() => setSelectedLeave(leaveItem)}
                          style={{ cursor: 'pointer' }}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
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
              disabled={leaveTypes.length === 0}
            >
              <option value="">
                {leaveTypes.length === 0 ? 'Loading leave types...' : 'Select Leave Type'}
              </option>
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
              multiple
            />
            {/* <small className="text-muted">
              <strong>Notice:</strong> Please combine multiple files or images into a single PDF
              before uploading.
            </small> */}
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

      <CModal visible={!!selectedLeave} onClose={() => setSelectedLeave(null)} size="lg">
        <CModalHeader>
          <CModalTitle>Leave Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedLeave ? (
            <div className="leave-details-container">
              <div className="mb-3">
                <p>
                  <strong>Name:</strong> {selectedLeave.name}
                </p>
                <p>
                  <strong>Department:</strong> {selectedLeave.department}
                </p>
                <p>
                  <strong>Job Position:</strong> {selectedLeave.job_position}
                </p>
              </div>
              <p className="mb-3">
                <strong>Date Requested:</strong>{' '}
                {new Date(selectedLeave.created_at).toLocaleDateString()}
              </p>
              <p className="mb-3">
                <strong>Duration:</strong> {new Date(selectedLeave.start_date).toLocaleDateString()}{' '}
                - {new Date(selectedLeave.end_date).toLocaleDateString()}
              </p>
              <p className="mb-3">
                <strong>Leave Type:</strong> {selectedLeave.leave_type}
              </p>
              <p className="mb-3">
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <p className="mb-3">
                <strong>Status:</strong>{' '}
                <CBadge color={getStatusBadge(selectedLeave.status)}>{selectedLeave.status}</CBadge>
              </p>
              <p className="mb-3">
                <strong>Remarks:</strong> {selectedLeave.remarks || 'N/A'}
              </p>

              <div className="mb-3">
                <p>
                  <strong>Documents:</strong>
                </p>
                {(() => {
                  try {
                    // Safely parse document_path whether it's a string or array
                    const documents =
                      typeof selectedLeave.document_path === 'string'
                        ? JSON.parse(selectedLeave.document_path)
                        : selectedLeave.document_path

                    // Check if we have valid documents to display
                    if (Array.isArray(documents) && documents.length > 0) {
                      return (
                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                          {documents.map((file, index) => {
                            const fileUrl = `http://localhost:8000/storage/${file}`
                            const fileExtension = file.split('.').pop().toLowerCase()
                            const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension)

                            return (
                              <li key={index} style={{ marginBottom: '10px' }}>
                                {isImage ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                      src={fileUrl}
                                      alt={`Uploaded file ${index + 1}`}
                                      style={{
                                        maxWidth: '100px',
                                        maxHeight: '100px',
                                        marginRight: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                      }}
                                    />
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none' }}
                                    >
                                      Open Full Image
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-block',
                                      padding: '5px 10px',
                                      backgroundColor: '#f8f9fa',
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      textDecoration: 'none',
                                      color: '#0d6efd',
                                    }}
                                  >
                                    Download {fileExtension.toUpperCase()} File ({index + 1})
                                  </a>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      )
                    }
                    return <p className="text-muted">No documents uploaded</p>
                  } catch (e) {
                    console.error('Error displaying documents:', e)
                    return <p className="text-muted">Unable to display documents</p>
                  }
                })()}
              </div>
            </div>
          ) : (
            <p>No leave details found.</p>
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
