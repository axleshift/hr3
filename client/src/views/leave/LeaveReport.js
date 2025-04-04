import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const LeaveReport = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  // const fetchLeaveData = async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)

  //     const [leaveRes, typesRes] = await Promise.all([
  //       api.get('/leave-requests/page', {
  //         params: { year: selectedYear, month: selectedMonth },
  //       }),
  //       api.get('/leave-types'),
  //     ])

  //     const leaveData = leaveRes.data.leaveRequests || leaveRes.data
  //     const typesData = typesRes.data

  //     if (Array.isArray(leaveData)) {
  //       setLeaveRequests(leaveData)
  //       setLeaveTypes(typesData)
  //       calculateLeaveBalances(leaveData, typesData)
  //     } else {
  //       setError('Invalid leave data format.')
  //     }
  //   } catch (err) {
  //     setError('Error fetching leave data.')
  //     console.error(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchLeaveData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params =
        selectedYear && selectedMonth ? { year: selectedYear, month: selectedMonth } : {}

      const [leaveRes, typesRes] = await Promise.all([
        api.get('/leave-requests/page', { params }),
        api.get('/leave-types'),
      ])

      setLeaveRequests(leaveRes.data.leaveRequests || leaveRes.data)
      setLeaveTypes(typesRes.data)
    } catch (err) {
      setError('Error fetching leave data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [selectedYear, selectedMonth])

  const groupByDepartment = (leaveData) => {
    return leaveData.reduce((acc, leave) => {
      const department = leave.department || 'Unassigned' // Ensure empty departments are labeled
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(leave)
      return acc
    }, {})
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get('/generate-report', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `leave-report-${selectedYear}-${selectedMonth}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download the PDF. Please try again.')
    }
  }

  const handleViewPDF = () => {
    const params = new URLSearchParams({
      year: selectedYear,
      month: selectedMonth,
    }).toString()

    window.open(`${api.defaults.baseURL}/view-report?${params}`, '_blank')
  }

  const getStatusBadge = (status) => {
    let color
    switch (status) {
      case 'Approved':
        color = 'success'
        break
      case 'Rejected':
        color = 'danger'
        break
      default:
        color = 'warning'
    }
    return <CBadge color={color}>{status}</CBadge>
  }

  const getPaidBadge = (isPaid) => {
    return isPaid === 'Paid' ? (
      <CBadge color="success">Paid</CBadge>
    ) : (
      <CBadge color="secondary">Unpaid</CBadge>
    )
  }

  const departmentHeaderStyle = {
    fontWeight: 'bold',
    fontSize: '1.1em',
    padding: '10px',
    backgroundColor: '#f0f0f0',
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Leave Report</strong>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '120px' }}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthIndex = i + 1
                return (
                  <option key={monthIndex} value={monthIndex}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                )
              })}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="danger" onClick={handleDownloadPDF}>
              <FontAwesomeIcon icon={faFilePdf} /> Export PDF
            </CButton>
            <CButton color="info" onClick={handleViewPDF} className="ms-2">
              {' '}
              View PDF
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}

          {loading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <CTable striped bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                      <CTableHeaderCell>Employee</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Department</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Job Position</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Leave Type</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Duration</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Days</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Paid</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Reason</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {leaveRequests.length > 0 ? (
                      Object.entries(groupByDepartment(leaveRequests)).map(
                        ([department, leaves]) => (
                          <React.Fragment key={department}>
                            <CTableRow>
                              <CTableDataCell colSpan="10" style={departmentHeaderStyle}>
                                <strong>{department} Department</strong>
                              </CTableDataCell>
                            </CTableRow>
                            {leaves.map((leave) => (
                              <CTableRow key={leave.id}>
                                <CTableDataCell>{leave.id}</CTableDataCell>
                                <CTableDataCell>{leave.name}</CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.department || 'Unassigned'}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.job_position}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.leave_type}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {new Date(leave.start_date).toLocaleDateString()} -{' '}
                                  {new Date(leave.end_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.total_days}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {getStatusBadge(leave.status)}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {getPaidBadge(leave.is_paid)}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {leave.reason}
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </React.Fragment>
                        ),
                      )
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No leave data available for the selected period
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default LeaveReport
