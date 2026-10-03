import { Category, MenuItem, Order, InventoryItem } from '../types';

export const STORE_INFO = {
  name: "DING TING",
  subtitle: "SIGNATURE BROASTED CHICKEN",
  tagline: "NOT FRIED. BROASTED. CRISPY OUTSIDE. JUICY INSIDE.",
  crunchLevel: "1000%",
  address: "8/21, 3rd Cross Street, Mandapam Rd, Kilpauk (N100), Chennai - 600010",
  website: "dingting.shop",
  instagram: "@DINGTINGCHENNAI",
  phone: "+91 98400 12345",
  halal: true,
  fssaiLic: "12423002000889",
  pickupTiming: "11:00 AM - 11:30 PM",
  estimatedPrepTime: "15 - 20 mins",
  logoUrl: "/refer_img/WhatsApp Image 2026-09-28 at 22.28.03.jpeg",
  bannerUrl: "/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg",
  boxUrl: "/refer_img/WhatsApp Image 2026-09-28 at 22.28.01.jpeg",
  chickenPieceUrl: "/refer_img/WhatsApp Image 2026-09-28 at 22.28.03 (1).jpeg",
  storeBannerUrl: "/refer_img/WhatsApp Image 2026-09-28 at 22.28.09.jpeg",
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'party-kit',
    name: 'Special Party Kit',
    description: 'The ultimate squad goal combo for maximum crunch',
    badge: 'MUST TRY ₹999',
    icon: 'Sparkles',
  },
  {
    id: 'broasted-boxes',
    name: 'Broasted Boxes',
    description: 'Pressure broasted, extra juicy signature chicken',
    badge: 'BESTSELLER',
    icon: 'Package',
  },
  {
    id: 'spice-infused',
    name: 'Spice Infused Broasted',
    description: 'Mild danger, maximum flavor spicy broasted chicken',
    badge: 'SPICY 🔥',
    icon: 'Flame',
  },
  {
    id: 'arabian-champagne',
    name: 'Arabian Champagne',
    description: 'Refreshing fizzy main character energy mocktails',
    badge: 'FIZZY 🥂',
    icon: 'GlassWater',
  },
  {
    id: 'sides',
    name: 'Sides That Deserve Attention',
    description: 'Golden fries, loaded boxes & fresh dips',
    badge: 'CRUNCHY 🍟',
    icon: 'UtensilsCrossed',
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Party Kit
  {
    id: 'pk-01',
    categoryId: 'party-kit',
    name: 'DING TING Special Party Kit',
    description: 'THE SQUAD GOAL COMBO! Includes 8 Pcs Broasted Chicken + 4 Khuboos + 1.25L Arabian Drink + Large French Fries + 3 Signature Dips.',
    price: 999,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 20,
    piecesCount: 8,
    isPopular: true,
    isPartyKit: true,
    addons: [
      { id: 'add-dip-garlic', name: 'Extra Garlic Dip', price: 30 },
      { id: 'add-dip-peri', name: 'Extra Peri Peri Dip', price: 35 },
      { id: 'add-khuboos', name: 'Extra Khuboos (2 pcs)', price: 40 },
    ],
  },

  // Broasted Boxes
  {
    id: 'bb-01',
    categoryId: 'broasted-boxes',
    name: '2 Pcs Classic Broasted',
    description: 'Perfect for solo munch mode. 2 pcs pressure broasted juicy chicken with signature garlic dip.',
    price: 219,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.03 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 12,
    piecesCount: 2,
    isPopular: true,
    addons: [
      { id: 'add-dip-garlic', name: 'Garlic Dip', price: 30 },
      { id: 'add-khuboos', name: 'Fresh Khuboos', price: 20 },
    ],
  },
  {
    id: 'bb-02',
    categoryId: 'broasted-boxes',
    name: '4 Pcs Classic Broasted',
    description: 'For when you\'re sharing... but not really. 4 pcs golden crispy pressure broasted chicken.',
    price: 399,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.01.jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 15,
    piecesCount: 4,
    isPopular: true,
    addons: [
      { id: 'add-dip-garlic', name: 'Garlic Dip', price: 30 },
      { id: 'add-dip-peri', name: 'Peri Peri Dip', price: 35 },
      { id: 'add-khuboos', name: 'Khuboos (2 Pcs)', price: 40 },
    ],
  },
  {
    id: 'bb-03',
    categoryId: 'broasted-boxes',
    name: '8 Pcs Classic Broasted Bucket',
    description: 'Whole squad approved! 8 pcs of ultra-crispy, extra juicy broasted chicken + 2 dips.',
    price: 749,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 18,
    piecesCount: 8,
    isPopular: true,
    addons: [
      { id: 'add-dip-garlic', name: 'Extra Garlic Dip', price: 30 },
      { id: 'add-fries-sm', name: 'Small French Fries', price: 79 },
    ],
  },

  // Spice Infused Broasted
  {
    id: 'sb-01',
    categoryId: 'spice-infused',
    name: '2 Pcs Spice Infused Broasted',
    description: 'Mild danger. Maximum flavor. Marinated in hot chili infusion & pressure broasted.',
    price: 239,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.03 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 12,
    piecesCount: 2,
    spiceLevel: 'Hot',
    addons: [
      { id: 'add-dip-peri', name: 'Peri Peri Dip', price: 35 },
    ],
  },
  {
    id: 'sb-02',
    categoryId: 'spice-infused',
    name: '4 Pcs Spice Infused Broasted',
    description: 'For people who say "I can handle spice." Fiery crispy skin with tender juicy meat.',
    price: 429,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.01.jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 15,
    piecesCount: 4,
    spiceLevel: 'Hot',
    isPopular: true,
    addons: [
      { id: 'add-dip-peri', name: 'Peri Peri Dip', price: 35 },
      { id: 'add-khuboos', name: 'Khuboos', price: 20 },
    ],
  },
  {
    id: 'sb-03',
    categoryId: 'spice-infused',
    name: '8 Pcs Spice Infused Broasted',
    description: 'Regret? Never heard of her. 8 pcs spicy broasted feast for serious spice lovers.',
    price: 799,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 20,
    piecesCount: 8,
    spiceLevel: 'Extreme',
    addons: [
      { id: 'add-dip-garlic', name: 'Cooling Garlic Dip', price: 30 },
      { id: 'add-khuboos-4', name: 'Khuboos (4 Pcs)', price: 75 },
    ],
  },

  // Arabian Champagne
  {
    id: 'ac-01',
    categoryId: 'arabian-champagne',
    name: 'Classic Arabian Champagne',
    description: 'The OG legend! Sparkling fruit punch infused with mint, citrus, and secret Arabian spices.',
    price: 99,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    isPopular: true,
  },
  {
    id: 'ac-02',
    categoryId: 'arabian-champagne',
    name: 'Blueberry Arabian Champagne',
    description: 'Sweet. Fizzy. Main character energy. Wild blueberry crush with sparkling fizz.',
    price: 119,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    isPopular: true,
  },
  {
    id: 'ac-03',
    categoryId: 'arabian-champagne',
    name: 'Green Apple Arabian Champagne',
    description: 'Fresh, tangy and ridiculously addictive. Crisp green apple sparkles with crushed ice.',
    price: 119,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 5,
  },

  // Sides
  {
    id: 'sd-01',
    categoryId: 'sides',
    name: 'Classic French Fries',
    description: 'Golden, crispy, impossible to stop. Seasoned with sea salt & herbs.',
    price: 119,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 8,
  },
  {
    id: 'sd-02',
    categoryId: 'sides',
    name: 'Chicken Loaded Fries',
    description: 'Fries + shredded broasted chicken + melted cheese sauce + garlic mayo = pure happiness.',
    price: 189,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: 10,
    isPopular: true,
  },
  {
    id: 'sd-03',
    categoryId: 'sides',
    name: 'Fresh Khuboos Bread (2 Pcs)',
    description: 'Soft authentic Arabic flatbread to pair with broasted chicken & dips.',
    price: 35,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 3,
  },
  {
    id: 'sd-04',
    categoryId: 'sides',
    name: 'Trio Dips Pack (Garlic, Peri Peri, Cheese)',
    description: '3 signature dipping sauces for maximum crunch enhancement.',
    price: 85,
    imageUrl: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.10 (1).jpeg',
    isVeg: true,
    isAvailable: true,
    prepTimeMinutes: 2,
  },
];

