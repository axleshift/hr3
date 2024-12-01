import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // Import axios here
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
  CButton,
} from '@coreui/react'

const Deduction = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [deductions, setDeductions] = useState([]) // State for deductions

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/deductions') // Corrected the API endpoint
      .then((res) => {
        if (res.status === 200) {
          setDeductions(res.data.deductions || []) // Set deductions data
        }
      })
      .catch((error) => {
        console.error('Error fetching deductions:', error)
      })
      .finally(() => setLoading(false))
  }, [])

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
            {loading ? (
              <div>Loading...</div> // Display loading message while data is being fetched
            ) : (
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow className="text-center">
                    <CTableDataCell>#</CTableDataCell>
                    <CTableDataCell>Employee Name</CTableDataCell>
                    <CTableDataCell>Deduction Type</CTableDataCell>
                    <CTableDataCell>Amount</CTableDataCell>
                    <CTableDataCell>Date</CTableDataCell>
                    <CTableDataCell>Actions</CTableDataCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody className="text-center">
                  {deductions.length > 0 ? (
                    deductions.map((deduction) => (
                      <CTableRow key={deduction.id}>
                        <CTableDataCell>{deduction.employeeId}</CTableDataCell>
                        <CTableDataCell>{deduction.employeeName}</CTableDataCell>
                        <CTableDataCell>{deduction.deductionType}</CTableDataCell>
                        <CTableDataCell>{deduction.amount}</CTableDataCell>
                        <CTableDataCell>{deduction.date}</CTableDataCell>
                        <CTableDataCell>
                          <CButton className="me-2" color="success" size="sm">
                            Edit
                          </CButton>
                          <CButton color="danger" size="sm">
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No deductions available.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Deduction
