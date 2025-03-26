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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const LeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [newLeaveType, setNewLeaveType] = useState({
    name: '',
    type: 'Paid',
    pay_rate: 0,
  })

  const [editLeaveType, setEditLeaveType] = useState({
    id: null,
    name: '',
    type: 'Paid',
    pay_rate: 0,
  })

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get('/api/leave-types')
      if (Array.isArray(response.data)) {
        setLeaveTypes(response.data)
      } else {
        console.error('Expected an array of leave types, but received:', response.data)
      }
    } catch (error) {
      console.error('Error fetching leave types:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewLeaveType({ ...newLeaveType, [name]: value })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditLeaveType({ ...editLeaveType, [name]: value })
  }

  const handleCreateLeaveType = async () => {
    if (!newLeaveType.name.trim()) {
      alert('Leave type name is required')
      return
    }
    try {
      const response = await api.post('/api/leave-types', newLeaveType)
      setLeaveTypes([...leaveTypes, response.data])
      setModalVisible(false)
      setNewLeaveType({ name: '', type: 'Paid', pay_rate: 0 })
    } catch (error) {
      console.error('Error creating leave type:', error)
    }
  }

  const handleEditLeaveType = async () => {
    if (!editLeaveType.name.trim()) {
      alert('Leave type name is required')
      return
    }
    try {
      const response = await api.put(`/api/leave-types/${editLeaveType.id}`, editLeaveType)
      const updatedLeaveTypes = leaveTypes.map((type) =>
        type.id === editLeaveType.id ? response.data : type,
      )
      setLeaveTypes(updatedLeaveTypes)
      setEditModalVisible(false)
    } catch (error) {
      console.error('Error updating leave type:', error)
    }
  }

  const handleDeleteLeaveType = async (id) => {
    try {
      await api.delete(`/api/leave-types/${id}`)
      setLeaveTypes(leaveTypes.filter((type) => type.id !== id))
    } catch (error) {
      console.error('Error deleting leave type:', error)
    }
  }

  const openEditModal = (leaveType) => {
    setEditLeaveType(leaveType)
    setEditModalVisible(true)
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
        <div className="table-responsive">
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Leave Type</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Pay Rate</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leaveTypes.length > 0 ? (
                leaveTypes.map((type, index) => (
                  <CTableRow key={type.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{type.name}</CTableDataCell>
                    <CTableDataCell>{type.type}</CTableDataCell>
                    <CTableDataCell>{type.pay_rate}</CTableDataCell>
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
          <div className="mb-3">
            <label htmlFor="leaveName" className="form-label">
              Leave Type Name
            </label>
            <CFormInput
              type="text"
              id="leaveName"
              name="name"
              value={newLeaveType.name}
              onChange={handleChange}
              placeholder="Enter leave type name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="leaveType" className="form-label">
              Leave Type
            </label>
            <CFormSelect
              id="leaveType"
              name="type"
              value={newLeaveType.type}
              onChange={handleChange}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <label htmlFor="payRate" className="form-label">
              Pay Rate
            </label>
            <CFormInput
              type="number"
              id="payRate"
              name="pay_rate"
              value={newLeaveType.pay_rate}
              onChange={handleChange}
              placeholder="Enter pay rate"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleCreateLeaveType}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Leave Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="editLeaveName" className="form-label">
              Leave Type Name
            </label>
            <CFormInput
              type="text"
              id="editLeaveName"
              name="name"
              value={editLeaveType.name}
              onChange={handleEditChange}
              placeholder="Enter leave type name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editLeaveType" className="form-label">
              Leave Type
            </label>
            <CFormSelect
              id="editLeaveType"
              name="type"
              value={editLeaveType.type}
              onChange={handleEditChange}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <label htmlFor="editPayRate" className="form-label">
              Pay Rate
            </label>
            <CFormInput
              type="number"
              id="editPayRate"
              name="pay_rate"
              value={editLeaveType.pay_rate}
              onChange={handleEditChange}
              placeholder="Enter pay rate"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Close
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
