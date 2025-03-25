import React, { useEffect, useState } from 'react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { CCol, CRow, CWidgetStatsA, CSpinner } from '@coreui/react'

const WidgetStats = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    fetch('https://hr3.axleshift.com/leave-requests')
      .then((response) => response.json())
      .then((data) => {
        setLeaveRequests(data.leaveRequests)
        setLoading(false)
        calculateMonthlyData(data.leaveRequests)
      })
      .catch((error) => {
        console.error('Error fetching leave requests:', error)
        setLoading(false)
      })
  }, [])

  const calculateMonthlyData = (requests) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const monthlyCounts = new Array(12).fill(0)

    requests.forEach((request) => {
      const startDate = new Date(request.start_date)
      const endDate = new Date(request.end_date)
      const startMonth = startDate.getMonth()
      const endMonth = endDate.getMonth()

      for (let month = startMonth; month <= endMonth; month++) {
        monthlyCounts[month]++
      }
    })

    const monthlyData = months.map((month, index) => ({
      month,
      count: monthlyCounts[index],
    }))

    setMonthlyData(monthlyData)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  const totalLeaveRequests = leaveRequests.length
  const approvedLeaveRequests = leaveRequests.filter(
    (request) => request.status === 'Approved',
  ).length
  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === 'Pending',
  ).length
  const rejectedLeaveRequests = leaveRequests.filter(
    (request) => request.status.toLowerCase() === 'rejected',
  ).length
  const paidLeaveRequests = leaveRequests.filter((request) => request.is_paid === 'Paid').length
  const unpaidLeaveRequests = leaveRequests.filter((request) => request.is_paid === 'Unpaid').length

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              {totalLeaveRequests} <span className="fs-6 fw-normal">(Total Requests)</span>
            </>
          }
          title="Total Leave Requests"
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Leave Requests',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: '#5856d6',
                    data: monthlyData.map((data) => data.count),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    max: Math.max(...monthlyData.map((data) => data.count)) + 5,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              {approvedLeaveRequests} <span className="fs-6 fw-normal">(Approved)</span>
            </>
          }
          title="Approved Leave Requests"
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Approved Requests',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: '#39f',
                    data: monthlyData.map((data) => data.count),
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    max: Math.max(...monthlyData.map((data) => data.count)) + 5,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <>
              {pendingLeaveRequests} <span className="fs-6 fw-normal">(Pending)</span>
            </>
          }
          title="Pending Leave Requests"
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Pending Requests',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: monthlyData.map((data) => data.count),
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              {rejectedLeaveRequests} <span className="fs-6 fw-normal">(Rejected)</span>
            </>
          }
          title="Rejected Leave Requests"
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Rejected Requests',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: monthlyData.map((data) => data.count),
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success"
          value={
            <>
              {paidLeaveRequests} <span className="fs-6 fw-normal">(Paid)</span>
            </>
          }
          title="Paid Leave Requests"
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Paid Requests',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: monthlyData.map((data) => data.count),
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="secondary"
          value={
            <>
              {unpaidLeaveRequests} <span className="fs-6 fw-normal">(Unpaid)</span>
            </>
          }
          title="Unpaid Leave Requests"
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthlyData.map((data) => data.month),
                datasets: [
                  {
                    label: 'Unpaid Requests',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: monthlyData.map((data) => data.count),
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}
export default WidgetStats
