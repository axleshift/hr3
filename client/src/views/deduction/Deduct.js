import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CAlert,
  CInputGroup,
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import { employees } from '../mock data/employee'
import axios from 'axios'

const Deduct = () => {
  const navigate = useNavigate()

  const [deductionInput, setDeduction] = useState({
    employeeId: '',
    employeeName: '',
    deductionType: '',
    amount: '',
  })

  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDeduction({ ...deductionInput, [name]: value })
  }

  const fetchEmployeeName = (e) => {
    const employeeId = e.target.value
    setDeduction({ ...deductionInput, employeeId: employeeId })

    if (employeeId) {
      const employee = employees.find((emp) => emp.employee_id.toString() === employeeId)

      if (employee) {
        setDeduction({ ...deductionInput, employeeName: employee.name })
        setError('')
      } else {
        setError('Employee not found')
        setDeduction({ ...deductionInput, employeeName: '' })
      }
    } else {
      setError('')
      setDeduction({ ...deductionInput, employeeName: '' })
    }
  }

  const saveDeduction = async (e) => {
    e.preventDefault()

    const data = {
      employeeId: deductionInput.employeeId,
      employeeName: deductionInput.employeeName,
      deductionType: deductionInput.deductionType,
      amount: Math.round(deductionInput.amount) || 0,
    }

    try {
      const response = await axios.post('http://localhost:8000/api/deduct', data)
      console.log('Saving deduction data:', response.data)
      navigate('/deduction')
    } catch (error) {
      console.error('Error submitting deduction:', error)
      setError('Something went wrong. Please try again later.')
    }
  }

  return (
    <CRow className="justify-content-left">
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong className="flex-grow-1 text-start">Add Deductions</strong>
            <CButton color="danger" size="sm" onClick={() => navigate('/deduction')}>
              Back
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={saveDeduction}>
              {error && <CAlert color="danger">{error}</CAlert>}

              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="employeeId"
                    onChange={fetchEmployeeName}
                    value={deductionInput.employeeId}
                    label="Employee ID"
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="text"
                    name="employeeName"
                    value={deductionInput.employeeName}
                    label="Employee Name"
                    disabled
                  />
                </CCol>
                <CRow>
                  <CCol className="mb-3">
                    <CFormLabel>Deduction Type</CFormLabel>
                    <CInputGroup>
                      <CFormSelect
                        name="deductionType"
                        value={deductionInput.deductionType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Deduction Type</option>
                        <option value="SSS">SSS</option>
                        <option value="PhilHealth">PhilHealth</option>
                        <option value="Pag-IBIG">Pag-IBIG</option>
                        <option value="Withholding Tax">Withholding Tax</option>
                        <option value="Other Deductions">Other Deductions</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>

                  <CCol className="mb-3">
                    <CFormInput
                      type="number"
                      name="amount"
                      value={deductionInput.amount}
                      onChange={handleInputChange}
                      label="Amount"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol className="mb-3">
                    <CButton type="submit" color="primary">
                      Save
                    </CButton>
                  </CCol>
                </CRow>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Deduct
