const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  sender_user_id: { type: String, required: true },
  recipient_user_id: { type: String, required: true },
  order_date: { type: Date, default: Date.now },
  total_amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  delivery_status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  delivery_date: { type: Date },
  delivery_time: { type: String },
  delivery_address: { type: String, required: true },
  
  // Emotional Customizations
  packaging: {
    paper_type: { type: String, default: 'Standard' },
    ribbon_color: { type: String, default: 'Pink' },
    gift_wrap: { type: Boolean, default: false }
  },
  video_url: { type: String }, // URL to the uploaded video
  greeting_card: {
    text: { type: String },
    drawing_data: { type: String }, // Base64 or JSON representation of canvas
  }
}, {
  collection: 'orders'
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
