import jwt from 'jsonwebtoken'
import User from '../api/models/User.js'
import UserRole from '../api/models/UserRole.js'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  })
}


export const isAuth = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ error: 'User not found' })
      }

      const userRole = await UserRole.findOne(
        { user: req.user._id },
        { role: 1 }
      ).populate({
        path: 'role',
        populate: {
          path: 'permission',
        },
      })

      if (!userRole?.role) {
        return res.status(403).json({
          error: 'No role assigned to this user',
        })
      }

      const permissions = userRole.role.permission || []

      // Remove query parameters from the requested URL.
      let url = req.path
      const method = req.method

      // Replace dynamic MongoDB IDs with route parameters.
      const urlSegments = url.split('/')

      const normalizedSegments = urlSegments.map((segment) => {
        if (/^[a-fA-F0-9]{24}$/.test(segment)) {
          return ':id'
        }

        return segment
      })

      url = normalizedSegments.join('/')

      // Match the existing pagination route convention.
      if (url.includes('page')) {
        url = url.split('page')[0]
      }

      const publicPermission = permissions.find(
        (permission) =>
          permission.route === url &&
          permission.method === method &&
          permission.auth === false
      )

      if (publicPermission) {
        return next()
      }

      const allowedPermission = permissions.find(
        (permission) =>
          permission.route === url &&
          permission.method === method &&
          permission.auth === true
      )

      if (!allowedPermission) {
        return res.status(403).json({
          error: 'You do not have permission to access this route',
        })
      }

      return next()
    } catch (error) {
      console.error('Authentication error:', error)

      return res.status(401).json({
        error: 'Unauthorized',
      })
    }
  }

  return res.status(401).json({
    error: 'Not authorized, no token provided',
  })
}

