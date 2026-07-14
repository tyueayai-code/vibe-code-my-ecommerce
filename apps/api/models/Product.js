const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  vendor_id: { type: String, required: true },
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true }
}, {
  collection: 'media' // The seeding script uses db.media.insertMany
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
