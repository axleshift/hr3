import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CRow } from '@coreui/react'

const AdminDashboard = () => {
  const { state } = useContext(AuthContext)

  return (
    <CRow>
      <strong>Welcome, {state.user?.name} (Admin)</strong>
    </CRow>
  )
}

export default AdminDashboard
