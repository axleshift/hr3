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
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CSpinner,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import api from '../../util/api'
import { useSelector } from 'react-redux'

const EmployeeDispute = () => {
  const [disputes, setDisputes] = useState([])
  const [selectedDispute, setSelectedDispute] = useState(null)
  const [visible, setVisible] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' })
  const [newDispute, setNewDispute] = useState({
    type: 'wages',
    description: '',
    pay_period: '',
  })
  const [resolutionData, setResolutionData] = useState({
    status: 'under_review',
    resolution_notes: '',
  })

  const userId = sessionStorage.getItem('user_id')
  const userName = sessionStorage.getItem('name')

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please log in again.')
      setLoading(false)
      return
    }
    fetchDisputes()
  }, [userId])

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute)
    setResolutionData({
      status: dispute.status,
      resolution_notes: dispute.resolution_notes || '',
    })
    setDetailModal(true)
  }

  const fetchDisputes = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/dispute/${userId}`)
      console.log('API Response:', response.data)
      const disputesData = Array.isArray(response.data) ? response.data : []
      setDisputes(disputesData)
    } catch (error) {
      setError('Failed to load disputes. Please try again later.')
      console.error('Error fetching disputes:', error)
      setDisputes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userId || isNaN(userId)) {
      setAlert({
        visible: true,
        type: 'danger',
        message: 'Invalid User ID. Please log in again.',
      })
      return
    }

    try {
      setLoading(true)

      const disputeData = {
        ...newDispute,
        user_id: userId,
        name: userName || '',
      }

      await api.post('/disputes', disputeData)

      setAlert({
        visible: true,
        type: 'success',
        message: 'Dispute submitted successfully!',
      })

      setVisible(false)
      setNewDispute({
        type: 'wages',
        description: '',
        pay_period: '',
      })
      await fetchDisputes()
    } catch (error) {
      console.error('Error submitting dispute:', error)
      setAlert({
        visible: true,
        type: 'danger',
        message: error.response?.data?.message || 'Failed to submit dispute. Please try again.',
      })
    } finally {
      setLoading(false)
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

  if (loading && disputes.length === 0) {
    return (
      <div className="text-center">
        <CSpinner color="primary" />
        <p>Loading disputes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Wage Disputes</strong>
            <CButton
              color="primary"
              className="float-end"
              onClick={() => setVisible(true)}
              disabled={loading}
            >
              Submit New Dispute
            </CButton>
          </CCardHeader>
          <CCardBody>
            {alert.visible && (
              <CAlert color={alert.type} dismissible>
                {alert.message}
              </CAlert>
            )}

            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Pay Period</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Submitted Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {disputes.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center">
                      No disputes found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  disputes.map((dispute) => (
                    <CTableRow key={dispute.id}>
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
                        {new Date(dispute.created_at).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          size="sm"
                          onClick={() => handleViewDispute(dispute)}
                        >
                          View
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={visible ? true : undefined} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Submit New Dispute</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            {alert.visible && (
              <CAlert color={alert.type} dismissible>
                {alert.message}
              </CAlert>
            )}

            <div className="mb-3">
              <CFormSelect
                id="type"
                label="Dispute Type"
                value={newDispute.type}
                onChange={(e) => setNewDispute({ ...newDispute, type: e.target.value })}
                options={[
                  { label: 'Wages', value: 'wages' },
                  { label: 'Hours', value: 'hours' },
                  { label: 'Deductions', value: 'deductions' },
                  { label: 'Bonuses', value: 'bonuses' },
                  { label: 'Taxes', value: 'taxes' },
                  { label: 'Benefits', value: 'benefits' },
                  { label: 'Other', value: 'other' },
                ]}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="date"
                id="pay_period"
                label="Pay Period Date"
                value={newDispute.pay_period}
                onChange={(e) => setNewDispute({ ...newDispute, pay_period: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <CFormTextarea
                id="description"
                label="Description"
                value={newDispute.description}
                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                rows={5}
                required
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Submit Dispute'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

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
    </CRow>
  )
}

export default EmployeeDispute
