import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTachometerAlt,
  faWallet,
  faChartBar,
  faHandsHelping,
  faUsers,
  faCalendarAlt,
  faFileInvoiceDollar,
  faChartLine,
  faHandHoldingHeart,
  faTasks,
  faUserCog,
} from '@fortawesome/free-solid-svg-icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = (role) => {
  const admin = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/Dashboard',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Leave List',
      to: '/LeaveList',
      icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Payroll Management',
    },
    {
      component: CNavItem,
      name: 'Payroll',
      to: '/Payroll',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Salary Report',
      to: '/Report',
      icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Benefit Management',
    },
    {
      component: CNavItem,
      name: 'Benefits',
      to: '/Benefits',
      icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="nav-icon" />,
    },
  ]

  const employee = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/Dashboard',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Leave',
      to: '/Leave',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Leave',
      to: '/EmployeeLeave',
      icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    },
  ]

  const superAdmin = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Leave List',
      to: '/LeaveList',
      icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Payroll Management',
    },
    {
      component: CNavItem,
      name: 'Payroll',
      to: '/Payroll',
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Report',
      to: '/Report',
      icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Benefit Management',
    },
    {
      component: CNavItem,
      name: 'Benefits',
      to: '/Benefits',
      icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Compliance',
      to: '/Compliance',
      icon: <FontAwesomeIcon icon={faUserCog} className="nav-icon" />,
    },
  ]

  const staff = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Tasks',
      to: '/staff-tasks',
      icon: <FontAwesomeIcon icon={faTasks} className="nav-icon" />,
    },
  ]

  switch (role) {
    case 'admin':
      return admin
    case 'superAdmin':
      return superAdmin
    case 'staff':
      return staff
    default:
      return employee
  }
}

export default _nav
