import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserRole, 
  OrderStatus, 
  PaymentMethod, 
  MenuItem, 
  Category, 
  CartItem, 
  Order, 
  InventoryItem,
  CartAddon 
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_ORDERS, INITIAL_INVENTORY } from '../data/mockData';

export interface UserProfile {
  name: string;
  phone: string;
  role: UserRole;
}

export type CustomerDetails = {
  name: string;
  phone: string;
};

interface StoreContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (name: string, phone: string, role?: UserRole) => void;
  logoutUser: () => void;
  
  customerTab: 'home' | 'menu' | 'cart' | 'track' | 'orders';
  setCustomerTab: (tab: 'home' | 'menu' | 'cart' | 'track' | 'orders') => void;
  
  staffTab: 'kds' | 'dashboard' | 'new-order' | 'menu-manage' | 'inventory' | 'reports';
  setStaffTab: (tab: 'kds' | 'dashboard' | 'new-order' | 'menu-manage' | 'inventory' | 'reports') => void;
  
  categories: Category[];
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  inventory: InventoryItem[];
  
  // Cart Actions
  addToCart: (item: MenuItem, quantity: number, selectedAddons: CartAddon[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  
  // Order Actions
  placeOrder: (customer: CustomerDetails, pickupTime: string, paymentMethod: PaymentMethod, notes?: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, actorName?: string, notes?: string) => { success: boolean; message?: string };
  
  // Admin / Staff Actions
  toggleItemAvailability: (itemId: string) => void;
  updateInventoryQuantity: (id: string, delta: number) => void;
  
  // Sound Notification Toggle
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Quick Search & Filters
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'menu' | 'cart' | 'track' | 'orders'>('home');
  const [staffTab, setStaffTab] = useState<'kds' | 'dashboard' | 'new-order' | 'menu-manage' | 'inventory' | 'reports'>('kds');
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const loginUser = (name: string, phone: string, targetRole: UserRole = 'customer') => {
    setUser({ name, phone, role: targetRole });
    setRole(targetRole);
    if (targetRole === 'staff') setStaffTab('kds');
    if (targetRole === 'admin') setStaffTab('dashboard');
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    setRole('customer');
    setCustomerTab('home');
  };

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string | null>('ord-1025');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = cartSubtotal + cartTax;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (item: MenuItem, quantity: number, selectedAddons: CartAddon[], notes?: string) => {
    const addonsKey = selectedAddons.map(a => a.id).sort().join('-');
    const cartItemId = `${item.id}_${addonsKey}`;
    
    const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
    const unitTotal = item.price + addonsTotal;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(i => i.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: unitTotal * newQty,
          specialNotes: notes || updated[existingIndex].specialNotes,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            menuItem: item,
            quantity,
            selectedAddons,
            specialNotes: notes,
            itemTotal: unitTotal * quantity,
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const addonsTotal = item.selectedAddons.reduce((s, a) => s + a.price, 0);
          const unitTotal = item.menuItem.price + addonsTotal;
          return {
            ...item,
            quantity: newQty,
            itemTotal: unitTotal * newQty,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  // Order Placement
  const placeOrder = (
    customer: CustomerDetails, 
    pickupTime: string, 
    paymentMethod: PaymentMethod, 
    notes?: string
  ): Order => {
    const newOrderNum = `DT-${1026 + orders.length}`;
    const newOrderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const orderItems = cart.map((cartItem, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      menuItemId: cartItem.menuItem.id,
      name: cartItem.menuItem.name,
      quantity: cartItem.quantity,
      unitPrice: cartItem.menuItem.price,
      totalPrice: cartItem.itemTotal,
      addonsList: cartItem.selectedAddons.map(a => `${a.name} (+₹${a.price})`),
      notes: cartItem.specialNotes,
    }));

    const newOrder: Order = {
      id: newOrderId,
      orderNumber: newOrderNum,
      customerName: customer.name || 'Pickup Customer',
      customerPhone: customer.phone || '+91 90000 00000',
      orderType: 'PICKUP',
      status: 'PLACED',
      items: orderItems,
      subtotal: cartSubtotal,
      tax: cartTax,
      discount: 0,
      total: cartTotal,
      pickupTime: pickupTime || 'ASAP (15-20 mins)',
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
      notes,
      createdAt: nowIso,
      statusHistory: [
        {
          previousStatus: 'NONE',
          newStatus: 'PLACED',
          changedBy: `${customer.name || 'Customer'} (Online)`,
          changedAt: nowIso,
          notes: 'Order placed for store pickup',
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrderId);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B2FC00', '#FF2E4C', '#FFB703', '#FFFFFF']
      });
    } catch {
      // safe fallback if canvas canvas-confetti fails
    }

    return newOrder;
  };

  // State Machine Validation (food-store-ordering-system-spec.md Section 15)
  const isValidTransition = (current: OrderStatus, next: OrderStatus): boolean => {
    const validMap: Record<OrderStatus, OrderStatus[]> = {
      PLACED: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY_FOR_PICKUP'],
      READY_FOR_PICKUP: ['PICKED_UP'],
      PICKED_UP: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
    };
    return validMap[current]?.includes(next) ?? false;
  };

  const updateOrderStatus = (
    orderId: string, 
    newStatus: OrderStatus, 
    actorName: string = 'Store Staff', 
    notes?: string
  ) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order not found' };
    }

    if (!isValidTransition(targetOrder.status, newStatus)) {
      return { 
        success: false, 
        message: `Invalid state transition: Cannot change from ${targetOrder.status} to ${newStatus}` 
      };
    }

    const nowIso = new Date().toISOString();

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const historyEntry = {
          previousStatus: ord.status,
          newStatus,
          changedBy: actorName,
          changedAt: nowIso,
          notes,
        };

        let updatedPaymentStatus = ord.paymentStatus;
        if (newStatus === 'COMPLETED' && ord.paymentStatus === 'PENDING') {
          updatedPaymentStatus = 'PAID';
        }

        return {
          ...ord,
          status: newStatus,
          paymentStatus: updatedPaymentStatus,
          statusHistory: [...ord.statusHistory, historyEntry],
        };
      }
      return ord;
    }));

    return { success: true };
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    }));
  };

  const updateInventoryQuantity = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.currentQuantity + delta);
        return { ...item, currentQuantity: newQty };
      }
      return item;
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        role,
        setRole,
        user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        customerTab,
        setCustomerTab,
        staffTab,
        setStaffTab,
        categories,
        menuItems,
        cart,
        orders,
        activeOrderId,
        setActiveOrderId,
        inventory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartCount,
        placeOrder,
        updateOrderStatus,
        toggleItemAvailability,
        updateInventoryQuantity,
        soundEnabled,
        setSoundEnabled,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
