import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CTableFoot,
  CButton,
  CFormLabel,
  CSpinner,
  CAlert,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const Report = () => {
  const [payroll, setPayroll] = useState([])
  const [filteredPayroll, setFilteredPayroll] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [departments, setDepartments] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)
  const statusOptions = ['all', 'Pending', 'Paid']

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get(`/payrolls/filter`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
          period: selectedPeriod !== 'all' ? selectedPeriod : undefined,
          department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchTerm || undefined,
        },
      })

      // 🛡 Safe data extraction with fallback
      let payrollData = response?.data
      if (payrollData?.data && Array.isArray(payrollData.data)) {
        payrollData = payrollData.data
      } else if (!Array.isArray(payrollData)) {
        console.error('Unexpected response format:', response.data)
        throw new Error('Invalid payroll data format received from server')
      }

      setPayroll(payrollData)
      setFilteredPayroll(payrollData)

      // Extract unique departments
      const uniqueDepartments = [...new Set(payrollData.map((item) => item.department))]
      setDepartments(uniqueDepartments)
    } catch (err) {
      console.error('Error fetching payroll data:', err)
      setError(err.response?.data?.message || err.message || 'Failed to fetch payroll data')
      setPayroll([])
      setFilteredPayroll([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrollData()
  }, [selectedYear, selectedMonth, selectedPeriod, selectedDepartment, selectedStatus, searchTerm])

  useEffect(() => {
    // Apply search filter
    if (searchTerm) {
      const filtered = payroll.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employee_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPayroll(filtered)
    } else {
      setFilteredPayroll(payroll)
    }
  }, [searchTerm, payroll])

  const calculateTotalNetSalary = () => {
    return filteredPayroll.reduce(
      (total, payroll) => total + parseFloat(payroll.net_salary || 0),
      0,
    )
  }

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    })
  }

  const groupByDepartment = (payrollData) => {
    return payrollData.reduce((acc, payroll) => {
      const department = payroll.department || 'Unassigned'
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(payroll)
      return acc
    }, {})
  }

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true)
      setError(null)

      const params = {
        year: selectedYear,
        month: selectedMonth,
      }

      if (selectedPeriod !== 'all') params.period = selectedPeriod
      if (selectedDepartment !== 'all') params.department = selectedDepartment

      const response = await api.get(`/payroll/download-report`, {
        params,
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `payroll-report-${selectedYear}-${selectedMonth}${
          selectedDepartment !== 'all' ? `-${selectedDepartment}` : ''
        }.pdf`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download error:', error)
      setError(error.response?.data?.message || 'Failed to generate PDF report')
    } finally {
      setPdfLoading(false)
    }
  }

  const formatDateRange = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} - 
            ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })}`
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const departmentHeaderStyle = {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    fontSize: '1.1em',
    padding: '10px',
  }

  const departmentTotalStyle = {
    backgroundColor: '#e9ecef',
    fontWeight: 'bold',
  }

  const getPeriodValue = () => {
    if (selectedPeriod === 'first') return 1
    if (selectedPeriod === 'second') return 2
    return undefined
  }

  const formatDateRangeForAllPeriods = (payrollList) => {
    if (!payrollList.length) return 'N/A'
    const startDates = payrollList.map((p) => new Date(p.start_date))
    const endDates = payrollList.map((p) => new Date(p.end_date))
    const minStart = new Date(Math.min(...startDates))
    const maxEnd = new Date(Math.max(...endDates))

    return `${minStart.getDate()} ${minStart.toLocaleString('default', { month: 'short' })} - ${maxEnd.getDate()} ${maxEnd.toLocaleString('default', { month: 'short' })}`
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Payroll Report</strong>
          <div className="mb-3">
            <strong>
              Period:{' '}
              {selectedPeriod === 'all'
                ? `All Periods (${formatDateRangeForAllPeriods(filteredPayroll)})`
                : selectedPeriod === 'first'
                  ? 'First Half'
                  : 'Second Half'}{' '}
              | Month:{' '}
              {new Date(2023, selectedMonth - 1).toLocaleString('default', { month: 'long' })} |
              Year: {selectedYear}
            </strong>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CInputGroup>
              <CInputGroupText>
                <FontAwesomeIcon icon={faSearch} />
              </CInputGroupText>
              <CFormInput
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CInputGroup>

            <CDropdown autoClose="outside">
              <CDropdownToggle color="secondary">
                <FontAwesomeIcon icon={faFilter} /> Filters
              </CDropdownToggle>
              <CDropdownMenu>
                <div className="p-2">
                  <div
                    className="mb-2"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <CFormLabel>Period</CFormLabel>
                    <CFormSelect
                      value={selectedPeriod}
                      onChange={(e) => {
                        e.stopPropagation()
                        setSelectedPeriod(e.target.value)
                      }}
                      disabled={loading}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All Periods</option>
                      <option value="1">First Half</option>
                      <option value="2">2nd Half</option>
                    </CFormSelect>
                  </div>

                  <div className="mb-2">
                    <CFormLabel>Month</CFormLabel>
                    <CFormSelect
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      disabled={loading}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="mb-2">
                    <CFormLabel>Year</CFormLabel>
                    <CFormSelect
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      disabled={loading}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="mb-2">
                    <CFormLabel>Department</CFormLabel>
                    <CFormSelect
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      disabled={loading}
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  {/* <div className="mb-2">
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={loading}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                  </div> */}
                </div>
              </CDropdownMenu>
            </CDropdown>

            <CButton
              color="primary"
              onClick={handleDownloadPDF}
              disabled={pdfLoading || loading || filteredPayroll.length === 0}
            >
              {pdfLoading ? <CSpinner size="sm" /> : <FontAwesomeIcon icon={faFilePdf} />}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <CSpinner />
              <p>Loading payroll data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Employee ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Base Salary</CTableHeaderCell>
                    <CTableHeaderCell>Overtime</CTableHeaderCell>
                    <CTableHeaderCell>Bonus</CTableHeaderCell>
                    <CTableHeaderCell>Benefits</CTableHeaderCell>
                    <CTableHeaderCell>Deductions</CTableHeaderCell>
                    <CTableHeaderCell>Net Salary</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Pay Period</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPayroll.length > 0 ? (
                    Object.entries(groupByDepartment(filteredPayroll)).map(
                      ([department, employees], deptIndex) => (
                        <React.Fragment key={department}>
                          <CTableRow>
                            <CTableDataCell colSpan="11" style={departmentHeaderStyle}>
                              {department} -{' '}
                              {formatDateRange(employees[0].start_date, employees[0].end_date)}
                            </CTableDataCell>
                          </CTableRow>
                          {employees.map((employee, empIndex) => (
                            <CTableRow key={`${employee.id}-${empIndex}`}>
                              <CTableDataCell>{employee.employee_id || 'N/A'}</CTableDataCell>
                              <CTableDataCell>{employee.name || 'N/A'}</CTableDataCell>
                              <CTableDataCell>{employee.department || 'N/A'}</CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.base_salary)}
                              </CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.total_overtime_amount)}
                              </CTableDataCell>
                              <CTableDataCell>{formatCurrency(employee.bonus)}</CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.benefits_total)}
                              </CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.total_deductions || employee.tax)}
                              </CTableDataCell>
                              <CTableDataCell>{formatCurrency(employee.net_salary)}</CTableDataCell>
                              <CTableDataCell>
                                <CBadge color={getStatusBadge(employee.status)}>
                                  {employee.status || 'Pending'}
                                </CBadge>
                              </CTableDataCell>
                              <CTableDataCell>
                                {employee.period === 1 ? '1st Half' : '2nd Half'}
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                          <CTableRow style={departmentTotalStyle}>
                            <CTableDataCell colSpan="8" className="text-center">
                              <strong>Department Total</strong>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <strong>
                                {formatCurrency(
                                  employees.reduce(
                                    (total, emp) => total + parseFloat(emp.net_salary || 0),
                                    0,
                                  ),
                                )}
                              </strong>
                            </CTableDataCell>
                            <CTableDataCell colSpan="2"></CTableDataCell>
                          </CTableRow>
                          {deptIndex <
                            Object.keys(groupByDepartment(filteredPayroll)).length - 1 && (
                            <CTableRow>
                              <CTableDataCell colSpan="11" style={{ padding: '10px' }}>
                                <hr style={{ borderTop: '1px solid #ddd' }} />
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </React.Fragment>
                      ),
                    )
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="11" className="text-center py-4">
                        {error
                          ? 'Error loading data'
                          : 'No payroll data available for selected filters'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
                {filteredPayroll.length > 0 && (
                  <CTableFoot>
                    <CTableRow style={{ backgroundColor: '#dee2e6' }}>
                      <CTableHeaderCell colSpan="8" className="text-center">
                        <strong>Grand Total</strong>
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        <strong>{formatCurrency(calculateTotalNetSalary())}</strong>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan="2"></CTableHeaderCell>
                    </CTableRow>
                  </CTableFoot>
                )}
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Report
