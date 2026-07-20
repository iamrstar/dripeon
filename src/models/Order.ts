import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guest checkouts
  },
  products: [
    {
      product_id: { type: String, required: true },
      name: { type: String, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  coupon: { type: String, required: false },
  discountAmount: { type: Number, required: false, default: 0 },
  shippingAddress: {
    name: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  },
  orderStatus: {
    type: String,
    enum: ['PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_REQUESTED', 'RETURNED', 'CANCELLED'],
    default: 'PROCESSING',
  },
  trackingNumber: {
    type: String,
    required: false,
  },
  courierPartner: {
    type: String,
    required: false,
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
