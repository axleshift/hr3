import React, { useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CCol,
  CRow,
  CButton,
  CFormInput,
} from '@coreui/react'

const PaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState('')
  const [employeeData, setEmployeeData] = useState({
    name: '',
    paymentMethod: '',
    accountNumber: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate the form data
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    if (paymentMethod === 'Bank Transfer' && !accountNumber) {
      setError('Account number is required for Bank Transfer')
      return
    }

    const formData = {
      ...employeeData,
      paymentMethod,
      accountNumber,
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:8000/api/addpayroll', formData)
      console.log('Form data submitted successfully:', response.data)

      setEmployeeData({ name: '', paymentMethod: '', accountNumber: '' })
      setPaymentMethod('')
      setAccountNumber('')
    } catch (err) {
      // Handle any error that occurs during the request
      setError('An error occurred while submitting the form')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <h4>Payment Method Form</h4>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol sm={10}>
              <CFormInput
                label="Employee Name"
                type="text"
                name="name"
                id="name"
                value={employeeData.name}
                onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                required
              />
            </CCol>
          </CRow>

          {/* Payment method selection */}
          <CRow className="mb-3">
            <CCol sm={10}>
              <select
                label="Payment Method"
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select a payment method</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>
            </CCol>
          </CRow>

          {/* Account number input */}
          <CRow className="mb-3">
            <CCol sm={10}>
              <CFormInput
                type="text"
                label="Account Number"
                name="accountNumber"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required={paymentMethod === 'Bank Transfer'}
              />
            </CCol>
          </CRow>

          {/* Error message */}
          {error && <div style={{ color: 'red' }}>{error}</div>}

          {/* Submit Button */}
          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default PaymentMethod
