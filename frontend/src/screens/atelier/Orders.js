
import { useMemo, useState } from 'react'
import {
  FaPlus,
  FaSearch,
  FaArrowUp,
  FaShoppingBag,
  FaClock,
  FaSpinner,
  FaCheckCircle,
  FaCalendarAlt,
  FaEllipsisH,
} from 'react-icons/fa'
import './orders.css'

// Temporary sample data.
// We will replace this with MongoDB data later.
const sampleOrders = [
  {
    id: 'AT-1028',
    customer: 'Ananya Sharma',
    initials: 'AS',
    item: 'Custom bridal outfit',
    date: '28 Oct 2026',
    deadline: '15 Nov 2026',
    amount: 18500,
    status: 'In Production',
  },
  {
    id: 'AT-1027',
    customer: 'Priya Thapa',
    initials: 'PT',
    item: 'Handcrafted evening dress',
    date: '27 Oct 2026',
    deadline: '12 Nov 2026',
    amount: 12000,
    status: 'Pending',
  },
  {
    id: 'AT-1026',
    customer: 'Sana Khadka',
    initials: 'SK',
    item: 'Embroidered kurta set',
    date: '26 Oct 2026',
    deadline: '05 Nov 2026',
    amount: 8500,
    status: 'Completed',
  },
  {
    id: 'AT-1025',
    customer: 'Mira Joshi',
    initials: 'MJ',
    item: 'Custom occasion wear',
    date: '25 Oct 2026',
    deadline: '18 Nov 2026',
    amount: 15000,
    status: 'In Production',
  },
  {
    id: 'AT-1024',
    customer: 'Riya Karki',
    initials: 'RK',
    item: 'Silk festive ensemble',
    date: '24 Oct 2026',
    deadline: '10 Nov 2026',
    amount: 22000,
    status: 'Pending',
  },
  {
    id: 'AT-1023',
    customer: 'Aarushi Shah',
    initials: 'AS',
    item: 'Linen co-ord set',
    date: '22 Oct 2026',
    deadline: '30 Oct 2026',
    amount: 9500,
    status: 'Completed',
  },
]

const formatCurrency = (amount) =>
  `Rs. ${amount.toLocaleString('en-IN')}`

const Orders = () => {
    console.log('ORDERS COMPONENT IS RENDERING')
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  
  const filteredOrders = useMemo(() => {
    return sampleOrders.filter((order) => {
      const matchesSearch = [
        order.id,
        order.customer,
        order.item,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )

      const matchesStatus =
        activeFilter === 'All' || order.status === activeFilter

      return matchesSearch && matchesStatus
    })
  }, [search, activeFilter])

  const counts = {
    all: sampleOrders.length,
    pending: sampleOrders.filter((order) => order.status === 'Pending').length,
    production: sampleOrders.filter((order) => order.status === 'In Production').length,
    completed: sampleOrders.filter((order) => order.status === 'Completed').length,
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
          onClick={() => window.alert('The Create Order form is our next milestone.')}
        >
          <FaPlus />
          Create order
        </button>
      </section>

      <section className='orders-stats'>
        <div className='orders-stat-card'>
          <div className='orders-stat-top'>
            <span className='orders-stat-icon sage'><FaShoppingBag /></span>
            <span className='orders-stat-change'><FaArrowUp /> 12.8%</span>
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className='orders-id'>{order.id}</span>
                      <span className='orders-item-name'>{order.item}</span>
                    </td>
                    <td>
                      <div className='orders-customer'>
                        <span className='orders-avatar'>{order.initials}</span>
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span className='orders-deadline'>
                        <FaCalendarAlt />
                        {order.deadline}
                      </span>
                    </td>
                    <td className='orders-amount'>{formatCurrency(order.amount)}</td>
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
                        aria-label={`More actions for ${order.id}`}
                        onClick={() => window.alert(`Order details for ${order.id} will be added soon.`)}
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
          <span>Showing {filteredOrders.length} of {sampleOrders.length} orders</span>
          <span>Sample data · Not connected to database yet</span>
        </div>
      </section>
    </div>
  )
}

export default Orders
