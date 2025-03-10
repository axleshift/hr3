import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CSpinner } from '@coreui/react'
import api from '../../util/api'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({
    activeEmployees: 0,
    newLeaveRequests: 0,
    approvedLeaveRequests: 0,
    rejectedLeaveRequests: 0,
    budget: 0,
    paidPayroll: 0,
    pendingPayroll: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          activeEmployeesRes,
          newLeaveRequestsRes,
          approvedLeaveRequestsRes,
          rejectedLeaveRequestsRes,
          budgetRes,
          paidPayrollRes,
          pendingPayrollRes,
        ] = await Promise.all([
          api.get('/employees/count'),
          api.get('/leave-requests/count?status=Pending'),
          api.get('/leave-requests/count?status=Approved'),
          api.get('/leave-requests/count?status=Rejected'),
          api.get('/budget'),
          api.get('/payrolls/count?status=Paid'),
          api.get('/payrolls/count?status=Pending'),
        ])

        setCounts({
          activeEmployees: activeEmployeesRes.data.count,
          newLeaveRequests: newLeaveRequestsRes.data.count,
          approvedLeaveRequests: approvedLeaveRequestsRes.data.count,
          rejectedLeaveRequests: rejectedLeaveRequestsRes.data.count,
          budget: budgetRes.data.budget,
          paidPayroll: paidPayrollRes.data.count,
          pendingPayroll: pendingPayrollRes.data.count,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="container">
      <CRow>
        <CCol md={3}>
          <CCard>
            <CCardHeader>Active Employees</CCardHeader>
            <CCardBody>
              <h3>{counts.activeEmployees}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>New Leave Requests</CCardHeader>
            <CCardBody>
              <h3>{counts.newLeaveRequests}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>Approved Leave Requests</CCardHeader>
            <CCardBody>
              <h3>{counts.approvedLeaveRequests}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>Rejected Leave Requests</CCardHeader>
            <CCardBody>
              <h3>{counts.rejectedLeaveRequests}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol md={3}>
          <CCard>
            <CCardHeader>Budget</CCardHeader>
            <CCardBody>
              <h3>${counts.budget}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>Paid Payroll</CCardHeader>
            <CCardBody>
              <h3>{counts.paidPayroll}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard>
            <CCardHeader>Pending Payroll</CCardHeader>
            <CCardBody>
              <h3>{counts.pendingPayroll}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
