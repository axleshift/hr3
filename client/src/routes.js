import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Benefits = React.lazy(() => import('./views/benefits/Benefits'))
const LeaveList = React.lazy(() => import('./views/leave/LeaveList'))
const Payroll = React.lazy(() => import('./views/payroll/Payroll'))
const Report = React.lazy(() => import('./views/payroll/Report'))
const ChangePassword = React.lazy(() => import('./views/pages/ChangePassword'))
const Leave = React.lazy(() => import('./views/leave/Leave'))
const EmployeeLeave = React.lazy(() => import('./views/leave/EmployeeLeave'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/LeaveList', name: 'Leave List', element: LeaveList },
  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Benefits', name: 'Benefits', element: Benefits },
  { path: '/Payroll', name: 'Payroll', element: Payroll },
  { path: '/Report', name: 'Report', element: Report },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Leave', name: 'Leave', element: Leave },
  { path: '/EmployeeLeave', name: 'Leave', element: EmployeeLeave },
]

export default routes
