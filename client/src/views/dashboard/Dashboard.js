import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Link } from 'react-router-dom'
import WidgetStats from './WidgetStats'
import useAuthStatus from '../../hook/useAuthStatus'
import api from '../../util/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [leaveStats, setLeaveStats] = useState({
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  })
  const [loading, setLoading] = useState(true)
  const userRole = sessionStorage.getItem('role')
  const authStatus = useAuthStatus()

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/login')
      return
    }

    const fetchLeaveStats = async () => {
      try {
        setLoading(true)
        const [pendingRequests, approvedLeaves, rejectedLeaves] = await Promise.all([
          api.get('/leave-requests/count/Pending'),
          api.get('/leave-requests/count/Approved'),
          api.get('/leave-requests/count/Rejected'),
        ])

        setLeaveStats({
          pendingRequests: pendingRequests.data.count,
          approvedLeaves: approvedLeaves.data.count,
          rejectedLeaves: rejectedLeaves.data.count,
        })
      } catch (error) {
        console.error('Error fetching leave stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveStats()
  }, [authStatus, navigate])

  if (authStatus === 'unauthenticated') {
    return null
  }

  const employeeCards = [
    { title: 'Payslips', path: '/payslips', description: 'View your payslips' },
    { title: 'Leave Request', path: '/leave-requests', description: 'Submit leave requests' },
    { title: 'Leave History', path: '/leave-history', description: 'View past leave requests' },
  ]

  return (
    <CContainer fluid>
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {(userRole === 'admin' || userRole === 'superAdmin') && (
            <WidgetStats stats={leaveStats} />
          )}

          {userRole === 'employee' && (
            <CRow className="g-4">
              {employeeCards.map((card, index) => (
                <CCol md={4} key={index}>
                  <Link to={card.path} className="text-decoration-none">
                    <CCard className="text-center h-100 hover-shadow">
                      <CCardHeader className="bg-primary text-white">{card.title}</CCardHeader>
                      <CCardBody>{card.description}</CCardBody>
                    </CCard>
                  </Link>
                </CCol>
              ))}
            </CRow>
          )}
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
