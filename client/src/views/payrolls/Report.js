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
          <CTableBody>
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <CTableRow key={payroll.id}>
                  <CTableDataCell>{payroll.employeeId}</CTableDataCell>
                  <CTableDataCell>{payroll.employeeName}</CTableDataCell>
                  <CTableDataCell>{payroll.basicSalary}</CTableDataCell>
                  <CTableDataCell>{payroll.overtime}</CTableDataCell>
                  <CTableDataCell>{payroll.bonus}</CTableDataCell>
                  <CTableDataCell>{payroll.deductions}</CTableDataCell>
                  <CTableDataCell>{payroll.netSalary}</CTableDataCell>
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
        </CTable>

        <CButton color="primary" onClick={() => window.print()}>
          Print Report
        </CButton>
      </CCardBody>
    </CCard>
  )
}

export default Report
