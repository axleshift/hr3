import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CSpinner,
  CAlert,
} from '@coreui/react'

const Adjustment = () => {
  const [adjustmentType, setAdjustmentType] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Basic form validation
    if (!adjustmentType || !amount || !reason) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    const formData = {
      payrollId,
      adjustmentType,
      amount,
      reason,
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await axios.post('http://localhost:8000/api/payroll-adjustments', formData)
      setSuccessMessage('Adjustment added successfully.')
      // Reset form
      setAdjustmentType('')
      setAmount('')
      setReason('')
    } catch (err) {
      setErrorMessage('Error adding adjustment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Payroll Adjustment</strong>
      </CCardHeader>
      <CCardBody>
        {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
        {successMessage && <CAlert color="success">{successMessage}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol sm={10}>
              <CFormSelect
                label="Adjustment Type"
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                required
              >
                <option value="">Select Adjustment Type</option>
                <option value="advance">Advance</option>
                <option value="loan">Loan</option>
                <option value="reimbursement">Reimbursement</option>
                <option value="unpaid_leave">Unpaid Leave</option>
                <option value="penalty">Penalty</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={10}>
              <CFormInput
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol sm={10}>
              <CFormTextarea
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </CCol>
          </CRow>

          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Submit Adjustment'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Adjustment
