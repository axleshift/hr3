import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faDownload } from '@fortawesome/free-solid-svg-icons'

const EmployeePayslip = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [downloading, setDownloading] = useState(false)

  const API_URL = 'http://localhost:8000/api/releases'

  const getMonthName = (monthNumber) => {
    const date = new Date()
    date.setMonth(monthNumber - 1)
    return date.toLocaleString('default', { month: 'long' })
  }

  const fetchPayslips = async () => {
    try {
      const userId = sessionStorage.getItem('user_id')

      if (!userId) {
        setError('User ID not found in session. Please log in again.')
        return
      }

      const response = await axios.get(`${API_URL}`, {
        params: {
          user_id: userId, // Send user_id as a query parameter
        },
      })

      console.log('API Response:', response.data)

      if (Array.isArray(response.data.payslips)) {
        setPayslips(response.data.payslips)
      } else {
        setError('Invalid payslip data format.')
        setPayslips([])
      }
    } catch (err) {
      console.error('Error fetching payslips:', err)
      if (err.response && err.response.status === 404) {
        setError('No payslips found for the specified employee.')
      } else {
        setError('Failed to fetch payslips. Please try again later.')
      }
      setPayslips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [])

  const handlePreviewPayslip = (payslip) => {
    setSelectedEmployee(payslip)

    // Calculate Pay Period based on the selected payslip's month and year
    const monthName = getMonthName(payslip.month) // Get the month name
    const year = payslip.year // Get the year

    // Calculate the start and end dates of the pay period
    const periodStart = `${year}-${String(payslip.month).padStart(2, '0')}-01` // First day of the month
    const periodEnd = new Date(year, payslip.month, 0).toISOString().split('T')[0] // Last day of the month

    setMonthName(monthName)
    setSelectedYear(year)
    setVisible(true)
  }

  const handleDownloadPayslip = async (employeeId, employeeName, monthNumber) => {
    setDownloading(true)
    try {
      const response = await axios.get(`${API_URL}/download/${employeeId}`, {
        responseType: 'blob',
      })
      const monthName = getMonthName(monthNumber)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Payslip-${monthName}-${employeeName}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error downloading payslip:', err)
      setError('Failed to download payslip. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadAllPayslips = async () => {
    setDownloading(true)
    try {
      const userId = sessionStorage.getItem('user_id')
      if (!userId) {
        setError('User ID not found in session. Please log in again.')
        return
      }

      const response = await axios.get(`${API_URL}/download-all`, {
        params: {
          user_id: userId,
        },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'all-payslips.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error downloading all payslips:', err)
      setError('Failed to download all payslips. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>My Payslips</strong>
        <CButton
          color="primary"
          className="float-end"
          onClick={handleDownloadAllPayslips}
          disabled={downloading}
        >
          {downloading ? <CSpinner size="sm" /> : 'Download All Payslips'}
        </CButton>
      </CCardHeader>
      <CCardBody>
        {loading ? (
          <div className="text-center">
            <CSpinner color="primary" />
            <p>Loading payslips...</p>
          </div>
        ) : error ? (
          <CAlert color="danger">{error}</CAlert>
        ) : payslips.length === 0 ? (
          <CAlert color="info">No payslips available.</CAlert>
        ) : (
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Month</CTableHeaderCell>
                <CTableHeaderCell>Year</CTableHeaderCell>
                <CTableHeaderCell>Net Salary</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {payslips.map((payslip) => (
                <CTableRow
                  key={payslip.id || `${payslip.user_id}-${payslip.month}-${payslip.year}`}
                >
                  <CTableDataCell>{getMonthName(payslip.month)}</CTableDataCell>
                  <CTableDataCell>{payslip.year}</CTableDataCell>
                  <CTableDataCell>
                    {parseFloat(payslip.net_salary || 0).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                      minimumFractionDigits: 2,
                    })}
                  </CTableDataCell>
                  <CTableDataCell>
                    <span
                      style={{
                        color: payslip.status === 'Paid' ? 'green' : 'orange',
                        fontWeight: 'bold',
                      }}
                    >
                      {payslip.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="secondary" onClick={() => handlePreviewPayslip(payslip)}>
                      <FontAwesomeIcon icon={faFile} />
                    </CButton>
                    <CButton
                      color="success"
                      className="ms-2"
                      onClick={() =>
                        handleDownloadPayslip(payslip.employee_id, payslip.name, payslip.month)
                      }
                      disabled={downloading}
                    >
                      {downloading ? <CSpinner size="sm" /> : <FontAwesomeIcon icon={faDownload} />}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Payslip for {selectedEmployee?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmployee && (
            <>
              <div className="mb-4">
                <p>
                  <strong>Pay Period:</strong>{' '}
                  {`${selectedYear}-${String(selectedEmployee.month).padStart(2, '0')}-01`} –{' '}
                  {new Date(selectedYear, selectedEmployee.month, 0).toISOString().split('T')[0]}
                </p>
                <p>
                  <strong>Employee Name:</strong> {selectedEmployee.name}
                </p>
                <p>
                  <strong>Employee ID:</strong> {selectedEmployee.employee_id}
                </p>
                <p>
                  <strong>Position:</strong> {selectedEmployee.job_position}
                </p>
              </div>
              <div className="table-responsive" style={{ overflowX: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Earnings</th>
                      <th>Amount</th>
                      <th>Deductions</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Base Salary</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.base_salary || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>Deduction</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.deduction || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td>Overtime Pay</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.total_overtime_amount || 0).toLocaleString(
                          'en-PH',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Bonus</td>
                      <td>
                        ₱
                        {parseFloat(selectedEmployee.bonus || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Gross Salary</th>
                      <th>
                        ₱
                        {(
                          parseFloat(selectedEmployee.base_salary || 0) +
                          parseFloat(selectedEmployee.total_overtime_amount || 0) +
                          parseFloat(selectedEmployee.bonus || 0)
                        ).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                      <th>Total Deductions</th>
                      <th>
                        ₱
                        {parseFloat(selectedEmployee.deduction || 0).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                    </tr>
                    <tr>
                      <th>Net Pay</th>
                      <th colSpan="3">
                        ₱
                        {(
                          parseFloat(selectedEmployee.base_salary || 0) +
                          parseFloat(selectedEmployee.total_overtime_amount || 0) +
                          parseFloat(selectedEmployee.bonus || 0) -
                          parseFloat(selectedEmployee.deduction || 0)
                        ).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CModalBody>
      </CModal>
    </CCard>
  )
}

export default EmployeePayslip
