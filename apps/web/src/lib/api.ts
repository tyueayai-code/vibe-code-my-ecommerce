import { Product, Vendor, User, Order } from '@/types';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_VENDOR, MOCK_ORDERS } from './mocks';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (IS_MOCK_MODE) {
    console.log(`[MOCK] API Request to ${endpoint}`);
    // Note: Detailed mock routing would happen here. 
    // For now, we'll handle specific return values in the wrapper functions.
    return {} as T;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) throw new Error(`API request failed: ${endpoint}`);
  return response.json();
}

export async function register(data: any) {
  if (IS_MOCK_MODE) return { success: true, user: MOCK_USER };
  return apiRequest('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function login(data: any) {
  if (IS_MOCK_MODE) return { success: true, token: 'mock-token', user: MOCK_USER };
  return apiRequest('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function registerVendor(data: any, token: string) {
  if (IS_MOCK_MODE) return { success: true, vendor: MOCK_VENDOR };
  return apiRequest('/vendors/register', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
}

export async function getVendorProfile(token: string) {
  if (IS_MOCK_MODE) return MOCK_VENDOR;
  return apiRequest('/vendors/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function getVendorProducts(token: string) {
  if (IS_MOCK_MODE) return MOCK_PRODUCTS.filter(p => p.vendor_id === MOCK_VENDOR.vendor_id);
  return apiRequest('/vendor/products', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function createProduct(data: any, token: string) {
  if (IS_MOCK_MODE) return { success: true, product: { ...data, _id: 'new-p' } };
  return apiRequest('/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
}

export async function updateProduct(productId: string, data: any, token: string) {
  if (IS_MOCK_MODE) return { success: true };
  return apiRequest(`/products/${productId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(productId: string, token: string) {
  if (IS_MOCK_MODE) return { success: true };
  return apiRequest(`/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

export async function generateQR(url: string) {
  if (IS_MOCK_MODE) return { qrUrl: 'http://example.com/mock-qr.png' };
  return apiRequest('/emotional/qr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}

export async function uploadVideo(videoName: string, token: string) {
  if (IS_MOCK_MODE) return { success: true, videoUrl: 'http://example.com/mock-video.mp4' };
  return apiRequest('/emotional/upload-video', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ videoName }),
  });
}

export async function createOrder(orderData: any, token: string) {
  if (IS_MOCK_MODE) return { success: true, orderId: 'mock-order-123' };
  return apiRequest('/orders', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });
}

export async function getProducts(params?: { category?: string; search?: string; maxPrice?: string; lat?: string; lng?: string }): Promise<Product[]> {
  if (IS_MOCK_MODE) {
    let filtered = [...MOCK_PRODUCTS];
    if (params?.category) filtered = filtered.filter(p => p.category === params.category);
    if (params?.search) filtered = filtered.filter(p => p.product_name.toLowerCase().includes(params.search!.toLowerCase()));
    if (params?.maxPrice) filtered = filtered.filter(p => p.price <= parseInt(params.maxPrice!));
    return filtered;
  }
  
  const query = new URLSearchParams(params as any).toString();
  return apiRequest(`/products${query ? `?${query}` : ''}`);
}

export async function getProductById(productId: string): Promise<Product> {
  if (IS_MOCK_MODE) {
    const product = MOCK_PRODUCTS.find(p => p._id === productId);
    if (!product) throw new Error('Product not found');
    return product;
  }
  return apiRequest(`/products/${productId}`);
}

export async function getVendors(): Promise<Vendor[]> {
  if (IS_MOCK_MODE) return [MOCK_VENDOR];
  return apiRequest('/vendors');
}

export async function getUsers(): Promise<User[]> {
  if (IS_MOCK_MODE) return [MOCK_USER];
  return apiRequest('/users');
}

export async function getOrders(): Promise<Order[]> {
  if (IS_MOCK_MODE) return MOCK_ORDERS;
  return apiRequest('/orders');
}