export const INITIAL_ORDERS: Order[] = [
  // ── KDS Demo: on-time NEW (3 min) ──
  {
    id: 'ord-1030',
    orderNumber: 'DT-1030',
    customerName: 'Meera Nair',
    customerPhone: '+91 94400 11223',
    orderType: 'PICKUP',
    status: 'PLACED',
    items: [
      { id: 'koi-1', menuItemId: 'bb-02', name: '4 Pcs Classic Broasted', quantity: 2, unitPrice: 399, totalPrice: 798, addonsList: ['Garlic Dip (+₹30)', 'Extra Crispy (+₹0)'] },
      { id: 'koi-2', menuItemId: 'ac-01', name: 'Classic Arabian Champagne', quantity: 1, unitPrice: 99, totalPrice: 99 },
    ],
    subtotal: 897, tax: 45, discount: 0, total: 942,
    pickupTime: 'ASAP',
    paymentMethod: 'UPI', paymentStatus: 'PAID',
    notes: 'NO garlic — customer allergic to garlic',
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    statusHistory: [{ previousStatus: 'NONE', newStatus: 'PLACED', changedBy: 'Meera Nair', changedAt: new Date(Date.now() - 3 * 60000).toISOString() }],
  },
  // ── KDS Demo: amber NEW (9 min, ACCEPTED) ──
  {
    id: 'ord-1029',
    orderNumber: 'DT-1029',
    customerName: 'Suresh Kumar',
    customerPhone: '+91 98001 44556',
    orderType: 'PICKUP',
    status: 'ACCEPTED',
    items: [
      { id: 'koi-3', menuItemId: 'pk-01', name: 'DING TING Special Party Kit', quantity: 1, unitPrice: 999, totalPrice: 999 },
    ],
    subtotal: 999, tax: 50, discount: 0, total: 1049,
    pickupTime: 'ASAP',
    paymentMethod: 'CASH', paymentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 9 * 60000).toISOString(),
    statusHistory: [
      { previousStatus: 'NONE', newStatus: 'PLACED', changedBy: 'Suresh Kumar', changedAt: new Date(Date.now() - 9 * 60000).toISOString() },
      { previousStatus: 'PLACED', newStatus: 'ACCEPTED', changedBy: 'KDS', changedAt: new Date(Date.now() - 7 * 60000).toISOString() },
    ],
  },
  // ── KDS Demo: LATE NEW (14 min, PLACED) ──
  {
    id: 'ord-1028',
    orderNumber: 'DT-1028',
    customerName: 'Deepak Menon',
    customerPhone: '+91 97000 78901',
    orderType: 'PICKUP',
    status: 'PLACED',
    items: [
      { id: 'koi-4', menuItemId: 'sb-01', name: '2 Pcs Spice Infused Broasted', quantity: 3, unitPrice: 239, totalPrice: 717 },
      { id: 'koi-5', menuItemId: 'sd-02', name: 'Chicken Loaded Fries', quantity: 1, unitPrice: 189, totalPrice: 189 },
    ],
    subtotal: 906, tax: 45, discount: 0, total: 951,
    pickupTime: 'ASAP',
    paymentMethod: 'ONLINE', paymentStatus: 'PAID',
    notes: 'Extra crispy, pack fries separately!',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    statusHistory: [{ previousStatus: 'NONE', newStatus: 'PLACED', changedBy: 'Deepak Menon', changedAt: new Date(Date.now() - 14 * 60000).toISOString() }],
  },
  // ── KDS Demo: COOKING on-time (6 min) ──
  {
    id: 'ord-1027',
    orderNumber: 'DT-1027',
    customerName: 'Lakshmi Venkat',
    customerPhone: '+91 96000 33445',
    orderType: 'PICKUP',
    status: 'PREPARING',
    items: [
      { id: 'koi-6', menuItemId: 'bb-03', name: '6 Pcs Classic Broasted', quantity: 1, unitPrice: 549, totalPrice: 549, addonsList: ['Garlic Dip (+₹30)'] },
    ],
    subtotal: 579, tax: 29, discount: 0, total: 608,
    pickupTime: 'ASAP',
    paymentMethod: 'UPI', paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
    statusHistory: [
      { previousStatus: 'NONE', newStatus: 'PLACED', changedBy: 'Lakshmi Venkat', changedAt: new Date(Date.now() - 6 * 60000).toISOString() },
      { previousStatus: 'PLACED', newStatus: 'ACCEPTED', changedBy: 'KDS', changedAt: new Date(Date.now() - 5 * 60000).toISOString() },
      { previousStatus: 'ACCEPTED', newStatus: 'PREPARING', changedBy: 'Chef Anbu', changedAt: new Date(Date.now() - 4 * 60000).toISOString() },
    ],
  },
  // ── KDS Demo: READY cash order ──
  {
    id: 'ord-1026',
    orderNumber: 'DT-1026',
    customerName: 'Arun Pillai',
    customerPhone: '+91 94400 99001',
    orderType: 'PICKUP',
    status: 'READY_FOR_PICKUP',
    items: [
      { id: 'koi-7', menuItemId: 'bb-01', name: '2 Pcs Classic Broasted', quantity: 1, unitPrice: 219, totalPrice: 219 },
    ],
    subtotal: 219, tax: 11, discount: 0, total: 230,
    pickupTime: 'ASAP',
    paymentMethod: 'CASH', paymentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    statusHistory: [
      { previousStatus: 'NONE', newStatus: 'PLACED', changedBy: 'Arun Pillai', changedAt: new Date(Date.now() - 18 * 60000).toISOString() },
      { previousStatus: 'PLACED', newStatus: 'ACCEPTED', changedBy: 'KDS', changedAt: new Date(Date.now() - 16 * 60000).toISOString() },
      { previousStatus: 'ACCEPTED', newStatus: 'PREPARING', changedBy: 'Chef Anbu', changedAt: new Date(Date.now() - 14 * 60000).toISOString() },
      { previousStatus: 'PREPARING', newStatus: 'READY_FOR_PICKUP', changedBy: 'KDS', changedAt: new Date(Date.now() - 2 * 60000).toISOString() },
    ],
  },
  {
    id: 'ord-1025',
    orderNumber: 'DT-1025',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 12345',
    orderType: 'PICKUP',
    status: 'PLACED',
    items: [
      {
        id: 'oi-1',
        menuItemId: 'bb-02',
        name: '4 Pcs Classic Broasted',
        quantity: 1,
        unitPrice: 399,
        totalPrice: 399,
        addonsList: ['Garlic Dip (₹30)'],
      },
      {
        id: 'oi-2',
        menuItemId: 'ac-01',
        name: 'Classic Arabian Champagne',
        quantity: 1,
        unitPrice: 99,
        totalPrice: 99,
      }
    ],
    subtotal: 528,
    tax: 26,
    discount: 0,
    total: 554,
    pickupTime: 'ASAP (7:45 PM)',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    notes: 'Extra crispy chicken please!',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    statusHistory: [
      {
        previousStatus: 'NONE',
        newStatus: 'PLACED',
        changedBy: 'Rahul Sharma (Customer)',
        changedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        notes: 'Order placed via online store',
      }
    ]
  },
  {
    id: 'ord-1024',
    orderNumber: 'DT-1024',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 98840 98765',
    orderType: 'PICKUP',
    status: 'ACCEPTED',
    items: [
      {
        id: 'oi-3',
        menuItemId: 'pk-01',
        name: 'DING TING Special Party Kit',
        quantity: 1,
        unitPrice: 999,
        totalPrice: 999,
        addonsList: ['Extra Garlic Dip (₹30)'],
      }
    ],
    subtotal: 1029,
    tax: 51,
    discount: 50,
    total: 1030,
    pickupTime: '8:00 PM',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Pack drink with ice separately.',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    statusHistory: [
      {
        previousStatus: 'NONE',
        newStatus: 'PLACED',
        changedBy: 'Priya Sundaram',
        changedAt: new Date(Date.now() - 14 * 60000).toISOString(),
      },
      {
        previousStatus: 'PLACED',
        newStatus: 'ACCEPTED',
        changedBy: 'Kitchen Staff (User #102)',
        changedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        notes: 'Accepted order by store manager',
      }
    ]
  },
  {
    id: 'ord-1023',
    orderNumber: 'DT-1023',
    customerName: 'Karthik Raja',
    customerPhone: '+91 97900 54321',
    orderType: 'PICKUP',
    status: 'PREPARING',
    items: [
      {
        id: 'oi-4',
        menuItemId: 'sb-02',
        name: '4 Pcs Spice Infused Broasted',
        quantity: 1,
        unitPrice: 429,
        totalPrice: 429,
      },
      {
        id: 'oi-5',
        menuItemId: 'sd-02',
        name: 'Chicken Loaded Fries',
        quantity: 1,
        unitPrice: 189,
        totalPrice: 189,
      }
    ],
    subtotal: 618,
    tax: 31,
    discount: 0,
    total: 649,
    pickupTime: 'ASAP (7:40 PM)',
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    notes: 'Pay cash at pickup counter.',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    statusHistory: [
      {
        previousStatus: 'NONE',
        newStatus: 'PLACED',
        changedBy: 'Karthik Raja',
        changedAt: new Date(Date.now() - 22 * 60000).toISOString(),
      },
      {
        previousStatus: 'PLACED',
        newStatus: 'ACCEPTED',
        changedBy: 'Kitchen Staff',
        changedAt: new Date(Date.now() - 18 * 60000).toISOString(),
      },
      {
        previousStatus: 'ACCEPTED',
        newStatus: 'PREPARING',
        changedBy: 'Chef Anbu',
        changedAt: new Date(Date.now() - 12 * 60000).toISOString(),
        notes: 'Broasting batch #4',
      }
    ]
  },
  {
    id: 'ord-1021',
    orderNumber: 'DT-1021',
    customerName: 'Ananya Venkatesh',
    customerPhone: '+91 99620 11223',
    orderType: 'PICKUP',
    status: 'READY_FOR_PICKUP',
    items: [
      {
        id: 'oi-6',
        menuItemId: 'bb-01',
        name: '2 Pcs Classic Broasted',
        quantity: 1,
        unitPrice: 219,
        totalPrice: 219,
      },
      {
        id: 'oi-7',
        menuItemId: 'ac-02',
        name: 'Blueberry Arabian Champagne',
        quantity: 1,
        unitPrice: 119,
        totalPrice: 119,
      }
    ],
    subtotal: 338,
    tax: 17,
    discount: 0,
    total: 355,
    pickupTime: '7:30 PM',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    statusHistory: [
      {
        previousStatus: 'NONE',
        newStatus: 'PLACED',
        changedBy: 'Ananya Venkatesh',
        changedAt: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        previousStatus: 'PLACED',
        newStatus: 'ACCEPTED',
        changedBy: 'Kitchen Staff',
        changedAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        previousStatus: 'ACCEPTED',
        newStatus: 'PREPARING',
        changedBy: 'Chef Anbu',
        changedAt: new Date(Date.now() - 22 * 60000).toISOString(),
      },
      {
        previousStatus: 'PREPARING',
        newStatus: 'READY_FOR_PICKUP',
        changedBy: 'Kitchen Staff',
        changedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        notes: 'Packed in Ding Ting signature chicken box',
      }
    ]
  },
  {
    id: 'ord-1019',
    orderNumber: 'DT-1019',
    customerName: 'Vikram Seth',
    customerPhone: '+91 98410 77889',
    orderType: 'PICKUP',
    status: 'COMPLETED',
    items: [
      {
        id: 'oi-8',
        menuItemId: 'sb-03',
        name: '8 Pcs Spice Infused Broasted',
        quantity: 1,
        unitPrice: 799,
        totalPrice: 799,
      }
    ],
    subtotal: 799,
    tax: 40,
    discount: 0,
    total: 839,
    pickupTime: '7:00 PM',
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
    statusHistory: [
      {
        previousStatus: 'NONE',
        newStatus: 'PLACED',
        changedBy: 'Vikram Seth',
        changedAt: new Date(Date.now() - 75 * 60000).toISOString(),
      },
      {
        previousStatus: 'PLACED',
        newStatus: 'ACCEPTED',
        changedBy: 'Staff',
        changedAt: new Date(Date.now() - 70 * 60000).toISOString(),
      },
      {
        previousStatus: 'ACCEPTED',
        newStatus: 'PREPARING',
        changedBy: 'Chef',
        changedAt: new Date(Date.now() - 50 * 60000).toISOString(),
      },
      {
        previousStatus: 'PREPARING',
        newStatus: 'READY_FOR_PICKUP',
        changedBy: 'Staff',
        changedAt: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        previousStatus: 'READY_FOR_PICKUP',
        newStatus: 'PICKED_UP',
        changedBy: 'Counter Staff (User #105)',
        changedAt: new Date(Date.now() - 20 * 60000).toISOString(),
      },
      {
        previousStatus: 'PICKED_UP',
        newStatus: 'COMPLETED',
        changedBy: 'Counter Staff',
        changedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Fresh Marinated Chicken (Kg)', unit: 'kg', currentQuantity: 42, minimumQuantity: 15, category: 'Poultry', isActive: true },
  { id: 'inv-2', name: 'Broasting Oil (Liters)', unit: 'L', currentQuantity: 28, minimumQuantity: 10, category: 'Oil & Spices', isActive: true },
  { id: 'inv-3', name: 'Ding Ting Secret Breading (Kg)', unit: 'kg', currentQuantity: 18, minimumQuantity: 8, category: 'Ingredients', isActive: true },
  { id: 'inv-4', name: 'Fresh Khuboos Flatbread (Pcs)', unit: 'pcs', currentQuantity: 120, minimumQuantity: 30, category: 'Bakery', isActive: true },
  { id: 'inv-5', name: 'Garlic Mayo Dip Tubs (Pcs)', unit: 'pcs', currentQuantity: 85, minimumQuantity: 25, category: 'Sauces', isActive: true },
  { id: 'inv-6', name: 'Arabian Champagne Syrup Base (Liters)', unit: 'L', currentQuantity: 14, minimumQuantity: 5, category: 'Beverages', isActive: true },
  { id: 'inv-7', name: 'Ding Ting Custom Chicken Boxes', unit: 'pcs', currentQuantity: 240, minimumQuantity: 50, category: 'Packaging', isActive: true },
];

export const STATUS_IMAGE_MAP: Record<string, { image: string; title: string; subtitle: string }> = {
  PLACED: {
    image: '/refer_img/status-placed.png',
    title: 'Order Placed & Registered',
    subtitle: 'Ticket received at Mandapam Rd counter'
  },
  ACCEPTED: {
    image: '/refer_img/status-accepted.png',
    title: 'Accepted by Kitchen',
    subtitle: 'Chef has accepted your ticket with a grin'
  },
  PREPARING: {
    image: '/refer_img/status-preparing.png',
    title: 'Broasting in Progress',
    subtitle: 'Crispy skin & juicy chicken sizzling at 500 PSI'
  },
  READY_FOR_PICKUP: {
    image: '/refer_img/status-ready.png',
    title: 'Ready for Pickup!',
    subtitle: 'Hot & packaged at Ding Ting counter!'
  },
  PICKED_UP: {
    image: '/refer_img/status-completed.png',
    title: 'Order Picked Up',
    subtitle: 'Food coma time! Thank you for munching!'
  },
  COMPLETED: {
    image: '/refer_img/status-completed.png',
    title: 'Order Completed',
    subtitle: 'Thank you for munching! Food coma time!'
  },
  CANCELLED: {
    image: '/refer_img/status-placed.png',
    title: 'Order Cancelled',
    subtitle: 'This order was cancelled'
  }
};

