import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [methodToDelete, setMethodToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          employeeName: 'John Kennedy',
          paymentMethod: 'E-Wallet',
          accountNumber: '0987654321',
          paymentSchedule: 'Weekly',
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          paymentMethod: 'Bank Transfer',
          accountNumber: '1234567890',
          paymentSchedule: 'Monthly',
        },
        {
          id: 3,
          employeeName: 'Michael Johnson',
          paymentMethod: 'Bank Transfer',
          accountNumber: '9876543210',
          paymentSchedule: 'Monthly',
        },
      ]

      setPaymentMethods(mockData)
      setLoading(false)
    }, 1000) // Simulate loading delay
  }, [])

  // Handle Delete
  const handleDelete = (id) => {
    setMethodToDelete(id)
    setModalMessage('Are you sure you want to delete this payment method?')
    setShowModal(true)
  }

  const deleteMethod = () => {
    if (methodToDelete) {
      setDeleting(true)
      setTimeout(() => {
        setModalMessage('Payment method deleted successfully!')
        setPaymentMethods((prev) => prev.filter((method) => method.id !== methodToDelete))
        setDeleting(false)
        setMethodToDelete(null)
      }, 1000)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Payment Methods</strong>
      </CCardHeader>
      <CCardBody>
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow style={{ fontWeight: 'bold' }}>
              <CTableDataCell>#</CTableDataCell>
              <CTableDataCell>Employee Name</CTableDataCell>
              <CTableDataCell>Payment Method</CTableDataCell>
              <CTableDataCell>Account Number</CTableDataCell>
              <CTableDataCell>Payment Schedule</CTableDataCell>
              <CTableDataCell>Actions</CTableDataCell>
            </CTableRow>
          </CTableHead>
          <CTableBody className="text-center">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <CTableRow key={method.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{method.employeeName}</CTableDataCell>
                  <CTableDataCell>{method.paymentMethod}</CTableDataCell>
                  <CTableDataCell>{method.accountNumber}</CTableDataCell>
                  <CTableDataCell>{method.paymentSchedule}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" size="sm" onClick={() => handleDelete(method.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="6" className="text-center">
                  No payment methods available.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Delete Confirmation Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalBody>{deleting ? <CSpinner color="primary" /> : modalMessage}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)} disabled={deleting}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={deleteMethod} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Payment
