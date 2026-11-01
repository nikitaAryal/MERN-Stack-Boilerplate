import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import dynamicAPI from '../../../api/dynamicAPI'
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaUser,
  FaClipboardList,
  FaCalendarAlt,
  FaWallet,
} from 'react-icons/fa'
import './create-order.css'

const initialForm = {
  customer: '',
  email: '',
  phone: '',
  title: '',
  category: 'Clothing',
  description: '',
  requirements: '',
  orderDate: new Date().toISOString().split('T')[0],
  deadline: '',
  priority: 'Normal',
  totalAmount: '',
  advancePayment: '',
  paymentMethod: 'Cash',
}

const CreateOrder = () => {
  const navigate = useNavigate()
const location = useLocation()

const selectedCustomer = location.state?.customer

const [form, setForm] = useState(() => ({
  ...initialForm,
  customer: selectedCustomer?.name || '',
  email: selectedCustomer?.email || '',
  phone: selectedCustomer?.phone || '',
}))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
const [submitError, setSubmitError] = useState('')

  const total = Number(form.totalAmount) || 0
  const advance = Number(form.advancePayment) || 0
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

    if (form.deadline && form.deadline < form.orderDate) {
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

  const handleSubmit = async (event, status) => {
  event.preventDefault()

  if (isSubmitting) return

  if (!validateForm()) return

  const orderData = {
    ...form,
    totalAmount: total,
    advancePayment: advance,
    balance,
    status,
  }

  setIsSubmitting(true)
  setSubmitError('')

  try {
    const response = await dynamicAPI(
      'post',
      '/api/orders',
      orderData
    )

    window.alert(
      status === 'Draft'
        ? 'Order saved as draft!'
        : 'Order created successfully!'
    )

    console.log('Saved order:', response.data)

    navigate('/orders')
  } catch (error) {
    console.error('Order submission failed:', error)

    setSubmitError(
      typeof error === 'string'
        ? error
        : error.message || 'Unable to save the order. Please try again.'
    )
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="create-order-page">

      <button
        type="button"
        className="create-order-back"
        onClick={() => navigate('/orders')}
      >
        <FaArrowLeft />
        Back to orders
      </button>

      <div className="create-order-heading">
        <div>
          <span className="atelier-eyebrow">
            Workspace / Orders / New order
          </span>
          <h1 className="atelier-heading">Create a new order</h1>
          <p>
            Capture the details and bring another custom creation to life.
          </p>
        </div>

        <span className="create-order-reference">
          NEW ORDER
        </span>
      </div>

      <form
        className="create-order-form"
        onSubmit={(event) => handleSubmit(event, 'Pending')}
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
              <p>Who are we creating this order for?</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Customer name *</label>
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="e.g. Ananya Sharma"
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
                placeholder="e.g. 98XXXXXXXX"
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

        {/* ORDER DETAILS */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaClipboardList />
            </span>
            <div>
              <h2>Order specifications</h2>
              <p>Tell us what needs to be created.</p>
            </div>
          </div>

          <div className="create-form-grid">
            <div className="create-field">
              <label>Order title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Custom bridal outfit"
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
              <p>When should this order be completed?</p>
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

        {/* PAYMENT */}
        <section className="create-order-section">
          <div className="create-section-heading">
            <span className="create-section-icon">
              <FaWallet />
            </span>
            <div>
              <h2>Pricing & payment</h2>
              <p>Set the order value and record the advance.</p>
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
                placeholder="e.g. 18500"
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
                placeholder="e.g. 5000"
              />
              {errors.advancePayment && (
                <span className="create-error">{errors.advancePayment}</span>
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

        {/* ACTIONS */}
        {submitError && (
  <div className="create-error">
    {submitError}
  </div>
)}
        <div className="create-order-actions">
          <button
  type="button"
  className="create-draft-button"
  onClick={(event) => handleSubmit(event, 'Draft')}
  disabled={isSubmitting}
>
  <FaSave />
  {isSubmitting ? 'Saving...' : 'Save as draft'}
</button>

          <button
  type="submit"
  className="create-submit-button"
  disabled={isSubmitting}
>
  <FaPlus />
  {isSubmitting ? 'Creating...' : 'Create order'}
</button>
        </div>

      </form>
    </div>
  )
}

export default CreateOrder
