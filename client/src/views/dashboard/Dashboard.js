import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import WidgetStats from './WidgetStats'
import useAuthStatus from '../../hook/useAuthStatus'

const API_URL = 'http://localhost:8000/api'

const getLeaveCountByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/leave-requests/count/${status}`)
    return response.data.count
  } catch (error) {
    console.error(`Error fetching count for status ${status}:`, error)
    return 0
  }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [leaveStats, setLeaveStats] = useState({
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  })
  const userRole = sessionStorage.getItem('role')
  const authStatus = useAuthStatus()

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        const pendingRequests = await getLeaveCountByStatus('Pending')
        const approvedLeaves = await getLeaveCountByStatus('Approved')
        const rejectedLeaves = await getLeaveCountByStatus('Rejected')

        setLeaveStats({
          pendingRequests,
          approvedLeaves,
          rejectedLeaves,
        })
      } catch (error) {
        console.error('Error fetching leave stats:', error)
      }
    }

    if (authStatus === 'authenticated') {
      fetchLeaveStats()
    }
  }, [authStatus])

  if (authStatus === 'unauthenticated') {
    navigate('/login')
    return null
  }

  return (
    <CContainer fluid>
      {(userRole === 'admin' || userRole === 'superAdmin') && (
        <>
          <WidgetStats />
        </>
      )}

      {userRole === 'employee' && (
        <>
          <h3>Employee Dashboard</h3>
          <CRow>
            <CCol md={4}>
              <Link to="/payslips">
                <CCard className="text-center">
                  <CCardHeader>Payslips</CCardHeader>
                  <CCardBody>View your payslips</CCardBody>
                </CCard>
              </Link>
            </CCol>

            <CCol md={4}>
              <Link to="/leave-request">
                <CCard className="text-center">
                  <CCardHeader>Leave Request</CCardHeader>
                  <CCardBody>Submit leave requests</CCardBody>
                </CCard>
              </Link>
            </CCol>

            <CCol md={4}>
              <Link to="/leave-history">
                <CCard className="text-center">
                  <CCardHeader>Leave History</CCardHeader>
                  <CCardBody>View past leave requests</CCardBody>
                </CCard>
              </Link>
            </CCol>
          </CRow>
        </>
      )}
    </CContainer>
  )
}

export default Dashboard

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { CContainer } from '@coreui/react'
// import axios from 'axios'
// import { WidgetStats } from './WidgetStats'

// const API_URL = 'http://localhost:8000/api'

// const getLeaveCountByStatus = async (status) => {
//   try {
//     const response = await axios.get(`${API_URL}/leave-requests/count/${status}`)
//     return response.data.count
//   } catch (error) {
//     console.error(`Error fetching count for status ${status}:`, error)
//     return 0
//   }
// }

// export const Dashboard = () => {
//   const navigate = useNavigate() // Hook for navigation
//   const [leaveStats, setLeaveStats] = useState({
//     pendingRequests: 0,
//     approvedLeaves: 0,
//     rejectedLeaves: 0,
//   })

//   useEffect(() => {
//     const fetchLeaveStats = async () => {
//       try {
//         const pendingRequests = await getLeaveCountByStatus('Pending')
//         const approvedLeaves = await getLeaveCountByStatus('Approved')
//         const rejectedLeaves = await getLeaveCountByStatus('Rejected')

//         setLeaveStats({
//           pendingRequests,
//           approvedLeaves,
//           rejectedLeaves,
//         })
//       } catch (error) {
//         console.error('Error fetching leave stats:', error)
//       }
//     }

//     fetchLeaveStats()
//   }, [])

//   return (
//     <CContainer fluid>
//       <WidgetStats />
//     </CContainer>
//   )
// }

// export default Dashboard
