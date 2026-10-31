
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaShoppingBag,
  FaWallet,
  FaUsers,
} from 'react-icons/fa'
import dynamicAPI from '../../api/dynamicAPI'
import './dashboard.css'

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning.'
  if (hour < 17) return 'Good afternoon.'
  return 'Good evening.'
}

const Dashboard = () => {
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dynamicAPI(
          'get',
          '/api/orders/dashboard-summary'
        )

        setSummary(response.data)
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : err.message || 'Unable to load dashboard data.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const stats = [
    {
      title: 'Total Orders',
      value: summary?.totalOrders ?? 0,
      description: 'All recorded orders',
      icon: FaShoppingBag,
    },
    {
      title: 'Pending Orders',
      value: summary?.pendingOrders ?? 0,
      description: 'Awaiting action',
      icon: FaClock,
    },
    {
      title: 'Total Customers',
      value: summary?.totalCustomers ?? 0,
      description: 'Unique customers',
      icon: FaUsers,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summary?.totalRevenue),
      description: 'From active orders',
      icon: FaWallet,
    },
  ]

  const recentOrders = summary?.recentOrders || []

  return (
    <div className='atelier-dashboard'>
      <section className='atelier-welcome'>
        <div>
          <p className='atelier-eyebrow'>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).toUpperCase()}
          </p>

          <h1 className='atelier-heading'>{getGreeting()}</h1>

          <p className='atelier-welcome-description'>
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <button
          type='button'
          className='atelier-primary-button'
          onClick={() => navigate('/orders/create')}
        >
          <FaPlus />
          Create new order
        </button>
      </section>

      {error && (
        <p role='alert' style={{ color: '#a57668', fontSize: '13px' }}>
          {error}
        </p>
      )}

      <section className='atelier-stats-grid'>
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className='atelier-stat-card' key={stat.title}>
              <div className='atelier-stat-top'>
                <span>{stat.title}</span>
                <div className='atelier-stat-icon'>
                  <Icon />
                </div>
              </div>

              <h2>{loading ? '—' : stat.value}</h2>

              <div className='atelier-stat-bottom'>
                <span className='atelier-stat-change'>
                  {loading ? 'Loading...' : 'Live data'}
                </span>
                <span>{stat.description}</span>
              </div>
            </article>
          )
        })}
      </section>

      <section className='atelier-dashboard-grid'>
        <article className='atelier-panel atelier-orders-panel'>
          <div className='atelier-panel-header'>
            <div>
              <p className='atelier-eyebrow'>YOUR WORKSPACE</p>
              <h2 className='atelier-panel-title'>Recent orders</h2>
            </div>

            <button
              type='button'
              className='atelier-text-button'
              onClick={() => navigate('/orders')}
            >
              View all <FaArrowRight />
            </button>
          </div>

          <div className='atelier-table-wrapper'>
            <table className='atelier-orders-table'>
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEM</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan='5'>Loading recent orders...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan='5'>Unable to load orders.</td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan='5'>No orders yet. Create your first order!</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className='atelier-order-id'>
                          {order.orderNumber}
                        </span>
                        <small>{formatDate(order.orderDate)}</small>
                      </td>

                      <td>{order.customer}</td>

                      <td>{order.title}</td>

                      <td className='atelier-order-amount'>
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td>
                        <span
                          className={`atelier-status atelier-status-${order.status
                            .toLowerCase()
                            .replace(/\s+/g, '-')}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <aside className='atelier-panel atelier-activity-panel'>
          <div className='atelier-panel-header'>
            <div>
              <p className='atelier-eyebrow'>AT A GLANCE</p>
              <h2 className='atelier-panel-title'>Order overview</h2>
            </div>
          </div>

          <div className='atelier-overview-item'>
            <div className='atelier-overview-icon sage'>
              <FaClock />
            </div>
            <div>
              <strong>
                {loading ? '—' : summary?.inProductionOrders ?? 0}
              </strong>
              <span>Orders in production</span>
            </div>
          </div>

          <div className='atelier-overview-item'>
            <div className='atelier-overview-icon gold'>
              <FaWallet />
            </div>
            <div>
              <strong>
                {loading
                  ? '—'
                  : formatCurrency(summary?.outstandingPayments)}
              </strong>
              <span>Payments outstanding</span>
            </div>
          </div>

          <div className='atelier-overview-item'>
            <div className='atelier-overview-icon green'>
              <FaCheckCircle />
            </div>
            <div>
              <strong>
                {loading ? '—' : summary?.completedThisMonth ?? 0}
              </strong>
              <span>Orders completed this month</span>
            </div>
          </div>

          <div className='atelier-dashboard-note'>
            <span className='atelier-note-mark'>✳</span>
            <div>
              <strong>A little reminder</strong>
              <p>
                Keep your order updates current so every customer stays
                informed.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <p className='atelier-demo-note'>
        {loading ? 'Loading dashboard...' : 'Dashboard · Live database data'}
      </p>
    </div>
  )
}

export default Dashboard
