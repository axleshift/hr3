import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormTextarea,
  CWidgetStatsA,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CListGroup,
  CListGroupItem,
  CAlert,
} from '@coreui/react'
import api from '../../util/api'

const AdminDisputeManagement = () => {
  const [disputes, setDisputes] = useState([])
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [detailModal, setDetailModal] = useState(false)
  const [resolutionModal, setResolutionModal] = useState(false)
  const [resolutionData, setResolutionData] = useState({
    status: 'under_review',
    resolution_notes: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    try {
      const response = await api.get('/disputes')
      setDisputes(response.data)
    } catch (error) {
      console.error('Error fetching disputes:', error)
      setError('Failed to load disputes')
    }
  }

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute)
    setResolutionData({
      status: dispute.status,
      resolution_notes: dispute.resolution_notes || '',
    })
    setDetailModal(true)
  }

  const handleOpenResolution = (dispute) => {
    setSelectedDispute(dispute)
    setResolutionData({
      status: dispute.status,
      resolution_notes: dispute.resolution_notes || '',
    })
    setResolutionModal(true)
  }

  const handleResolutionSubmit = async () => {
    try {
      await api.put(`/disputes/${selectedDispute.id}`, resolutionData)
      setResolutionModal(false)
      fetchDisputes()

      if (detailModal) {
        const response = await api.get(`/disputes/${selectedDispute.id}`)
        setSelectedDispute(response.data)
      }
    } catch (error) {
      console.error('Error updating dispute:', error)
      setError('Failed to update dispute')
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: 'warning',
      under_review: 'info',
      resolved: 'success',
      rejected: 'danger',
    }
    return statusMap[status] || 'secondary'
  }

  return (
    <CRow>
      {/* Error display */}
      {error && (
        <CCol xs={12}>
          <CAlert color="danger" onClose={() => setError('')} dismissible>
            {error}
          </CAlert>
        </CCol>
      )}

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Disputes</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Employee</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Pay Period</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Submitted</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {disputes.map((dispute) => (
                  <CTableRow key={dispute.id}>
                    <CTableDataCell>{dispute.id}</CTableDataCell>
                    <CTableDataCell>{dispute.user?.name}</CTableDataCell>
                    <CTableDataCell>{dispute.type}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(dispute.pay_period).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(dispute.status)}>
                        {dispute.status.replace('_', ' ')}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" onClick={() => handleViewDispute(dispute)}>
                        Manage
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal size="lg" visible={detailModal} onClose={() => setDetailModal(false)}>
        <CModalHeader onClose={() => setDetailModal(false)}>
          <CModalTitle>
            Dispute Details
            <CBadge color={getStatusBadge(selectedDispute?.status)} className="ms-2">
              {selectedDispute?.status.replace('_', ' ')}
            </CBadge>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedDispute && (
            <CListGroup>
              <CListGroupItem>
                <strong>Employee:</strong> {selectedDispute.user?.name}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Type:</strong> {selectedDispute.type}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Pay Period:</strong>{' '}
                {new Date(selectedDispute.pay_period).toLocaleDateString()}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Submitted:</strong> {new Date(selectedDispute.created_at).toLocaleString()}
              </CListGroupItem>
              <CListGroupItem>
                <strong>Description:</strong>
                <div className="mt-2 p-2 bg-light rounded">{selectedDispute.description}</div>
              </CListGroupItem>
              {selectedDispute.resolution_notes && (
                <CListGroupItem>
                  <strong>Resolution Notes:</strong>
                  <div className="mt-2 p-2 bg-light rounded">
                    {selectedDispute.resolution_notes}
                  </div>
                </CListGroupItem>
              )}
            </CListGroup>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDetailModal(false)}>
            Close
          </CButton>
          {selectedDispute && (
            <CButton
              color="primary"
              onClick={() => {
                setDetailModal(false)
                handleOpenResolution(selectedDispute)
              }}
            >
              Update Status
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* Resolution Update Modal */}
      <CModal visible={resolutionModal} onClose={() => setResolutionModal(false)}>
        <CModalHeader onClose={() => setResolutionModal(false)}>
          <CModalTitle>Update Dispute Status</CModalTitle>
        </CModalHeader>
        <CForm
          onSubmit={(e) => {
            e.preventDefault()
            handleResolutionSubmit()
          }}
        >
          <CModalBody>
            <div className="mb-3">
              <CFormSelect
                label="Status"
                value={resolutionData.status}
                onChange={(e) =>
                  setResolutionData({
                    ...resolutionData,
                    status: e.target.value,
                  })
                }
                options={[
                  { label: 'Submitted', value: 'submitted' },
                  { label: 'Under Review', value: 'under_review' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Rejected', value: 'rejected' },
                ]}
              />
            </div>
            <div className="mb-3">
              <CFormTextarea
                label="Resolution Notes"
                value={resolutionData.resolution_notes}
                onChange={(e) =>
                  setResolutionData({
                    ...resolutionData,
                    resolution_notes: e.target.value,
                  })
                }
                rows={5}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setResolutionModal(false)}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              Update
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CRow>
  )
}

export default AdminDisputeManagement
