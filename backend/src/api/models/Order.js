import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Customer information
    customer: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Order specifications
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'Clothing',
        'Bridal',
        'Accessories',
        'Home Decor',
        'Other',
      ],
      default: 'Clothing',
    },

    description: {
      type: String,
      default: '',
    },

    requirements: {
      type: String,
      default: '',
    },

    // Timeline
    orderDate: {
      type: Date,
      default: Date.now,
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal',
    },

    // Order status
    status: {
      type: String,
      enum: [
        'Draft',
        'Pending',
        'In Production',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },

    // Payment information
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    advancePayment: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'eSewa', 'Khalti'],
      default: 'Cash',
    },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order