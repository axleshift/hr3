import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormSelect,
  CTableFoot,
} from '@coreui/react'
import axios from 'axios'

const Report = () => {
  const [payroll, setPayroll] = useState([])
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/payroll', {
        params: { year: selectedYear, month: selectedMonth },
      })
      const payrollData = response.data.payroll || response.data

      if (Array.isArray(payrollData)) {
        setPayroll(payrollData)
      } else {
        setError('Invalid payroll data format.')
      }
    } catch (err) {
      setError('Error fetching payroll data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrollData()
  }, [selectedYear, selectedMonth])

  const calculateTotalNetSalary = () => {
    return payroll.reduce((total, payroll) => total + parseFloat(payroll.net_salary || 0), 0)
  }

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    })
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Payroll Report</strong>
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
        </div>
      </CCardHeader>
      <CCardBody>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {loading ? (
          <div>Loading payroll data...</div>
        ) : (
          <CTable hover bordered responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Employee ID</CTableHeaderCell>
                <CTableHeaderCell>Employee Name</CTableHeaderCell>
                <CTableHeaderCell>Overtime</CTableHeaderCell>
                <CTableHeaderCell>Bonus</CTableHeaderCell>
                <CTableHeaderCell>Deduction</CTableHeaderCell>
                <CTableHeaderCell>Net Salary</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payroll.length > 0 ? (
                payroll.map((payroll) => (
                  <CTableRow key={payroll.id}>
                    <CTableDataCell>{payroll.employee_id}</CTableDataCell>
                    <CTableDataCell>{payroll.name}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(payroll.total_overtime_amount)}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(payroll.bonus)}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(payroll.deduction)}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(payroll.net_salary)}</CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-right">
                    No payroll data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
            <CTableFoot>
              {payroll.length > 0 && (
                <CTableRow>
                  <CTableHeaderCell colSpan="4"></CTableHeaderCell>
                  <CTableHeaderCell>Total:</CTableHeaderCell>
                  <CTableHeaderCell>{formatCurrency(calculateTotalNetSalary())}</CTableHeaderCell>
                </CTableRow>
              )}
            </CTableFoot>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Report
