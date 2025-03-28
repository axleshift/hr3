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
} from '@coreui/react'
import api from '../../util/api'

const EmployeeDetails = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null)
  const [tax, setTax] = useState([])
  const [benefits, setBenefits] = useState([])
  const [compliance, setCompliance] = useState([])

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await api.get(`/employees/${employeeId}`)
        setEmployee(response.data.employee)
        setTax(response.data.tax)
        setBenefits(response.data.benefits)
        setCompliance(response.data.compliance)
      } catch (error) {
        console.error('Error fetching employee details:', error)
      }
    }

    fetchEmployeeDetails()
  }, [employeeId])

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Employee Details</strong>
      </CCardHeader>
      <CCardBody>
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Department:</strong> {employee.department}
        </p>
        <p>
          <strong>Position:</strong> {employee.position}
        </p>
        <p>
          <strong>Salary:</strong> {employee.salary}
        </p>

        <h5>Tax Details</h5>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Month</CTableHeaderCell>
              <CTableHeaderCell>Year</CTableHeaderCell>
              <CTableHeaderCell>Taxable Income</CTableHeaderCell>
              <CTableHeaderCell>Withholding Tax</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tax.map((t) => (
              <CTableRow key={t.id}>
                <CTableDataCell>{t.month}</CTableDataCell>
                <CTableDataCell>{t.year}</CTableDataCell>
                <CTableDataCell>{t.taxable_income}</CTableDataCell>
                <CTableDataCell>{t.withholding_tax}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <h5>Benefits Details</h5>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Month</CTableHeaderCell>
              <CTableHeaderCell>Year</CTableHeaderCell>
              <CTableHeaderCell>SSS Contribution</CTableHeaderCell>
              <CTableHeaderCell>PhilHealth Contribution</CTableHeaderCell>
              <CTableHeaderCell>Pag-IBIG Contribution</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {benefits.map((b) => (
              <CTableRow key={b.id}>
                <CTableDataCell>{b.month}</CTableDataCell>
                <CTableDataCell>{b.year}</CTableDataCell>
                <CTableDataCell>{b.sss_contribution}</CTableDataCell>
                <CTableDataCell>{b.philhealth_contribution}</CTableDataCell>
                <CTableDataCell>{b.pagibig_contribution}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <h5>Compliance Details</h5>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Month</CTableHeaderCell>
              <CTableHeaderCell>Year</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Remarks</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {compliance.map((c) => (
              <CTableRow key={c.id}>
                <CTableDataCell>{c.month}</CTableDataCell>
                <CTableDataCell>{c.year}</CTableDataCell>
                <CTableDataCell>{c.status}</CTableDataCell>
                <CTableDataCell>{c.remarks}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default EmployeeDetails
