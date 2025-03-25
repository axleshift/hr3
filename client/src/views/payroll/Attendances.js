import React, { useEffect, useState, useMemo } from 'react'
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
  CSpinner,
  CFormSelect,
  CAlert,
  CBadge,
  CRow,
  CCol,
} from '@coreui/react'
import api from '../../api'

const Attendances = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalOvertime: 0,
    totalUndertime: 0,
  })

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/attendances', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })

      const data = response.data
      setEmployees(Array.isArray(data.employees) ? data.employees : [])

      // Update stats if available
      if (data.stats) {
        setStats({
          totalEmployees: data.stats.totalEmployees || 0,
          totalOvertime: data.stats.totalOvertime || 0,
          totalUndertime: data.stats.totalUndertime || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error)
      setError(error.response?.data?.message || 'Failed to fetch attendance data')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [selectedYear, selectedMonth])

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i)
  }, [])

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(2023, i).toLocaleString('default', { month: 'long' }),
    }))
  }, [])

  const formatHours = (hours) => {
    return parseFloat(hours || 0).toFixed(2)
  }

  return (
    <div className="attendances-container">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="mb-2 mb-md-0">
            <strong>Employee Attendance</strong>
            <span className="ms-3 text-muted">
              {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="form-select-sm"
              style={{ width: '150px' }}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="form-select-sm"
              style={{ width: '120px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
          </div>
        </CCardHeader>

        {/* Summary Stats */}
        <CCardBody className="py-2">
          <CRow className="g-3">
            <CCol xs={12} md={4}>
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small">Total Employees</div>
                <div className="h4 mb-0">{stats.totalEmployees}</div>
              </div>
            </CCol>
            <CCol xs={12} md={4}>
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small">Total Overtime Hours</div>
                <div className="h4 mb-0 text-warning">{formatHours(stats.totalOvertime)}</div>
              </div>
            </CCol>
            <CCol xs={12} md={4}>
              <div className="p-3 border rounded bg-light">
                <div className="text-muted small">Total Undertime Hours</div>
                <div className="h4 mb-0 text-danger">{formatHours(stats.totalUndertime)}</div>
              </div>
            </CCol>
          </CRow>
        </CCardBody>

        <CCardBody>
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="mt-2">Loading attendance data...</p>
            </div>
          ) : error ? (
            <CAlert color="danger" className="text-center">
              {error}
              <CButton color="link" size="sm" onClick={fetchAttendanceData} className="ms-2">
                Retry
              </CButton>
            </CAlert>
          ) : employees.length === 0 ? (
            <div className="text-center py-5">
              <p>No attendance records found for the selected period.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Employee</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Position</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Work Days</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Overtime</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">Undertime</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {employees.map((employee, index) => (
                    <CTableRow key={employee.employee_id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold">{employee.name}</div>
                        <div className="small text-muted">ID: {employee.employee_id}</div>
                      </CTableDataCell>
                      <CTableDataCell>{employee.department}</CTableDataCell>
                      <CTableDataCell>{employee.job_position}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        {formatHours(employee.total_regular_hours)}
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="warning">
                          {formatHours(employee.total_overtime_hours)}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="danger">
                          {formatHours(employee.total_undertime_hours)}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Attendances
