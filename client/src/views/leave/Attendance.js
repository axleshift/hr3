// no set for deduct and bonus
import React, { useEffect, useState } from 'react'
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
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormLabel,
  CFormInput,
  CModalFooter,
} from '@coreui/react'
import axios from 'axios'

const Payroll = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthName, setMonthName] = useState(
    new Date().toLocaleString('default', { month: 'long' }),
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [salaryRate, setSalaryRate] = useState('')
  const [overtimeRate, setOvertimeRate] = useState('')

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/payroll', {
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      })
      const data = response.data

      // Only update state if the data has changed
      if (JSON.stringify(data) !== JSON.stringify(employees)) {
        console.log('Data updated:', data) // Log the updated data
        setEmployees(data)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching payroll data:', error)
      setLoading(false)
    }
  }

  const fetchRates = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rates')
      const rates = response.data

      // Set the salary and overtime rates in the state
      setSalaryRate(rates.salary_rate || '')
      setOvertimeRate(rates.overtime_rate || '')
    } catch (error) {
      console.error('Error fetching rates:', error)
    }
  }

  useEffect(() => {
    fetchPayrollData()

    // Set up polling to fetch data every 5 seconds (adjust the interval as needed)
    const interval = setInterval(fetchPayrollData, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    if (modalVisible) {
      fetchRates()
    }
  }, [modalVisible])

  const handleSaveRates = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/rates', {
        salary_rate: parseFloat(salaryRate),
        overtime_rate: parseFloat(overtimeRate),
      })

      console.log('Rates saved successfully:', response.data)

      setModalVisible(false)

      // Refetch payroll data to reflect the updated rates
      fetchPayrollData()
    } catch (error) {
      console.error('Error saving rates:', error)
    }
  }

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Employee Payroll</strong>
          <div className="float-end">
            <CFormSelect
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ width: '150px', display: 'inline-block', marginRight: '10px' }}
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
              style={{ width: '100px', display: 'inline-block', marginRight: '10px' }}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              Set Rates
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading && employees.length === 0 ? (
            <div className="text-center">
              <CSpinner color="primary" />
              <p>Loading...</p>
            </div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Employee ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Worked Days</CTableHeaderCell>
                  <CTableHeaderCell>Total Overtime</CTableHeaderCell>
                  <CTableHeaderCell>Net Salary</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees.map((employee) => (
                  <CTableRow key={employee.employee_id}>
                    <CTableDataCell>{employee.employee_id}</CTableDataCell>
                    <CTableDataCell>{employee.name}</CTableDataCell>
                    <CTableDataCell>
                      {parseFloat(employee.total_regular_hours).toFixed(2)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {parseFloat(employee.total_overtime_hours).toFixed(2)}
                    </CTableDataCell>
                    <CTableDataCell>
                      {parseFloat(employee.net_salary).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Set Salary and Overtime Rates</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>Salary Rate (per hour)</CFormLabel>
          <CFormInput
            type="number"
            value={salaryRate}
            onChange={(e) => setSalaryRate(e.target.value)}
            placeholder="Enter salary rate"
          />
          <CFormLabel className="mt-3">Overtime Rate (per hour)</CFormLabel>
          <CFormInput
            type="number"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
            placeholder="Enter overtime rate"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveRates}>
            Save Rates
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Payroll

// working
// import React, { useEffect, useState } from 'react'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CTable,
//   CTableBody,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableDataCell,
//   CSpinner,
//   CFormSelect,
//   CButton,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
//   CFormLabel,
// } from '@coreui/react'
// import axios from 'axios'

// const Payroll = () => {
//   const [employees, setEmployees] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
//   const [monthName, setMonthName] = useState(
//     new Date().toLocaleString('default', { month: 'long' }),
//   )
//   const [modalVisible, setModalVisible] = useState(false) // State for modal visibility
//   const [salaryRate, setSalaryRate] = useState('') // State for salary rate
//   const [overtimeRate, setOvertimeRate] = useState('') // State for overtime rate

//   useEffect(() => {
//     const fetchPayrollData = async () => {
//       try {
//         setLoading(true) // Show loading spinner
//         const response = await axios.get('http://localhost:8000/api/payroll', {
//           params: {
//             year: selectedYear,
//             month: selectedMonth,
//           },
//         })
//         const data = response.data

//         if (Array.isArray(data)) {
//           setEmployees(data)
//         } else {
//           console.error('Invalid data format:', data)
//           setEmployees([])
//         }
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching payroll data:', error)
//         setLoading(false)
//       }
//     }

//     fetchPayrollData()
//   }, [selectedYear, selectedMonth])

//   useEffect(() => {
//     const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
//       month: 'long',
//     })
//     setMonthName(monthName)
//   }, [selectedMonth, selectedYear])

//   const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

//   const handleSaveRates = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/rates', {
//         salaryRate: parseFloat(salaryRate),
//         overtimeRate: parseFloat(overtimeRate),
//       })

//       console.log('Rates saved successfully:', response.data)

//       setModalVisible(false)
//     } catch (error) {
//       console.error('Error saving rates:', error)
//     }
//   }

//   return (
//     <div>
//       <CCard>
//         <CCardHeader className="d-flex justify-content-between align-items-center">
//           <strong>Employee Payroll</strong>
//           <div className="float-end">
//             <CFormSelect
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//               style={{ width: '150px', display: 'inline-block', marginRight: '10px' }}
//             >
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {new Date(2023, i).toLocaleString('default', { month: 'long' })}
//                 </option>
//               ))}
//             </CFormSelect>
//             <CFormSelect
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               style={{ width: '100px', display: 'inline-block', marginRight: '10px' }}
//             >
//               {years.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </CFormSelect>
//             <CButton color="primary" onClick={() => setModalVisible(true)}>
//               Set Rates
//             </CButton>
//           </div>
//         </CCardHeader>
//         <CCardBody>
//           {loading ? (
//             <div className="text-center">
//               <CSpinner color="primary" />
//               <p>Loading...</p>
//             </div>
//           ) : (
//             <CTable hover responsive>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>Employee ID</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Total Worked Hours</CTableHeaderCell>
//                   <CTableHeaderCell>Total Overtime</CTableHeaderCell>
//                   <CTableHeaderCell>Net Salary</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {employees.length > 0 ? (
//                   employees.map((employee) => (
//                     <CTableRow key={employee.employee_id}>
//                       <CTableDataCell>{employee.employee_id}</CTableDataCell>
//                       <CTableDataCell>{employee.name}</CTableDataCell>
//                       <CTableDataCell>{employee.total_worked_hours.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{employee.total_overtime.toFixed(2)}</CTableDataCell>
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="4" className="text-center">
//                       No data available
//                     </CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           )}
//         </CCardBody>
//       </CCard>

//       <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//         <CModalHeader>
//           <CModalTitle>Set Salary and Overtime Rates</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CFormLabel>Salary Rate (per hour)</CFormLabel>
//           <CFormInput
//             type="number"
//             value={salaryRate}
//             onChange={(e) => setSalaryRate(e.target.value)}
//             placeholder="Enter salary rate"
//           />
//           <CFormLabel className="mt-3">Overtime Rate (per hour)</CFormLabel>
//           <CFormInput
//             type="number"
//             value={overtimeRate}
//             onChange={(e) => setOvertimeRate(e.target.value)}
//             placeholder="Enter overtime rate"
//           />
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setModalVisible(false)}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={handleSaveRates}>
//             Save Rates
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </div>
//   )
// }

// export default Payroll
