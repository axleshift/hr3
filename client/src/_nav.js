import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTachometerAlt,
  faWallet,
  faFileInvoiceDollar,
  faClipboardList,
  faFileAlt,
  faChartBar,
  faUsers,
  faCogs,
  faHandsHelping,
} from '@fortawesome/free-solid-svg-icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = (role) => {
  const admin = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Payroll Management',
    },
    {
      component: CNavItem,
      name: 'Payroll',
      to: '/Payroll',
      icon: <FontAwesomeIcon icon={faWallet} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Deductions',
      to: '/Deduction',
      icon: <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Payment',
      to: '/Payment',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'Adjustment',
    //   to: '/Adjustment',
    //   icon: <FontAwesomeIcon icon={faCogs} className="nav-icon" />,
    // },
    {
      component: CNavItem,
      name: 'Report',
      to: '/Report',
      icon: <FontAwesomeIcon icon={faChartBar} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Benefit Management',
    },
    {
      component: CNavItem,
      name: 'Benefits',
      to: '/Benefits',
      icon: <FontAwesomeIcon icon={faHandsHelping} className="nav-icon" />,
    },
  ]

  const employee = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/Portal',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Payroll',
      to: '/EPayroll',
      icon: <FontAwesomeIcon icon={faWallet} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Update Payment Method',
      to: '/PaymentMethod',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    },
  ]

  return role === 'admin' ? admin : employee
}

export default _nav
