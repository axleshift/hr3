import React, { useEffect, useState } from 'react'
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
  CBadge,
  CSpinner,
  CFormSelect,
  CFormCheck,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from '@coreui/react'
import api from '../../util/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const LeaveList = () => {
  const [leave, setLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLeave(currentPage)
  }, [currentPage, filterType])

  const fetchLeave = async (page = 1) => {
    try {
      setLoading(true)
      const response = await api.get(`/leave-requests?page=${page}`)
      let leaveRequests = response.data.leaveRequests || []

      const now = new Date()
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      if (filterType === 'last24') {
        leaveRequests = leaveRequests.filter((leave) => new Date(leave.created_at) >= last24Hours)
      } else if (filterType === 'recent') {
        leaveRequests = leaveRequests.filter(
          (leave) =>
            new Date(leave.created_at) < last24Hours &&
            new Date(leave.created_at) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        )
      } else if (filterType === 'old') {
        leaveRequests = leaveRequests.filter(
          (leave) =>
            new Date(leave.created_at) <= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        )
      }

      setLeave(leaveRequests)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching leave list:', error)
      alert('Failed to fetch leave requests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Leave Requests</strong>
        <CFormSelect
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="all">All Requests</option>
          <option value="last24">Last 24 Hours</option>
          <option value="recent">Recent (Last 7 Days)</option>
          <option value="old">Older</option>
        </CFormSelect>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </div>
        ) : leave.length === 0 ? (
          <div className="text-center">
            <p>No leave request.</p>
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
                  <CTableDataCell>{leave.name}</CTableDataCell>
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
                    <CButton color="link" onClick={() => handleView(leave.id)}>
                      <FontAwesomeIcon icon={faFile} />
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
    </CCard>
  )
}

export default LeaveList
