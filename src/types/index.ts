export type UserRole = 'customer' | 'staff' | 'admin';

export type OrderStatus = 
  | 'PLACED' 
  | 'ACCEPTED' 
  | 'PREPARING' 
  | 'READY_FOR_PICKUP' 
  | 'PICKED_UP' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CASH' | 'CARD' | 'ONLINE';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Category {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon?: string;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  piecesCount?: number;
  spiceLevel?: 'None' | 'Mild' | 'Hot' | 'Extreme';
  isPopular?: boolean;
  isPartyKit?: boolean;
  addons?: AddonOption[];
}

export interface CartAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique for item + addons combination
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: CartAddon[];
  specialNotes?: string;
  itemTotal: number;
}

export interface StatusHistoryEntry {
  previousStatus: OrderStatus | 'NONE';
  newStatus: OrderStatus;
  changedBy: string;
  changedAt: string; // ISO string or format
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addonsList?: string[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. DT-1024
  customerName: string;
  customerPhone: string;
  orderType: 'PICKUP';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  pickupTime: string; // e.g. "ASAP (15-20 mins)" or timestamp
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity: number;
  category: string;
  isActive: boolean;
}

export interface SalesReportData {
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  readyOrders: number;
  completedOrders: number;
  popularItem: string;
  averageOrderValue: number;
}
