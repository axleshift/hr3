import React, { useEffect, useState } from 'react'
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
import avatar1 from './../../assets/images/avatars/1.jpg'
import { useNavigate } from 'react-router-dom'
import api from '../../util/api'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async (userId) => {
      try {
        const profileResponse = await api.get(`/profiles/${userId}`)
        setProfile(profileResponse.data.data)
      } catch (error) {
        console.error('Error fetching profile', error)
      }
    }

    const verifySessionAndFetchProfile = async () => {
      try {
        const sessionId = Cookies.get('dcims')
        if (sessionId) {
          const response = await api.post('/auth/verify-session', { session_id: sessionId })
          const userId = response.data.user.id
          await fetchProfile(userId)
        }
      } catch (error) {
        console.error('Error verifying session', error)
      }
    }

    verifySessionAndFetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      sessionStorage.clear()
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
        <CAvatar src={profile?.profile_url || avatar1} size="md" className="me-2" />
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

        {/* Logout */}
        <CDropdownItem onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
