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
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
} from '@coreui/react'
import api from '../../util/api'
import LeaveCalendar from './LeaveCalendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faInfoCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const List = () => {
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
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Leave List</strong>
        <div className="d-flex gap-2 flex-wrap">
          <CButton color="secondary" onClick={() => setCalendarModalVisible(true)} className="me-2">
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
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredLeave.map((leave, index) => (
                    <CTableRow
                      key={leave.id}
                      onClick={() => fetchLeaveDetails(leave.id)}
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
                <p>
                  <strong>Documents:</strong>
                </p>
                {selectedLeave.document_path ? (
                  Array.isArray(selectedLeave.document_path) ? (
                    selectedLeave.document_path.length > 0 ? (
                      <ul className="list-unstyled">
                        {selectedLeave.document_path.map((file, index) => {
                          const fileUrl = `https://hr3.axleshift.com/storage/${file}`
                          const fileName = file.split('/').pop()

                          return (
                            <li key={index} className="mb-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <i className="far fa-file me-2"></i>
                                {fileName}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p>No documents uploaded</p>
                    )
                  ) : (
                    <ul className="list-unstyled">
                      <li>
                        {typeof selectedLeave.document_path === 'string' && (
                          <a
                            href={`https://hr3.axleshift.com/storage/${selectedLeave.document_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <i className="far fa-file me-2"></i>
                            {selectedLeave.document_path.split('/').pop()}
                          </a>
                        )}
                      </li>
                    </ul>
                  )
                ) : (
                  <p>No documents uploaded</p>
                )}
              </div>
            </>
          ) : (
            <p>No leave details found.</p>
          )}
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default List
