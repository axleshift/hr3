import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CSpinner,
  CFormLabel,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const Employee = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [formData, setFormData] = useState({
    job_position: '',
    department: '',
    salary: '',
    employee_id: '',
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/employees')
      if (Array.isArray(response.data)) {
        const employeesWithSalaries = await Promise.all(
          response.data.map(async (employee) => {
            const salary = await fetchSalary(employee.department, employee.job_position)
            return { ...employee, salary }
          }),
        )
        setEmployees(employeesWithSalaries)
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSalary = async (department, jobPosition) => {
    try {
      const response = await api.get('/api/salaries', {
        params: { department, job_position: jobPosition },
      })
      return response.data ? response.data : null
    } catch (error) {
      console.error('Error fetching salary:', error)
      return null
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/salaries', formData)
      setModalVisible(false)
      fetchEmployees()
    } catch (error) {
      console.error('Error submitting salary:', error)
    }
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Employee</strong>
        <div className="float-end">
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading...</p>
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Employee ID</CTableHeaderCell>
                <CTableHeaderCell className="center-text">Name</CTableHeaderCell>
                <CTableHeaderCell>Job Position</CTableHeaderCell>
                <CTableHeaderCell>Department</CTableHeaderCell>
                <CTableHeaderCell>Salary</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {employees.map((employee) => (
                <CTableRow key={employee.id}>
                  <CTableDataCell>{employee.employee_id}</CTableDataCell>
                  <CTableDataCell>{employee.name}</CTableDataCell>
                  <CTableDataCell>{employee.job_position}</CTableDataCell>
                  <CTableDataCell>{employee.department}</CTableDataCell>
                  <CTableDataCell>
                    {employee.salary ? `${employee.salary.salary}` : 'N/A'}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Salary</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit}>
            <CFormLabel>Job Position</CFormLabel>
            <CFormInput
              name="job_position"
              placeholder="Job Position"
              onChange={handleInputChange}
              required
            />

            <CFormLabel>Department</CFormLabel>
            <CFormInput
              name="department"
              placeholder="Department"
              onChange={handleInputChange}
              required
            />

            <CFormLabel>Salary</CFormLabel>
            <CFormInput
              type="number"
              name="salary"
              placeholder="Salary"
              onChange={handleInputChange}
              required
            />

            <CButton type="submit" color="primary">
              Add Salary
            </CButton>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Employee
