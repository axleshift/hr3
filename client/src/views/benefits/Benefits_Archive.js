import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCardHeader,
  CRow,
  CButton,
  CCard,
  CCol,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CBadge,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const BenefitsArchive = () => {
  const [benefits, setBenefits] = useState([])
  const [groupedBenefits, setGroupedBenefits] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRestore = async (id) => {
    try {
      setLoading(true)
      await api.put(`/benefits/${id}`, { status: 'Active' })

      const updatedBenefits = benefits.filter((benefit) => benefit.id !== id)
      setBenefits(updatedBenefits)

      const grouped = updatedBenefits.reduce((acc, benefit) => {
        if (!acc[benefit.employee_id]) {
          acc[benefit.employee_id] = []
        }
        acc[benefit.employee_id].push(benefit)
        return acc
      }, {})

      setGroupedBenefits(grouped)

      alert('Benefit restored successfully!')
    } catch (err) {
      console.error('Error restoring benefit:', err)
      setError('Failed to restore benefit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchArchivedBenefits = async () => {
      try {
        setLoading(true)
        const response = await api.get('/benefits?status=Inactive')
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
        console.error('Error fetching archived benefits:', err)
        setError('Failed to fetch archived benefits.')
      } finally {
        setLoading(false)
      }
    }

    fetchArchivedBenefits()
  }, [])

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
            <strong>Archived Benefits</strong>
            {/* <CButton color="secondary" className="float-end" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Benefits
            </CButton> */}
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
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center">
                      <CSpinner />
                      <span className="ms-2">Loading archived benefits...</span>
                    </CTableDataCell>
                  </CTableRow>
                ) : Object.keys(groupedBenefits).length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={7} className="text-center">
                      No archived benefits found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  Object.entries(groupedBenefits).map(([employeeId, employeeBenefits], index) => (
                    <React.Fragment key={employeeId}>
                      {employeeBenefits.map((benefit, benefitIndex) => (
                        <CTableRow key={benefit.id}>
                          {benefitIndex === 0 && (
                            <>
                              <CTableDataCell rowSpan={employeeBenefits.length}>
                                {index + 1}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={employeeBenefits.length}>
                                {benefit.employee_id}
                              </CTableDataCell>
                              <CTableDataCell rowSpan={employeeBenefits.length}>
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
                              color="success"
                              size="sm"
                              onClick={() => handleRestore(benefit.id)}
                            >
                              Restore
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BenefitsArchive
