import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom' // Import useNavigate hook
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CButton,
} from '@coreui/react'

const Deduction = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { deductionsList } = location.state || { deductionsList: [] }

  const AddDeduction = () => {
    navigate('/deduct')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Deductions</strong>
            <CButton color="primary" size="sm" className="float-end" onClick={AddDeduction}>
              Add Deduction
            </CButton>
          </CCardHeader>
          <CCardBody>
            {deductionsList.length > 0 ? (
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Employee Name</CTableHeaderCell>
                    <CTableHeaderCell>Deduction Type</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deductionsList.map((deduction, index) => (
                    <CTableRow key={deduction.deductionID}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{deduction.employeeName}</CTableDataCell>
                      <CTableDataCell>{deduction.deductionType}</CTableDataCell>
                      <CTableDataCell>{deduction.amount}</CTableDataCell>
                      <CTableDataCell>{deduction.created_at}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <p>No deductions to display.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Deduction
