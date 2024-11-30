import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
} from '@coreui/react'

const EditPayroll = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [payrollInput, setPayroll] = useState({
    employeeName: '',
    basicSalary: '',
    overtime: '',
    bonus: '',
    deductions: '',
    hoursWorked: 0,
    benefits: '',
    accountNumber: '',
    status: 'Pending',
  })
  const [netSalary, setNetSalary] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:8000/api/edit-payroll/${id}`).then((res) => {
      if (res.data.status === 200) {
        setPayroll({
          employeeName: res.data.payroll.employeeName || '',
          basicSalary: res.data.payroll.basicSalary || '0',
          overtime: res.data.payroll.overtime || '0',
          bonus: res.data.payroll.bonus || '0',
          deductions: res.data.payroll.deductions || '0',
          hoursWorked: res.data.payroll.hoursWorked || '0',
          benefits: res.data.payroll.benefits || '0',
          accountNumber: res.data.payroll.accountNumber || '',
          status: res.data.payroll.status || 'Pending',
        })
        setPaymentMethod(res.data.payroll.paymentMethod || '')
        setNetSalary(res.data.payroll.netSalary || 0)
        setLoading(false)
      } else if (res.data.status === 404) {
        navigate('/payroll')
      }
    })
  }, [id, navigate])

  useEffect(() => {
    const calculateNetSalary = () => {
      const basicSalary = parseFloat(payrollInput.basicSalary) || 0
      const overtime = parseFloat(payrollInput.overtime) || 0
      const benefits = parseFloat(payrollInput.benefits) || 0
      const bonus = parseFloat(payrollInput.bonus) || 0
      const deductions = parseFloat(payrollInput.deductions) || 0
      const net = basicSalary + overtime + bonus - (deductions + benefits)
      setNetSalary(net)
    }

    calculateNetSalary()
  }, [payrollInput])

  const handleInput = (e) => {
    e.persist()
    setPayroll({ ...payrollInput, [e.target.name]: e.target.value })
  }

  const resetInputs = () => {
    setPayroll({
      employeeName: '',
      basicSalary: '',
      overtime: '',
      bonus: '',
      deductions: '',
      hoursWorked: 0,
      benefits: '',
      accountNumber: '',
    })
    setNetSalary(0)
    setPaymentMethod('')
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const updatePayroll = async (e) => {
    e.preventDefault()

    const data = {
      employeeName: payrollInput.employeeName,
      basicSalary: Math.round(payrollInput.basicSalary),
      overtime: Math.round(payrollInput.overtime) || 0,
      benefits: Math.round(payrollInput.benefits) || 0,
      bonus: Math.round(payrollInput.bonus) || 0,
      deductions: Math.round(payrollInput.deductions) || 0,
      netSalary: Math.round(netSalary), // Ensure netSalary is a number here
      hoursWorked: payrollInput.hoursWorked,
      paymentMethod,
      accountNumber: payrollInput.accountNumber || null,
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/payrolls/${id}`, data)
      if (response.data.status === 200) {
        navigate('/payroll')
      } else if (response.data.status === 422) {
        // Handle validation errors
      }
    } catch (error) {
      console.error('Error updating payroll:', error)
    }
  }

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <strong>Loading Payroll Data...</strong>
      </div>
    )
  }

  return (
    <CRow className="justify-content-left">
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong className="flex-grow-1 text-start">Edit Payroll</strong>
            <Link to="/payroll" className="btn btn-danger btn-sm">
              Back
            </Link>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={updatePayroll}>
              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="text"
                    name="employeeName"
                    onChange={handleInput}
                    value={payrollInput.employeeName}
                    label="Employee Name"
                    required
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="basicSalary"
                    onChange={handleInput}
                    value={payrollInput.basicSalary}
                    label="Basic Salary"
                    required
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="overtime"
                    onChange={handleInput}
                    value={payrollInput.overtime}
                    label="Overtime"
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="bonus"
                    onChange={handleInput}
                    value={payrollInput.bonus}
                    label="Bonus"
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="hoursWorked"
                    onChange={handleInput}
                    value={payrollInput.hoursWorked}
                    label="Hours Worked"
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="deductions"
                    onChange={handleInput}
                    value={payrollInput.deductions}
                    label="Deductions"
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="benefits"
                    onChange={handleInput}
                    value={payrollInput.benefits}
                    label="Benefits"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol className="mb-3">
                  <CFormSelect
                    name="paymentMethod"
                    onChange={handlePaymentMethodChange} // Update to use the dedicated handler
                    value={paymentMethod}
                    label="Payment Method"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Cash">Cash</option>
                  </CFormSelect>
                </CCol>

                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="accountNumber"
                    onChange={handleInput}
                    value={payrollInput.accountNumber}
                    label="Account Number"
                  />
                </CCol>
              </CRow>

              <CRow>
                <CCol className="mb-3">
                  <CFormSelect
                    name="status"
                    onChange={handleInput} // Use the handleInput function to update the state
                    value={payrollInput.status}
                    label="Payroll Status"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Processed">Processed</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="align-items-center">
                <CCol className="mb-3 d-flex align-items-center">
                  <CInputGroup className="mb-3">
                    <CInputGroupText id="basic-addon-net-salary">Net Salary:</CInputGroupText>
                    <CFormInput
                      placeholder="Net Salary"
                      aria-label="Net Salary"
                      aria-describedby="basic-addon-net-salary"
                      value={Math.round(netSalary).toLocaleString()}
                      readOnly
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              <CCol className="d-flex justify-content-center align-items-center gap-6">
                <CButton type="submit" color="primary">
                  Save
                </CButton>
                <CButton className="ms-2" type="button" onClick={resetInputs} color="secondary">
                  Clear
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditPayroll
