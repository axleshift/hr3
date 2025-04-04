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
  CInputGroupText,
  CModal,
  CModalHeader,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CModalTitle,
  CContainer,
  CRow,
  CCol,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
} from '@coreui/react'
import LeaveCalendar from './LeaveCalendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faInfoCircle,
  faCalendarAlt,
  faChevronDown,
  faCalendar,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const List = () => {
  const [events, setEvents] = useState([])
  const [leave, setLeave] = useState([])
  const [filteredLeave, setFilteredLeave] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [calendarModalVisible, setCalendarModalVisible] = useState(false)
  const itemsPerPage = 10
  const [statusCounts, setStatusCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  })

  const handleLeaveStatus = async (id, leaveStatus) => {
    try {
      await api.put(`/leave-requests/${id}`, { leave_status: leaveStatus })
      fetchLeave()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const formatDocuments = (documents) => {
    if (!documents) return []
    try {
      if (Array.isArray(documents)) return documents
      const parsed = JSON.parse(documents)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [calendarResponse, approvedCount, pendingCount, rejectedCount] = await Promise.all([
          api.get('/leave/calendar'),
          api.get('/leave-requests/count/approved'),
          api.get('/leave-requests/count/pending'),
          api.get('/leave-requests/count/rejected'),
        ])

        const formattedEvents = calendarResponse.data.map((event) => ({
          ...event,
          extendedProps: {
            status: event.status,
            leave_type: event.leave_type,
            user_name: event.user_name,
            department: event.department,
            leave_id: event.id,
          },
        }))

        setStatusCounts({
          approved: approvedCount.data.count || 0,
          pending: pendingCount.data.count || 0,
          rejected: rejectedCount.data.count || 0,
        })

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    fetchLeave()
  }, [currentPage, selectedMonth, selectedYear])

  const fetchLeave = async () => {
    try {
      setLoading(true)
      const response = await api.get('/leave-requests/page', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          year: selectedYear,
        },
      })
      const data = response.data || {}

      if (Array.isArray(data.leaveRequests)) {
        const filtered = data.leaveRequests.filter((item) => {
          const startDate = new Date(item.start_date)
          return (
            startDate.getMonth() + 1 === selectedMonth && startDate.getFullYear() === selectedYear
          )
        })

        setLeave(filtered)
        setFilteredLeave(filtered)
      } else {
        setLeave([])
        setFilteredLeave([])
      }

      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching leave list:', error)
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

  const getBadgeColor = (status) => {
    if (!status || typeof status !== 'string') {
      return 'primary'
    }
    const statusString = String(status).toLowerCase()
    switch (statusString) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'danger'
      default:
        return 'primary'
    }
  }

  const fetchEmployeeInfo = async (userId, employeeName) => {
    try {
      const leaveHistoryResponse = await api.get(`/leaves/${userId}`)
      let leaveHistory = []
      if (Array.isArray(leaveHistoryResponse.data)) {
        leaveHistory = leaveHistoryResponse.data
      } else if (Array.isArray(leaveHistoryResponse.data?.leaveRequests)) {
        leaveHistory = leaveHistoryResponse.data.leaveRequests
      } else if (leaveHistoryResponse.data) {
        leaveHistory = [leaveHistoryResponse.data]
      }

      const department = leaveHistory.length > 0 ? leaveHistory[0].department : 'Unknown'

      setSelectedEmployee({
        name: employeeName,
        department: department,
        leaveHistory: leaveHistory,
      })

      setEmployeeModalVisible(true)
    } catch (error) {
      console.error('Error fetching employee info:', error)
      setSelectedEmployee({
        name: employeeName,
        department: 'Unknown',
        leaveHistory: [],
      })
      setEmployeeModalVisible(true)
    }
  }

  const fetchLeaveDetails = async (id) => {
    try {
      const response = await api.get(`/leave-requests/${id}`)
      if (response.data.leaveRequests && response.data.leaveRequests.length > 0) {
        setSelectedLeave(response.data.leaveRequests[0])
      } else {
        setSelectedLeave(null)
      }
      setLeaveModalVisible(true)
    } catch (error) {
      console.error('Error fetching leave details:', error)
    }
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const month = start.getMonth() + 1
    const startDay = start.getDate()
    const endDay = end.getDate()
    const year = start.getFullYear().toString().slice(-2)

    return `${month}/${startDay}-${endDay}/${year}`
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  return (
    <CContainer fluid>
      <CRow className="mb-4 g-4">
        <CCol xs={12} md={6} lg={3}>
          <CCard className="h-100 border-top-3 border-top-success">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="fs-2 text-success bg-success bg-opacity-10 p-3 rounded-circle">
                  <FontAwesomeIcon icon={faCheckCircle} fixedWidth />
                </div>
              </div>
              <div>
                <div className="text-medium-emphasis small">Approved</div>
                <div className="fs-4 fw-semibold">{statusCounts.approved}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="h-100 border-top-3 border-top-warning">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="fs-2 text-warning bg-warning bg-opacity-10 p-3 rounded-circle">
                  <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
                </div>
              </div>
              <div>
                <div className="text-medium-emphasis small">Pending</div>
                <div className="fs-4 fw-semibold">{statusCounts.pending}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="h-100 border-top-3 border-top-danger">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="fs-2 text-danger bg-danger bg-opacity-10 p-3 rounded-circle">
                  <FontAwesomeIcon icon={faTimesCircle} fixedWidth />
                </div>
              </div>
              <div>
                <div className="text-medium-emphasis small">Rejected</div>
                <div className="fs-4 fw-semibold">{statusCounts.rejected}</div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CCard className="h-100 border-top-3 border-top-info">
            <CCardBody className="d-flex align-items-center">
              <div className="me-3">
                <div className="fs-2 text-info bg-info bg-opacity-10 p-3 rounded-circle">
                  <FontAwesomeIcon icon={faCalendar} fixedWidth />
                </div>
              </div>
              <div>
                <div className="text-medium-emphasis small">Total Leaves</div>
                <div className="fs-4 fw-semibold">
                  {statusCounts.approved + statusCounts.pending + statusCounts.rejected}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Leave List</strong>
          <div className="d-flex gap-2 flex-wrap">
            <CButton
              color="secondary"
              onClick={() => setCalendarModalVisible(true)}
              className="me-2"
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
            </CButton>
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: '120px', marginRight: '10px' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px', marginRight: '10px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CInputGroup style={{ width: '150px' }}>
              <CFormInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <CInputGroupText color="primary">
                <FontAwesomeIcon icon={faSearch} />
              </CInputGroupText>
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
              <p>No leave request found.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Employee</CTableHeaderCell>
                      <CTableHeaderCell>Date Requested</CTableHeaderCell>
                      <CTableHeaderCell>Leave Type</CTableHeaderCell>
                      <CTableHeaderCell>Days</CTableHeaderCell>
                      <CTableHeaderCell>Admin Status</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredLeave.map((leave, index) => (
                      <CTableRow
                        key={leave.id}
                        onClick={(e) => {
                          if (
                            !e.target.closest('.dropdown') &&
                            !e.target.closest('.dropdown-toggle') &&
                            !e.target.closest('.dropdown-menu')
                          ) {
                            fetchLeaveDetails(leave.id)
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                        className="hover-row"
                      >
                        <CTableDataCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell>{leave.name}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(leave.updated_at).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>{leave.leave_type}</CTableDataCell>
                        <CTableDataCell>{leave.total_days}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(leave.status)}>{leave.status}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getBadgeColor(leave.leave_status)}>
                            {leave.leave_status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              fetchEmployeeInfo(leave.user_id, leave.name)
                            }}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </CButton>
                          <CDropdown className="d-inline ms-1">
                            <CDropdownToggle color="secondary" size="sm">
                              <FontAwesomeIcon icon={faChevronDown} />
                            </CDropdownToggle>
                            <CDropdownMenu onClick={(e) => e.stopPropagation()}>
                              <CDropdownItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLeaveStatus(leave.id, 'Approved')
                                }}
                                disabled={leave.leave_status === 'Approved'}
                              >
                                Approved
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLeaveStatus(leave.id, 'Rejected')
                                }}
                                disabled={leave.leave_status === 'Rejected'}
                              >
                                Rejected
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLeaveStatus(leave.id, 'Pending')
                                }}
                                disabled={leave.leave_status === 'Pending'}
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
              </div>

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

        <CModal
          visible={employeeModalVisible}
          onClose={() => setEmployeeModalVisible(false)}
          size="lg"
          scrollable
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle>Employee Information</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedEmployee ? (
              <>
                <div className="mb-3">
                  <p>
                    <strong>Name:</strong> {selectedEmployee.name}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                  <p className="mb-3">
                    <strong>Leave History:</strong>
                  </p>

                  {selectedEmployee.leaveHistory && selectedEmployee.leaveHistory.length > 0 ? (
                    <div className="table-responsive">
                      <CTable hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>#</CTableHeaderCell>
                            <CTableHeaderCell>Leave Type</CTableHeaderCell>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Days</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {selectedEmployee.leaveHistory.map((history, index) => (
                            <CTableRow
                              key={history.id || index}
                              onClick={() => history.id && fetchLeaveDetails(history.id)}
                              style={{ cursor: history.id ? 'pointer' : 'default' }}
                              className={history.id ? 'hover-row' : ''}
                            >
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{history.leave_type || 'N/A'}</CTableDataCell>
                              <CTableDataCell>
                                {history.start_date && history.end_date
                                  ? formatDateRange(history.start_date, history.end_date)
                                  : 'N/A'}
                              </CTableDataCell>
                              <CTableDataCell>{history.total_days || 'N/A'}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={getBadgeColor(history.status)}>
                                  {history.status || 'N/A'}
                                </CBadge>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </div>
                  ) : (
                    <p>No leave history found for this employee.</p>
                  )}
                </div>
              </>
            ) : (
              <p>No employee data found.</p>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setEmployeeModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal
          visible={calendarModalVisible}
          onClose={() => setCalendarModalVisible(false)}
          size="xl"
          fullscreen="lg"
        >
          <CModalHeader closeButton>
            <CModalTitle>Leave Calendar</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <LeaveCalendar />
          </CModalBody>
        </CModal>

        <CModal visible={leaveModalVisible} onClose={() => setLeaveModalVisible(false)}>
          <CModalHeader closeButton>
            <CModalTitle>Leave Request Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedLeave ? (
              <>
                <div className="mb-4">
                  <p>
                    <strong>Employee:</strong> {selectedLeave.name}
                  </p>
                  <p>
                    <strong>Leave Type:</strong> {selectedLeave.leave_type}
                  </p>
                  <p>
                    <strong>Duration:</strong>{' '}
                    {new Date(selectedLeave.start_date).toLocaleDateString()} -{' '}
                    {new Date(selectedLeave.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Days:</strong> {selectedLeave.total_days}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <CBadge color={getBadgeColor(selectedLeave.status)}>
                      {selectedLeave.status}
                    </CBadge>
                  </p>
                  <p>
                    <strong>Reason:</strong> {selectedLeave.reason}
                  </p>
                  <div className="col-12 mt-3">
                    <p>
                      <strong>Documents:</strong>
                    </p>
                    {formatDocuments(selectedLeave.document_path).length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {formatDocuments(selectedLeave.document_path).map((doc, index) => {
                          const docName = doc.split('/').pop()
                          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(docName)
                          return (
                            <a
                              key={index}
                              href={`http://localhost:8000/storage/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border p-2 rounded d-block text-decoration-none"
                            >
                              {isImage ? (
                                <img
                                  src={`http://localhost:8000/storage/${doc}`}
                                  alt={`Document ${index + 1}`}
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                                  className="img-thumbnail"
                                />
                              ) : (
                                docName
                              )}
                            </a>
                          )
                        })}
                      </div>
                    ) : (
                      <p>No documents attached</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>No leave details found.</p>
            )}
          </CModalBody>
        </CModal>
      </CCard>
    </CContainer>
  )
}

export default List
