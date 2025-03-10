import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
} from '@coreui/react'

const Pay = () => {
  const [payrollData, setPayrollData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await fetch('http://your-api-url.com/api/payrolls')
        if (!response.ok) throw new Error('Failed to fetch payroll data')
        const data = await response.json()
        setPayrollData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPayrollData()
  }, [])

  if (loading) return <CSpinner color="primary" />
  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CTable striped hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>ID</CTableHeaderCell>
          <CTableHeaderCell>Employee Name</CTableHeaderCell>
          <CTableHeaderCell>Department</CTableHeaderCell>
          <CTableHeaderCell>Basic Salary</CTableHeaderCell>
          <CTableHeaderCell>Deductions</CTableHeaderCell>
          <CTableHeaderCell>Net Pay</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {payrollData.map((employee) => (
          <CTableRow key={employee.id}>
            <CTableDataCell>{employee.id}</CTableDataCell>
            <CTableDataCell>{employee.name}</CTableDataCell>
            <CTableDataCell>{employee.department}</CTableDataCell>
            <CTableDataCell>₱{employee.basic_salary}</CTableDataCell>
            <CTableDataCell>₱{employee.deductions}</CTableDataCell>
            <CTableDataCell>₱{employee.net_pay}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default Pay
