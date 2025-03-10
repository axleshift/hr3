import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { faUser, faSignOutAlt, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import api from '../../util/api'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      Cookies.remove('dcims')
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

        {/* Profile Link */}
        <CDropdownItem onClick={() => navigate('/profile')}>
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Profile
        </CDropdownItem>

        {/* Change Password Link */}
        <CDropdownItem onClick={() => navigate('/changepassword')}>
          <FontAwesomeIcon icon={faLock} className="me-2" />
          Change Password
        </CDropdownItem>

        <CDropdownItem onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
