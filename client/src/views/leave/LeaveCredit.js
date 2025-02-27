import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
} from '@coreui/react'

const LeaveCredit = () => {
  const [employee, setEmployee] = useState(null)
  const [leaveCredits, setLeaveCredits] = useState([])
  const [leaveRecords, setLeaveRecords] = useState([])
  const [error, setError] = useState(null)

  const employeeId = sessionStorage.getItem('employee_id')

  useEffect(() => {
    if (!employeeId) {
      setError('Employee ID not found. Please log in again.')
      return
    }

    fetch(`http://localhost:8000/api/employee/${employeeId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch employee data')
        }
        return res.json()
      })
      .then((data) => {
        setEmployee(data.employee)
        setLeaveCredits(data.leaveCredits)
        setLeaveRecords(data.leaveRecords)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [employeeId])

  return (
    <CCard>
      <CCardHeader>Employee Leave Record</CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        {employee ? (
          <>
            <p>
              <strong>Employee ID:</strong> {employee.id}
            </p>
            <p>
              <strong>Name:</strong> {employee.name}
            </p>
            <p>
              <strong>Department:</strong> {employee.department}
            </p>

            <h5>Leave Credits</h5>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Allowable</CTableHeaderCell>
                  <CTableHeaderCell>Available</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {leaveCredits.map((credit) => (
                  <CTableRow key={credit.type}>
                    <CTableDataCell>{credit.type}</CTableDataCell>
                    <CTableDataCell>{credit.allowable}</CTableDataCell>
                    <CTableDataCell>{credit.available}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <h5>Leave Records</h5>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Leave Type</CTableHeaderCell>
                  <CTableHeaderCell>Start Date</CTableHeaderCell>
                  <CTableHeaderCell>End Date</CTableHeaderCell>
                  <CTableHeaderCell>Total Days</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Remarks</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {leaveRecords.map((record) => (
                  <CTableRow key={record.id}>
                    <CTableDataCell>{record.leave_type}</CTableDataCell>
                    <CTableDataCell>{record.start_date}</CTableDataCell>
                    <CTableDataCell>{record.end_date}</CTableDataCell>
                    <CTableDataCell>{record.total_days}</CTableDataCell>
                    <CTableDataCell>{record.status}</CTableDataCell>
                    <CTableDataCell>{record.remarks || 'N/A'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </>
        ) : (
          !error && <p>Loading employee data...</p>
        )}
      </CCardBody>
    </CCard>
  )
}

export default LeaveCredit
