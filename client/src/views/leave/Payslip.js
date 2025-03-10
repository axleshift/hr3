import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CFormSelect,
  CButton,
} from '@coreui/react'
import axios from 'axios'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Payslip = () => {
  const [payslips, setPayslips] = useState([]) // Store all payslips
  const [selectedPayslipId, setSelectedPayslipId] = useState(null) // Track selected payslip ID
  const [selectedPayslip, setSelectedPayslip] = useState(null) // Store the selected payslip data
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )

  // Replace with the actual employee ID of the logged-in user
  const employeeId = 1 // Example employee ID

  const fetchPayslipData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8000/api/payroll/employee/${employeeId}`)
      console.log('API Response:', response.data) // Log the response
      if (response.data && response.data.length > 0) {
        setPayslips(response.data)
        setSelectedPayslipId(response.data[0].id) // Set the first payslip as default
        setSelectedPayslip(response.data[0]) // Set the first payslip data
      } else {
        setPayslips([]) // Reset if no data is returned
        setSelectedPayslipId(null)
        setSelectedPayslip(null)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching payslip data:', error)
      setLoading(false)
      setPayslips([]) // Reset on error
      setSelectedPayslipId(null)
      setSelectedPayslip(null)
    }
  }

  useEffect(() => {
    fetchPayslipData()
  }, [])

  useEffect(() => {
    if (selectedPayslipId) {
      const selected = payslips.find((payslip) => payslip.id === selectedPayslipId)
      setSelectedPayslip(selected)
    }
  }, [selectedPayslipId, payslips])

  useEffect(() => {
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
      month: 'long',
    })
    setMonthName(monthName)
  }, [selectedMonth, selectedYear])

  const handleDownloadPayslip = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/payroll/generate-payslip/${employeeId}`,
        {
          responseType: 'blob',
        },
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'payslip.pdf')
      document.body.appendChild(link)

      link.click()

      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error generating payslip:', error)
    }
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>My Payslip</strong>
          <div className="float-end">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '120px', display: 'inline-block', marginRight: '10px' }}
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
              style={{ width: '90px', display: 'inline-block', marginRight: '10px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              value={selectedPayslipId || ''}
              onChange={(e) => setSelectedPayslipId(parseInt(e.target.value))}
              style={{ width: '150px', display: 'inline-block', marginRight: '10px' }}
            >
              {payslips.map((payslip) => (
                <option key={payslip.id} value={payslip.id}>
                  {new Date(payslip.year, payslip.month - 1).toLocaleString('default', {
                    month: 'long',
                  })}{' '}
                  {payslip.year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="primary" onClick={handleDownloadPayslip}>
              <FontAwesomeIcon icon={faFile} /> Download Payslip
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center">
              <CSpinner color="primary" />
              <p>Loading...</p>
            </div>
          ) : selectedPayslip ? (
            <CTable hover responsive>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Employee ID</CTableHeaderCell>
                  <CTableDataCell>{selectedPayslip.employee_id}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableDataCell>{selectedPayslip.name}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Month</CTableHeaderCell>
                  <CTableDataCell>{monthName}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Year</CTableHeaderCell>
                  <CTableDataCell>{selectedYear}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Overtime</CTableHeaderCell>
                  <CTableDataCell>
                    {parseFloat(selectedPayslip.total_overtime_amount).toFixed(2)}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Deduction</CTableHeaderCell>
                  <CTableDataCell>
                    {parseFloat(selectedPayslip.deduction).toFixed(2)}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Bonus</CTableHeaderCell>
                  <CTableDataCell>{parseFloat(selectedPayslip.bonus).toFixed(2)}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  <CTableDataCell>
                    {parseFloat(selectedPayslip.net_salary).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'PHP',
                      minimumFractionDigits: 2,
                    })}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          ) : (
            <p>No payslip data available for the selected month and year.</p>
          )}
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Payslip
