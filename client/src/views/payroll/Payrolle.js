import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CSpinner,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faFile } from '@fortawesome/free-solid-svg-icons'

const Payroll = () => {
  const [loading, setLoading] = useState(true)
  const [payrolls, setPayrolls] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [payrollToDelete, setPayrollToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/payrolls`)
      .then((res) => {
        if (res.status === 200) {
          setPayrolls(res.data.payrolls || [])
        }
      })
      .catch((error) => {
        console.error('Error fetching payrolls:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const getEmployeeDetails = (employeeId) => {
    return employees.find((emp) => emp.employee_id === employeeId) || {}
  }

  const deletePayroll = () => {
    if (payrollToDelete) {
      setDeleting(true) // Start loading during deletion
      axios
        .delete(`http://localhost:8000/api/deletepayroll/${payrollToDelete}`)
        .then((res) => {
          if (res.data.status === 200) {
            setModalMessage('Payroll record deleted successfully!')
            setPayrolls((prevPayrolls) =>
              prevPayrolls.filter((payroll) => payroll.id !== payrollToDelete),
            ) // Optimistic update
            setDeleted(true) // Mark as deleted
          } else if (res.data.status === 404) {
            setModalMessage('Error: ' + res.data.message)
          }
        })
        .catch(() => {
          setModalMessage('An error occurred while deleting the payroll record.')
        })
        .finally(() => {
          setShowModal(true) // Show the modal with the result message
          setDeleting(false) // Stop loading
          setPayrollToDelete(null) // Reset the payroll to delete
        })
    }
  }

  const generatePayslip = (id) => {
    window.open(`http://localhost:8000/api/payroll/${id}/payslip`, '_blank')
  }

  const AddPayroll = () => {
    navigate('/addpayroll')
  }

  const handleEditPayroll = (id) => {
    navigate(`/editpayroll/${id}`)
  }

  const handleDeleteClick = (id) => {
    setPayrollToDelete(id) // Set the payroll ID to delete
    setModalMessage('Are you sure you want to delete this payroll record?')
    setShowModal(true)
    setDeleted(false) // Reset the deleted state before opening the modal
  }

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
        <CCol className="col-md-15">
          <CCard>
            <CCardHeader>
              <strong>Manage Payroll</strong>
              <CButton color="primary" size="sm" className="float-end" onClick={AddPayroll}>
                Add Payroll
              </CButton>
            </CCardHeader>

            <CCardBody>
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow className="text-center" style={{ fontWeight: 'bold' }}>
                    <CTableDataCell>#</CTableDataCell>
                    <CTableDataCell>Employee Name</CTableDataCell>
                    <CTableDataCell>Department</CTableDataCell>
                    <CTableDataCell>Salary</CTableDataCell>
                    <CTableDataCell>Status</CTableDataCell>
                    <CTableDataCell>Action</CTableDataCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody className="text-center">
                  {payrolls.length > 0 ? (
                    payrolls.map((payroll) => {
                      const employee = getEmployeeDetails(payroll.employeeId)
                      return (
                        <CTableRow key={payroll.id}>
                          <CTableDataCell>{payroll.employeeId}</CTableDataCell>
                          <CTableDataCell>{employee.name}</CTableDataCell>
                          <CTableDataCell>{employee.department}</CTableDataCell>
                          <CTableDataCell>{payroll.basicSalary}</CTableDataCell>
                          <CTableDataCell>{payroll.status}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              className="me-2"
                              color="success"
                              size="sm"
                              onClick={() => handleEditPayroll(payroll.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </CButton>
                            <CButton
                              className="me-2"
                              color="info"
                              size="sm"
                              onClick={() => generatePayslip(payroll.id)}
                            >
                              <FontAwesomeIcon icon={faFile} />
                            </CButton>
                            {/* <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(payroll.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </CButton> */}
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No payroll data available.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Delete Confirmation Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalBody>{deleting ? <CSpinner color="primary" /> : modalMessage}</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setShowModal(false)}
            disabled={deleting || deleted}
          >
            Cancel
          </CButton>
          <CButton
            color="danger"
            onClick={deletePayroll}
            disabled={deleting || deleted} // Disable delete button after success
          >
            {deleting ? 'Deleting...' : deleted ? 'Deleted' : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Payroll
