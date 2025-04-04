import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
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
  CSpinner,
  CFormSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CFormInput,
  CModalFooter,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCol,
  CRow,
  CAlert,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import api from '../../util/api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  faFile,
  faChevronDown,
  faMoneyBill,
  faClock,
  faGift,
  faCalendarAlt,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Payroll = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [departments, setDepartments] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [overtimeRate, setOvertimeRate] = useState('')
  const [bonusModalVisible, setBonusModalVisible] = useState(false)
  const [bonus, setBonus] = useState(0)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [salaryModalVisible, setSalaryModalVisible] = useState(false)
  const [jobPosition, setJobPosition] = useState('')
  const [monthlyRate, setMonthlyRate] = useState('')
  const [validationError, setValidationError] = useState('')
  const [jobPositions, setJobPositions] = useState([])
  const [employeeBenefits, setEmployeeBenefits] = useState([])
  const [error, setError] = useState(null)
  const [payslipModalVisible, setPayslipModalVisible] = useState(false)
  const [hasAttendanceData, setHasAttendanceData] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [attendanceDetails, setAttendanceDetails] = useState([])
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false)
  const [workingDays, setWorkingDays] = useState(0)
  const [presetRanges, setPresetRanges] = useState([])
  const [selectedPreset, setSelectedPreset] = useState('')
  const [computationModalVisible, setComputationModalVisible] = useState(false)
  const [selectedEmployeeComputation, setSelectedEmployeeComputation] = useState(null)

  useEffect(() => {
    const today = new Date()
    const currentYear = today.getFullYear()

    const ranges = [
      {
        label: 'Custom',
        value: 'custom',
        getRange: () => [null, null],
      },
      {
        label: 'Last Month',
        value: 'last_month',
        getRange: () => {
          const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const lastDay = new Date(today.getFullYear(), today.getMonth(), 0)
          return [firstDay, lastDay]
        },
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        label: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' }),
        value: `month_${i + 1}`,
        getRange: () => {
          const firstDay = new Date(currentYear, i, 1)
          const lastDay = new Date(currentYear, i + 1, 0)
          return [firstDay, lastDay]
        },
      })),
    ]

    setPresetRanges(ranges)
    setSelectedPreset('custom')
  }, [])

  useEffect(() => {
    if (selectedPreset && presetRanges.length > 0) {
      const selectedRange = presetRanges.find((r) => r.value === selectedPreset)
      if (selectedRange) {
        const [start, end] = selectedRange.getRange()
        setDateRange([start, end])

        // Reset employees when changing periods
        setEmployees([])
        setHasAttendanceData(false)

        if (selectedPreset !== 'custom') {
          fetchPayrollDataForMonth(start, end)
        }
      }
    }
  }, [selectedPreset])

  const fetchPayrollDataForMonth = async (start, end) => {
    try {
      setLoading(true)
      setError(null)

      if (!start || !end) {
        setError('Invalid date range selected')
        setLoading(false)
        return
      }

      const response = await api.get('/payrolls', {
        params: {
          year: start.getFullYear(),
          month: start.getMonth() + 1,
        },
      })

      const groupedData = response.data.reduce((acc, payroll) => {
        if (!acc[payroll.employee_id]) {
          acc[payroll.employee_id] = {
            employee_id: payroll.employee_id,
            name: payroll.name,
            department: payroll.department,
            job_position: payroll.job_position,
            payrolls: [],
          }
        }
        acc[payroll.employee_id].payrolls.push(payroll)
        return acc
      }, {})

      setEmployees(Object.values(groupedData))
      setHasAttendanceData(response.data.length > 0)

      const uniqueDepartments = [...new Set(response.data.map((p) => p.department))]
      setDepartments(uniqueDepartments)
    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.message || 'Failed to fetch payroll data')
      setHasAttendanceData(false)
    } finally {
      setLoading(false)
    }
  }

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions')
      setJobPositions(response.data)
    } catch (error) {
      console.error('Error fetching job positions:', error)
      setError('Failed to fetch job positions')
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/employee/departments')
      setDepartments(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching departments:', error)
      setError('Failed to fetch departments')
      setDepartments([])
    }
  }

  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 0

    let count = 0
    const current = new Date(start)
    const last = new Date(end)

    while (current <= last) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }

    return count
  }

  // const fetchPayrollData = async () => {
  //   try {
  //     setLoading(true)
  //     setHasAttendanceData(false)
  //     setError(null)

  //     if (!startDate || !endDate) {
  //       setError('Please select a date range')
  //       setLoading(false)
  //       return
  //     }

  //     const params = {
  //       start_date: startDate.toISOString().split('T')[0],
  //       end_date: endDate.toISOString().split('T')[0],
  //       calculate: selectedPreset === 'custom',
  //     }

  //     const response = await api.get('/payrolls', { params })

  //     // Debugging: Log the response
  //     console.log('Payroll API Response:', response.data)

  //     // Handle case where response.data is the array directly
  //     const payrollData = Array.isArray(response.data) ? response.data : response.data.data || [] // Also check for Laravel's default wrapped response

  //     if (payrollData.length === 0) {
  //       setHasAttendanceData(false)
  //       setLoading(false)
  //       return
  //     }

  //     const groupedData = payrollData.reduce((acc, payroll) => {
  //       if (!acc[payroll.employee_id]) {
  //         acc[payroll.employee_id] = {
  //           employee_id: payroll.employee_id,
  //           name: payroll.name,
  //           department: payroll.department,
  //           job_position: payroll.job_position,
  //           payrolls: [],
  //         }
  //       }
  //       acc[payroll.employee_id].payrolls.push(payroll)
  //       return acc
  //     }, {})

  //     setEmployees(Object.values(groupedData))
  //     setHasAttendanceData(payrollData.length > 0)

  //     const uniqueDepartments = [...new Set(payrollData.map((emp) => emp.department))]
  //     setDepartments(uniqueDepartments)
  //   } catch (error) {
  //     console.error('Error:', error)
  //     setError(error.response?.data?.message || 'Failed to fetch payroll data')
  //     setHasAttendanceData(false)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!startDate || !endDate) {
        setError('Please select a date range')
        return
      }

      if (startDate > endDate) {
        setError('End date must be after start date')
        return
      }

      const params = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        calculate: selectedPreset === 'custom',
      }

      console.log('Making request with params:', params)

      const response = await api.get('/payrolls', { params })

      if (!response.data || response.data.length === 0) {
        setHasAttendanceData(false)
        return
      }

      // Process response data...
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      })

      setError(error.response?.data?.message || 'Failed to fetch payroll data')
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (employee, e) => {
    if (
      e.target.closest('.dropdown') ||
      e.target.closest('.dropdown-toggle') ||
      e.target.closest('.dropdown-menu')
    ) {
      return
    }
    setSelectedEmployeeComputation(employee)
    setComputationModalVisible(true)
  }

  const handleCustomDateChange = (update) => {
    const [start, end] = update
    setDateRange([start, end])
    setSelectedPreset('custom')

    if (start && end) {
      setEmployees([])
      setHasAttendanceData(false)
      fetchPayrollData()
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      setWorkingDays(calculateWorkingDays(startDate, endDate))
      if (selectedPreset === 'custom') {
        fetchPayrollData()
      }
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchDepartments()
    fetchJobPositions()
  }, [])

  useEffect(() => {
    if (selectedDepartment === 'all') {
      setFilteredEmployees(employees)
    } else {
      setFilteredEmployees(employees.filter((emp) => emp.department === selectedDepartment))
    }
  }, [selectedDepartment, employees])

  const handleSaveSalary = async () => {
    if (!jobPosition || !monthlyRate) {
      setValidationError('All fields are required')
      return
    }

    try {
      await api.post('/payrolls', {
        job_position: jobPosition,
        monthly_rate: parseFloat(monthlyRate),
      })
      setSalaryModalVisible(false)
      setValidationError('')
      setJobPosition('')
      setMonthlyRate('')
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving salary:', error)
      setValidationError(error.response?.data?.message || 'Failed to save salary')
    }
  }

  const fetchRates = async () => {
    try {
      const response = await api.get('/rates')
      setOvertimeRate(response.data.overtime_rate || '')
    } catch (error) {
      console.error('Error fetching rates:', error)
      setValidationError('Failed to fetch overtime rate')
    }
  }

  useEffect(() => {
    if (modalVisible) fetchRates()
  }, [modalVisible])

  const handleSaveRates = async () => {
    if (!overtimeRate) {
      setValidationError('Overtime rate is required')
      return
    }
    try {
      await api.put(`/rates/overtime`, { rate: parseFloat(overtimeRate) })
      setModalVisible(false)
      setValidationError('')
      fetchPayrollData()
    } catch (error) {
      setValidationError(error.response?.data?.message || 'Failed to save overtime rate')
    }
  }

  const fetchAttendanceDetails = async (employeeId) => {
    try {
      setLoading(true)
      const params = {
        employee_id: employeeId,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      }

      const response = await api.get('/attendances', { params })
      setAttendanceDetails(response.data)
      setShowAttendanceDetails(!showAttendanceDetails)
    } catch (error) {
      console.error('Error fetching attendance details:', error)
      setError('Failed to fetch attendance details')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewPayslip = async (payroll) => {
    try {
      setSelectedEmployee(payroll)
      const response = await api.get('/benefits', {
        params: {
          employee_id: payroll.employee_id,
          start_date: payroll.start_date,
          end_date: payroll.end_date,
        },
      })
      setEmployeeBenefits(response.data.benefits || [])
      setPayslipModalVisible(true)
    } catch (error) {
      console.error('Error fetching benefits:', error)
      setError('Failed to fetch benefits data')
    }
  }

  const handleStatus = async (id, newStatus) => {
    try {
      await api.put(`/payrolls/${id}`, { status: newStatus })
      fetchPayrollData()
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update payroll status')
    }
  }

  const handleBonus = async () => {
    try {
      await api.post('/bonus', {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        bonus: parseFloat(bonus),
      })
      setBonusModalVisible(false)
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving bonus:', error)
      setError('Failed to save bonus')
    }
  }

  const getStatusBadge = (status) => {
    const statusValue = status?.toLowerCase() || 'pending'
    switch (statusValue) {
      case 'pending':
        return 'warning'
      case 'paid':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'No date range selected'

    if (selectedPreset.startsWith('month_')) {
      return startDate.toLocaleString('default', { month: 'long', year: 'numeric' })
    }
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`
  }

  const handleRefresh = () => {
    setError(null)
    fetchPayrollData()
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong>Employee Payroll</strong>
            {startDate && endDate && (
              <div className="text-muted small mt-1">{workingDays} working days</div>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CInputGroup>
              <CInputGroupText>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </CInputGroupText>
              <CFormSelect
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                {presetRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </CFormSelect>
            </CInputGroup>

            {selectedPreset === 'custom' && (
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleCustomDateChange}
                isClearable
                placeholderText="Select date range"
                className="form-control"
                dateFormat="yyyy-MM-dd"
                minDate={new Date(2020, 0, 1)}
                maxDate={new Date()}
                onCalendarClose={() => {
                  if (startDate && endDate) {
                    fetchPayrollData()
                  }
                }}
              />
            )}

            <CFormSelect
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </CFormSelect>

            <CButton
              color="primary"
              onClick={() => setModalVisible(true)}
              title="Set Overtime Rate"
            >
              <FontAwesomeIcon icon={faClock} />
            </CButton>

            <CButton color="primary" onClick={() => setBonusModalVisible(true)} title="Set Bonus">
              <FontAwesomeIcon icon={faGift} />
            </CButton>

            <CButton
              color="info"
              onClick={() => setSalaryModalVisible(true)}
              title="Manage Salaries"
            >
              <FontAwesomeIcon icon={faMoneyBill} />
            </CButton>

            <CButton color="secondary" onClick={handleRefresh} title="Refresh Data">
              <FontAwesomeIcon icon={faSyncAlt} />
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading payroll data...</p>
            </div>
          ) : error ? (
            <CAlert color="danger" className="text-center">
              <h5>Error loading data</h5>
              <p>{error}</p>
              <CButton color="primary" size="sm" onClick={fetchPayrollData}>
                Retry
              </CButton>
            </CAlert>
          ) : employees.length === 0 ? ( // Changed from hasAttendanceData
            <div className="text-center py-5">
              <p>No payroll records found for the selected date range</p>
              <CButton color="primary" onClick={fetchPayrollData}>
                Refresh
              </CButton>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    {' '}
                    <CTableHeaderCell>#</CTableHeaderCell>
                    {/* <CTableHeaderCell>ID</CTableHeaderCell> */}
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Position</CTableHeaderCell>
                    <CTableHeaderCell>Base Salary</CTableHeaderCell>
                    <CTableHeaderCell>Days Worked</CTableHeaderCell>
                    <CTableHeaderCell>Gross Salary</CTableHeaderCell>
                    <CTableHeaderCell>Tax</CTableHeaderCell>
                    <CTableHeaderCell>Benefits</CTableHeaderCell>
                    <CTableHeaderCell>Bonus</CTableHeaderCell>
                    <CTableHeaderCell>Net Salary</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredEmployees.map((employee, index) => (
                    <React.Fragment key={employee.employee_id || index}>
                      {employee.payrolls.map((payroll, payrollIndex) => (
                        <CTableRow
                          key={`${employee.employee_id}-${payrollIndex}`}
                          onClick={(e) => handleRowClick(payroll, e)}
                          style={{ cursor: 'pointer' }}
                          className="hover-row"
                        >
                          {payrollIndex === 0 && (
                            <>
                              <CTableDataCell rowSpan={employee.payrolls.length}>
                                {index + 1}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={employee.payrolls.length}>
                                {employee.name}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={employee.payrolls.length}>
                                {employee.department}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={employee.payrolls.length}>
                                {employee.job_position}
                              </CTableDataCell>
                            </>
                          )}
                          <CTableDataCell>{formatCurrency(payroll.base_salary)}</CTableDataCell>
                          <CTableDataCell>{payroll.working_days || 'N/A'}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(payroll.gross_salary)}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(payroll.tax)}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(payroll.benefits_total)}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(payroll.bonus)}</CTableDataCell>
                          <CTableDataCell>{formatCurrency(payroll.net_salary)}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusBadge(payroll.status)}>
                              {payroll.status || 'Pending'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePreviewPayslip(payroll)
                              }}
                              title="View Payslip"
                            >
                              <FontAwesomeIcon icon={faFile} />
                            </CButton>
                            <CDropdown className="d-inline ms-1">
                              <CDropdownToggle color="secondary" size="sm">
                                <FontAwesomeIcon icon={faChevronDown} />
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatus(payroll.id, 'Paid')
                                  }}
                                  disabled={payroll.status === 'Paid'}
                                >
                                  Mark as Paid
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatus(payroll.id, 'Pending')
                                  }}
                                  disabled={payroll.status === 'Pending'}
                                >
                                  Mark as Pending
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Overtime Rate Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Set Overtime Rate</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationError && <CAlert color="danger">{validationError}</CAlert>}
          <CFormLabel>Overtime Rate (per hour)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>₱</CInputGroupText>
            <CFormInput
              type="number"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
              placeholder="Enter overtime rate"
              min="0"
              step="0.01"
            />
          </CInputGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveRates}>
            Save Rate
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Bonus Modal */}
      <CModal visible={bonusModalVisible} onClose={() => setBonusModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Set Bonus for Selected Period</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="mb-3">
            <strong>Date Range:</strong> {formatDateRange()}
          </p>

          <CFormLabel>Bonus Amount</CFormLabel>
          <CInputGroup>
            <CInputGroupText>₱</CInputGroupText>
            <CFormInput
              type="number"
              value={bonus}
              onChange={(e) => setBonus(parseFloat(e.target.value))}
              placeholder="Enter bonus amount"
              min="0"
              step="0.01"
            />
          </CInputGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBonusModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleBonus}>
            Apply Bonus
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Salary Management Modal */}
      <CModal visible={salaryModalVisible} onClose={() => setSalaryModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Manage Base Salaries</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationError && <CAlert color="danger">{validationError}</CAlert>}

          <div className="mb-3">
            <CFormLabel>Job Position</CFormLabel>
            <CFormSelect value={jobPosition} onChange={(e) => setJobPosition(e.target.value)}>
              <option value="">Select a job position</option>
              {jobPositions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel>Monthly Rate</CFormLabel>
            <CInputGroup>
              <CInputGroupText>₱</CInputGroupText>
              <CFormInput
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                placeholder="Enter monthly rate"
                min="0"
                step="0.01"
              />
            </CInputGroup>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSalaryModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveSalary}>
            Save Salary
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Payslip Modal */}
      <CModal
        visible={payslipModalVisible}
        onClose={() => {
          setPayslipModalVisible(false)
          setShowAttendanceDetails(false)
        }}
        size="xl"
        scrollable
      >
        <CModalHeader closeButton>
          <CModalTitle>
            Payslip for {selectedEmployee?.name}
            <div className="small text-muted mt-1">
              Pay Period:{' '}
              {selectedEmployee?.start_date
                ? new Date(selectedEmployee.start_date).toLocaleDateString()
                : ''}{' '}
              -{' '}
              {selectedEmployee?.end_date
                ? new Date(selectedEmployee.end_date).toLocaleDateString()
                : ''}
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployee && (
            <>
              <CRow className="mb-4">
                <CCol md={6}>
                  <p>
                    <strong>Name:</strong> {selectedEmployee.name}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedEmployee.employee_id}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedEmployee.department}
                  </p>
                  <p>
                    <strong>Designation:</strong> {selectedEmployee.job_position}
                  </p>
                </CCol>
                <CCol md={6}>
                  <p>
                    <strong>Date of Payment:</strong> {selectedEmployee.updated_at || 'N/A'}
                  </p>
                  <p>
                    <strong>Working Days:</strong> {selectedEmployee.working_days || 'N/A'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <CBadge color={getStatusBadge(selectedEmployee.status)}>
                      {selectedEmployee.status || 'Pending'}
                    </CBadge>
                  </p>
                  <p>
                    <strong
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => fetchAttendanceDetails(selectedEmployee.employee_id)}
                    >
                      View Attendance Details
                    </strong>
                  </p>
                </CCol>
              </CRow>

              {showAttendanceDetails && (
                <div className="mb-4">
                  <h5>Attendance Details</h5>
                  <div className="table-responsive">
                    <CTable striped>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableHeaderCell>Time In</CTableHeaderCell>
                          <CTableHeaderCell>Time Out</CTableHeaderCell>
                          <CTableHeaderCell>Hours Worked</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {attendanceDetails
                          .filter(
                            (att) =>
                              new Date(att.time_in) >= new Date(selectedEmployee.start_date) &&
                              new Date(att.time_out) <= new Date(selectedEmployee.end_date),
                          )
                          .map((attendance, index) => {
                            const timeIn = new Date(attendance.time_in)
                            const timeOut = new Date(attendance.time_out)
                            const hoursWorked = (timeOut - timeIn) / (1000 * 60 * 60) - 1
                            return (
                              <CTableRow key={index}>
                                <CTableDataCell>{timeIn.toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{timeIn.toLocaleTimeString()}</CTableDataCell>
                                <CTableDataCell>{timeOut.toLocaleTimeString()}</CTableDataCell>
                                <CTableDataCell>{hoursWorked.toFixed(2)} hours</CTableDataCell>
                              </CTableRow>
                            )
                          })}
                        <CTableRow>
                          <CTableDataCell colSpan="3" className="text-end">
                            <strong>Total Hours:</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <strong>
                              {attendanceDetails
                                .filter(
                                  (att) =>
                                    new Date(att.time_in) >=
                                      new Date(selectedEmployee.start_date) &&
                                    new Date(att.time_out) <= new Date(selectedEmployee.end_date),
                                )
                                .reduce((total, attendance) => {
                                  const timeIn = new Date(attendance.time_in)
                                  const timeOut = new Date(attendance.time_out)
                                  return total + ((timeOut - timeIn) / (1000 * 60 * 60) - 1)
                                }, 0)
                                .toFixed(2)}{' '}
                              hours
                            </strong>
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </div>
                </div>
              )}

              <div className="table-responsive">
                <CTable bordered>
                  <CTableHead>
                    <CTableRow className="text-center">
                      <CTableHeaderCell>Earnings</CTableHeaderCell>
                      <CTableHeaderCell>Hours</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Deductions</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Base Salary</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {selectedEmployee.total_regular_hours || '0'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.base_salary)}
                      </CTableDataCell>
                      <CTableDataCell>Tax</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.tax)}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Overtime Pay</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {selectedEmployee.total_overtime_hours || '0'}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.total_overtime_amount)}
                      </CTableDataCell>
                      <CTableDataCell>Benefits</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.benefits_total)}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Bonus</CTableDataCell>
                      <CTableDataCell className="text-center">-</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.bonus)}
                      </CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>

                    {employeeBenefits
                      .filter(
                        (benefit) =>
                          new Date(benefit.date) >= new Date(selectedEmployee.start_date) &&
                          new Date(benefit.date) <= new Date(selectedEmployee.end_date),
                      )
                      .map((benefit, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell colSpan={3}></CTableDataCell>
                          <CTableDataCell>{benefit.type}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            {formatCurrency(benefit.amount)}
                          </CTableDataCell>
                        </CTableRow>
                      ))}

                    <CTableRow>
                      <CTableDataCell>Paid Leave</CTableDataCell>
                      <CTableDataCell className="text-center">-</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.paid_leave_amount)}
                      </CTableDataCell>
                      <CTableDataCell>Late Hours</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {formatCurrency(selectedEmployee.total_late_hours)}
                      </CTableDataCell>
                    </CTableRow>

                    <CTableRow>
                      <CTableHeaderCell>Gross Salary</CTableHeaderCell>
                      <CTableHeaderCell colSpan={2} className="text-center">
                        {formatCurrency(selectedEmployee.gross_salary)}
                      </CTableHeaderCell>
                      <CTableHeaderCell>Total Deductions</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">
                        {formatCurrency(
                          parseFloat(selectedEmployee.tax || 0) +
                            parseFloat(selectedEmployee.benefits_total || 0) +
                            parseFloat(
                              selectedEmployee.total_late_hours *
                                (selectedEmployee.daily_rate / 8) || 0,
                            ),
                        )}
                      </CTableHeaderCell>
                    </CTableRow>
                    <br />

                    <CTableRow>
                      <CTableHeaderCell>Net Pay</CTableHeaderCell>
                      <CTableHeaderCell colSpan={4} className="text-center">
                        {formatCurrency(selectedEmployee.net_salary)}
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPayslipModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => window.print()}>
            Print Payslip
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={computationModalVisible}
        onClose={() => setComputationModalVisible(false)}
        size="xl"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            Payroll Computation for {selectedEmployeeComputation?.name} -{' '}
            {selectedEmployeeComputation?.job_position}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployeeComputation && (
            <div>
              <CRow className="mb-4">
                <CCol md={6}>
                  <p>
                    <strong>Employee ID:</strong> {selectedEmployeeComputation.employee_id}
                  </p>
                  <p>
                    <strong>Department:</strong> {selectedEmployeeComputation.department}
                  </p>
                  <p>
                    <strong>Pay Period:</strong>{' '}
                    {new Date(selectedEmployeeComputation.start_date).toLocaleDateString()} -{' '}
                    {new Date(selectedEmployeeComputation.end_date).toLocaleDateString()}
                  </p>
                </CCol>
                <CCol md={6}>
                  <p>
                    <strong>Position:</strong> {selectedEmployeeComputation.job_position}
                  </p>
                  <p>
                    <strong>Monthly Rate:</strong>{' '}
                    {formatCurrency(selectedEmployeeComputation.monthly_rate)}
                  </p>
                  <p>
                    <strong>Days of Worked:</strong> {selectedEmployeeComputation.working_days}
                  </p>
                </CCol>
              </CRow>

              <CTable bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Component</CTableHeaderCell>
                    <CTableHeaderCell>Calculation</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>Monthly Rate</CTableDataCell>
                    <CTableDataCell>Base salary</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.monthly_rate)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Base Salary (Half Month)</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.monthly_rate)} / 2
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.base_salary)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Daily Rate</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.base_salary)} /{' '}
                      {selectedEmployeeComputation.working_days} days
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.daily_rate)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Regular Pay</CTableDataCell>
                    <CTableDataCell>
                      {selectedEmployeeComputation.working_days} days ×{' '}
                      {formatCurrency(selectedEmployeeComputation.daily_rate)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(
                        selectedEmployeeComputation.working_days *
                          selectedEmployeeComputation.daily_rate,
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Overtime Pay</CTableDataCell>
                    <CTableDataCell>
                      {selectedEmployeeComputation.total_overtime_hours} hours ×{' '}
                      {formatCurrency(overtimeRate)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.total_overtime_amount)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Bonus</CTableDataCell>
                    <CTableDataCell>Additional compensation</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.bonus)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Paid Leave</CTableDataCell>
                    <CTableDataCell>Approved paid leaves</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.paid_leave_amount)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow className="table-primary">
                    <CTableDataCell>
                      <strong>Gross Salary</strong>
                    </CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell>
                      <strong>{formatCurrency(selectedEmployeeComputation.gross_salary)}</strong>
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Tax</CTableDataCell>
                    <CTableDataCell>Progressive tax calculation</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.tax)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Benefits</CTableDataCell>
                    <CTableDataCell>Employee benefits</CTableDataCell>
                    <CTableDataCell>
                      {formatCurrency(selectedEmployeeComputation.benefits_total)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow className="table-primary">
                    <CTableDataCell>
                      <strong>Net Salary</strong>
                    </CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell>
                      <strong>{formatCurrency(selectedEmployeeComputation.net_salary)}</strong>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <div className="mt-4">
                <h5>Tax Computation Details</h5>
                <p>The tax is calculated using progressive tax rates based on the gross salary:</p>
                <ul>
                  <li>Up to ₱20,833: 0%</li>
                  <li>₱20,834 - ₱33,332: 15% of excess over ₱20,833</li>
                  <li>₱33,333 - ₱66,666: ₱1,875 + 20% of excess over ₱33,333</li>
                  <li>₱66,667 - ₱166,666: ₱8,541.80 + 25% of excess over ₱66,667</li>
                  <li>₱166,667 - ₱666,666: ₱33,541.80 + 30% of excess over ₱166,667</li>
                  <li>Over ₱666,667: ₱183,541.80 + 35% of excess over ₱666,667</li>
                </ul>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setComputationModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Payroll
