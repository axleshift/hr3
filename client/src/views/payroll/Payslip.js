import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CBadge,
  CAlert,
  CSpinner,
  CContainer,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const Payslip = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const fetchPayslips = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/api/payslip`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      setPayslips(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Error fetching payslips:', err)
      setError('Failed to fetch payslips')
      setPayslips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [selectedYear, selectedMonth, selectedDepartment])

  useEffect(() => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
      month: 'long',
    })
    setMonthName(monthName)
  }, [selectedMonth, selectedYear])

  const handleSendPayslips = async () => {
    if (
      !window.confirm(`Are you sure you want to send payslips for ${monthName} ${selectedYear}?`)
    ) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.post(`/api/release`, {
        month: selectedMonth,
        year: selectedYear,
      })

      if (response.data.count === 0) {
        setError('No payroll records available to send as payslips')
      } else {
        await fetchPayslips()
        setError(null)
      }
    } catch (err) {
      console.error('Error sending payslips:', err)
      setError(err.response?.data?.message || 'Failed to send payslips')
    } finally {
      setLoading(false)
    }
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const formatDate = (dateString) => {
    if (!dateString) return 'Not sent yet'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString()
    } catch (e) {
      return 'Invalid Date'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return 'success'
      case 'Pending':
        return 'warning'
      case 'Paid':
        return 'primary'
      default:
        return 'secondary'
    }
  }

  return (
    <CContainer fluid>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Payslip Management</strong>
          <div className="d-flex flex-wrap gap-2">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: '120px' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: '100px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="primary" onClick={handleSendPayslips} disabled={loading}>
              {loading ? (
                <>
                  <CSpinner size="sm" /> Sending...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                </>
              )}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          {loading && payslips.length === 0 ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : payslips.length === 0 ? (
            <div className="text-center py-5">
              <p>
                No payslips found for {monthName} {selectedYear}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Employee ID</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Sent Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {payslips.map((payslip, index) => (
                    <CTableRow key={payslip.id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{payslip.employee_id}</CTableDataCell>
                      <CTableDataCell>{payslip.name}</CTableDataCell>
                      <CTableDataCell>{payslip.department}</CTableDataCell>
                      <CTableDataCell>
                        ₱
                        {parseFloat(payslip.net_salary || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(payslip.status)}>{payslip.status}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{formatDate(payslip.issued_at)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Payslip
