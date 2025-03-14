import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { CCol, CRow, CWidgetStatsF, CContainer } from '@coreui/react'
import axios from 'axios'

const getLeaveCountByStatus = async (status) => {
  try {
    const response = await axios.get(`/leave-requests/count/${status}`)
    return response.data.count
  } catch (error) {
    console.error(`Error fetching count for status ${status}:`, error)
    return 0
  }
}

export const Dashboard = () => {
  const navigate = useNavigate() // Hook for navigation
  const [leaveStats, setLeaveStats] = useState({
    pendingRequests: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  })

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

    fetchLeaveStats()
  }, [])

  return (
    <CContainer fluid>
      <CRow className="g-3">
        {/* Pending Requests */}
        <CCol xs={12} sm={6} md={4} lg={3}>
          <div onClick={() => navigate('/Pending')} style={{ cursor: 'pointer' }}>
            <CWidgetStatsF
              className="mb-3 h-100"
              color="warning"
              icon={<FontAwesomeIcon icon={faClock} size="2x" />}
              title="Pending Requests"
              value={leaveStats.pendingRequests}
              padding={true}
            />
          </div>
        </CCol>

        {/* Approved Leaves */}
        <CCol xs={12} sm={6} md={4} lg={3}>
          <div onClick={() => navigate('/Approved')} style={{ cursor: 'pointer' }}>
            <CWidgetStatsF
              className="mb-3 h-100"
              color="success"
              icon={<FontAwesomeIcon icon={faCheckCircle} size="2x" />}
              title="Approved Leaves"
              value={leaveStats.approvedLeaves}
              padding={true}
            />
          </div>
        </CCol>

        {/* Rejected Leaves */}
        <CCol xs={12} sm={6} md={4} lg={3}>
          <div onClick={() => navigate('/Rejected')} style={{ cursor: 'pointer' }}>
            <CWidgetStatsF
              className="mb-3 h-100"
              color="danger"
              icon={<FontAwesomeIcon icon={faTimesCircle} size="2x" />}
              title="Rejected Leaves"
              value={leaveStats.rejectedLeaves}
              padding={true}
            />
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Dashboard
