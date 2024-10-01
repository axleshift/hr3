import React from 'react'
import CIcon from '@coreui/icons-react'

import {
  cilNotes,
  cilMoney,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Payroll',
    to: '/payrol',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Employee',
    to: '/employee',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },

  

  
]

export default _nav
