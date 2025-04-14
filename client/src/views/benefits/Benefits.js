import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCardHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CButton,
  CCard,
  CCol,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CFormInput,
  CBadge,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Benefits = () => {
  const navigate = useNavigate()
  const [type, setType] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('Active')
  const [benefits, setBenefits] = useState([])
  const [groupedBenefits, setGroupedBenefits] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState(null)

  const benefitTypes = [
    'Pag-ibig',
    'SSS',
    'PhilHealth',
    '13th Month Pay',
    'Service Incentive Leave',
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ]

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true)
        const response = await api.get('/benefits?status=Active')
        setBenefits(response.data)

        const grouped = response.data.reduce((acc, benefit) => {
          if (!acc[benefit.employee_id]) {
            acc[benefit.employee_id] = []
          }
          acc[benefit.employee_id].push(benefit)
          return acc
        }, {})

        setGroupedBenefits(grouped)
      } catch (err) {
        console.error('Error fetching benefits:', err)
        setError('Failed to fetch benefits.')
      } finally {
        setLoading(false)
      }
    }

    fetchBenefits()
  }, [])

  const handleSubmit = async () => {
    if (!type || !amount) {
      setError('Please select a benefit type and enter an amount.')
      return
    }

    setLoading(true)
    setError(null)

    const benefitData = {
      type,
      amount: parseFloat(amount),
      status: status || 'Active',
    }

    try {
      if (editingBenefit) {
        await api.put(`/benefits/${editingBenefit.id}`, benefitData)
        alert('Benefit updated successfully!')
      } else {
        const response = await api.post('/benefits', benefitData)
        console.log('Success:', response.data)
        alert('Benefit applied successfully!')
      }

      const response = await api.get('/benefits?status=Active')
      setBenefits(response.data)

      const grouped = response.data.reduce((acc, benefit) => {
        if (!acc[benefit.employee_id]) {
          acc[benefit.employee_id] = []
        }
        acc[benefit.employee_id].push(benefit)
        return acc
      }, {})

      setGroupedBenefits(grouped)

      setModalVisible(false)
      setType('')
      setAmount('')
      setStatus('Active')
      setEditingBenefit(null)
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      setError(err.response?.data?.error || 'Failed to apply/update benefit.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit)
    setType(benefit.type)
    setAmount(benefit.amount)
    setStatus(benefit.status)
    setModalVisible(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <CBadge color="success">Active</CBadge>
      case 'Inactive':
        return <CBadge color="danger">Inactive</CBadge>
      default:
        return <CBadge color="secondary">Unknown</CBadge>
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <strong>Manage Employee Benefits</strong>
            <div className="float-end">
              {/* <CButton
                color="secondary"
                className="me-2"
                onClick={() => navigate('/Benefits_Archive')}
              >
                View Archive
              </CButton> */}
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                <FontAwesomeIcon icon={faPlus} />
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Employee ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Benefit Type</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center">
                      <CSpinner />
                      <span className="ms-2">Loading benefits...</span>
                    </CTableDataCell>
                  </CTableRow>
                ) : Object.keys(groupedBenefits).length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center">
                      No benefits found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  Object.entries(groupedBenefits).map(([employeeId, employeeBenefits], index) => (
                    <React.Fragment key={employeeId}>
                      {employeeBenefits.map((benefit, benefitIndex) => (
                        <CTableRow key={benefit.id}>
                          {benefitIndex === 0 && (
                            <>
                              <CTableDataCell
                                rowSpan={employeeBenefits.length}
                                className="text-center align-middle"
                              >
                                {index + 1}
                              </CTableDataCell>
                              <CTableDataCell
                                rowSpan={employeeBenefits.length}
                                className="text-center align-middle"
                              >
                                {benefit.employee_id}
                              </CTableDataCell>
                              <CTableDataCell
                                rowSpan={employeeBenefits.length}
                                className="text-center align-middle"
                              >
                                {benefit.name}
                              </CTableDataCell>
                            </>
                          )}
                          <CTableDataCell>{benefit.type}</CTableDataCell>
                          <CTableDataCell>
                            ₱
                            {parseFloat(benefit.amount).toLocaleString('en-PH', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </CTableDataCell>
                          <CTableDataCell>{getStatusBadge(benefit.status)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="warning"
                              size="sm"
                              onClick={() => handleEdit(benefit)}
                              className="me-2"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </CTableBody>
            </CTable>

            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
              <CModalHeader>
                <CModalTitle>{editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Benefit Type</CInputGroupText>
                  <CFormSelect value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select benefit type</option>
                    {benefitTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>Amount</CInputGroupText>
                  <CFormInput
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>Status</CInputGroupText>
                  <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner component="span" size="sm" aria-hidden="true" />
                      <span className="ms-2">Processing...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Benefits
