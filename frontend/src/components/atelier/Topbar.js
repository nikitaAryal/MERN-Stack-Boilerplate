import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import {
  FaBars,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaSignOutAlt,
} from 'react-icons/fa'
import useAuthHook from '../../api/auth'
import useAuth from '../../hooks/useAuth'

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const { postLogout } = useAuthHook()

  const { mutateAsync } = useMutation(postLogout, {
    onSuccess: () => navigate('/auth/login'),
  })

  const user = auth?.userInfo

  const logoutHandler = async () => {
    await mutateAsync({})
  }

  return (
    <header className='atelier-topbar'>
      <div className='atelier-topbar-left'>
        <button
          type='button'
          className='atelier-menu-toggle'
          onClick={onMenuClick}
          aria-label='Open navigation'
        >
          <FaBars />
        </button>

        <div className='atelier-breadcrumb'>
          <span>Workspace</span>
          <span className='atelier-breadcrumb-divider'>/</span>
          <strong>Overview</strong>
        </div>
      </div>

      <div className='atelier-topbar-right'>
        <div className='atelier-search'>
          <FaSearch />
          <input
            type='search'
            placeholder='Search anything...'
            aria-label='Search'
          />
          <span className='atelier-search-shortcut'>⌘ K</span>
        </div>

        <button
          type='button'
          className='atelier-notification-button'
          aria-label='Notifications'
        >
          <FaBell />
          <span className='atelier-notification-dot' />
        </button>

        <div className='atelier-user-menu'>
          <div className='atelier-avatar'>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>

          <div className='atelier-user-details'>
            <span className='atelier-user-name'>
              {user?.name || 'Administrator'}
            </span>
            <span className='atelier-user-role'>Super Admin</span>
          </div>

          <button
            type='button'
            className='atelier-logout-button'
            onClick={logoutHandler}
            title='Sign out'
            aria-label='Sign out'
          >
            <FaSignOutAlt />
          </button>

          <FaChevronDown className='atelier-user-chevron' />
        </div>
      </div>
    </header>
  )
}

export default Topbar