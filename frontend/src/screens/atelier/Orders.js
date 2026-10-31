
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaCalendarAlt,
  FaEllipsisH,
} from 'react-icons/fa'
import dynamicAPI from '../../api/dynamicAPI'
import './orders.css'

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

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

const Orders = () => {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await dynamicAPI('get', '/api/orders')

        setOrders(response.data || [])
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : err.message || 'Unable to load orders.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = [
        order.orderNumber,
        order.customer,
        order.title,
      ].some((value) =>
        (value || '').toLowerCase().includes(search.toLowerCase())
      )

      const matchesStatus =
        activeFilter === 'All' || order.status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, search, activeFilter])

  const counts = {
    all: orders.length,
    pending: orders.filter((order) => order.status === 'Pending').length,
    production: orders.filter(
      (order) => order.status === 'In Production'
    ).length,
    completed: orders.filter(
      (order) => order.status === 'Completed'
    ).length,
  }

  const filters = [
    'All',
    'Pending',
    'In Production',
    'Completed',
  ]

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'pending'
      case 'In Production':
        return 'production'
      case 'Completed':
        return 'completed'
      default:
        return ''
    }
  }

  return (
    <div className='orders-page'>
      <section className='orders-heading'>
        <div>
          <span className='atelier-eyebrow'>Workspace / Orders</span>
          <h1 className='atelier-heading'>Orders</h1>
          <p className='orders-subtitle'>
            Keep track of every detail, from the first request to final delivery.
          </p>
        </div>

        <button
          type='button'
          className='orders-create-button'
          onClick={() => navigate('/orders/create')}
        >
          <FaPlus />
          Create order
        </button>
      </section>

      <section className='orders-stats'>
        <div className='orders-stat-card'>
          <div className='orders-stat-top'>
            <span className='orders-stat-icon sage'><FaShoppingBag /></span>
            <span className='orders-stat-label'>All records</span>
          </div>
          <p>Total orders</p>
          <h2>{counts.all}</h2>
          <span className='orders-stat-note'>Across all order statuses</span>
        </div>

        <div className='orders-stat-card'>
          <div className='orders-stat-top'>
            <span className='orders-stat-icon amber'><FaClock /></span>
            <span className='orders-stat-label'>Needs attention</span>
          </div>
          <p>Pending</p>
          <h2>{counts.pending}</h2>
          <span className='orders-stat-note'>Awaiting confirmation</span>
        </div>

        <div className='orders-stat-card'>
          <div className='orders-stat-top'>
            <span className='orders-stat-icon blue'><FaSpinner /></span>
            <span className='orders-stat-label'>In progress</span>
          </div>
          <p>In production</p>
          <h2>{counts.production}</h2>
          <span className='orders-stat-note'>Currently being worked on</span>
        </div>

        <div className='orders-stat-card'>
          <div className='orders-stat-top'>
            <span className='orders-stat-icon green'><FaCheckCircle /></span>
            <span className='orders-stat-label'>Successfully delivered</span>
          </div>
          <p>Completed</p>
          <h2>{counts.completed}</h2>
          <span className='orders-stat-note'>Finished orders</span>
        </div>
      </section>

      <section className='orders-table-panel'>
        <div className='orders-panel-heading'>
          <div>
            <h2 className='atelier-heading'>All orders</h2>
            <p>Manage and monitor your customer orders.</p>
          </div>

          <span className='orders-total-count'>
            {filteredOrders.length} orders
          </span>
        </div>

        <div className='orders-toolbar'>
          <div className='orders-search'>
            <FaSearch />
            <input
              type='text'
              placeholder='Search by order, customer or item...'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className='orders-filters'>
            {filters.map((filter) => (
              <button
                key={filter}
                type='button'
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className='orders-table-scroll'>
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Order date</th>
                <th>Deadline</th>
                <th>Amount</th>
                <th>Status</th>
                <th aria-label='Actions'></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='7' className='orders-empty'>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan='7' className='orders-empty'>
                    {error}
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className='orders-id'>{order.orderNumber}</span>
                      <span className='orders-item-name'>{order.title}</span>
                    </td>

                    <td>
                      <div className='orders-customer'>
                        <span className='orders-avatar'>
                          {getInitials(order.customer)}
                        </span>
                        <span>{order.customer}</span>
                      </div>
                    </td>

                    <td>{formatDate(order.orderDate)}</td>

                    <td>
                      <span className='orders-deadline'>
                        <FaCalendarAlt />
                        {formatDate(order.deadline)}
                      </span>
                    </td>

                    <td className='orders-amount'>
                      {formatCurrency(order.totalAmount)}
                    </td>

                    <td>
                      <span className={`orders-status ${getStatusClass(order.status)}`}>
                        <span className='orders-status-dot'></span>
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type='button'
                        className='orders-more-button'
                        aria-label={`More actions for ${order.orderNumber}`}
                        onClick={() =>
                          window.alert(
                            `Order details for ${order.orderNumber} will be added soon.`
                          )
                        }
                      >
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7' className='orders-empty'>
                    No orders match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='orders-table-footer'>
          <span>
            Showing {loading ? 0 : filteredOrders.length} of {orders.length} orders
          </span>
          <span>Live database records</span>
        </div>
      </section>
    </div>
  )
}

export default Orders
