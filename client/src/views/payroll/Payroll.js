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
} from '@coreui/react'
import api from '../../util/api'
import {
  faFile,
  faChevronDown,
  faMoneyBill,
  faClock,
  faGift,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Payroll = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [overtimeRate, setOvertimeRate] = useState('')
  const [bonusModalVisible, setbonusModalVisible] = useState(false)
  //  const [deduction, setDeduction] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [visible, setVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [salaryModalVisible, setSalaryModalVisible] = useState(false)
  const [salaries, setSalaries] = useState([])
  const [jobPosition, setJobPosition] = useState('')
  const [baseSalary, setBaseSalary] = useState('')
  const [validationError, setValidationError] = useState('')
  const [jobPositions, setJobPositions] = useState([])
  const [employeeBenefits, setEmployeeBenefits] = useState([])

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions')
      setJobPositions(response.data)
    } catch (error) {
      console.error('Error fetching job positions:', error)
      setError('Failed to fetch job positions')
    }
  }

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/payroll', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      setEmployees(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching payroll data:', error)
      setError('Failed to fetch payroll data')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSalary = async () => {
    if (!jobPosition || !baseSalary) {
      setValidationError('All fields are required')
      return
    }

    try {
      await api.post('/salaries', {
        job_position: jobPosition,
        base_salary: parseFloat(baseSalary),
      })
      setSalaryModalVisible(false)
      setValidationError('')
      setJobPosition('')
      setBaseSalary('')
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving salary:', error)
      setValidationError(error.response?.data?.message || 'Failed to save salary')
    }
  }

  useEffect(() => {
    fetchJobPositions()
    fetchPayrollData()
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    setMonthName(
      new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' }),
    )
  }, [selectedMonth, selectedYear])

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
      await api.post('/rates', { overtime_rate: parseFloat(overtimeRate) })
      setModalVisible(false)
      setValidationError('')
      fetchPayrollData()
    } catch (error) {
      setValidationError(error.response?.data?.message || 'Failed to save overtime rate')
    }
  }

  const handlePreviewPayslip = async (employee) => {
    try {
      setLoading(true)
      setSelectedEmployee(employee)
      const response = await api.get('/benefits', {
        params: {
          employee_id: employee.employee_id,
          year: selectedYear,
          month: selectedMonth,
        },
      })
      setEmployeeBenefits(response.data)
      setPayslipModalVisible(true)
    } catch (error) {
      console.error('Error fetching benefits:', error)
      setError('Failed to fetch benefits data')
    } finally {
      setLoading(false)
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
      await api.post('/payroll/bonus', {
        year: selectedYear,
        month: selectedMonth,
        bonus: parseFloat(bonus),
      })
      setBonusModalVisible(false)
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving bonus:', error)
      setError('Failed to save bonus')
    }
  }

  const fetchBonus = async () => {
    try {
      const response = await api.get('/payroll/bonus', {
        params: { year: selectedYear, month: selectedMonth },
      })
      setBonus(response.data?.bonus || 0)
    } catch (error) {
      console.error('Error fetching bonus:', error)
      setError('Failed to fetch bonus data')
    }
  }

  useEffect(() => {
    if (bonusModalVisible) fetchBonus()
  }, [bonusModalVisible])

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

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

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Employee Payroll</strong>
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
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              <FontAwesomeIcon icon={faClock} />
            </CButton>
            <CButton color="primary" onClick={() => setDeductionBonusModalVisible(true)}>
              <FontAwesomeIcon icon={faGift} />
            </CButton>
            <CButton color="info" onClick={() => setSalaryModalVisible(true)}>
              <FontAwesomeIcon icon={faMoneyBill} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading && employees.length === 0 ? (
            <div className="text-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Job Position</CTableHeaderCell>
                    <CTableHeaderCell>Base Salary</CTableHeaderCell>
                    <CTableHeaderCell>Overtime</CTableHeaderCell>
                    <CTableHeaderCell>Tax</CTableHeaderCell>
                    <CTableHeaderCell>Benefits</CTableHeaderCell>
                    <CTableHeaderCell>Bonus</CTableHeaderCell>
                    <CTableHeaderCell>Net Salary</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {employees.map((employee) => {
                    const employeeStatus = employee.status || 'Pending'
                    return (
                      <CTableRow key={employee.employee_id}>
                        <CTableDataCell>{employee.id}</CTableDataCell>
                        <CTableDataCell>{employee.employee_id}</CTableDataCell>
                        <CTableDataCell>{employee.name}</CTableDataCell>
                        <CTableDataCell>{employee.department}</CTableDataCell>
                        <CTableDataCell>{employee.job_position}</CTableDataCell>
                        <CTableDataCell>
                          {parseFloat(employee.base_salary || 0).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {parseFloat(employee.total_overtime_amount || 0).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          ₱
                          {parseFloat(employee.tax || 0).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </CTableDataCell>
                        <CTableDataCell>
                          {parseFloat(employee.benefits_total || 0).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {parseFloat(employee.bonus || 0).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {parseFloat(employee.net_salary || 0).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(employeeStatus)}>{employeeStatus}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton color="secondary" onClick={() => handlePreviewPayslip(employee)}>
                            <FontAwesomeIcon icon={faFile} />
                          </CButton>
                          <CDropdown>
                            <CDropdownToggle color="link" size="sm">
                              <FontAwesomeIcon icon={faChevronDown} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => handleStatus(employee.id, 'Paid')}
                                disabled={employeeStatus === 'Paid'}
                              >
                                Paid
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => handleStatus(employee.id, 'Pending')}
                                disabled={employeeStatus === 'Pending'}
                              >
                                Pending
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set Overtime Rate</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Overtime Rate (per hour)</CFormLabel>
          <CFormInput
            type="number"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
            placeholder="Enter overtime rate"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveRates}>
            Save Rate
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={bonusModalVisible} onClose={() => setbonusModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set Bonus</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <CFormLabel>Deduction</CFormLabel>
          <CFormInput
            type="number"
            value={deduction}
            onChange={(e) => setDeduction(parseFloat(e.target.value))}
            placeholder="Enter deduction"
          /> */}
          <CFormLabel className="mt-3">Bonus</CFormLabel>
          <CFormInput
            type="number"
            value={bonus}
            onChange={(e) => setBonus(parseFloat(e.target.value))}
            placeholder="Enter bonus"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setbonusModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleBonus}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={salaryModalVisible} onClose={() => setSalaryModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Manage Salaries</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationError && <div className="alert alert-danger">{validationError}</div>}
          <CFormLabel>Job Position</CFormLabel>
          <CFormSelect
            value={jobPosition}
            onChange={(e) => setJobPosition(e.target.value)}
            placeholder="Select job position"
          >
            <option value="">Select a job position</option>
            {jobPositions.map((position, index) => (
              <option key={index} value={position}>
                {position}
              </option>
            ))}
          </CFormSelect>
          <CFormLabel className="mt-3">Base Salary</CFormLabel>
          <CFormInput
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            placeholder="Enter base salary"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSalaryModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveSalary}>
            Save Salary
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Payslip for {selectedEmployee?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployee && (
            <>
              <div className="mb-4">
                <p>
                  <strong>Date Period:</strong> {monthName} 1, {selectedYear} – {monthName} 30,{' '}
                  {selectedYear}
                </p>
                <p>
                  <strong>Employee Name:</strong> {selectedEmployee.name}
                </p>
                <p>
                  <strong>Employee ID:</strong> {selectedEmployee.employee_id}
                </p>
                <p>
                  <strong>Position:</strong> {selectedEmployee.job_position}
                </p>
              </div>
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Earnings</th>
                      <th>Amount</th>
                      <th>Deductions</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Base Salary</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.base_salary || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>Tax</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.tax || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td>Overtime Pay</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.total_overtime_amount || 0).toLocaleString(
                          'en-PH',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td>Bonus</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.bonus || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>

                    {employeeBenefits.map((benefit, index) => (
                      <tr key={index}>
                        <td colSpan="2"></td>
                        <td>{benefit.type}</td>
                        <td>
                          ₱
                          {parseFloat(benefit.amount || 0).toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <th>Gross Salary</th>
                      <th>
                        ₱
                        {(
                          parseFloat(selectedEmployee.base_salary || 0) +
                          parseFloat(selectedEmployee.total_overtime_amount || 0) +
                          parseFloat(selectedEmployee.bonus || 0)
                        ).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                      <th>Total Deductions</th>
                      <th>
                        ₱
                        {(
                          parseFloat(selectedEmployee.tax || 0) +
                          parseFloat(selectedEmployee.benefits_total || 0)
                        ).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                    </tr>
                    <tr>
                      <th>Net Pay</th>
                      <th colSpan="3">
                        ₱
                        {(
                          parseFloat(selectedEmployee.base_salary || 0) +
                          parseFloat(selectedEmployee.total_overtime_amount || 0) +
                          parseFloat(selectedEmployee.bonus || 0) -
                          parseFloat(selectedEmployee.tax || 0) -
                          parseFloat(selectedEmployee.benefits_total || 0)
                        ).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Payroll
