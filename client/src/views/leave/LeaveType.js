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
  const [newLeaveType, setNewLeaveType] = useState({ name: '', type: 'Paid' })
  const [editLeaveType, setEditLeaveType] = useState({ id: null, name: '', type: 'Paid' })

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get('/leaves')
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
    try {
      const response = await api.post('/leave', newLeaveType)
      setLeaveTypes([...leaveTypes, response.data])
      setModalVisible(false)
      setNewLeaveType({ name: '', type: 'Paid' })
    } catch (error) {
      console.error('Error creating leave type:', error)
    }
  }

  const handleEditLeaveType = async () => {
    try {
      const response = await api.put(`/leaves/${editLeaveType.id}`, editLeaveType)
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
      await api.delete(`/leave/${id}`)
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
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Leave Type List</strong>
        <CButton className="float-end" color="primary" onClick={() => setModalVisible(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Leave Type</CTableHeaderCell>
              <CTableHeaderCell>Type</CTableHeaderCell>
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
                <CTableDataCell colSpan="4" className="text-center">
                  No leave types found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Edit Modal */}
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
