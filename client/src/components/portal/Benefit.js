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
import BenefitsList from './BenefitsList'

const Benefits = () => {
  const [benefits, setBenefits] = useState([])
  const [benefitID, setBenefitID] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [benefitType, setBenefitType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverageAmount, setCoverageAmount] = useState('')
  const [status, setStatus] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('')
  const [editIndex, setEditIndex] = useState(null)

  const isLegalRequirement = (benefitType) => {
    return ['Health_insurance', 'Retirement_plan', 'Paid Time Off', 'Life Insurance'].includes(
      benefitType,
    )
  }

  const handleClear = () => {
    setBenefitID('')
    setEmployeeName('')
    setBenefitType('')
    setStartDate('')
    setEndDate('')
    setCoverageAmount('')
    setStatus('')
    setApprovalStatus('')
    setEditIndex(null)
  }

  const handleSubmit = () => {
    const newBenefit = {
      id: benefitID || Math.random().toString(36).substring(2, 9),
      employeeName,
      benefitType,
      startDate,
      endDate,
      coverageAmount,
      status,
      approvalStatus: isLegalRequirement(benefitType)
        ? 'Approved by Compliance as it meets legal requirements.'
        : 'Not approved by Compliance; does not meet legal requirements.',
    }

    if (editIndex !== null) {
      // Update existing benefit
      const updatedBenefits = [...benefits]
      updatedBenefits[editIndex] = newBenefit
      setBenefits(updatedBenefits)
    } else {
      // Add new benefit
      setBenefits([...benefits, newBenefit])
    }

    handleClear()
  }

  const handleEdit = (index) => {
    const benefit = benefits[index]
    setBenefitID(benefit.id)
    setEmployeeName(benefit.employeeName)
    setBenefitType(benefit.benefitType)
    setStartDate(benefit.startDate)
    setEndDate(benefit.endDate)
    setCoverageAmount(benefit.coverageAmount)
    setStatus(benefit.status)
    setApprovalStatus(benefit.approvalStatus)
    setEditIndex(index)
  }

  const handleDelete = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mt-4">
          <CCardHeader>
            <strong>Benefits List</strong>
          </CCardHeader>
          <CCardBody>
            {benefits.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Benefit Type</th>
                    <th>Coverage Amount</th>
                    <th>Status</th>
                    <th>Approval Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((benefit, index) => (
                    <tr key={benefit.id}>
                      <td>{benefit.employeeName}</td>
                      <td>{benefit.benefitType}</td>
                      <td>{benefit.coverageAmount}</td>
                      <td>{benefit.status}</td>
                      <td>{benefit.approvalStatus}</td>
                      <td>
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </CButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No benefits added yet.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Benefits
