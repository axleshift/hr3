import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:8000/api/benefits'

  // Function to submit form data
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const benefitData = {
      employee_name: employeeName,
      benefit_type: benefitType,
      status,
    }

    try {
      const response = await axios.post(API_URL, benefitData)
      console.log('Success:', response.data)
      alert('Benefit saved successfully!')
      handleClear()
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Failed to submit data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch benefit details if `benefitID` is set
  useEffect(() => {
    if (!benefitID) return

    const fetchBenefitDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/${benefitID}`)
        const data = response.data
        setEmployeeName(data.employee_name)
        setBenefitType(data.benefit_type)
        setStatus(data.status)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Error fetching benefit details.')
      } finally {
        setLoading(false)
      }
    }

    fetchBenefitDetails()
  }, [benefitID])

  // Function to clear the form
  const handleClear = () => {
    setBenefitID('')
    setEmployeeName('')
    setBenefitType('')
    setStatus('')
    setError(null)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Employee Benefits</strong>
          </CCardHeader>
          <CCardBody>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <CInputGroup className="mb-3">
              <CInputGroupText>Benefit ID:</CInputGroupText>
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
                    <option value="health_insurance">Health Insurance</option>
                    <option value="dental_insurance">Dental Insurance</option>
                    <option value="life_insurance">Life Insurance</option>
                    <option value="retirement_plan">Retirement Plan</option>
                    <option value="paid_time_off">Paid Time Off</option>
                  </CFormSelect>
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
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
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
