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
} from '@coreui/react'
import axios from 'axios'

const Report = () => {
  const [payrolls, setPayrolls] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/payrolls')
        setPayrolls(response.data.payrolls) // Make sure the response has 'payrolls' array
      } catch (err) {
        setError('Error fetching payroll data.')
      }
    }

    fetchPayrollData()
  }, [])

  // Calculate totals for each field
  const calculateTotal = (field) => {
    return payrolls.reduce(
      (total, payroll) => total + Math.round(parseFloat(payroll[field] || 0)),
      0,
    )
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Payroll Report</strong>
      </CCardHeader>
      <CCardBody>
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <CTable hover bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Employee ID</CTableHeaderCell>
              <CTableHeaderCell>Employee Name</CTableHeaderCell>
              <CTableHeaderCell>Basic Salary</CTableHeaderCell>
              <CTableHeaderCell>Overtime</CTableHeaderCell>
              <CTableHeaderCell>Bonus</CTableHeaderCell>
              <CTableHeaderCell>Deductions</CTableHeaderCell>
              <CTableHeaderCell>Net Salary</CTableHeaderCell>
              <CTableHeaderCell>Payment Method</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Payment Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody className="text-center">
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <CTableRow key={payroll.id}>
                  <CTableDataCell>{payroll.employeeId}</CTableDataCell>
                  <CTableDataCell>{payroll.employeeName}</CTableDataCell>
                  <CTableDataCell>{Math.round(payroll.basicSalary)}</CTableDataCell>
                  <CTableDataCell>{Math.round(payroll.overtime)}</CTableDataCell>
                  <CTableDataCell>{Math.round(payroll.bonus)}</CTableDataCell>
                  <CTableDataCell>{Math.round(payroll.deductions)}</CTableDataCell>
                  <CTableDataCell>{Math.round(payroll.netSalary)}</CTableDataCell>
                  <CTableDataCell>{payroll.paymentMethod}</CTableDataCell>
                  <CTableDataCell>{payroll.status}</CTableDataCell>
                  <CTableDataCell>
                    {payroll.created_at
                      ? new Date(payroll.paymentDate).toLocaleDateString()
                      : 'N/A'}
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="10" style={{ textAlign: 'center' }}>
                  No payroll data available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
          {payrolls.length > 0 && (
            <CTableRow className="text-center">
              <CTableDataCell colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total:
              </CTableDataCell>
              <CTableDataCell>{Math.round(calculateTotal('netSalary'))}</CTableDataCell>
              <CTableDataCell colSpan="3"></CTableDataCell>
            </CTableRow>
          )}
        </CTable>

        <CButton color="primary" onClick={() => window.print()}>
          Print Report
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default Report
