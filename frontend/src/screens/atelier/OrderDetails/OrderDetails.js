
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMoneyBillWave,
  FaSpinner,
  FaEdit,
} from 'react-icons/fa'
import dynamicAPI from '../../../api/dynamicAPI'
import './order-details.css'

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`

const formatDate = (date) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await dynamicAPI('get', `/api/orders/${id}`)
        setOrder(response.data)
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : err.message || 'Unable to load order details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = async (newStatus) => {
  try {
    setSavingStatus(true)
    setError('')

    const response = await dynamicAPI('put', `/api/orders/${id}`, {
      status: newStatus,
    })

    setOrder(response.data)
  } catch (err) {
    setError(
      typeof err === 'string'
        ? err
        : err.message || 'Unable to update order status.'
    )
  } finally {
    setSavingStatus(false)
  }
}

  if (loading) {
    return (
      <div className='order-details-state'>
        <FaSpinner className='order-details-spinner' />
        <p>Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className='order-details-state'>
        <h2>Order not found</h2>
        <p>{error || 'We could not find this order.'}</p>
        <button onClick={() => navigate('/orders')}>
          Back to orders
        </button>
      </div>
    )
  }

  const balance = Number(order.totalAmount || 0) -
    Number(order.advancePayment || 0)

  return (
    <div className='order-details-page'>
      <button
        type='button'
        className='order-details-back'
        onClick={() => navigate('/orders')}
      >
        <FaArrowLeft />
        Back to orders
      </button>

      
<section className='order-details-heading'>
  <div>
    <span className='atelier-eyebrow'>Workspace / Orders / Details</span>
    <h1 className='atelier-heading'>{order.orderNumber}</h1>
    <p>{order.title}</p>
  </div>

  <div className='order-details-actions'>
    <button
      type='button'
      className='order-edit-button'
      onClick={() => navigate(`/orders/${id}/edit`)}
    >
      <FaEdit />
      Edit Order
    </button>

    <div className='order-details-status-control'>
      <label htmlFor='order-status'>Order status</label>

      <select
        id='order-status'
        value={order.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={savingStatus}
        className={`order-details-status-select ${order.status
          ?.toLowerCase()
          .replace(/\s+/g, '-')}`}
      >
        <option value='Draft'>Draft</option>
        <option value='Pending'>Pending</option>
        <option value='In Production'>In Production</option>
        <option value='Completed'>Completed</option>
        <option value='Cancelled'>Cancelled</option>
      </select>

      {savingStatus && <span>Saving...</span>}
    </div>
  </div>
</section>


      <div className='order-details-grid'>
        <main className='order-details-main'>
          <section className='order-details-card'>
            <h2>Order information</h2>

            <div className='order-details-info-grid'>
              <div>
                <span>Order title</span>
                <strong>{order.title}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{order.category || '—'}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{order.priority || 'Normal'}</strong>
              </div>

              <div>
                <span>Order date</span>
                <strong>{formatDate(order.orderDate)}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>
                  <FaCalendarAlt />
                  {formatDate(order.deadline)}
                </strong>
              </div>
            </div>

            <div className='order-details-description'>
              <span>Description</span>
              <p>{order.description || 'No description provided.'}</p>
            </div>

            <div className='order-details-description'>
              <span>Special requirements</span>
              <p>{order.requirements || 'No special requirements provided.'}</p>
            </div>
          </section>

          <section className='order-details-card'>
            <h2>Customer information</h2>

            <div className='order-details-customer'>
              <div className='order-details-avatar'>
                <FaUser />
              </div>

              <div>
                <strong>{order.customer}</strong>
                <span>Customer</span>
              </div>
            </div>

            <div className='order-details-contact'>
              <div>
                <FaPhone />
                <span>{order.phone}</span>
              </div>

              <div>
                <FaEnvelope />
                <span>{order.email || 'No email provided'}</span>
              </div>
            </div>
          </section>
        </main>

        <aside className='order-details-sidebar'>
          <section className='order-details-card'>
            <h2>Payment summary</h2>

            <div className='order-details-payment-icon'>
              <FaMoneyBillWave />
            </div>

            <div className='order-details-payment-row'>
              <span>Total amount</span>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>

            <div className='order-details-payment-row'>
              <span>Advance paid</span>
              <strong>{formatCurrency(order.advancePayment)}</strong>
            </div>

            <div className='order-details-payment-row order-details-balance'>
              <span>Remaining balance</span>
              <strong>{formatCurrency(balance)}</strong>
            </div>

            <div className='order-details-payment-method'>
              <span>Payment method</span>
              <strong>{order.paymentMethod || '—'}</strong>
            </div>
          </section>

          <section className='order-details-card'>
            <h2>Order timeline</h2>

            <div className='order-details-timeline'>
              <div className='order-details-timeline-dot' />
              <div>
                <strong>Order created</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className='order-details-timeline'>
              <div className='order-details-timeline-dot' />
              <div>
                <strong>Last updated</strong>
                <span>{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetails
