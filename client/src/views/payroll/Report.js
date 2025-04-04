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
  CTableFoot,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faSync } from '@fortawesome/free-solid-svg-icons'
import api from '../../util/api'

const Report = () => {
  const [payroll, setPayroll] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/payrolls`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })

      let payrollData = response.data.payroll || response.data

      if (Array.isArray(payrollData)) {
        if (selectedPeriod !== 'all') {
          payrollData = payrollData.filter((record) => {
            const startDate = new Date(record.start_date).getDate()
            return selectedPeriod === 'first' ? startDate <= 15 : startDate > 15
          })
        }

        setPayroll(payrollData)
      } else {
        throw new Error('Invalid payroll data format received from server')
      }
    } catch (err) {
      console.error('Error fetching payroll data:', err)
      setError(err.response?.data?.message || err.message || 'Failed to fetch payroll data')
      setPayroll([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrollData()
  }, [selectedYear, selectedMonth, selectedPeriod]) // Add selectedPeriod here

  const calculateTotalNetSalary = () => {
    return payroll.reduce((total, payroll) => total + parseFloat(payroll.net_salary || 0), 0)
  }

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    })
  }

  const groupByDepartment = (payrollData) => {
    return payrollData.reduce((acc, payroll) => {
      const department = payroll.department || 'Unassigned'
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(payroll)
      return acc
    }, {})
  }

  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true)
      const response = await api.get(`/payroll/download-report`, {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
        responseType: 'blob',
        withCredentials: true,
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `payroll-report-${selectedYear}-${selectedMonth}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      setError('Failed to download the PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const formatDateRange = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} - 
            ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })}`
  }

  const departmentHeaderStyle = {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    fontSize: '1.1em',
    padding: '10px',
  }

  const departmentTotalStyle = {
    backgroundColor: '#e9ecef',
    fontWeight: 'bold',
  }

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center flex-wrap">
          <strong>Payroll Report</strong>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <CFormSelect
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ width: '150px' }}
              disabled={loading}
            >
              <option value="all">All Periods</option>
              <option value="first">First Half</option>
              <option value="second">2nd Half</option>
            </CFormSelect>
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '120px' }}
              disabled={loading}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2023, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ width: '90px' }}
              disabled={loading}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="secondary" onClick={fetchPayrollData} disabled={loading}>
              <FontAwesomeIcon icon={faSync} spin={loading} />
            </CButton>
            <CButton
              color="primary"
              onClick={handleDownloadPDF}
              disabled={pdfLoading || loading || payroll.length === 0}
            >
              {pdfLoading ? <CSpinner size="sm" /> : <FontAwesomeIcon icon={faFilePdf} />}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && (
            <CAlert color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <CSpinner />
              <p>Loading payroll data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover bordered responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Employee Name</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Base Salary</CTableHeaderCell>
                    <CTableHeaderCell>Overtime</CTableHeaderCell>
                    <CTableHeaderCell>Bonus</CTableHeaderCell>
                    <CTableHeaderCell>Benefits</CTableHeaderCell>
                    <CTableHeaderCell>Deductions</CTableHeaderCell>
                    <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {payroll.length > 0 ? (
                    Object.entries(groupByDepartment(payroll)).map(
                      ([department, employees], deptIndex) => (
                        <React.Fragment key={department}>
                          <CTableRow>
                            <CTableDataCell colSpan="8" style={departmentHeaderStyle}>
                              {department} -{' '}
                              {new Date(employees[0].start_date).toLocaleDateString()} to{' '}
                              {new Date(employees[0].end_date).toLocaleDateString()}
                            </CTableDataCell>
                          </CTableRow>
                          {employees.map((employee, empIndex) => (
                            <CTableRow key={`${employee.id}-${empIndex}`}>
                              <CTableDataCell>{employee.name || 'N/A'}</CTableDataCell>
                              <CTableDataCell>{employee.department || 'N/A'}</CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.base_salary)}
                              </CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.total_overtime_amount)}
                              </CTableDataCell>
                              <CTableDataCell>{formatCurrency(employee.bonus)}</CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.benefits_total)}
                              </CTableDataCell>
                              <CTableDataCell>
                                {formatCurrency(employee.total_deductions || employee.tax)}
                              </CTableDataCell>
                              <CTableDataCell>{formatCurrency(employee.net_salary)}</CTableDataCell>
                            </CTableRow>
                          ))}
                          <CTableRow style={departmentTotalStyle}>
                            <CTableDataCell colSpan="6" className="text-center">
                              <strong>Department Total</strong>
                            </CTableDataCell>
                            <CTableDataCell colSpan="2" className="text-center">
                              <strong>
                                {formatCurrency(
                                  employees.reduce(
                                    (total, emp) => total + parseFloat(emp.net_salary || 0),
                                    0,
                                  ),
                                )}
                              </strong>
                            </CTableDataCell>
                          </CTableRow>
                          <br />
                          {deptIndex < Object.keys(groupByDepartment(payroll)).length - 1 && (
                            <CTableRow>
                              <CTableDataCell colSpan="8" style={{ padding: '10px' }}>
                                <hr style={{ borderTop: ' #ddd' }} />
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </React.Fragment>
                      ),
                    )
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center py-4">
                        {error
                          ? 'Error loading data'
                          : 'No payroll data available for selected period'}
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
                {payroll.length > 0 && (
                  <CTableFoot>
                    <CTableRow style={{ backgroundColor: '#dee2e6' }}>
                      <CTableHeaderCell colSpan="6" className="text-center">
                        <strong>Grand Total</strong>
                      </CTableHeaderCell>
                      <CTableHeaderCell colSpan="2" className="text-center">
                        <strong>{formatCurrency(calculateTotalNetSalary())}</strong>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableFoot>
                )}
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Report
