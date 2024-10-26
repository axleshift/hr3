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

const Benefits = () => {
  const [benefitID, setBenefitID] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [benefitType, setBenefitType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverageAmount, setCoverageAmount] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = () => {
    console.log({
      benefitID,
      employeeName,
      benefitType,
      startDate,
      endDate,
      coverageAmount,
      status,
    })
  }

  const handleClear = () => {
    setBenefitID('')
    setEmployeeName('')
    setBenefitType('')
    setStartDate('')
    setEndDate('')
    setCoverageAmount('')
    setStatus('')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Employee Benefits</strong>
          </CCardHeader>
          <CCardBody>
            <CInputGroup className="mb-3">
              <CInputGroupText id="benefitID">Benefit ID:</CInputGroupText>
              <CFormInput
                disabled
                placeholder="Auto-generated"
                value={benefitID}
                onChange={(e) => setBenefitID(e.target.value)}
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Employee Name:</CInputGroupText>
              <CFormInput
                placeholder="Enter employee name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </CInputGroup>

            <CRow>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Benefit Type:</CInputGroupText>
                  <CFormSelect value={benefitType} onChange={(e) => setBenefitType(e.target.value)}>
                    <option value="">Select benefit type</option>
                    <option value="Health_insurance">Health Insurance</option>
                    <option value="Paid Time Off">Paid Time Off</option>
                    <option value="Life_insurance">Life Insurance</option>
                    <option value="Retirement_plan">Retirement Plan</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Coverage Amount:</CInputGroupText>
                  <CFormInput
                    type="number"
                    placeholder="Enter coverage amount"
                    value={coverageAmount}
                    onChange={(e) => setCoverageAmount(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Start Date:</CInputGroupText>
                  <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>End Date:</CInputGroupText>
                  <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Status:</CInputGroupText>
                  <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-center">
              <CButton
                className="mb-2 me-2"
                color="primary"
                variant="outline"
                onClick={handleSubmit}
              >
                Submit
              </CButton>

              <CButton className="mb-2" color="primary" variant="outline" onClick={handleClear}>
                Clear
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Benefits
