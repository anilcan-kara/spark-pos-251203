export type UserRole = 'cashier' | 'kitchen' | 'manager' | 'accountant' | 'waiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'split';
export type OrderSource = 'dine-in' | 'takeout' | 'uber-eats' | 'doordash' | 'yemeksepeti' | 'getir';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
  description?: string;
  modifiers?: MenuModifier[];
}

export interface MenuModifier {
  id: string;
  name: string;
  options: { label: string; price: number }[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: Record<string, string>;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  source: OrderSource;
  tableId?: string;
  customerId?: string;
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  paymentMethod?: PaymentMethod;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  createdBy: string;
  notes?: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  currentOrderId?: string;
  reservationId?: string;
  x: number;
  y: number;
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerPhone: string;
  partySize: number;
  date: number;
  notes?: string;
  status: 'confirmed' | 'seated' | 'cancelled' | 'completed';
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: number;
  processedBy: string;
  status: 'completed' | 'refunded' | 'failed';
  refundReason?: string;
}

export interface SalesReport {
  date: number;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  byPaymentMethod: Record<PaymentMethod, number>;
  bySource: Record<OrderSource, number>;
  topItems: { itemId: string; name: string; quantity: number; revenue: number }[];
}

export interface StaffPerformance {
  userId: string;
  ordersProcessed: number;
  totalRevenue: number;
  averageOrderTime: number;
  shiftStart?: number;
  shiftEnd?: number;
}
