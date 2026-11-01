
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = () => {
  const { auth } = useAuth()
  const location = useLocation()

  const permittedPaths =
    auth?.userRole?.clientPermission?.map((permission) => permission?.path) || []

  const hasPermission = permittedPaths.some((path) => {
    if (!path) return false

    if (path === location.pathname) return true

    const permissionParts = path.split('/')
    const locationParts = location.pathname.split('/')

    if (permissionParts.length !== locationParts.length) return false

    return permissionParts.every((part, index) => {
      return part.startsWith(':') || part === locationParts[index]
    })
  })

  return hasPermission ? (
    <Outlet />
  ) : auth?.userInfo ? (
    <Navigate to='/' state={{ from: location }} replace />
  ) : (
    <Navigate
      to={`/auth/login?next=${location.pathname}`}
      state={{ from: location }}
      replace
    />
  )
}

export default RequireAuth
