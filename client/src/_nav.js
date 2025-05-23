import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTachometerAlt,
  faCalendarAlt,
  faFileInvoiceDollar,
  faChartLine,
  faHandHoldingHeart,
  faUserCog,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { CNavItem, CNavTitle, CNavGroup } from '@coreui/react'

const navItems = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/Dashboard',
    icon: <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />,
    permission: ['superadmin', 'admin', 'employee', 'staff'],
  },
  {
    component: CNavTitle,
    name: 'Leave Management',
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Leave',
    to: '/EmployeeLeave',
    icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    permission: ['employee'],
  },
  {
    component: CNavItem,
    name: 'Leave Type',
    to: '/LeaveType',
    icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    permission: ['superadmin'],
  },
  // {
  //   component: CNavItem,
  //   name: 'Leave Report',
  //   to: '/LeaveReport',
  //   icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
  //   permission: ['superadmin'],
  // },
  {
    component: CNavItem,
    name: 'Leave List',
    to: '/List',
    icon: <FontAwesomeIcon icon={faCheckCircle} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Leave Balance',
    to: '/LeaveBalances',
    icon: <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />,
    permission: ['superadmin'],
  },
  {
    component: CNavItem,
    name: 'Leave Report',
    to: '/LeaveReport',
    icon: <FontAwesomeIcon icon={faCheckCircle} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavTitle,
    name: 'Payroll Management',
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Payslip',
    to: '/EmployeePayslip',
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    permission: ['employee'],
  },
  {
    component: CNavItem,
    name: 'Payroll',
    to: '/Payroll',
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Dispute',
    to: '/Dispute',
    icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Payslip',
    to: '/Payslip',
    icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/Report',
    icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  // {
  //   component: CNavItem,
  //   name: 'Budget',
  //   to: '/Budget',
  //   icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
  //   permission: ['superadmin', 'admin'],
  // },
  {
    component: CNavTitle,
    name: 'Benefit Management',
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Benefits',
    to: '/Benefits',
    icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  {
    component: CNavItem,
    name: 'Benefits Archive',
    to: '/Benefits_Archive',
    icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="nav-icon" />,
    permission: ['superadmin', 'admin'],
  },
  // {
  //   component: CNavItem,
  //   name: 'Compliance',
  //   to: '/Compliance',
  //   icon: <FontAwesomeIcon icon={faUserCog} className="nav-icon" />,
  //   permission: ['superadmin'],
  // },
  //   {
  //     component: CNavItem,
  //     name: 'User Mangement',
  //     to: '/User_Mangement',
  //     icon: <FontAwesomeIcon icon={faChartLine} className="nav-icon" />,
  //     permission: ['superadmin'],
  //   },
]

const _nav = (role) => {
  return navItems.filter((item) => item.permission.includes(role))
}

export default _nav
