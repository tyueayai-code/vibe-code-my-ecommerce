export type Product = {
  _id: string;
  product_id: string;
  vendor_id: string;
  product_name: string;
  price: number;
  category: 'CAKE' | 'FUNNY_GIFT';
  stock: number;
};

export type Vendor = {
  vendor_id: string;
  shop_name: string;
  owner_name: string;
  location_lat: number;
  location_lng: number;
  is_free_tier: boolean;
  remaining_free_orders: number;
  create_at: string;
};

export type User = {
  user_id: string;
  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: 'customer' | 'vendor';
  create_at?: string;
};

export type Order = {
  order_id: string;
  sender_user_id: string;
  recipient_user_id: string;
  order_date: string;
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  delivery_date: string;
  delivery_time: string;
  delivery_address: string;
  package_paper_type: string;
};
