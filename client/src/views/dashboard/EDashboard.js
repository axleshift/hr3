import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import { Link } from 'react-router-dom'

const EDashboard = () => {
  return (
    <CRow>
      <CCol md={4}>
        <Link to="/payslips">
          <CCard className="text-center">
            <CCardHeader>Payslips</CCardHeader>
            <CCardBody>View your payslips</CCardBody>
          </CCard>
        </Link>
      </CCol>

      <CCol md={4}>
        <Link to="/leave-request">
          <CCard className="text-center">
            <CCardHeader>Leave Request</CCardHeader>
            <CCardBody>Submit leave requests</CCardBody>
          </CCard>
        </Link>
      </CCol>

      <CCol md={4}>
        <Link to="/leave-history">
          <CCard className="text-center">
            <CCardHeader>Leave History</CCardHeader>
            <CCardBody>View past leave requests</CCardBody>
          </CCard>
        </Link>
      </CCol>
    </CRow>
  )
}

export default EDashboard
