import React, { useState } from 'react'

import {
  CCardHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CCard,
  CCol,
  CCardBody,
  CFormSelect,
} from '@coreui/react'

const Payrol = () => {
  const [employeeID, setEmpID] = useState('')
  const [employeeName, setEmpName] = useState('')
  const [Department, setDepart] = useState('')
  const [salary, setSalary] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [numDays, setNumDays] = useState('')
  const [ratePerDay, setRatePerDay] = useState('')

  const handleSubmit = () => { 
    console.log({
      employeeID,
      employeeName,
      Department,
      salary, 
      paymentMethod,
      numDays,
      ratePerDay,
    })
  }

  const handleClear = () => {
    setEmpID('')
    setEmpName('')
    setDepart('')
    setSalary('')
    setPaymentMethod('')
    setNumDays('')
    setRatePerDay('')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader><strong>Employee Details</strong></CCardHeader>
          <CCardBody>
            <CInputGroup className="mb-2">
              <CInputGroupText id="empID">Employee ID:</CInputGroupText>
                <CFormInput disabled locale="en-US"
                  placeholder="Enter employee ID"
                  value={employeeID}
                  onChange={(e) => setEmpID(e.target.value)}/>
            </CInputGroup>

            <CInputGroup className="mb-2">
              <CInputGroupText>Employee Name:</CInputGroupText>
                <CFormInput
                  value={employeeName}
                  onChange={(e) => setEmpName(e.target.value)}/>
            </CInputGroup>

            <CInputGroup className="mb-2">
              <CInputGroupText>Department:</CInputGroupText>
                <CFormInput
                  value={Department}
                  onChange={(e) => setDepart(e.target.value)}/>
            </CInputGroup>

            <CRow>
              <CCol md={6}>
                <CInputGroup className="mb-2">
                  <CInputGroupText>Payment Method:</CInputGroupText>
                    <CFormSelect
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="digital_wallet">Digital Wallet</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>

              <CCol md={6}>
                <CInputGroup className="mb-2">
                  <CInputGroupText>Date:</CInputGroupText>
                  <CFormInput
                    placeholder="Enter number of days"
                    value={numDays}
                    onChange={(e) => setNumDays(e.target.value)}/>
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CInputGroup className="mb-2">
                  <CInputGroupText>Rate per Day:</CInputGroupText>
                  <CFormInput
                    placeholder="Enter rate per day"
                    value={ratePerDay}
                    onChange={(e) => setRatePerDay(e.target.value)}/>
                </CInputGroup>
              </CCol>

              <CInputGroup className="mb-2">
                  <CInputGroupText>Payment Method:</CInputGroupText>
                    <CFormSelect
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="digital_wallet">Digital Wallet</option>
                  </CFormSelect>
                </CInputGroup>

              <CCol md={6}>
                <CInputGroup className="mb-2">
                  <CInputGroupText>Basic Salary:</CInputGroupText>
                    <CFormSelect
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}>
                        <option value="">Select payment method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="digital_wallet">Digital Wallet</option>
                    </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>

              <div className="d-flex justify-content-center">
                <CButton className="mb-2 me-2" color="primary" variant="outline" onClick={handleSubmit}>
                Submit
              </CButton>

              <CButton className="mb-2" color="primary" variant="outline" onClick={handleClear}>
                Clear
              </CButton></div>
              
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Payrol

