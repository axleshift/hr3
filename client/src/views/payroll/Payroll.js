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
import axios from 'axios'
import { faFile, faChevronDown } from '@fortawesome/free-solid-svg-icons'
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
  const [salaryRate, setSalaryRate] = useState('')
  const [overtimeRate, setOvertimeRate] = useState('')
  const [deductionBonusModalVisible, setDeductionBonusModalVisible] = useState(false)
  const [deduction, setDeduction] = useState(0)
  const [bonus, setBonus] = useState(0)

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/payroll', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      const data = response.data

      console.log('API Response:', data)

      if (Array.isArray(data)) {
        setEmployees(data)
      } else {
        console.error('Invalid data format:', data)
        setEmployees([])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching payroll data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrollData()
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
      month: 'long',
    })
    setMonthName(monthName)
  }, [selectedMonth, selectedYear])

  const fetchRates = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rates')
      const rates = response.data

      setSalaryRate(rates.salary_rate || '')
      setOvertimeRate(rates.overtime_rate || '')
    } catch (error) {
      console.error('Error fetching rates:', error)
    }
  }

  useEffect(() => {
    if (modalVisible) {
      fetchRates()
    }
  }, [modalVisible])

  const handleSaveRates = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/rates', {
        salary_rate: parseFloat(salaryRate),
        overtime_rate: parseFloat(overtimeRate),
      })

      console.log('Rates saved successfully:', response.data)

      setModalVisible(false)
    } catch (error) {
      console.error('Error saving rates:', error)
    }
  }

  const handleStatus = async (id, Newstatus) => {
    try {
      await axios.put(`http://localhost:8000/api/payrolls/${id}`, { status: Newstatus })
      fetchPayrollData()
    } catch (error) {
      console.error('Error updating paid status:', error)
      alert('Failed to update paid status. Please try again.')
    }
  }

  const handleSaveDeductionBonus = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/payroll', {
        year: selectedYear,
        month: selectedMonth,
        deduction: parseFloat(deduction),
        bonus: parseFloat(bonus),
      })
      setDeductionBonusModalVisible(false)
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving deduction and bonus:', error)
    }
  }

  const fetchDeductionBonus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/payroll', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      const data = response.data

      if (data.length > 0) {
        setDeduction(data[0].deduction || 0)
        setBonus(data[0].bonus || 0)
      }
    } catch (error) {
      console.error('Error fetching deduction and bonus:', error)
    }
  }

  useEffect(() => {
    if (deductionBonusModalVisible) {
      fetchDeductionBonus()
    }
  }, [deductionBonusModalVisible])

  const handleViewPayslip = async (employee) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/payroll/generate-payslip/${employee.id}`,
        {
          responseType: 'blob',
        },
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'payslip.pdf')
      document.body.appendChild(link)

      link.click()

      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error generating payslip:', error)
    }
  }

  const handlePreviewPayslip = (employeeId) => {
    window.open(
      `http://localhost:8000/api/payroll/generate-payslip/${employeeId}?view=true`,
      '_blank',
    )
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'success'
      case 'paid':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Employee Payroll</strong>
          <div className="float-end">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '120px', display: 'inline-block', marginRight: '10px' }}
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
              style={{ width: '90px', display: 'inline-block', marginRight: '10px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton className="me-2" color="primary" onClick={() => setModalVisible(true)}>
              Rates
            </CButton>
            <CButton color="primary" onClick={() => setDeductionBonusModalVisible(true)}>
              Set
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading && employees.length === 0 ? (
            <div className="text-center">
              <CSpinner color="primary" />
              <p>Loading...</p>
            </div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Overtime</CTableHeaderCell>
                  <CTableHeaderCell>Deduction</CTableHeaderCell>
                  <CTableHeaderCell>Bonus</CTableHeaderCell>
                  <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees.map((employee) => (
                  <CTableRow key={employee.employee_id}>
                    <CTableDataCell>{employee.id}</CTableDataCell>
                    <CTableDataCell>{employee.employee_id}</CTableDataCell>
                    <CTableDataCell>{employee.name}</CTableDataCell>
                    <CTableDataCell>
                      {parseFloat(employee.total_overtime_amount).toFixed(2)}
                    </CTableDataCell>
                    <CTableDataCell>{parseFloat(employee.deduction).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{parseFloat(employee.bonus).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      {parseFloat(employee.net_salary).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                      })}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(employee.status)}>{employee.status}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="me-2"
                        color="success"
                        size="sm"
                        onClick={() => handlePreviewPayslip(employee.id)}
                      >
                        <FontAwesomeIcon icon={faFile} />
                      </CButton>
                      <CDropdown>
                        <CDropdownToggle color="link" size="sm">
                          <FontAwesomeIcon icon={faChevronDown} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            onClick={() => handleStatus(employee.id, 'Paid')}
                            disabled={employee.status === 'Paid'}
                          >
                            Paid
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleStatus(employee.id, 'Pending')}
                            disabled={employee.status === 'Pending'}
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

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set Salary and Overtime Rates</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Salary Rate (per hour)</CFormLabel>
          <CFormInput
            type="number"
            value={salaryRate}
            onChange={(e) => setSalaryRate(e.target.value)}
            placeholder="Enter salary rate"
          />
          <CFormLabel className="mt-3">Overtime Rate (per hour)</CFormLabel>
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
            Save Rates
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={deductionBonusModalVisible}
        onClose={() => setDeductionBonusModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Set Deduction and Bonus</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Deduction</CFormLabel>
          <CFormInput
            type="number"
            value={deduction}
            onChange={(e) => setDeduction(parseFloat(e.target.value))}
            placeholder="Enter deduction"
          />
          <CFormLabel className="mt-3">Bonus</CFormLabel>
          <CFormInput
            type="number"
            value={bonus}
            onChange={(e) => setBonus(parseFloat(e.target.value))}
            placeholder="Enter bonus"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeductionBonusModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveDeductionBonus}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Payroll
