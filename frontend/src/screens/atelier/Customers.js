import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaSearch,
  FaUsers,
  FaShoppingBag,
  FaWallet,
  FaArrowRight,
  FaSpinner,
} from 'react-icons/fa'
import dynamicAPI from '../../api/dynamicAPI'
import './customers.css'

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`

const getInitials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

const Customers = () => {
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError('')

        const query = new URLSearchParams({
          limit: '100',
          search,
        })

        const response = await dynamicAPI(
          'get',
          `/api/customers?${query.toString()}`
        )

        setCustomers(response.data || [])
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : err.message || 'Unable to load customers.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [search])

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.totalOrders,
    0
  )

  const totalOutstanding = customers.reduce(
    (sum, customer) => sum + customer.outstandingBalance,
    0
  )

  return (
    <div className='customers-page'>
      <section className='customers-heading'>
        <div>
          <span className='atelier-eyebrow'>Workspace / Customers</span>
          <h1 className='atelier-heading'>Customers</h1>
          <p>Get to know the people behind every custom creation.</p>
        </div>

        <div className='customers-count-badge'>
          <FaUsers />
          {customers.length} customers
        </div>
      </section>

      <section className='customers-stats'>
        <div className='customers-stat-card'>
          <span className='customers-stat-icon sage'><FaUsers /></span>
          <p>Customers shown</p>
          <h2>{customers.length}</h2>
          <span>In your customer directory</span>
        </div>

        <div className='customers-stat-card'>
          <span className='customers-stat-icon blue'><FaShoppingBag /></span>
          <p>Orders represented</p>
          <h2>{totalOrders}</h2>
          <span>Across these customers</span>
        </div>

        <div className='customers-stat-card'>
          <span className='customers-stat-icon amber'><FaWallet /></span>
          <p>Outstanding balance</p>
          <h2>{formatCurrency(totalOutstanding)}</h2>
          <span>Remaining customer payments</span>
        </div>
      </section>

      <section className='customers-panel'>
        <div className='customers-panel-heading'>
          <div>
            <h2 className='atelier-heading'>All customers</h2>
            <p>Customer details and order activity.</p>
          </div>
        </div>

        <div className='customers-toolbar'>
          <div className='customers-search'>
            <FaSearch />
            <input
              type='search'
              placeholder='Search by name, phone or email...'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className='customers-table-scroll'>
          <table className='customers-table'>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total spending</th>
                <th>Outstanding</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan='7' className='customers-empty'>
                    <FaSpinner className='customers-spinner' />
                    Loading customers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan='7' className='customers-empty'>
                    {error}
                  </td>
                </tr>
              ) : customers.length ? (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className='customers-person'>
                        <span className='customers-avatar'>
                          {getInitials(customer.name)}
                        </span>
                        <strong>{customer.name}</strong>
                      </div>
                    </td>

                    <td>{customer.phone}</td>
                    <td>{customer.email || '—'}</td>
                    <td>{customer.totalOrders}</td>
                    <td className='customers-money'>
                      {formatCurrency(customer.totalSpending)}
                    </td>
                    <td className='customers-money'>
                      {formatCurrency(customer.outstandingBalance)}
                    </td>

                    <td>
                      <button
                        type='button'
                        className='customers-view-button'
                        onClick={() => navigate(`/customers/${customer._id}`)}
                        aria-label={`View ${customer.name}`}
                      >
                        <FaArrowRight />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7' className='customers-empty'>
                    {search
                      ? 'No customers match your search.'
                      : 'No customers yet. Create your first order to add a customer.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='customers-table-footer'>
          <span>{customers.length} customers displayed</span>
          <span>Customer records from your orders</span>
        </div>
      </section>
    </div>
  )
}

export default Customers