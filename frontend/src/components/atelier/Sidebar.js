import { NavLink } from 'react-router-dom'
import {
  FaChartPie,
  FaClipboardList,
  FaUsers,
  FaBoxOpen,
  FaFileAlt,
  FaFileInvoice,
  FaWallet,
  FaChartLine,
  FaUserFriends,
  FaCog,
  FaTimes,
  FaLeaf,
} from 'react-icons/fa'

const navigationGroups = [
  {
    title: 'WORKSPACE',
    items: [
      { name: 'Overview', path: '/', icon: FaChartPie },
      { name: 'Orders', path: '/orders', icon: FaClipboardList },
      { name: 'Customers', path: '/customers', icon: FaUsers },
      { name: 'Products & Services', path: '/products', icon: FaBoxOpen },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { name: 'Quotations', path: '/quotations', icon: FaFileAlt },
      { name: 'Invoices', path: '/invoices', icon: FaFileInvoice },
      { name: 'Payments', path: '/payments', icon: FaWallet },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Analytics', path: '/analytics', icon: FaChartLine },
      { name: 'Team', path: '/team', icon: FaUserFriends },
      { name: 'Settings', path: '/settings', icon: FaCog },
    ],
  },
]

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className='atelier-sidebar-overlay'
          onClick={onClose}
        />
      )}

      <aside
        className={`atelier-sidebar ${isOpen ? 'atelier-sidebar-open' : ''}`}
      >
        <div className='atelier-brand'>
          <div className='atelier-brand-icon'>
            <FaLeaf />
          </div>

          <div className='atelier-brand-copy'>
            <span className='atelier-brand-name'>atelier</span>
            <span className='atelier-brand-subtitle'>
              ORDER MANAGEMENT
            </span>
          </div>

          <button
            type='button'
            className='atelier-sidebar-close'
            onClick={onClose}
            aria-label='Close navigation'
          >
            <FaTimes />
          </button>
        </div>

        <div className='atelier-sidebar-content'>
          {navigationGroups.map((group) => (
            <div className='atelier-nav-group' key={group.title}>
              <p className='atelier-nav-heading'>{group.title}</p>

              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `atelier-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <Icon className='atelier-nav-icon' />
                    <span>{item.name}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </div>

        <div className='atelier-sidebar-footer'>
          <div className='atelier-sidebar-footer-mark'>A</div>
          <div>
            <p>Made for your business</p>
            <span>Atelier workspace</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar