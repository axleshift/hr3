// import React, { useEffect, useState } from 'react'
// import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CSpinner } from '@coreui/react'
// import { Link } from 'react-router-dom'
// import WidgetStats from './WidgetStats'
// import api from '../../util/api'

// const Dashboard = () => {
//   const [leaveStats, setLeaveStats] = useState({
//     pendingRequests: 0,
//     approvedLeaves: 0,
//     rejectedLeaves: 0,
//   })
//   const [loading, setLoading] = useState(true)
//   const userRole = sessionStorage.getItem('role')

//   useEffect(() => {
//     const fetchLeaveStats = async () => {
//       try {
//         setLoading(true)
//         const [pendingRequests, approvedLeaves, rejectedLeaves] = await Promise.all([
//           api.get('/leave-requests/count/Pending'),
//           api.get('/leave-requests/count/Approved'),
//           api.get('/leave-requests/count/Rejected'),
//         ])

//         setLeaveStats({
//           pendingRequests: pendingRequests.data.count,
//           approvedLeaves: approvedLeaves.data.count,
//           rejectedLeaves: rejectedLeaves.data.count,
//         })
//       } catch (error) {
//         console.error('Error fetching leave stats:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchLeaveStats()
//   }, [])

//   const employeeCards = [
//     { title: 'Payslips', path: '/payslips', description: 'View your payslips' },
//     { title: 'Leave Request', path: '/leave-requests', description: 'Submit leave requests' },
//     { title: 'Leave History', path: '/leave-history', description: 'View past leave requests' },
//   ]

//   return (
//     <CContainer fluid>
//       {loading && (
//         <div className="loading-overlay">
//           <CSpinner color="primary" variant="grow" />
//         </div>
//       )}

//       {!loading && (
//         <>
//           {(userRole === 'admin' || userRole === 'superAdmin') && (
//             <WidgetStats stats={leaveStats} />
//           )}

//           {userRole === 'employee' && (
//             <CRow className="g-4">
//               {employeeCards.map((card, index) => (
//                 <CCol md={4} key={index}>
//                   <Link to={card.path} className="text-decoration-none">
//                     <CCard className="text-center h-100 hover-shadow">
//                       <CCardHeader className="bg-primary text-white">{card.title}</CCardHeader>
//                       <CCardBody>{card.description}</CCardBody>
//                     </CCard>
//                   </Link>
//                 </CCol>
//               ))}
//             </CRow>
//           )}
//         </>
//       )}
//     </CContainer>
//   )
// }

// export default Dashboard

import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
  CSpinner,
  CButton,
} from '@coreui/react'
import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartPie,
  CChartPolarArea,
} from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilMoney, cilPeople, cilChartPie } from '@coreui/icons'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('monthly') // 'monthly' or 'yearly'
  const [dashboardData, setDashboardData] = useState(null)

  // Mock data generator
  const generateMockData = () => {
    // Current month and previous 5 months
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }))
    }

    // Departments
    const departments = ['Finance', 'HR', 'IT', 'Operations', 'Marketing']

    return {
      payroll: {
        total: 1250000,
        monthlyTrend: months.map(() => Math.floor(Math.random() * 200000) + 100000),
        byDepartment: departments.map(() => Math.floor(Math.random() * 300000) + 50000),
      },
      leave: {
        pending: Math.floor(Math.random() * 15) + 5,
        approved: Math.floor(Math.random() * 30) + 10,
        rejected: Math.floor(Math.random() * 10) + 2,
        types: {
          labels: ['Annual', 'Sick', 'Maternity', 'Unpaid'],
          data: [45, 30, 15, 10],
        },
      },
      disputes: {
        open: Math.floor(Math.random() * 8) + 2,
        inProgress: Math.floor(Math.random() * 5) + 1,
        resolved: Math.floor(Math.random() * 15) + 5,
      },
      attendance: {
        latePercentage: Math.floor(Math.random() * 20) + 5,
        departments: departments,
        lateByDept: departments.map(() => Math.floor(Math.random() * 15) + 5),
      },
      benefits: {
        totalCost: 350000,
        types: ['Health', 'Retirement', 'Bonus', 'Allowance'],
        costs: [150000, 120000, 50000, 30000],
      },
      months: months,
      departments: departments,
    }
  }

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setDashboardData(generateMockData())
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRange])

  if (loading || !dashboardData) {
    return (
      <div className="text-center py-5">
        <CSpinner />
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Time Range Selector */}
      <div className="mb-4 text-end">
        <CButton
          color={timeRange === 'monthly' ? 'primary' : 'secondary'}
          onClick={() => setTimeRange('monthly')}
          className="me-2"
        >
          Monthly
        </CButton>
        <CButton
          color={timeRange === 'yearly' ? 'primary' : 'secondary'}
          onClick={() => setTimeRange('yearly')}
        >
          Yearly
        </CButton>
      </div>

      {/* Key Metrics */}
      <CRow className="mb-4">
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="text-center">
              <div className="fs-4 fw-semibold text-primary">
                ${dashboardData.payroll.total.toLocaleString()}
              </div>
              <div className="text-medium-emphasis small">Total Payroll</div>
              <CIcon icon={cilMoney} height={36} className="my-3 text-primary" />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="text-center">
              <div className="fs-4 fw-semibold text-warning">{dashboardData.leave.pending}</div>
              <div className="text-medium-emphasis small">Pending Leave Requests</div>
              <CIcon icon={cilCalendar} height={36} className="my-3 text-warning" />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="text-center">
              <div className="fs-4 fw-semibold text-danger">{dashboardData.disputes.open}</div>
              <div className="text-medium-emphasis small">Open Disputes</div>
              <CIcon icon={cilPeople} height={36} className="my-3 text-danger" />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100">
            <CCardBody className="text-center">
              <div className="fs-4 fw-semibold text-info">
                {dashboardData.attendance.latePercentage}%
              </div>
              <div className="text-medium-emphasis small">Late Attendance</div>
              <CIcon icon={cilChartPie} height={36} className="my-3 text-info" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Payroll Trends */}
      <CRow className="mb-4">
        <CCol xs={12} lg={8}>
          <CCard className="h-100">
            <CCardHeader>Payroll Trends</CCardHeader>
            <CCardBody>
              <CChartLine
                data={{
                  labels: dashboardData.months,
                  datasets: [
                    {
                      label: 'Payroll Amount',
                      backgroundColor: 'rgba(32, 107, 196, 0.2)',
                      borderColor: 'rgba(32, 107, 196, 1)',
                      pointBackgroundColor: 'rgba(32, 107, 196, 1)',
                      pointBorderColor: '#fff',
                      data: dashboardData.payroll.monthlyTrend,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={4}>
          <CCard className="h-100">
            <CCardHeader>Leave Request Status</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['Approved', 'Pending', 'Rejected'],
                  datasets: [
                    {
                      backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'],
                      data: [
                        dashboardData.leave.approved,
                        dashboardData.leave.pending,
                        dashboardData.leave.rejected,
                      ],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Department Breakdown */}
      <CRow className="mb-4">
        <CCol xs={12} lg={6}>
          <CCard className="h-100">
            <CCardHeader>Payroll by Department</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: dashboardData.departments,
                  datasets: [
                    {
                      label: 'Payroll Amount',
                      backgroundColor: '#36A2EB',
                      data: dashboardData.payroll.byDepartment,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="h-100">
            <CCardHeader>Leave Types Distribution</CCardHeader>
            <CCardBody>
              <CChartPolarArea
                data={{
                  labels: dashboardData.leave.types.labels,
                  datasets: [
                    {
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                      data: dashboardData.leave.types.data,
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Additional Metrics */}
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="h-100">
            <CCardHeader>Dispute Status</CCardHeader>
            <CCardBody>
              <CChartPie
                data={{
                  labels: ['Open', 'In Progress', 'Resolved'],
                  datasets: [
                    {
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      data: [
                        dashboardData.disputes.open,
                        dashboardData.disputes.inProgress,
                        dashboardData.disputes.resolved,
                      ],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} lg={6}>
          <CCard className="h-100">
            <CCardHeader>Benefits Cost Distribution</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: dashboardData.benefits.types,
                  datasets: [
                    {
                      label: 'Cost',
                      backgroundColor: '#4BC0C0',
                      data: dashboardData.benefits.costs,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
