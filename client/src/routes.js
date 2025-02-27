import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Benefits = React.lazy(() => import('./views/benefits/Benefits'))

// Admin
const LeaveList = React.lazy(() => import('./views/leave/LeaveList'))

const Payroll = React.lazy(() => import('./views/payroll/Payroll'))
const AddPayroll = React.lazy(() => import('./views/payroll/AddPayroll'))
const Report = React.lazy(() => import('./views/payroll/Report'))

// Account
const ChangePassword = React.lazy(() => import('./views/pages/ChangePassword'))
const Profile = React.lazy(() => import('./views/pages/Profile'))

// Employee
const Leave = React.lazy(() => import('./views/leave/Leave'))
const Employee = React.lazy(() => import('./views/employee/Employee'))
const EDashboard = React.lazy(() => import('./views/dashboard/EDashboard'))
const EmployeeLeave = React.lazy(() => import('./views/leave/EmployeeLeave'))
const LeaveCredit = React.lazy(() => import('./views/leave/LeaveCredit'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // Admin
  { path: '/LeaveList', name: 'Leave List', element: LeaveList },

  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/EDashboard', name: 'Dashboard', element: EDashboard },
  { path: '/Benefits', name: 'Benefits', element: Benefits },
  { path: '/Payroll', name: 'Payroll', element: Payroll },
  { path: '/AddPayroll', name: 'Payroll', element: AddPayroll },
  { path: '/Report', name: 'Report', element: Report },
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Leave', name: 'Leave', element: Leave },
  { path: '/EmployeeLeave', name: 'Leave', element: EmployeeLeave },
  { path: '/Employee', name: 'Employee', element: Employee },
  { path: '/LeaveCredit', name: 'Credit', element: LeaveCredit },
]

export default routes
