import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
  CFormInput,
} from '@coreui/react'
import api from '../../util/api' // Assuming you are using an API utility for making requests

const LeaveCredit = () => {
  const [visible, setVisible] = useState(false)
  const [leaveCredits, setLeaveCredits] = useState({
    LWOP: '',
    SL: '',
    VL: '',
  })
  const [initialCredits, setInitialCredits] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch existing leave credits from the API when the component is loaded
    const fetchLeaveCredits = async () => {
      try {
        const response = await api.get('/leave-credits') // Adjust the API endpoint if necessary
        if (response.data) {
          const fetchedCredits = response.data // Assuming the API response has leave credits
          setLeaveCredits(fetchedCredits)
          setInitialCredits(fetchedCredits) // Save the initial values to compare later
        }
      } catch (error) {
        console.error('Error fetching leave credits:', error)
      }
    }

    fetchLeaveCredits()
  }, [])

  const handleInputChange = (type, value) => {
    setLeaveCredits({ ...leaveCredits, [type]: value })
  }

  const isFormChanged = () => {
    // Compare the current leave credits with the initial state to check if any changes were made
    return JSON.stringify(leaveCredits) !== JSON.stringify(initialCredits)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await api.put(`/leave-credits/${leaveCredits.employee_id}`, leaveCredits) // Assuming you have an endpoint for updating leave credits
      if (response.data) {
        // Successfully updated leave credits
        setInitialCredits(leaveCredits) // Update the initial credits to the new ones
        setVisible(false) // Close the modal
        setLeaveCredits(response.data.data) // Update the leaveCredits state with the new data from the backend
      }
    } catch (error) {
      console.error('Error saving leave credits:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>Employee Record</CCardHeader>
        <CCardBody>
          <p>
            <strong>Employee ID:</strong> 6231415
          </p>
          <p>
            <strong>Name:</strong> John D Smith
          </p>
          <p>
            <strong>Department:</strong> IT
          </p>
          <p>
            <strong>Designation:</strong> Web Developer
          </p>
          <CButton color="primary" onClick={() => setVisible(true)}>
            Manage Leave Credits
          </CButton>
        </CCardBody>
      </CCard>

      <CCard className="mt-3">
        <CCardHeader>Leave Credits</CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Allowable</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Object.entries(leaveCredits).map(([type, value]) => (
                <CTableRow key={type}>
                  <CTableDataCell>{type}</CTableDataCell>
                  <CTableDataCell>{value}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Manage Leave Credits</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {Object.entries(leaveCredits).map(([type, value]) => (
            <div key={type} className="mb-3">
              <CFormCheck id={type} label={type} defaultChecked />
              <CFormInput
                type="number"
                value={value}
                onChange={(e) => handleInputChange(type, e.target.value)}
              />
            </div>
          ))}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave} disabled={!isFormChanged() || loading}>
            {loading ? 'Saving...' : 'Save'}
          </CButton>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default LeaveCredit
