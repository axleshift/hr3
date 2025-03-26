import React, { useState, useEffect, useRef } from 'react'
import api from '../../util/api'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CFormSelect,
} from '@coreui/react'

const Payslip = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, addToast] = useState(null)
  const toaster = useRef(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/payroll`, {
          params: {
            year: selectedYear,
            month: selectedMonth,
          },
        })
        setPayslips(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error('Error fetching payslips:', err)
        setError('Failed to fetch payslips')
        addToast({
          message: 'Failed to fetch payslips',
          color: 'danger',
        })
        setPayslips([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayslips()
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
      month: 'long',
    })
    setMonthName(monthName)
  }, [selectedMonth, selectedYear])

  const handleReleasePayslips = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post(`/release`, {
        month: selectedMonth,
        year: selectedYear,
      })
      console.log('Release Payslips Response:', response.data)

      if (response.data.message === 'All payslips for this month have already been released.') {
        addToast({
          message: response.data.message,
          color: 'info',
        })
      } else {
        setPayslips(response.data.data || [])
        addToast({
          message: 'Payslips released successfully for all employees!',
          color: 'success',
        })
      }
    } catch (err) {
      console.error('Error releasing payslips:', err)
      console.error('Error details:', err.response?.data || err.message)

      setError('Failed to release payslips')
      addToast({
        message: err.response?.data?.message || 'Failed to release payslips',
        color: 'danger',
      })
      console.error('Full error response:', err.response)
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Payslip</strong>
          </CCardHeader>
          <CCardBody>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <CRow className="mb-3 align-items-center">
              <CCol xs={12} md={3} className="mb-2 mb-md-0">
                <CFormSelect
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{ width: '100%' }}
                  className="custom-select"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={3} className="mb-2 mb-md-0">
                <CFormSelect
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{ width: '100%' }}
                  className="custom-select"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={12} md={6} className="text-md-start text-center">
                <CButton color="success" onClick={handleReleasePayslips} disabled={loading}>
                  {loading ? 'Processing...' : 'Send Payslips'}
                </CButton>
              </CCol>
            </CRow>

            {/* <h5 className="mt-3">
              Released Payslips for {monthName} {selectedYear}
            </h5> */}
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Employee Name</CTableHeaderCell>
                  <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  <CTableHeaderCell>Date Issued</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {(payslips || []).length > 0 ? (
                  payslips.map((payslip) => (
                    <CTableRow key={payslip.id}>
                      <CTableDataCell>{payslip.name || 'Unknown'}</CTableDataCell>
                      <CTableDataCell>
                        {parseFloat(payslip.net_salary || 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'PHP',
                          minimumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(payslip.created_at)}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="3" className="text-center">
                      No payslips available
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CToaster ref={toaster} placement="top-end">
        {toast && (
          <CToast
            autohide={true}
            delay={3000}
            show={true}
            color={toast.color}
            onClose={() => addToast(null)}
          >
            <CToastHeader closeButton>
              <strong className="me-auto">Notification</strong>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        )}
      </CToaster>
    </CRow>
  )
}

export default Payslip
