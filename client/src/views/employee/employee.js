import React from 'react'
import { 
  CRow, 
  CCol, 
  CCard, // Add this import
  CCardHeader, 
  CCardBody, // Add this import
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
} 
from '@coreui/react'

const Employee = () => {
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader><strong>Employee Details</strong></CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead className="text-center">
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Department</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Employment Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
            </CTable> 
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>  
  )
}

export default Employee
