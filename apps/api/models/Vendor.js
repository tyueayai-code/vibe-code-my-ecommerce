const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendor_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true }, // Link to User model
  shop_name: { type: String, required: true },
  owner_name: { type: String, required: true },
  location_lat: { type: Number, required: true },
  location_lng: { type: Number, required: true },
  is_free_tier: { type: Boolean, required: true },
  remaining_free_orders: { type: Number, required: true },
  create_at: { type: Date, default: Date.now }
}, {
  collection: 'vendor'
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
