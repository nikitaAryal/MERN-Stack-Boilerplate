import {
  FaArrowUp,
  FaArrowRight,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaShoppingBag,
  FaWallet,
  FaUsers,
} from 'react-icons/fa'
import './dashboard.css'

const stats = [
  {
    title: 'Total Orders',
    value: '128',
    change: '+12.8%',
    description: 'Compared to last month',
    icon: FaShoppingBag,
  },
  {
    title: 'Pending Orders',
    value: '18',
    change: 'Needs attention',
    description: 'Currently in progress',
    icon: FaClock,
  },
  {
    title: 'Total Customers',
    value: '86',
    change: '+8.4%',
    description: 'Compared to last month',
    icon: FaUsers,
  },
  {
    title: 'Total Revenue',
    value: 'Rs. 2,45,800',
    change: '+16.2%',
    description: 'Compared to last month',
    icon: FaWallet,
  },
]

const recentOrders = [
  {
    id: 'AT-1028',
    customer: 'Ananya Sharma',
    product: 'Custom bridal outfit',
    date: '28 Oct 2026',
    amount: 'Rs. 18,500',
    status: 'In Production',
  },
  {
    id: 'AT-1027',
    customer: 'Priya Thapa',
    product: 'Handcrafted evening dress',
    date: '27 Oct 2026',
    amount: 'Rs. 12,000',
    status: 'Pending',
  },
  {
    id: 'AT-1026',
    customer: 'Sana Khadka',
    product: 'Embroidered kurta set',
    date: '26 Oct 2026',
    amount: 'Rs. 8,500',
    status: 'Completed',
  },
  {
    id: 'AT-1025',
    customer: 'Mira Joshi',
    product: 'Custom occasion wear',
    date: '25 Oct 2026',
    amount: 'Rs. 15,000',
    status: 'In Production',
  },
]

const Dashboard = () => {
  return (
    <div className='atelier-dashboard'>
      <section className='atelier-welcome'>
        <div>
          <p className='atelier-eyebrow'>FRIDAY, 30 OCTOBER 2026</p>
          <h1 className='atelier-heading'>Good evening.</h1>
          <p className='atelier-welcome-description'>
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <button type='button' className='atelier-primary-button'>
          <FaPlus />
          Create new order
        </button>
      </section>

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

              <h2>{stat.value}</h2>

              <div className='atelier-stat-bottom'>
                <span className='atelier-stat-change'>
                  {stat.change.startsWith('+') && <FaArrowUp />}
                  {stat.change}
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

            <button type='button' className='atelier-text-button'>
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
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className='atelier-order-id'>{order.id}</span>
                      <small>{order.date}</small>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td className='atelier-order-amount'>{order.amount}</td>
                    <td>
                      <span
                        className={`atelier-status atelier-status-${order.status
                          .toLowerCase()
                          .replace(' ', '-')}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
              <strong>18</strong>
              <span>Orders in progress</span>
            </div>
          </div>

          <div className='atelier-overview-item'>
            <div className='atelier-overview-icon gold'>
              <FaWallet />
            </div>
            <div>
              <strong>Rs. 42,500</strong>
              <span>Payments outstanding</span>
            </div>
          </div>

          <div className='atelier-overview-item'>
            <div className='atelier-overview-icon green'>
              <FaCheckCircle />
            </div>
            <div>
              <strong>12</strong>
              <span>Orders completed this month</span>
            </div>
          </div>

          <div className='atelier-dashboard-note'>
            <span className='atelier-note-mark'>✳</span>
            <div>
              <strong>A little reminder</strong>
              <p>Keep your order updates current so every customer stays informed.</p>
            </div>
          </div>
        </aside>
      </section>

      <p className='atelier-demo-note'>
        Dashboard preview · Sample data for design purposes
      </p>
    </div>
  )
}

export default Dashboard