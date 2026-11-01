import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaClipboardList,
  FaCalendarAlt,
  FaWallet,
} from 'react-icons/fa'
import dynamicAPI from '../../../api/dynamicAPI'
import '../CreateOrder/create-order.css'
import './edit-order.css'

const EditOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [pageError, setPageError] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setPageError('')

        const response = await dynamicAPI('get', `/api/orders/${id}`)
        const order = response.data

        if (!order) {
          setPageError('We could not find this order.')
          return
        }

        setForm({
          customer: order.customer || '',
          email: order.email || '',
          phone: order.phone || '',
          title: order.title || '',
          category: order.category || 'Clothing',
          description: order.description || '',
          requirements: order.requirements || '',
          orderDate: order.orderDate
            ? new Date(order.orderDate).toISOString().split('T')[0]
            : '',
          deadline: order.deadline
            ? new Date(order.deadline).toISOString().split('T')[0]
            : '',
          priority: order.priority || 'Normal',
          totalAmount: order.totalAmount ?? '',
          advancePayment: order.advancePayment ?? 0,
          paymentMethod: order.paymentMethod || 'Cash',
        })
      } catch (error) {
        console.error('Unable to fetch order:', error)
        setPageError(
          typeof error === 'string'
            ? error
            : error.message || 'Unable to load this order.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const total = Number(form?.totalAmount) || 0
  const advance = Number(form?.advancePayment) || 0
  const balance = total - advance

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.customer.trim()) {
      newErrors.customer = 'Customer name is required.'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.'
    }

    if (!form.title.trim()) {
      newErrors.title = 'Order title is required.'
    }

    if (!form.deadline) {
      newErrors.deadline = 'Please select a delivery date.'
    }

    if (
      form.deadline &&
      form.orderDate &&
      form.deadline < form.orderDate
    ) {
      newErrors.deadline = 'Delivery date cannot be before order date.'
    }

    if (total <= 0) {
      newErrors.totalAmount = 'Enter a valid order amount.'
    }

    if (advance < 0 || advance > total) {
      newErrors.advancePayment =
        'Advance must be between zero and the total amount.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving || !validateForm()) return

    const updatedOrder = {
      ...form,
      totalAmount: total,
      advancePayment: advance,
      balance,
    }

    try {
      setIsSaving(true)
      setSubmitError('')

      await dynamicAPI('put', `/api/orders/${id}`, updatedOrder)

      window.alert('Order updated successfully!')
      navigate(`/orders/${id}`)
    } catch (error) {
      console.error('Order update failed:', error)

      setSubmitError(
        typeof error === 'string'
          ? error
          : error.message || 'Unable to update the order. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="edit-order-state">
        <div className="edit-order-loader" />
        <p>Loading order details...</p>
      </div>
    )
  }

  if (pageError || !form) {
    return (
      <div className="edit-order-state">
        <h2>Unable to open this order</h2>
        <p>{pageError || 'Order not found.'}</p>
        <button
          type="button"
          className="create-order-back"
          onClick={() => navigate('/orders')}
        >
          <FaArrowLeft />
          Back to orders
        </button>
      </div>
    )
  }

  return (
    <div className="create-order-page edit-order-page">
      <button
        type="button"
        className="create-order-back"
        onClick={() => navigate(`/orders/${id}`)}
      >
        <FaArrowLeft />
        Back to order details
      </button>

      <div className="create-order-heading">
        <div>
          <span className="atelier-eyebrow">
            Workspace / Orders / Edit order
          </span>

          <h1 className="atelier-heading">Edit order</h1>

          <p>
            Update the details and keep this creation moving forward.
          </p>
        </div>

        <span className="create-order-reference">
          EDIT ORDER
        </span>
      </div>

      <form
        className="create-order-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* CUSTOMER INFORMATION */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaUser />
            </span>

            <div>
              <h2>Customer information</h2>
              <p>Update the customer&apos;s contact details.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Customer name *</label>
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="Customer name"
              />
              {errors.customer && (
                <span className="create-error">{errors.customer}</span>
              )}
            </div>

            <div className="create-field">
              <label>Phone number *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
              {errors.phone && (
                <span className="create-error">{errors.phone}</span>
              )}
            </div>

            <div className="create-field full-width">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </section>

        {/* ORDER SPECIFICATIONS */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaClipboardList />
            </span>

            <div>
              <h2>Order specifications</h2>
              <p>Update what needs to be created.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Order title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Order title"
              />
              {errors.title && (
                <span className="create-error">{errors.title}</span>
              )}
            </div>

            <div className="create-field">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Clothing</option>
                <option>Bridal</option>
                <option>Accessories</option>
                <option>Home Decor</option>
                <option>Other</option>
              </select>
            </div>

            <div className="create-field full-width">
              <label>Order description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product or service..."
                rows="3"
              />
            </div>

            <div className="create-field full-width">
              <label>Special requirements</label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Measurements, fabric preferences, colours, design references..."
                rows="3"
              />
            </div>
          </div>
        </section>

        {/* SCHEDULING */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaCalendarAlt />
            </span>

            <div>
              <h2>Timeline & priority</h2>
              <p>Adjust the delivery schedule if needed.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Order date</label>
              <input
                type="date"
                name="orderDate"
                value={form.orderDate}
                onChange={handleChange}
              />
            </div>

            <div className="create-field">
              <label>Expected delivery date *</label>
              <input
                type="date"
                name="deadline"
                min={form.orderDate}
                value={form.deadline}
                onChange={handleChange}
              />
              {errors.deadline && (
                <span className="create-error">{errors.deadline}</span>
              )}
            </div>

            <div className="create-field">
              <label>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaWallet />
            </span>

            <div>
              <h2>Pricing & payment</h2>
              <p>Review the order value and recorded advance.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Total order amount (Rs.) *</label>
              <input
                type="number"
                min="0"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleChange}
              />
              {errors.totalAmount && (
                <span className="create-error">{errors.totalAmount}</span>
              )}
            </div>

            <div className="create-field">
              <label>Advance payment (Rs.)</label>
              <input
                type="number"
                min="0"
                max={total}
                name="advancePayment"
                value={form.advancePayment}
                onChange={handleChange}
              />
              {errors.advancePayment && (
                <span className="create-error">
                  {errors.advancePayment}
                </span>
              )}
            </div>

            <div className="create-field">
              <label>Payment method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>eSewa</option>
                <option>Khalti</option>
              </select>
            </div>
          </div>

          <div className="create-payment-summary">
            <div>
              <span>Total amount</span>
              <strong>Rs. {total.toLocaleString('en-IN')}</strong>
            </div>

            <div>
              <span>Advance received</span>
              <strong>Rs. {advance.toLocaleString('en-IN')}</strong>
            </div>

            <div className="balance-row">
              <span>Remaining balance</span>
              <strong>Rs. {balance.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </section>

        {submitError && (
          <div className="edit-order-error">
            {submitError}
          </div>
        )}

        <div className="create-order-actions">
          <button
            type="button"
            className="create-draft-button"
            onClick={() => navigate(`/orders/${id}`)}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-submit-button"
            disabled={isSaving}
          >
            <FaSave />
            {isSaving ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditOrder