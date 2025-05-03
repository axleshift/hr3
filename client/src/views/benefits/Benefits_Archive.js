import React, { useEffect, useState } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CSpinner,
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
        if (!acc[benefit.employeeId]) {
          acc[benefit.employeeId] = []
        }
        acc[benefit.employeeId].push(benefit)
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
          if (!acc[benefit.employeeId]) {
            acc[benefit.employeeId] = []
          }
          acc[benefit.employeeId].push(benefit)
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
    <div>
      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <CSpinner color="primary" variant="grow" />
        </div>
      )}

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <strong>Archived Benefits</strong>
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
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Object.keys(groupedBenefits).length === 0 ? (
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
                              {benefit.employeeId}
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
                      </CTableRow>
                    ))}
                  </React.Fragment>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default BenefitsArchive
