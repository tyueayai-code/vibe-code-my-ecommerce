const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};
app.get('/api/products', async (req, res) => {
  try {
    // ตรวจสอบสถานะการเชื่อมต่อ MongoDB
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (err) {
    console.error("Database fetch error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// --- AUTH ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, phoneNumber, address } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      user_id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully', userId: user.user_id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- EMOTIONAL FEATURES ---
app.post('/api/emotional/qr', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const qrImage = await QRCode.toDataURL(url);
    res.json({ qrCode: qrImage });
  } catch (err) {
    console.error('QR generation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/emotional/upload-video', authenticateToken, async (req, res) => {
  try {
    // This is a placeholder for actual cloud storage (S3/Cloudinary)
    const { videoName } = req.body;
    const mockUrl = `https://storage.vibe-cake.com/videos/${Date.now()}-${videoName}`;
    res.json({ url: mockUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- VENDORS ---
app.post('/api/vendors/register', authenticateToken, async (req, res) => {
  try {
    const { shop_name, owner_name, location_lat, location_lng, is_home_baker } = req.body;
    
    // Update user role to vendor
    await User.findOneAndUpdate({ user_id: req.user.userId }, { role: 'vendor' });

    const vendor = new Vendor({
      vendor_id: `v-${Date.now()}`,
      user_id: req.user.userId,
      shop_name,
      owner_name,
      location_lat,
      location_lng,
      is_free_tier: is_home_baker,
      remaining_free_orders: is_home_baker ? 10 : 0,
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully', vendorId: vendor.vendor_id });
  } catch (err) {
    console.error('Vendor registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/vendors/me', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.userId });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });
    res.json(vendor);
  } catch (err) {
    console.error('Error fetching vendor profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/vendors', async (req, res) => {

  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- PRODUCTS ---
app.get('/api/vendor/products', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.userId });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    
    const products = await Product.find({ vendor_id: vendor.vendor_id });
    res.json(products);
  } catch (err) {
    console.error('Error fetching vendor products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.userId });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const { product_name, price, category, stock } = req.body;
    const product = new Product({
      product_id: `p-${Date.now()}`,
      vendor_id: vendor.vendor_id,
      product_name,
      price,
      category,
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/products/:productId', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.userId });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.vendor_id !== vendor.vendor_id) return res.status(403).json({ error: 'Unauthorized' });

    const updates = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: req.params.productId },
      updates,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:productId', authenticateToken, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user.userId });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.vendor_id !== vendor.vendor_id) return res.status(403).json({ error: 'Unauthorized' });

    await Product.deleteOne({ product_id: req.params.productId });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {


  try {
    const { category, search, lat, lng, maxPrice } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.product_name = { $regex: search, $options: 'i' };
    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };

    let products;
    if (lat && lng) {
      // Use aggregation to join with vendors and filter by distance
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const MAX_DISTANCE_KM = 50;

      products = await Product.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'vendor',
            localField: 'vendor_id',
            foreignField: 'vendor_id',
            as: 'vendor',
          },
        },
        { $unwind: '$vendor' },
        {
          $addFields: {
            distance: {
              $divide: [
                {
                  $sqrt: {
                    $add: [
                      { $pow: [{ $subtract: ['$vendor.location_lat', userLat] }, 2] },
                      { $pow: [{ $subtract: ['$vendor.location_lng', userLng] }, 2] },
                    ],
                  },
                },
                0.01, // Rough approximation for km
              ],
            },
          },
        },
        { $match: { distance: { $lte: MAX_DISTANCE_KM } } },
      ]);
    } else {
      products = await Product.find(query);
    }
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- VENDORS ---
app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- USERS ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- ORDERS ---
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { 
      recipient_user_id, 
      delivery_address, 
      total_amount, 
      packaging, 
      video_url, 
      greeting_card, 
      products 
    } = req.body;

    const order = new Order({
      order_id: `ord-${Date.now()}`,
      sender_user_id: req.user.userId,
      recipient_user_id: recipient_user_id || 'guest',
      total_amount,
      delivery_address,
      packaging,
      video_url,
      greeting_card,
      payment_status: 'paid', // Simulating immediate payment for MVP
      delivery_status: 'processing',
      order_date: new Date(),
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug route to list collections and their document counts
app.get('/api/debug/counts', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const counts = {};
    for (const col of collections) {
      counts[col.name] = await mongoose.connection.db.collection(col.name).countDocuments();
    }
    res.json({
      database: mongoose.connection.name,
      collections: counts
    });
  } catch (err) {
    console.error('Error getting counts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
