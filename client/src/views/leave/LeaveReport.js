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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const LeaveReport = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const years = Array.from({ length: new Date().getFullYear() - 2020 + 1 }, (_, i) => 2020 + i)

  const fetchLeaveData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8000/api/leave-requests', {
        params: { year: selectedYear, month: selectedMonth },
      })
      const leaveData = response.data.leaveRequests || response.data

      if (Array.isArray(leaveData)) {
        setLeaveRequests(leaveData)
      } else {
        setError('Invalid leave data format.')
      }
    } catch (err) {
      setError('Error fetching leave data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveData()
  }, [selectedYear, selectedMonth])

  const groupByDepartment = (leaveData) => {
    return leaveData.reduce((acc, leave) => {
      const department = leave.department || 'Unassigned'
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(leave)
      return acc
    }, {})
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/generate-leave', {
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

  const calculateEmployeeLeavesSummary = () => {
    const summary = leaveRequests.reduce((acc, leave) => {
      const employeeName = leave.name
      if (!acc[employeeName]) {
        acc[employeeName] = 0
      }
      acc[employeeName] += 1
      return acc
    }, {})

    return Object.entries(summary).map(([name, totalLeaves]) => ({
      name,
      totalLeaves,
    }))
  }

  const departmentHeaderStyle = {
    fontWeight: 'bold',
    fontSize: '1.1em',
    padding: '10px',
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
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CFormSelect>
            <CButton color="primary" onClick={handleDownloadPDF}>
              <FontAwesomeIcon icon={faFilePdf} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {loading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <strong>Summary of Leaves Taken by Employees</strong>
              <CCardBody>
                <CTable hover bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Employee Name</CTableHeaderCell>
                      <CTableHeaderCell>Total Leaves Taken</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {calculateEmployeeLeavesSummary().map((employee) => (
                      <CTableRow key={employee.name}>
                        <CTableDataCell>{employee.name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {employee.totalLeaves}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>

              <div className="table-responsive">
                <CTable hover bordered responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Employee Name</CTableHeaderCell>
                      <CTableHeaderCell>Department</CTableHeaderCell>
                      <CTableHeaderCell>Leave Type</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Total Days</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {leaveRequests.length > 0 ? (
                      Object.entries(groupByDepartment(leaveRequests)).map(
                        ([department, leaves], index) => (
                          <React.Fragment key={department}>
                            <CTableRow>
                              <CTableDataCell colSpan="7" style={departmentHeaderStyle}>
                                <strong>Department: {department}</strong>
                              </CTableDataCell>
                            </CTableRow>
                            {leaves.map((leave) => (
                              <CTableRow key={leave.id}>
                                <CTableDataCell>{leave.name}</CTableDataCell>
                                <CTableDataCell>{leave.department}</CTableDataCell>
                                <CTableDataCell>{leave.leave_type}</CTableDataCell>
                                <CTableDataCell>
                                  {new Date(leave.start_date).toLocaleDateString()} -{' '}
                                  {new Date(leave.end_date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <span
                                    style={{
                                      color:
                                        leave.status === 'Approved'
                                          ? 'green'
                                          : leave.status === 'Rejected'
                                            ? 'red'
                                            : 'orange',
                                    }}
                                  >
                                    {leave.status}
                                  </span>
                                </CTableDataCell>
                                <CTableDataCell>{leave.total_days}</CTableDataCell>
                              </CTableRow>
                            ))}
                            {index < Object.keys(groupByDepartment(leaveRequests)).length - 1 && (
                              <CTableRow>
                                <CTableDataCell colSpan="7" style={{ padding: '10px 0' }}>
                                  <hr style={{ borderTop: '2px solid #ddd' }} />
                                </CTableDataCell>
                              </CTableRow>
                            )}
                          </React.Fragment>
                        ),
                      )
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center">
                          No leave data available
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

// import React, { useEffect, useState } from 'react'
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CCardHeader,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CFormSelect,
//   CInputGroup,
//   CFormInput,
//   CInputGroupText,
//   CBadge,
//   CSpinner,
//   CPagination,
//   CPaginationItem,
// } from '@coreui/react'
// import api from '../../util/api'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'

// const LeaveReport = () => {
//   const [leaveData, setLeaveData] = useState([])
//   const [leaveTypes, setLeaveTypes] = useState([])
//   const [filter, setFilter] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const itemsPerPage = 10

//   useEffect(() => {
//     fetchLeaveReport()
//     fetchLeaveTypes()
//   }, [selectedMonth, currentPage])

//   const fetchLeaveReport = async () => {
//     try {
//       setLoading(true)
//       const response = await api.get('/leave-requests/page', {
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//         },
//       })
//       const data = response.data.leaveRequests || []

//       const filteredLeave = data.filter((item) => {
//         const requestMonth = new Date(item.start_date).getMonth() + 1
//         return requestMonth === selectedMonth
//       })

//       setLeaveData(filteredLeave)
//       setTotalPages(Math.ceil(filteredLeave.length / itemsPerPage))
//     } catch (error) {
//       console.error('Error fetching leave report:', error)
//       setLeaveData([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchLeaveTypes = async () => {
//     try {
//       const response = await api.get('/leave-types')
//       setLeaveTypes(response.data || [])
//     } catch (error) {
//       console.error('Error fetching leave types:', error)
//       setLeaveTypes([])
//     }
//   }

//   const getLeaveBalance = (leaveType) => {
//     const leaveTypeData = leaveTypes.find((type) => type.name === leaveType)
//     return leaveTypeData ? leaveTypeData.leave_balance : 'N/A'
//   }

//   const handleSearch = (query) => {
//     setSearchQuery(query)
//   }

//   // const getBadgeColor = (status) => {
//   //   if (!status || typeof status !== 'string') return 'primary'
//   //   const statusString = String(status).toLowerCase()
//   //   switch (statusString) {
//   //     case 'approved':
//   //       return 'success'
//   //     case 'rejected':
//   //       return 'danger'
//   //     default:
//   //       return 'primary'
//   //   }
//   // }

//   const filteredLeaveData = leaveData.filter((leave) =>
//     leave.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
//   )

//   return (
//     <CCard>
//       <CCardHeader className="d-flex justify-content-between align-items-center">
//         <strong>Leave Report</strong>
//         <div className="d-flex gap-2 flex-wrap">
//           <CFormSelect
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(Number(e.target.value))}
//             style={{ width: '120px', marginRight: '10px' }}
//           >
//             {Array.from({ length: 12 }, (_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {new Date(2023, i).toLocaleString('default', { month: 'long' })}
//               </option>
//             ))}
//           </CFormSelect>
//           <CFormSelect
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             style={{ width: '120px', marginRight: '10px' }}
//           >
//             <option value="">All Leave Types</option>
//             {leaveTypes.map((type) => (
//               <option key={type.id} value={type.name}>
//                 {type.name}
//               </option>
//             ))}
//           </CFormSelect>
//           <CInputGroup style={{ width: '150px' }}>
//             <CFormInput
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//             <CInputGroupText>
//               <FontAwesomeIcon icon={faSearch} />
//             </CInputGroupText>
//           </CInputGroup>
//         </div>
//       </CCardHeader>
//       <CCardBody>
//         {loading ? (
//           <div className="text-center">
//             <CSpinner color="primary" />
//             <p>Loading...</p>
//           </div>
//         ) : filteredLeaveData.length === 0 ? (
//           <div className="text-center">
//             <p>No leave requests found.</p>
//           </div>
//         ) : (
//           <>
//             <div className="table-responsive">
//               <CTable hover responsive>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell>Employee ID</CTableHeaderCell>
//                     <CTableHeaderCell>Name</CTableHeaderCell>
//                     <CTableHeaderCell>Department</CTableHeaderCell>
//                     <CTableHeaderCell>Leave Type</CTableHeaderCell>
//                     <CTableHeaderCell>Description</CTableHeaderCell>
//                     <CTableHeaderCell>Start Date</CTableHeaderCell>
//                     <CTableHeaderCell className="text-center">End Date</CTableHeaderCell>
//                     {/* <CTableHeaderCell className="text-center">Leave Balance</CTableHeaderCell> */}
//                     {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {filteredLeaveData
//                     .filter((leave) => !filter || leave.leave_type === filter)
//                     .map((leave) => (
//                       <CTableRow key={leave.id}>
//                         <CTableDataCell>{leave.employee_id}</CTableDataCell>
//                         <CTableDataCell>{leave.name}</CTableDataCell>
//                         <CTableDataCell>{leave.department || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{leave.leave_type}</CTableDataCell>
//                         <CTableDataCell>{leave.reason}</CTableDataCell>
//                         <CTableDataCell>{leave.start_date}</CTableDataCell>
//                         <CTableDataCell>{leave.end_date}</CTableDataCell>
//                         {/* <CTableDataCell className="text-center">{leave.total_days}</CTableDataCell>
//                         <CTableDataCell className="text-center">
//                           {getLeaveBalance(leave.leave_type)}
//                         </CTableDataCell> */}
//                         {/* <CTableDataCell>
//                           <CBadge color={getBadgeColor(leave.status)}>{leave.status}</CBadge>
//                         </CTableDataCell> */}
//                       </CTableRow>
//                     ))}
//                 </CTableBody>
//               </CTable>
//             </div>

//             <CPagination align="center" className="mt-3">
//               <CPaginationItem
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 &laquo;
//               </CPaginationItem>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <CPaginationItem
//                   key={i + 1}
//                   active={i + 1 === currentPage}
//                   onClick={() => setCurrentPage(i + 1)}
//                 >
//                   {i + 1}
//                 </CPaginationItem>
//               ))}
//               <CPaginationItem
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 &raquo;
//               </CPaginationItem>
//             </CPagination>
//           </>
//         )}
//       </CCardBody>
//     </CCard>
//   )
// }

// export default LeaveReport
