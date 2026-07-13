const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['sender', 'vendor', 'admin'], default: 'sender' },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
