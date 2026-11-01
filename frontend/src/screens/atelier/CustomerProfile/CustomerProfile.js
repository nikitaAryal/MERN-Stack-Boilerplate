import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaShoppingBag,
  FaWallet,
  FaPlus,
  FaCalendarAlt,
  FaSpinner,
} from 'react-icons/fa'
import dynamicAPI from '../../../api/dynamicAPI'
import '../customers.css'

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

const CustomerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await dynamicAPI(
          'get',
          `/api/customers/${id}`
        )

        setProfile(response.data)
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : err.message || 'Unable to load customer profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className='customer-profile-state'>
        <FaSpinner className='customers-spinner' />
        Loading customer profile...
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className='customer-profile-state'>
        <p>{error || 'Customer not found.'}</p>
        <button
          type='button'
          className='customers-back-button'
          onClick={() => navigate('/customers')}
        >
          <FaArrowLeft /> Back to customers
        </button>
      </div>
    )
  }

  const { customer, orders, summary } = profile

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending'
      case 'In Production': return 'production'
      case 'Completed': return 'completed'
      default: return ''
    }
  }

  return (
    <div className='customers-page'>
      <button
        type='button'
        className='customers-back-button'
        onClick={() => navigate('/customers')}
      >
        <FaArrowLeft /> Back to customers
      </button>

      <section className='customer-profile-heading'>
        <div className='customer-profile-identity'>
          <span className='customer-profile-avatar'>
            {customer.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join('')}
          </span>

          <div>
            <span className='atelier-eyebrow'>Workspace / Customers / Profile</span>
            <h1 className='atelier-heading'>{customer.name}</h1>

            <div className='customer-contact-details'>
              <span><FaPhone /> {customer.phone}</span>
              {customer.email && (
                <span><FaEnvelope /> {customer.email}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type='button'
          className='customers-create-button'
          onClick={() => navigate('/orders/create', {
            state: { customer },
          })}
        >
          <FaPlus /> Create order
        </button>
      </section>

      <section className='customers-stats'>
        <div className='customers-stat-card'>
          <span className='customers-stat-icon sage'><FaShoppingBag /></span>
          <p>Total orders</p>
          <h2>{summary.totalOrders}</h2>
          <span>Orders placed by this customer</span>
        </div>

        <div className='customers-stat-card'>
          <span className='customers-stat-icon green'><FaWallet /></span>
          <p>Total spending</p>
          <h2>{formatCurrency(summary.totalSpending)}</h2>
          <span>Total order value</span>
        </div>

        <div className='customers-stat-card'>
          <span className='customers-stat-icon amber'><FaWallet /></span>
          <p>Outstanding balance</p>
          <h2>{formatCurrency(summary.outstandingBalance)}</h2>
          <span>Remaining payment</span>
        </div>
      </section>

      <section className='customers-panel'>
        <div className='customers-panel-heading'>
          <div>
            <h2 className='atelier-heading'>Order history</h2>
            <p>Every order associated with this customer.</p>
          </div>

          <span className='customers-count-badge'>
            {orders.length} orders
          </span>
        </div>

        <div className='customers-table-scroll'>
          <table className='customers-table'>
            <thead>
              <tr>
                <th>Order</th>
                <th>Order date</th>
                <th>Deadline</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <button
                        type='button'
                        className='customers-order-link'
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        {order.orderNumber}
                      </button>
                      <span className='customers-order-title'>
                        {order.title}
                      </span>
                    </td>

                    <td>{formatDate(order.orderDate)}</td>
                    <td>
                      <span className='customers-date'>
                        <FaCalendarAlt /> {formatDate(order.deadline)}
                      </span>
                    </td>
                    <td className='customers-money'>
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className='customers-money'>
                      {formatCurrency(order.balance)}
                    </td>
                    <td>
                      <span className={`orders-status ${getStatusClass(order.status)}`}>
                        <span className='orders-status-dot'></span>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='customers-empty'>
                    No orders found for this customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default CustomerProfile