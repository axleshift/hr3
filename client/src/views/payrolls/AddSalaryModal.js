import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalBody, CModalFooter, CFormInput, CButton, CSpinner } from '@coreui/react'
import axios from 'axios'

const AddSalaryModal = ({ employeeId, showModal, onClose, onSubmit }) => {
  const [salary, setSalary] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setSalary(e.target.value)
  }

  const handleSubmit = async () => {
    if (!salary) return

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:8000/api/addpayroll', {
        employeeId,
        basicSalary: salary,
      })

      if (response.status === 200) {
        onSubmit(salary)
        onClose()
      } else {
        alert('Error updating salary')
      }
    } catch (error) {
      console.error('Error adding salary:', error)
      alert('An error occurred while adding the salary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal visible={showModal} onClose={onClose}>
      <CModalBody>
        <div>
          <CFormInput
            type="number"
            label="Basic Salary"
            value={salary}
            onChange={handleInputChange}
            required
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading || !salary}>
          {loading ? <CSpinner size="sm" /> : 'Add Salary'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

AddSalaryModal.propTypes = {
  employeeId: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default AddSalaryModal
