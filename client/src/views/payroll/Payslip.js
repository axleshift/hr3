import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CBadge,
  CAlert,
  CSpinner,
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CToaster,
  CToast,
  CToastHeader,
  CFormLabel,
  CToastBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFile,
  faChevronDown,
  faPaperPlane,
  faEnvelope,
  faSearch,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'

const Payslip = () => {
  const [allPayslips, setAllPayslips] = useState([]) // Store all payslips
  const [filteredPayslips, setFilteredPayslips] = useState([]) // Store filtered payslips
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )
  const [toast, setToast] = useState(0)
  const toaster = React.useRef()
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    status: 'all',
  })
  const [departments, setDepartments] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const fetchPayslips = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/payslips`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })

      // Store all payslips
      setAllPayslips(response.data)

      // Apply month/year filter immediately
      const filtered = response.data.filter(
        (payslip) => payslip.month == selectedMonth && payslip.year == selectedYear,
      )

      setFilteredPayslips(filtered)

      // Get unique departments
      const uniqueDepartments = [...new Set(filtered.map((item) => item.department))]
      setDepartments(uniqueDepartments)
    } catch (err) {
      console.error('Error fetching payslips:', err)
      setError('Failed to fetch payslips')
      setAllPayslips([])
      setFilteredPayslips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
      month: 'long',
    })
    setMonthName(monthName)
  }, [selectedMonth, selectedYear])

  // Apply all filters
  useEffect(() => {
    let filtered = [...allPayslips]

    // First apply month/year filter
    filtered = filtered.filter(
      (payslip) => payslip.month == selectedMonth && payslip.year == selectedYear,
    )

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.employee_id.toString().includes(searchTerm),
      )
    }

    // Department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter((item) => item.department === filters.department)
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(
        (item) => (item.status || 'Pending').toLowerCase() === filters.status.toLowerCase(),
      )
    }

    setFilteredPayslips(filtered)
  }, [filters, allPayslips, selectedMonth, selectedYear])

  const handleReleasePayslips = async () => {
    try {
      setLoading(true)
      const response = await api.post('/payslip/release', {
        month: selectedMonth,
        year: selectedYear,
      })

      setToast(
        <CToast title="Success" color="success">
          <CToastHeader closeButton>
            <strong className="me-auto">Success</strong>
          </CToastHeader>
          <CToastBody>
            {response.data.count > 0
              ? `Successfully released ${response.data.count} payslips`
              : response.data.message}
          </CToastBody>
        </CToast>,
      )
      setTimeout(() => setToast(0), 3000)

      // Refresh data
      await fetchPayslips()
    } catch (error) {
      console.error('Error releasing payslips:', error)
      setToast(
        <CToast title="Error" color="danger">
          <CToastHeader closeButton>
            <strong className="me-auto">Error</strong>
          </CToastHeader>
          <CToastBody>{error.response?.data?.message || 'Failed to release payslips'}</CToastBody>
        </CToast>,
      )
      setTimeout(() => setToast(0), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSendPayslip = async (payslipId) => {
    try {
      setLoading(true)
      const response = await api.post(`/payslips/send/${payslipId}`)

      setToast(
        <CToast title="Success" color="success">
          <CToastHeader closeButton>
            <strong className="me-auto">Success</strong>
          </CToastHeader>
          <CToastBody>Payslip sent successfully</CToastBody>
        </CToast>,
      )
      setTimeout(() => setToast(0), 3000)

      await fetchPayslips()
    } catch (error) {
      console.error('Error sending payslip:', error)
      setToast(
        <CToast title="Error" color="danger">
          <CToastHeader closeButton>
            <strong className="me-auto">Error</strong>
          </CToastHeader>
          <CToastBody>{error.response?.data?.message || 'Failed to send payslip'}</CToastBody>
        </CToast>,
      )
      setTimeout(() => setToast(0), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (payslipId, newStatus) => {
    try {
      await api.put(`/payslips/${payslipId}`, { status: newStatus })
      await fetchPayslips()
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update payslip status')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not sent yet'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
    } catch (e) {
      return 'Invalid Date'
    }
  }

  const getStatusBadge = (status) => {
    const statusValue = (status || 'pending').toLowerCase()
    switch (statusValue) {
      case 'pending':
        return 'warning'
      case 'paid':
        return 'success'
      case 'sent':
      case 'generated':
        return 'primary'
      default:
        return 'secondary'
    }
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const statusOptions = ['all', 'Pending', 'Paid', 'Generated', 'Sent']

  return (
    <CContainer fluid>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <strong>Payslip Management</strong>
            <div className="small text-muted">
              {monthName} {selectedYear}
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: '120px' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </CFormSelect>
            {/* <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: '100px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect> */}

            <CInputGroup>
              <CInputGroupText>
                <FontAwesomeIcon icon={faSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search by name or ID"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </CInputGroup>

            {/* <CDropdown
              autoClose="outside"
              onToggle={(show) => setShowFilters(show)}
              show={showFilters}
            >
              <CDropdownToggle color="secondary">
                <FontAwesomeIcon icon={faFilter} className="me-1" />
                Filters
              </CDropdownToggle>
              <CDropdownMenu>
                <div className="p-3" style={{ minWidth: '250px' }}>
                  <div className="mb-3">
                    <CFormLabel>Department</CFormLabel>
                    <CFormSelect
                      value={filters.department}
                      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                  <div className="mb-3">
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </div>
              </CDropdownMenu>
            </CDropdown> */}

            <CButton color="primary" onClick={handleReleasePayslips} disabled={loading}>
              {loading ? (
                <CSpinner size="sm" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Release Payslips
                </>
              )}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          {loading && filteredPayslips.length === 0 ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : filteredPayslips.length === 0 ? (
            <div className="text-center py-5">
              <p>
                No payslips found for {monthName} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Employee</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Position</CTableHeaderCell>
                    <CTableHeaderCell>Net Salary</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Issued At</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPayslips.map((payslip, index) => (
                    <CTableRow key={payslip.employee_id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div>{payslip.name}</div>
                        <small className="text-muted">ID: {payslip.employee_id}</small>
                      </CTableDataCell>
                      <CTableDataCell>{payslip.department}</CTableDataCell>
                      <CTableDataCell>{payslip.job_position}</CTableDataCell>
                      <CTableDataCell>
                        {new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP',
                        }).format(payslip.net_salary || 0)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(payslip.status)}>
                          {payslip.status || 'Pending'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(payslip.issued_at)}</CTableDataCell>
                      <CTableDataCell>
                        <CDropdown>
                          <CDropdownToggle color="secondary" size="sm">
                            <FontAwesomeIcon icon={faChevronDown} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={() => handleSendPayslip(payslip.id)}
                              disabled={!payslip.id}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                              Send Email
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => handleStatusChange(payslip.id, 'Paid')}
                              disabled={payslip.status === 'Paid'}
                            >
                              Mark as Paid
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => handleStatusChange(payslip.id, 'Pending')}
                              disabled={payslip.status === 'Pending'}
                            >
                              Mark as Pending
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Payslip

// <!DOCTYPE html>
// <html>
// <head>
//     <title>Your Payslip</title>
//     <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; }
//         .header { text-align: center; margin-bottom: 20px; }
//         .details { margin-bottom: 20px; }
//         .footer { margin-top: 30px; font-size: 0.9em; color: #666; }
//     </style>
// </head>
// <body>
//     <div class="header">
//         <h2>{{ config('app.name') }}</h2>
//         <h3>Payslip for {{ date('F Y', mktime(0, 0, 0, $payslip->month, 1, $payslip->year)) }}</h3>
//     </div>

//     <div class="details">
//         <p><strong>Employee:</strong> {{ $payslip->name }}</p>
//         <p><strong>Employee ID:</strong> {{ $payslip->employee_id }}</p>
//         <p><strong>Department:</strong> {{ $payslip->department }}</p>
//         <p><strong>Position:</strong> {{ $payslip->job_position }}</p>
//         <p><strong>Pay Period:</strong>
//             {{ \Carbon\Carbon::parse($payslip->start_date)->format('M d, Y') }} -
//             {{ \Carbon\Carbon::parse($payslip->end_date)->format('M d, Y') }}
//         </p>
//     </div>

//     <p>Please find attached your payslip for the above period.</p>

//     <div class="footer">
//         <p>This is an automated message. Please do not reply directly to this email.</p>
//         <p>If you have any questions about your payslip, please contact HR.</p>
//     </div>
// </body>
// </html>
