import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import api from '../../util/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const Compliance = () => {
  const [compliances, setCompliances] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    fetchCompliances()
  }, [])

  const fetchCompliances = async () => {
    try {
      const response = await api.get('/compliances')
      setCompliances(response.data)
    } catch (error) {
      console.error('Error fetching compliances:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await api.put(`/compliances/${formData.id}`, formData)
      } else {
        await api.post('api/compliances', formData)
      }
      fetchCompliances()
      setModalVisible(false)
      resetForm()
    } catch (error) {
      console.error('Error saving compliance:', error)
    }
  }

  const handleEdit = (compliance) => {
    setFormData({
      id: compliance.id,
      name: compliance.name,
      description: compliance.description,
      status: compliance.status,
    })
    setEditMode(true)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/compliances/${id}`)
      fetchCompliances()
    } catch (error) {
      console.error('Error deleting compliance:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      status: 'active',
    })
    setEditMode(false)
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Compliance List</strong>
        <CButton color="primary" className="float-right" onClick={() => setModalVisible(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {compliances.map((item) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.description}</CTableDataCell>
                <CTableDataCell>{item.status}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" onClick={() => handleEdit(item)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </CButton>
                  <CButton color="danger" onClick={() => handleDelete(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>

      {/* Add/Edit Compliance Modal */}
      <CModal show={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{editMode ? 'Edit Compliance' : 'Add Compliance'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormInput
              type="text"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <CFormInput
              type="text"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <CFormSelect
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default Compliance
