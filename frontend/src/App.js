import { Routes, Route } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import { Layout } from './components'

import AtelierLayout from './components/atelier/AtelierLayout'
import Dashboard from './screens/atelier/Dashboard'
import Orders from './screens/atelier/Orders'
import CreateOrder from './screens/atelier/CreateOrder/CreateOrder'
import OrderDetails from './screens/atelier/OrderDetails/OrderDetails'
import EditOrder from './screens/atelier/EditOrder/EditOrder'
import Customers from './screens/atelier/Customers'
import CustomerProfile from './screens/atelier/CustomerProfile/CustomerProfile'

import ForgotPassword from './screens/auth/ForgotPassword'

import Login from './screens/auth/Login'
import NotFound from './screens/auth/NotFound'
import ResetPassword from './screens/auth/ResetPassword'

import Profile from './screens/account/Profile'

import ClientPermissions from './screens/admin/auth/ClientPermissions'
import Permissions from './screens/admin/auth/Permissions'
import Roles from './screens/admin/auth/Roles'
import UserRoles from './screens/admin/auth/UserRoles'
import UserProfiles from './screens/admin/auth/UserProfiles'
import Users from './screens/admin/auth/Users'

const App = () => {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path='/auth/login' element={<Login />} />

      <Route
        path='/auth/forgot-password'
        element={<ForgotPassword />}
      />

      <Route
        path='/auth/reset-password/:restToken'
        element={<ResetPassword />}
      />

      {/* Protected application routes */}
      <Route element={<RequireAuth />}>
        <Route
          path='/'
          element={
            <AtelierLayout>
              <Dashboard />
            </AtelierLayout>
          }
        />

        <Route
          path='/orders'
          element={
            <AtelierLayout>
              <Orders />
            </AtelierLayout>
          }
        />

        <Route
          path='/orders/create'
          element={
            <AtelierLayout>
              <CreateOrder />
            </AtelierLayout>
          }
        />

        <Route
          path='/orders/:id'
          element={
            <AtelierLayout>
              <OrderDetails />
            </AtelierLayout>
          }
        />

        <Route
          path='/orders/:id/edit'
          element={
            <AtelierLayout>
              <EditOrder />
            </AtelierLayout>
          }
        />

        <Route
  path='/customers'
  element={
    <AtelierLayout>
      <Customers />
    </AtelierLayout>
  }
/>

<Route
  path='/customers/:id'
  element={
    <AtelierLayout>
      <CustomerProfile />
    </AtelierLayout>
  }
/>
        {/* Existing account and administration screens */}
        <Route
          path='/account/profile'
          element={<Layout><Profile /></Layout>}
        />

        <Route
          path='/admin/auth/client-permissions'
          element={<Layout><ClientPermissions /></Layout>}
        />

        <Route
          path='/admin/auth/permissions'
          element={<Layout><Permissions /></Layout>}
        />

        <Route
          path='/admin/auth/roles'
          element={<Layout><Roles /></Layout>}
        />

        <Route
          path='/admin/auth/user-roles'
          element={<Layout><UserRoles /></Layout>}
        />

        <Route
          path='/admin/auth/user-profiles'
          element={<Layout><UserProfiles /></Layout>}
        />

        <Route
          path='/admin/auth/users'
          element={<Layout><Users /></Layout>}
        />
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App