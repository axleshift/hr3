import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CContainer, CWidgetStatsA } from '@coreui/react'

const Dashboard = () => {
  // Mock data (no fetching)
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 500,
    paidEmployees: 450,
    benefitsEnrolled: 300,
  })

  return (
    <CContainer fluid>
      <CRow>
        {/* Total Employees Card */}
        <CCol sm="4">
          <CCard>
            <CCardHeader>Total Employees</CCardHeader>
            <CCardBody>
              <CWidgetStatsA
                className="mb-3"
                color="primary"
                value={dashboardData.totalEmployees}
                title="Employees"
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Paid Employees Card */}
        <CCol sm="4">
          <CCard>
            <CCardHeader>Paid Employees</CCardHeader>
            <CCardBody>
              <CWidgetStatsA
                className="mb-3"
                color="success"
                value={dashboardData.paidEmployees}
                title="Employees"
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Benefits Enrolled Card */}
        <CCol sm="4">
          <CCard>
            <CCardHeader>Benefits Enrolled</CCardHeader>
            <CCardBody>
              <CWidgetStatsA
                className="mb-3"
                color="info"
                value={dashboardData.benefitsEnrolled}
                title="Employees"
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
