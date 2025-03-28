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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

const BenefitTypes = () => {
  const [benefitTypes, setBenefitTypes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [newBenefitType, setNewBenefitType] = useState({ name: '', amount: '' })
  const [editBenefitType, setEditBenefitType] = useState({ id: null, name: '', amount: '' })

  useEffect(() => {
    fetchBenefitTypes()
  }, [])

  const fetchBenefitTypes = async () => {
    try {
      const response = await api.get('/benefit-types')
      setBenefitTypes(response.data)
    } catch (error) {
      console.error('Error fetching benefit types:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewBenefitType({ ...newBenefitType, [name]: value })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditBenefitType({ ...editBenefitType, [name]: value })
  }

  const handleCreateBenefitType = async () => {
    if (!newBenefitType.name.trim() || !newBenefitType.amount.trim()) {
      alert('All fields are required')
      return
    }
    try {
      const response = await api.post('/benefit-types', newBenefitType)
      setBenefitTypes([...benefitTypes, response.data])
      setModalVisible(false)
      setNewBenefitType({ name: '', amount: '' })
    } catch (error) {
      console.error('Error creating benefit type:', error)
    }
  }

  const handleEditBenefitType = async () => {
    if (!editBenefitType.name.trim() || !editBenefitType.amount.trim()) {
      alert('All fields are required')
      return
    }
    try {
      const response = await api.put(`/benefit-types/${editBenefitType.id}`, editBenefitType)
      setBenefitTypes(
        benefitTypes.map((type) => (type.id === editBenefitType.id ? response.data : type)),
      )
      setEditModalVisible(false)
    } catch (error) {
      console.error('Error updating benefit type:', error)
    }
  }

  const handleDeleteBenefitType = async (id) => {
    try {
      await api.delete(`/benefit-types/${id}`)
      setBenefitTypes(benefitTypes.filter((type) => type.id !== id))
    } catch (error) {
      console.error('Error deleting benefit type:', error)
    }
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <strong>Benefit Type List</strong>
        <CButton color="primary" onClick={() => setModalVisible(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Benefit Type</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {benefitTypes.map((type, index) => (
              <CTableRow key={type.id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{type.name}</CTableDataCell>
                <CTableDataCell>{type.amount}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setEditBenefitType(type)
                      setEditModalVisible(true)
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteBenefitType(type.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Create New Benefit Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            name="name"
            value={newBenefitType.name}
            onChange={handleChange}
            placeholder="Enter benefit type name"
            className="mb-3"
          />
          <CFormInput
            type="number"
            name="amount"
            value={newBenefitType.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleCreateBenefitType}>
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Benefit Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            name="name"
            value={editBenefitType.name}
            onChange={handleEditChange}
            placeholder="Enter benefit type name"
            className="mb-3"
          />
          <CFormInput
            type="number"
            name="amount"
            value={editBenefitType.amount}
            onChange={handleEditChange}
            placeholder="Enter amount"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleEditBenefitType}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default BenefitTypes
