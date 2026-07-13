import { Product, User, Vendor, Order } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'p1',
    product_id: 'PROD-001',
    vendor_id: 'v1',
    product_name: 'Strawberry Dream Cake',
    price: 850,
    category: 'CAKE',
    stock: 10,
  },
  {
    _id: 'p2',
    product_id: 'PROD-002',
    vendor_id: 'v1',
    product_name: 'Chocolate Fudge Heaven',
    price: 920,
    category: 'CAKE',
    stock: 5,
  },
  {
    _id: 'p3',
    product_id: 'PROD-003',
    vendor_id: 'v2',
    product_name: 'Giant Sarcastic Greeting Card',
    price: 250,
    category: 'FUNNY_GIFT',
    stock: 50,
  },
  {
    _id: 'p4',
    product_id: 'PROD-004',
    vendor_id: 'v2',
    product_name: 'The "You\'re Old" Balloon Kit',
    price: 450,
    category: 'FUNNY_GIFT',
    stock: 20,
  },
  {
    _id: 'p5',
    product_id: 'PROD-005',
    vendor_id: 'v3',
    product_name: 'Velvet Red Passion',
    price: 1100,
    category: 'CAKE',
    stock: 3,
  },
];

export const MOCK_USER: User = {
  user_id: 'u1',
  username: 'johndoe',
  email: 'john@example.com',
  phoneNumber: '0812345678',
  address: '123 Maple St, Bangkok',
  role: 'customer',
  create_at: new Date().toISOString(),
};

export const MOCK_VENDOR: Vendor = {
  vendor_id: 'v1',
  shop_name: 'Sweet Treats Bakery',
  owner_name: 'Jane Baker',
  location_lat: 13.7563,
  location_lng: 100.5018,
  is_free_tier: false,
  remaining_free_orders: 0,
  create_at: new Date().toISOString(),
};

export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'o1',
    sender_user_id: 'u1',
    recipient_user_id: 'u2',
    order_date: new Date().toISOString(),
    total_amount: 850,
    payment_status: 'PAID',
    delivery_status: 'PENDING',
    delivery_date: '2025-07-20',
    delivery_time: '14:00',
    delivery_address: '456 Oak Ave, Bangkok',
    package_paper_type: 'PINK_GLOSS',
  },
];
