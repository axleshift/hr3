import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'

const EPayroll = () => {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/api/payrolls/${employeeId}', {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Log the response to verify structure
        console.log(response.data)

        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setPayrolls(response.data)
        } else {
          console.error('Data is not an array', response.data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching payrolls:', error)
        setLoading(false)
      }
    }

    fetchPayrolls()
  }, [])

  const downloadPayslip = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      const response = await axios.get(`http://localhost:8000/api/payrolls/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `payslip_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error downloading payslip:', error)
      alert('Unable to download payslip.')
    }
  }

  return (
    <CContainer>
      <CCard className="mt-4">
        <CCardHeader>
          <h5>Payroll</h5>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div className="text-center">
              <CSpinner color="primary" />
              <p>Loading payrolls...</p>
            </div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Pay Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payslip</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {payrolls.length > 0 ? (
                  payrolls.map((payroll) => (
                    <CTableRow key={payroll.id}>
                      <CTableDataCell>{payroll.paydate}</CTableDataCell>
                      <CTableDataCell>{payroll.netSalary}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" onClick={() => downloadPayslip(payroll.id)}>
                          Download
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="3" className="text-center">
                      No payroll data available.
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default EPayroll
