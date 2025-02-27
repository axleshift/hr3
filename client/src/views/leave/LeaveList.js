import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormCheck,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical, faChevronDown, faEye } from '@fortawesome/free-solid-svg-icons'

const LeaveList = () => {
  const [leave, setLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeave()
  }, [])

  const fetchLeave = async () => {
    try {
      const response = await api.get('/leave-requests')
      setLeave(response.data.leaveRequests || [])
    } catch (error) {
      console.error('Error fetching leave list:', error)
      alert('Failed to fetch leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await api.get(`/leave-requests/${id}`)
      console.log('API Response:', response.data)
      setSelectedLeave(response.data)
      setViewModalVisible(true)
    } catch (error) {
      console.error('Error fetching leave details:', error)
      alert('Failed to fetch leave details. Please try again.')
    }
  }
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/leave-requests/${id}`, { status })
      fetchLeave()
    } catch (error) {
      console.error('Error updating leave status:', error)
      alert(`Failed to update leave status: ${error.response?.data?.message || error.message}`)
    }
  }

  const handlePaidUpdate = async (id, isPaid) => {
    try {
      await api.put(`/leave-requests/${id}`, { is_paid: isPaid })
      fetchLeave()
    } catch (error) {
      console.error('Error updating paid status:', error)
      alert('Failed to update paid status. Please try again.')
    }
  }

  const LeaveCredit = () => {
    navigate('/LeaveCredit')
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

  return (
    <CCard>
      <CCardHeader>
        <strong>Leave Requests</strong>
        <div className="float-end">
          <CButton color="primary" onClick={() => setViewModalVisible(true)} className="me-2">
            <FontAwesomeIcon icon={faPlus} />
          </CButton>
          <CButton color="primary" onClick={() => navigate('/LeaveCredit')}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Employee</CTableHeaderCell>
                <CTableHeaderCell>Date Requested</CTableHeaderCell>
                <CTableHeaderCell>Leave Type</CTableHeaderCell>
                <CTableHeaderCell>Days</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Paid</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leave.map((leave, index) => (
                <CTableRow key={leave.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    ID: {leave.employee_id} <br /> Name: {leave.name}
                  </CTableDataCell>
                  <CTableDataCell>{new Date(leave.created_at).toLocaleDateString()}</CTableDataCell>
                  <CTableDataCell>{leave.leave_type}</CTableDataCell>
                  <CTableDataCell>{leave.total_days}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(leave.status)}>{leave.status}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormCheck
                      id={`paid-checkbox-${leave.id}`}
                      checked={leave.is_paid}
                      onChange={(e) => handlePaidUpdate(leave.id, e.target.checked)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="link"
                      size="sm"
                      onClick={() => handleView(leave.id)}
                      className="me-2"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </CButton>
                    <CDropdown>
                      <CDropdownToggle color="link" size="sm">
                        <FontAwesomeIcon icon={faChevronDown} />
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                          disabled={leave.status === 'Approved'}
                        >
                          Approved
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                          disabled={leave.status === 'Rejected'}
                        >
                          Rejected
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() => handleStatusUpdate(leave.id, 'Pending')}
                          disabled={leave.status === 'Pending'}
                        >
                          Pending
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Leave Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedLeave ? (
            <>
              <p>
                <strong>Employee ID:</strong> {selectedLeave.employee_id}
              </p>
              <p>
                <strong>Employee Name:</strong> {selectedLeave.name}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedLeave.leave_type}
              </p>
              <p>
                <strong>Start Date:</strong> {selectedLeave.start_date}
              </p>
              <p>
                <strong>End Date:</strong> {selectedLeave.end_date}
              </p>
              <p>
                <strong>Total Days:</strong> {selectedLeave.total_days}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <CBadge color={getStatusBadge(selectedLeave.status)}>{selectedLeave.status}</CBadge>
              </p>
              <p>
                <strong>Date Requested:</strong>{' '}
                {new Date(selectedLeave.created_at).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p>No data available.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default LeaveList
