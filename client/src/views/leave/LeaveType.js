import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CBadge,
  CFormLabel,
  CAlert,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const LeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [error, setError] = useState('')
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    type: 'Paid',
    pay_rate: 100,
    // description: '',
    // max_days_per_year: '0',
    eligibility_rules: '',
  })

  const [editLeaveType, setEditLeaveType] = useState({
    id: null,
    name: '',
    type: 'Paid',
    pay_rate: 100,
    // description: '',
    // max_days_per_year: '0',
    eligibility_rules: '',
  })

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get('/leave-types')
      if (Array.isArray(response.data)) {
        const formattedData = response.data.map((type) => ({
          ...type,
          pay_rate: parseFloat(type.pay_rate) || 0,
        }))
        setLeaveTypes(formattedData)
      } else {
        console.error('Expected an array of leave types, but received:', response.data)
      }
    } catch (error) {
      console.error('Error fetching leave types:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedLeaveType = { ...newLeaveType, [name]: value }

    if (name === 'type' && value === 'Unpaid') {
      updatedLeaveType.pay_rate = 0
    }

    setNewLeaveType(updatedLeaveType)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    const updatedLeaveType = { ...editLeaveType, [name]: value }

    if (name === 'type' && value === 'Unpaid') {
      updatedLeaveType.pay_rate = 0
    }

    setEditLeaveType(updatedLeaveType)
  }

  const validateLeaveType = (leaveType) => {
    if (!leaveType.name.trim()) {
      return 'Leave type name is required'
    }

    if (leaveType.type === 'Paid' && (leaveType.pay_rate < 0 || leaveType.pay_rate > 100)) {
      return 'Pay rate must be between 0 and 100 for paid leave'
    }

    return ''
  }

  const handleCreateLeaveType = async () => {
    const validationError = validateLeaveType(newLeaveType)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const response = await api.post('/leave-types', {
        ...newLeaveType,
        pay_rate: newLeaveType.type === 'Unpaid' ? 0 : newLeaveType.pay_rate,
      })
      setLeaveTypes([...leaveTypes, response.data])
      setModalVisible(false)
      setNewLeaveType({ name: '', type: 'Paid', pay_rate: 100 })
      setError('')
    } catch (error) {
      console.error('Error creating leave type:', error)
      setError(error.response?.data?.message || 'Failed to create leave type')
    }
  }

  const handleEditLeaveType = async () => {
    const validationError = validateLeaveType(editLeaveType)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const response = await api.put(`/leave-types/${editLeaveType.id}`, {
        ...editLeaveType,
        pay_rate: editLeaveType.type === 'Unpaid' ? 0 : editLeaveType.pay_rate,
      })
      const updatedLeaveTypes = leaveTypes.map((type) =>
        type.id === editLeaveType.id ? response.data : type,
      )
      setLeaveTypes(updatedLeaveTypes)
      setEditModalVisible(false)
      setError('')
    } catch (error) {
      console.error('Error updating leave type:', error)
      setError(error.response?.data?.message || 'Failed to update leave type')
    }
  }

  const handleDeleteLeaveType = async (id) => {
    try {
      await api.delete(`/leave-types/${id}`)
      setLeaveTypes(leaveTypes.filter((type) => type.id !== id))
    } catch (error) {
      console.error('Error deleting leave type:', error)
      setError(error.response?.data?.message || 'Failed to delete leave type')
    }
  }

  const openEditModal = (leaveType) => {
    setEditLeaveType({
      ...leaveType,
      pay_rate: parseFloat(leaveType.pay_rate) || 0,
    })
    setEditModalVisible(true)
    setError('')
  }

  const getPayRateDisplay = (type, payRate) => {
    if (type === 'Unpaid') return 'Unpaid'
    return `${payRate}%`
  }

  const getTypeBadge = (type) => {
    return type === 'Paid' ? 'success' : 'secondary'
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
        <strong>Leave Type List</strong>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </CButton>
      </CCardHeader>
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <div className="table-responsive">
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Leave Type</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Pay Rate</CTableHeaderCell>
                {/* <CTableHeaderCell>Description</CTableHeaderCell> */}
                {/* <CTableHeaderCell>Days</CTableHeaderCell> */}
                <CTableHeaderCell>Rules</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leaveTypes.length > 0 ? (
                leaveTypes.map((type, index) => (
                  <CTableRow key={type.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{type.name}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getTypeBadge(type.type)}>{type.type}</CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{getPayRateDisplay(type.type, type.pay_rate)}</CTableDataCell>
                    {/* <CTableDataCell>{type.description}</CTableDataCell> */}
                    {/* <CTableDataCell>{type.max_days_per_year}</CTableDataCell> */}
                    <CTableDataCell>{type.eligibility_rules}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="info"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(type)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteLeaveType(type.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No leave types found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create New Leave Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          <div className="mb-3">
            <CFormLabel>Leave Type Name</CFormLabel>
            <CFormInput
              type="text"
              name="name"
              value={newLeaveType.name}
              onChange={handleChange}
              placeholder="Enter leave type name"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Leave Type</CFormLabel>
            <CFormSelect name="type" value={newLeaveType.type} onChange={handleChange}>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </div>
          {newLeaveType.type === 'Paid' && (
            <div className="mb-3">
              <CFormLabel>Pay Rate (%)</CFormLabel>
              <CFormInput
                type="number"
                name="pay_rate"
                min="0"
                max="100"
                value={newLeaveType.pay_rate}
                onChange={handleChange}
                placeholder="Enter pay rate percentage (0-100)"
              />
            </div>
          )}

          {/* <div className="mb-3">
            <CFormLabel>Description</CFormLabel>
            <CFormInput
              type="text"
              name="description"
              value={newLeaveType.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div> */}
          {/* <div className="mb-3">
            <CFormLabel>Max Days Per Year</CFormLabel>
            <CFormInput
              type="number"
              name="max_days_per_year"
              value={newLeaveType.max_days_per_year}
              onChange={handleChange}
              placeholder="Enter max days per year"
            />
          </div> */}
          <div className="mb-3">
            <CFormLabel>Eligibility Rules</CFormLabel>
            <CFormInput
              type="text"
              name="eligibility_rules"
              value={newLeaveType.eligibility_rules}
              onChange={handleChange}
              placeholder="Enter eligibility rules"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleCreateLeaveType}>
            Create Leave Type
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Leave Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          <div className="mb-3">
            <CFormLabel>Leave Type Name</CFormLabel>
            <CFormInput
              type="text"
              name="name"
              value={editLeaveType.name} // Bind to editLeaveType
              onChange={handleEditChange}
              placeholder="Enter leave type name"
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Leave Type</CFormLabel>
            <CFormSelect name="type" value={editLeaveType.type} onChange={handleEditChange}>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </div>
          {editLeaveType.type === 'Paid' && (
            <div className="mb-3">
              <CFormLabel>Pay Rate (%)</CFormLabel>
              <CFormInput
                type="number"
                name="pay_rate"
                min="0"
                max="100"
                value={editLeaveType.pay_rate} // Bind to editLeaveType
                onChange={handleEditChange}
                placeholder="Enter pay rate percentage (0-100)"
              />
            </div>
          )}

          {/* <div className="mb-3">
            <CFormLabel>Description</CFormLabel>
            <CFormInput
              type="text"
              name="description"
              value={editLeaveType.description} // Bind to editLeaveType
              onChange={handleEditChange}
              placeholder="Enter description"
            />
          </div> */}
          {/* <div className="mb-3">
            <CFormLabel>Max Days Per Year</CFormLabel>
            <CFormInput
              type="number"
              name="max_days_per_year"
              value={editLeaveType.max_days_per_year} // Bind to editLeaveType
              onChange={handleEditChange}
              placeholder="Enter max days per year"
            />
          </div> */}
          <div className="mb-3">
            <CFormLabel>Eligibility Rules</CFormLabel>
            <CFormInput
              type="text"
              name="eligibility_rules"
              value={editLeaveType.eligibility_rules} // Bind to editLeaveType
              onChange={handleEditChange}
              placeholder="Enter eligibility rules"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleEditLeaveType}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default LeaveType
