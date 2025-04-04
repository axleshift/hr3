import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react'
import api from '../../util/api'

const BudgetRequestForm = () => {
  const [formData, setFormData] = useState({
    department: '',
    typeOfRequest: '',
    category: '',
    reason: '',
    totalRequest: '',
    documents: null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const departments = ['Logistics', 'HR', 'Finance', 'IT', 'Operations']
  const requestTypes = ['Training Cost', 'Equipment', 'Travel', 'Software', 'Payroll']
  const categories = [
    'Employee Development',
    'Finance',
    'Operational Costs',
    'Technology',
    'Miscellaneous',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, documents: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // First submit to HR API
      const hrFormData = new FormData()
      for (const key in formData) {
        hrFormData.append(key, formData[key])
      }

      await api.post('/budget-requests', hrFormData)

      // Then submit to Finance API (no API key)
      const financeData = {
        ...formData,
        status: 'Pending', // Default status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await axios.post('https://finance/api/budgetRequest', financeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setSuccess(true)
      setFormData({
        department: '',
        typeOfRequest: '',
        category: '',
        reason: '',
        totalRequest: '',
        documents: null,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <h5>Budget Request Form</h5>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && (
          <CAlert color="success">
            Request submitted successfully to both HR and Finance systems!
          </CAlert>
        )}

        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormSelect
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormSelect
              name="typeOfRequest"
              value={formData.typeOfRequest}
              onChange={handleChange}
              label="Type of Request"
              required
            >
              <option value="">Select Request Type</option>
              {requestTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormSelect
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormInput
              type="textarea"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              label="Reason for Request"
              required
            />
          </div>

          <div className="mb-3">
            <CFormInput
              type="number"
              name="totalRequest"
              value={formData.totalRequest}
              onChange={handleChange}
              label="Total Amount Requested"
              required
            />
          </div>

          <div className="mb-3">
            <CFormInput
              type="file"
              name="documents"
              onChange={handleFileChange}
              label="Supporting Document"
            />
          </div>

          <div className="d-grid gap-2">
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? (
                <>
                  <CSpinner component="span" size="sm" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default BudgetRequestForm
