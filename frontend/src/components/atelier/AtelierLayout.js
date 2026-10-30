import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './layout.css'

const AtelierLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className='atelier-app'>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className='atelier-main'>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className='atelier-page-content'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AtelierLayout