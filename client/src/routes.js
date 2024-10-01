import React from 'react'

const Dashboard = React.lazy(() => import('./views/dash/Dashboard'))
const Payrol = React.lazy(() => import('./views/Payrol/payrol'))
const Employee = React.lazy(() => import('./views/employee/Employee'))
const Benefits = React.lazy(() => import('./views/benefits/Benefits'))
const Compliance = React.lazy(() => import('./views/compliance/Compliance.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  
  { path: '/dash', name: 'Dashboard', element: Dashboard },
  { path: '/payrol', name: 'Payroll', element: Payrol },
  { path: '/employee', name: 'Employee', element: Employee },
  { path: '/benefits', name: 'Benefits', element: Benefits },
  { path: '/compliance', name: 'Compliance', element: Compliance },
]

export default routes
