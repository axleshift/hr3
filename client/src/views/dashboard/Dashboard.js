import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CContainer, CWidgetStatsA } from '@coreui/react'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 500,
    paidEmployees: 450,
    benefitsEnrolled: 300,
  })

  return (
    <CContainer fluid>
      <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 3 }} className="g-4">
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="text-center">Total Employees</CCardHeader>
            <CCardBody className="text-center">
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
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="text-center">Paid Employees</CCardHeader>
            <CCardBody className="text-center">
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
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader className="text-center">Benefits Enrolled</CCardHeader>
            <CCardBody className="text-center">
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
