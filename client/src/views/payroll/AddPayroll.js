import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  // CFormTextarea,
} from '@coreui/react'

import { calculateTotalHoursWorked } from '../mock data/attendanceUtils'
import { employees } from '../mock data/employee'

const AddPayroll = () => {
  const navigate = useNavigate()
  const [payrollInput, setPayroll] = useState({
    employeeId: '',
    employeeName: '',
    basicSalary: '',
    overtime: '',
    bonus: '',
    deductions: '',
    hoursWorked: '',
    benefits: '',
    accountNumber: '',
    hourlyRate: '',
    // note: '',
  })

  const [netSalary, setNetSalary] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [attendanceData, setAttendanceData] = useState([])

  const handleEmployeeIdChange = (e) => {
    const selectedEmployeeId = e.target.value
    setPayroll({ ...payrollInput, employeeId: selectedEmployeeId })

    const selectedEmployee = employees.find(
      (emp) => emp.employee_id === parseInt(selectedEmployeeId),
    )

    if (selectedEmployee) {
      setPayroll((prev) => ({
        ...prev,
        employeeName: selectedEmployee.name,
        hoursWorked: calculateTotalHoursWorked(selectedEmployee.attendance),
        accountNumber: selectedEmployee.accountNumber,
      }))
      setAttendanceData(selectedEmployee.attendance)
      setPaymentMethod(selectedEmployee.paymentMethod)
    } else {
      setPayroll((prev) => ({
        ...prev,
        employeeName: '',
        hoursWorked: '',
        accountNumber: '',
      }))
      setPaymentMethod('')
    }
  }

  // Calculate Net Salary
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
      employeeId: '',
      employeeName: '',
      basicSalary: '',
      overtime: '',
      bonus: '',
      deductions: '',
      hoursWorked: '',
      benefits: '',
      accountNumber: '',
      // note: '',
    })
    setNetSalary(0)
    setPaymentMethod('')
    setAttendanceData([])
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
  }

  const savePayroll = async (e) => {
    e.preventDefault()

    const data = {
      employeeId: payrollInput.employeeId,
      employeeName: payrollInput.employeeName,
      basicSalary: Math.round(payrollInput.basicSalary),
      overtime: Math.round(payrollInput.overtime) || 0,
      benefits: Math.round(payrollInput.benefits) || 0,
      bonus: Math.round(payrollInput.bonus) || 0,
      deductions: Math.round(payrollInput.deductions) || 0,
      netSalary: Math.round(netSalary),
      hoursWorked: payrollInput.hoursWorked,
      paymentMethod,
      accountNumber: payrollInput.accountNumber || null,
      hourlyRate: payrollInput.hourlyRate,
      // note: payrollInput.note || null,
    }

    try {
      const response = await axios.post('http://localhost:8000/api/addpayroll', data)
      console.log(response.data)
      if (response.data.status === 200) return navigate('/payroll')
      if (response.data.status === 422)
        setPayroll({ ...payrollInput, error_list: response.data.validate_err })
    } catch (error) {
      console.error('Error in POST request:', error.response || error)
    }
  }

  return (
    <CRow className="justify-content-left">
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong className="flex-grow-1 text-start">Add Payroll</strong>
            <Link to="/payroll" className="btn btn-danger btn-sm">
              Back
            </Link>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={savePayroll}>
              <CRow>
                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="employeeId"
                    onChange={handleEmployeeIdChange}
                    value={payrollInput.employeeId}
                    label="Employee ID"
                  />
                </CCol>
                <CCol className="mb-3">
                  <CFormInput
                    type="text"
                    name="employeeName"
                    value={payrollInput.employeeName}
                    onChange={handleInput}
                    label="Employee Name"
                    disabled
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
                    value={payrollInput.hoursWorked}
                    label="Hours Worked"
                    readOnly
                  />
                </CCol>

                <CCol className="mb-3">
                  <CFormInput
                    type="number"
                    name="hourlyRate"
                    onChange={handleInput}
                    value={payrollInput.hourlyRate}
                    label="Hourly Rate"
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
                    onChange={handlePaymentMethodChange}
                    value={paymentMethod || ''}
                    label="Payment Method"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="E-Wallet">E-Wallet</option>
                  </CFormSelect>
                </CCol>

                <CCol className="mb-3">
                  <CFormInput
                    type="text"
                    name="accountNumber"
                    onChange={handleInput}
                    value={payrollInput.accountNumber}
                    label="Account Number"
                  />
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

              <CFormSelect
                name="status"
                onChange={handleInput}
                value={payrollInput.status || 'Pending'}
                label="Status"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Processed">Processed</option>
                <option value="Paid">Paid</option>
              </CFormSelect>

              {/* <CRow>
                <CCol className="mb-3">
                  <CFormTextarea
                    name="note"
                    onChange={handleInput}
                    value={payrollInput.note}
                    label="Note"
                    placeholder="Add any notes here"
                  />
                </CCol>
              </CRow> */}

              <div className="d-flex justify-content-end">
                <CButton type="submit" color="primary" className="me-2">
                  Save
                </CButton>
                <CButton type="button" color="danger" onClick={resetInputs}>
                  Clear
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddPayroll
