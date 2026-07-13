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
  shippingAddress: {
    name: String,
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
    enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING',
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
