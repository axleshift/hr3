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
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormInput,
  CButton,
} from '@coreui/react'
import api from '../../util/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const Pending = () => {
  const [leave, setLeave] = useState([])
  const [filteredLeave, setFilteredLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchLeave()
  }, [currentPage])

  const fetchLeave = async () => {
    try {
      setLoading(true)
      const response = await api.get('/leave-requests', {
        params: { page: currentPage, limit: itemsPerPage },
      })
      const data = response.data || {}

      if (Array.isArray(data.leaveRequests)) {
        const approvedLeave = data.leaveRequests.filter(
          (item) => item.status.toLowerCase() === 'pending',
        )
        setLeave(approvedLeave)
        setFilteredLeave(approvedLeave)
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

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Pending Leave Requests</strong>
        <div className="d-flex gap-2">
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <CButton color="primary">
              <FontAwesomeIcon icon={faSearch} />
            </CButton>
          </CInputGroup>
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
            <p>No approved leave request found.</p>
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
                  <CTableHeaderCell>Paid</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
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
                    <CTableDataCell>{leave.is_paid ? 'Paid' : 'Unpaid'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="warning">{leave.status}</CBadge>
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

export default Pending
