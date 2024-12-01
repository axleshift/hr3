import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Benefits = React.lazy(() => import('./views/benefits/Benefits'))

// Payroll Management
const Payroll = React.lazy(() => import('./views/payroll/Payroll'))
const EditPayroll = React.lazy(() => import('./views/payroll/EditPayroll'))
const AddPayroll = React.lazy(() => import('./views/payroll/AddPayroll'))
const Deduction = React.lazy(() => import('./views/deduction/Deduction'))
const Deduct = React.lazy(() => import('./views/deduction/Deduct'))
const Checkout = React.lazy(() => import('./views/payroll/Checkout'))
const Payment = React.lazy(() => import('./views/payroll/Payment'))
const Report = React.lazy(() => import('./views/payroll/Report'))

// Account
const ChangePassword = React.lazy(() => import('./components/pages/ChangePassword'))
const Profile = React.lazy(() => import('./components/pages/Profile'))

// Employee Portal
const Portal = React.lazy(() => import('./components/portal/Portal'))
const PaymentMethod = React.lazy(() => import('./views/Form/PaymentMethod'))
// const ExpenseForm = React.lazy(() => import('./views/Form/ExpenseForm'))
const EPayroll = React.lazy(() => import('./components/portal/EPayroll'))
const Adjustment = React.lazy(() => import('./views/payroll/Adjustment'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // Admin
  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Benefits', name: 'Benefits', element: Benefits },
  { path: '/Payroll', name: 'Payroll', element: Payroll },
  { path: '/AddPayroll', name: 'Payroll', element: AddPayroll },
  { path: '/EditPayroll/:id', name: 'Edit Payroll', element: EditPayroll },
  { path: '/Deduct', name: 'Deduct', element: Deduct },
  { path: '/Deduction', name: 'Deduction', element: Deduction },
  { path: '/Checkout', name: 'Checkout', element: Checkout },
  { path: '/Payment', name: 'Payment', element: Payment },
  { path: '/Report', name: 'Report', element: Report },
  { path: '/Adjustment', name: 'Adjustment', element: Adjustment },
  { path: '/PaymentMethod', name: 'Payment Method Form', element: PaymentMethod },
  // { path: '/ExpenseForm', name: 'Expense Form', element: ExpenseForm },

  // Account
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/ChangePassword', name: 'Change Password', element: ChangePassword },

  // Employee Portal
  { path: '/Portal', name: 'Portal', element: Portal },
  { path: '/EPayroll', name: 'Payroll', element: EPayroll },
  { path: '/Portal', name: 'Portal', element: Portal },
]

export default routes
