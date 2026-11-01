import Customer from '../models/Customer.js'
import mongoose from 'mongoose'
import Order from '../models/Order.js'

// Generate a unique order reference
const generateOrderNumber = () => {
  return `AT-${Date.now()}`
}

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      email,
      phone,
      title,
      category,
      description,
      requirements,
      orderDate,
      deadline,
      priority,
      status,
      totalAmount,
      advancePayment,
      paymentMethod,
    } = req.body

    // Required field validation
    if (!customer?.trim() || !phone?.trim() || !title?.trim() || !deadline) {
      return res.status(400).json({
        error: 'Customer, phone, title and delivery date are required.',
      })
    }

    const total = Number(totalAmount)
    const advance = Number(advancePayment ?? 0)

    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({
        error: 'Enter a valid total amount.',
      })
    }

    if (!Number.isFinite(advance) || advance < 0 || advance > total) {
      return res.status(400).json({
        error: 'Advance payment must be between zero and the total amount.',
      })
    }

    const deliveryDate = new Date(deadline)
    const placedDate = orderDate ? new Date(orderDate) : new Date()

    if (
      Number.isNaN(deliveryDate.getTime()) ||
      Number.isNaN(placedDate.getTime())
    ) {
      return res.status(400).json({
        error: 'Please provide valid order and delivery dates.',
      })
    }

    if (deliveryDate < placedDate) {
      return res.status(400).json({
        error: 'Delivery date cannot be before the order date.',
      })
    }

        // Find an existing customer by phone or create a new one.
    const customerRecord = await Customer.findOneAndUpdate(
      {
        createdBy: req.user._id,
        phone: phone.trim(),
      },
      {
        $set: {
          name: customer.trim(),
          email: email?.trim().toLowerCase() || '',
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      createdBy: req.user._id,
      customerId: customerRecord._id,

      customer: customer.trim(),
      email: email?.trim().toLowerCase() || '',
      phone: phone.trim(),

      title: title.trim(),
      category,
      description,
      requirements,

      orderDate: placedDate,
      deadline: deliveryDate,
      priority,
      status: status || 'Pending',

      totalAmount: total,
      advancePayment: advance,
      balance: total - advance,
      paymentMethod,
    })

    return res.status(201).json({
      message: 'Order created successfully.',
      data: order,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// GET ALL ORDERS FOR THE LOGGED-IN USER
export const getOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const filter = {
      createdBy: req.user._id,
    }

    if (req.query.status) {
      filter.status = req.query.status
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ])

    return res.status(200).json({
      data: orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

export const getDashboardSummary = async (req, res) => {
  try {
    const userFilter = {
      createdBy: req.user._id,
    }

    const activeFilter = {
      ...userFilter,
      status: { $nin: ['Draft', 'Cancelled'] },
    }

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [
      totalOrders,
      pendingOrders,
      inProductionOrders,
      completedOrders,
      totalCustomers,
      revenueResult,
      outstandingResult,
      completedThisMonth,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(userFilter),

      Order.countDocuments({
        ...userFilter,
        status: 'Pending',
      }),

      Order.countDocuments({
        ...userFilter,
        status: 'In Production',
      }),

      Order.countDocuments({
        ...userFilter,
        status: 'Completed',
      }),

      Order.distinct('phone', userFilter),

      Order.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' },
          },
        },
      ]),

      Order.aggregate([
        { $match: activeFilter },
        {
          $group: {
            _id: null,
            total: { $sum: '$balance' },
          },
        },
      ]),

      Order.countDocuments({
        ...userFilter,
        status: 'Completed',
        updatedAt: { $gte: startOfMonth },
      }),

      Order.find(userFilter)
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
    ])

    return res.status(200).json({
      data: {
        totalOrders,
        pendingOrders,
        inProductionOrders,
        completedOrders,
        totalCustomers: totalCustomers.filter(Boolean).length,
        totalRevenue: revenueResult[0]?.total || 0,
        outstandingPayments: outstandingResult[0]?.total || 0,
        completedThisMonth,
        recentOrders,
      },
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// GET ONE ORDER
export const getOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID.' })
    }

    const order = await Order.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    return res.status(200).json({ data: order })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// UPDATE ORDER
export const updateOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID.' })
    }

    const order = await Order.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    const allowedFields = [
      'customer',
      'email',
      'phone',
      'title',
      'category',
      'description',
      'requirements',
      'orderDate',
      'deadline',
      'priority',
      'status',
      'totalAmount',
      'advancePayment',
      'paymentMethod',
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field]
      }
    })

    if (
      !order.customer?.trim() ||
      !order.phone?.trim() ||
      !order.title?.trim() ||
      !order.deadline
    ) {
      return res.status(400).json({
        error: 'Customer, phone, title and delivery date are required.',
      })
    }

    const total = Number(order.totalAmount)
    const advance = Number(order.advancePayment)

    if (
      !Number.isFinite(total) ||
      total <= 0 ||
      !Number.isFinite(advance) ||
      advance < 0 ||
      advance > total
    ) {
      return res.status(400).json({
        error: 'Please check the total amount and advance payment.',
      })
    }

    if (new Date(order.deadline) < new Date(order.orderDate)) {
      return res.status(400).json({
        error: 'Delivery date cannot be before the order date.',
      })
    }

        // Keep the linked customer record synchronized.
    const customerRecord = await Customer.findOneAndUpdate(
      {
        createdBy: req.user._id,
        phone: order.phone.trim(),
      },
      {
        $set: {
          name: order.customer.trim(),
          email: order.email?.trim().toLowerCase() || '',
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )

    order.customerId = customerRecord._id
    order.balance = total - advance

    await order.save()

    return res.status(200).json({
      message: 'Order updated successfully.',
      data: order,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID.' })
    }

    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    return res.status(200).json({
      message: 'Order deleted successfully.',
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const skip = (page - 1) * limit

    const filter = {
      createdBy: req.user._id,
    }

    const search = req.query.search?.trim()

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Customer.countDocuments(filter),
    ])

    const phones = customers.map((customer) => customer.phone)

    const orderStats = phones.length
      ? await Order.aggregate([
          {
            $match: {
              createdBy: req.user._id,
              phone: { $in: phones },
            },
          },
          {
            $group: {
              _id: '$phone',
              totalOrders: { $sum: 1 },
              totalSpending: { $sum: '$totalAmount' },
              outstandingBalance: { $sum: '$balance' },
            },
          },
        ])
      : []

    const statsByPhone = new Map(
      orderStats.map((item) => [item._id, item])
    )

    const data = customers.map((customer) => {
      const stats = statsByPhone.get(customer.phone)

      return {
        ...customer,
        totalOrders: stats?.totalOrders || 0,
        totalSpending: stats?.totalSpending || 0,
        outstandingBalance: stats?.outstandingBalance || 0,
      }
    })

    return res.status(200).json({
      data,
      page,
      pages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}

// GET CUSTOMER PROFILE AND ORDER HISTORY
export const getCustomerById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        error: 'Invalid customer ID.',
      })
    }

    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).lean()

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found.',
      })
    }

    // Include older orders that have not yet been linked by customerId.
    const orders = await Order.find({
      createdBy: req.user._id,
      phone: customer.phone,
    })
      .sort({ createdAt: -1 })
      .lean()

    const summary = orders.reduce(
      (result, order) => {
        result.totalOrders += 1
        result.totalSpending += order.totalAmount || 0
        result.outstandingBalance += order.balance || 0
        return result
      },
      {
        totalOrders: 0,
        totalSpending: 0,
        outstandingBalance: 0,
      }
    )

    return res.status(200).json({
      data: {
        customer,
        orders,
        summary,
      },
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
}
