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
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormInput,
  CInputGroupText,
} from '@coreui/react'
import api from '../../util/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'

const LeaveList = () => {
  const [leave, setLeave] = useState([])
  const [filteredLeave, setFilteredLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchLeave()
  }, [filterType, currentPage])

  const fetchLeave = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/leave-requests/page', {
        params: { page: currentPage, limit: itemsPerPage },
      })
      const data = response.data || {}

      if (Array.isArray(data.leaveRequests)) {
        setLeave(data.leaveRequests)
        setFilteredLeave(data.leaveRequests)
      } else {
        setLeave([])
        setFilteredLeave([])
      }

      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching leave list:', error)
      setLeave([])
      setFilteredLeave([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/leave-requests/${id}`, { status })
      fetchLeave()
    } catch (error) {
      console.error('Error updating leave status:', error)
      alert(`Failed to update leave status: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredLeave(leave)
    } else {
      const filtered = leave.filter((item) =>
        item.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
      setFilteredLeave(filtered)
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
        <div className="d-flex gap-2">
          <CInputGroup style={{ width: '200px' }}>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <CInputGroupText>
              <FontAwesomeIcon icon={faSearch} />
            </CInputGroupText>
          </CInputGroup>

          <CFormSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Requests</option>
            <option value="last24">Last 24 Hours</option>
            <option value="recent">Recent (Last 7 Days)</option>
            <option value="old">Older</option>
          </CFormSelect>
        </div>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </div>
        ) : filteredLeave.length === 0 ? (
          <div className="text-center">
            <p>No leave request found.</p>
          </div>
        ) : (
          <>
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
                {filteredLeave.map((leave, index) => (
                  <CTableRow key={leave.id}>
                    <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                    <CTableDataCell>{leave.name}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(leave.created_at).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>{leave.leave_type}</CTableDataCell>
                    <CTableDataCell>{leave.total_days}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(leave.status)}>{leave.status}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormCheck
                        id={`paid-checkbox-${leave.id}`}
                        checked={leave.is_paid}
                        onChange={() => {}}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="link">
                        <FontAwesomeIcon icon={faFile} />
                      </CButton>
                      <CDropdown>
                        <CDropdownToggle color="link" size="sm">
                          <FontAwesomeIcon icon={faChevronDown} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            onClick={() => handleStatus(leave.id, 'Approved')}
                            disabled={leave.status === 'Approved'}
                          >
                            Approved
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleStatus(leave.id, 'Rejected')}
                            disabled={leave.status === 'Rejected'}
                          >
                            Rejected
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleStatus(leave.id, 'Pending')}
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

            {/* Pagination */}
            <CPagination align="center" className="mt-3">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &laquo;
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <CPaginationItem
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &raquo;
              </CPaginationItem>
            </CPagination>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default LeaveList
