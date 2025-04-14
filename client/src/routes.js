import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Benefits = React.lazy(() => import('./views/benefits/Benefits'))
const BenefitTypes = React.lazy(() => import('./views/benefits/BenefitTypes'))
const Payroll = React.lazy(() => import('./views/payroll/Payroll'))
const Report = React.lazy(() => import('./views/payroll/Report'))
const ChangePassword = React.lazy(() => import('./views/pages/ChangePassword'))
const Profile = React.lazy(() => import('./views/pages/Profile'))

// employee
const Leave = React.lazy(() => import('./views/employee/Leave'))
const EmployeePayslip = React.lazy(() => import('./views/employee/EmployeePayslip'))
const Employee = React.lazy(() => import('./views/payroll/Employee'))
const EmployeeLeave = React.lazy(() => import('./views/employee/EmployeeLeave'))
// const Attendances = React.lazy(() => import('./views/payroll/Attendances'))
const Payslip = React.lazy(() => import('./views/payroll/Payslip'))
const Compliance = React.lazy(() => import('./views/benefits/Compliance'))
const List = React.lazy(() => import('./views/leave/List'))
const Pending = React.lazy(() => import('./views/leave/Pending'))
const LeaveList = React.lazy(() => import('./views/leave/LeaveList'))
const LeaveType = React.lazy(() => import('./views/leave/LeaveType'))
const LeaveReport = React.lazy(() => import('./views/leave/LeaveReport'))
const Benefits_Archive = React.lazy(() => import('./views/benefits/Benefits_Archive'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Pending', name: 'Leave Pending', element: Pending },
  { path: '/List', name: 'Leave List', element: List },
  { path: '/EmployeePayslip', name: 'Employee List', element: EmployeePayslip },
  { path: '/Benefits', name: 'Benefits', element: Benefits },
  { path: '/BenefitTypes', name: 'Benefit Types', element: BenefitTypes },
  { path: '/Compliance', name: 'Compliance', element: Compliance },
  { path: '/Payroll', name: 'Payroll', element: Payroll },
  { path: '/Report', name: 'Report', element: Report },
  { path: '/LeaveReport', name: 'Report', element: LeaveReport },
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },
  { path: '/Leave', name: 'Leave', element: Leave },
  { path: '/LeaveList', name: 'Leave', element: LeaveList },
  { path: '/EmployeeLeave', name: 'Employee Leave', element: EmployeeLeave },
  { path: '/Employee', name: 'Employee', element: Employee },
  //  { path: '/Attendances', name: 'Attendances', element: Attendances },
  { path: '/Payslip', name: 'Payslip', element: Payslip },
  { path: '/LeaveType', name: 'LeaveType', element: LeaveType },
  { path: '/Benefits_Archive', name: 'Benefits_Archive', element: Benefits_Archive },
]

export default routes
