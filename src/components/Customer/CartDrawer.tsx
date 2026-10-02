import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { STORE_INFO } from '../../data/mockData';
import { playBoingSound, playCrunchSound, playVictorySound } from '../../utils/audioFX';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

const SUBMIT_MESSAGES = [
  "Firing up pressure broaster at 500 PSI... 🍗",
  "Baking fresh Arabic Khuboos... 🍞",
  "Double dipping in signature garlic sauce... 🧄",
  "Pouring ice cold Arabian champagne... 🥤",
  "Generating pickup receipt & QR code... 🧾",
];

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    placeOrder,
    setCustomerTab,
    setSelectedCategory,
    soundEnabled,
    user,
    openAuthModal
  } = useStore();

  const [customerName, setCustomerName] = useState<string>(user?.name || 'Bharathwaaj');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '+91 98765 43210');

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setCustomerPhone(user.phone);
    }
  }, [user]);

  const [pickupTime, setPickupTime] = useState<string>('ASAP (15-20 mins)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [orderNotes, setOrderNotes] = useState<string>('Extra napkins please');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStepIndex, setSubmitStepIndex] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      interval = setInterval(() => {
        setSubmitStepIndex(prev => (prev + 1) % SUBMIT_MESSAGES.length);
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (soundEnabled) playVictorySound();
    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder(
        { name: customerName, phone: customerPhone },
        pickupTime,
        paymentMethod,
        orderNotes
      );
      setIsSubmitting(false);
      setCustomerTab('track');
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="relative w-24 h-24 bg-[#160A24] border border-white/10 rounded-full flex items-center justify-center mx-auto text-slate-500 shadow-sm">
          <span className="text-4xl select-none">🍗</span>
          <span className="absolute -top-1 -right-1 bg-[#FF2E4C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            EMPTY
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-headline text-2xl font-extrabold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't added any broasted chicken boxes, sides, or drinks yet! Explore our menu to start your order.
          </p>
        </div>

        <button
          onClick={() => { setSelectedCategory('all'); setCustomerTab('menu'); }}
          className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-7 py-3 rounded-xl font-extrabold text-xs inline-flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <UtensilsCrossed className="w-4 h-4" /> Browse Menu & Add Food
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
            <span>YOUR CART & PICKUP DETAILS</span>
            <span className="bg-[#B2FC00]/15 text-[#B2FC00] border border-[#B2FC00]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cart.length} ITEMS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store Pickup at <strong className="text-[#B2FC00] font-medium">{STORE_INFO.address}</strong>
          </p>
        </div>

        <button
          onClick={() => {
            if (soundEnabled) playBoingSound();
            clearCart();
          }}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <form onSubmit={handleCheckout} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <span>Selected Food Items</span>
            <span className="text-sm">🍗</span>
          </h3>

          <div className="space-y-3">
            {cart.map(item => (
              <div
                key={item.cartItemId}
                className="bg-[#160A24] border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-[#0E0617]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-white text-sm truncate">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-xs font-bold text-[#B2FC00]">
                      ₹{item.menuItem.price} each
                    </p>

                    {item.selectedAddons.length > 0 && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Addons: {item.selectedAddons.map(a => `${a.name} (+₹${a.price})`).join(', ')}
                      </div>
                    )}

                    {item.specialNotes && (
                      <p className="text-[11px] italic text-amber-300 mt-0.5">
                        Note: "{item.specialNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-[#0E0617] border border-white/10 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playBoingSound();
                        updateCartQuantity(item.cartItemId, -1);
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#271240] active:scale-90"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playCrunchSound();
                        updateCartQuantity(item.cartItemId, 1);
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center text-[#B2FC00] hover:bg-[#271240] active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-black text-white text-sm w-14 text-right">
                    ₹{item.itemTotal}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playBoingSound();
                      removeFromCart(item.cartItemId);
                    }}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pickup Instructions Box */}
          <div className="bg-[#160A24] border border-white/10 p-4 rounded-xl space-y-2">
            <h4 className="font-headline text-xs font-bold text-[#B2FC00] uppercase tracking-wider">
              Special Pickup Request 📝
            </h4>
            <textarea
              rows={2}
              placeholder="e.g. Please pack extra garlic dips, ensure broasted chicken is extra spicy..."
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              className="w-full bg-[#0E0617] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B2FC00] transition-colors"
            />
          </div>
        </div>

        {/* Right Column: Checkout & Payment Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-headline text-lg font-bold text-white">
                Pickup Information
              </h3>
              <button
                type="button"
                onClick={openAuthModal}
                className="text-xs text-[#B2FC00] hover:underline font-bold flex items-center gap-1"
              >
                📲 {user ? 'Change Account' : 'Login via OTP'}
              </button>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B2FC00] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mobile Number (For Pickup Verification) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B2FC00] transition-colors"
                />
              </div>

              {/* Pickup Time Option */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Estimated Pickup Time
                </label>
                <select
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#B2FC00] transition-colors"
                >
                  <option value="ASAP (15-20 mins)">ASAP (15 - 20 mins)</option>
                  <option value="7:30 PM">7:30 PM Today</option>
                  <option value="8:00 PM">8:00 PM Today</option>
                  <option value="8:30 PM">8:30 PM Today</option>
                  <option value="9:00 PM">9:00 PM Today</option>
                </select>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="block text-xs font-bold text-[#B2FC00] uppercase tracking-wider">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playBoingSound();
                    setPaymentMethod('UPI');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                    paymentMethod === 'UPI' 
                      ? 'bg-[#271240] border-[#B2FC00] text-[#B2FC00] shadow-sm' 
                      : 'bg-[#0E0617] border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#B2FC00]" /> Instant UPI
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playBoingSound();
                    setPaymentMethod('CASH');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                    paymentMethod === 'CASH' 
                      ? 'bg-[#271240] border-[#B2FC00] text-[#B2FC00] shadow-sm' 
                      : 'bg-[#0E0617] border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-400" /> Cash Counter
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playBoingSound();
                    setPaymentMethod('CARD');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                    paymentMethod === 'CARD' 
                      ? 'bg-[#271240] border-[#B2FC00] text-[#B2FC00] shadow-sm' 
                      : 'bg-[#0E0617] border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" /> Card / POS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playBoingSound();
                    setPaymentMethod('ONLINE');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-bold transition-all active:scale-[0.98] ${
                    paymentMethod === 'ONLINE' 
                      ? 'bg-[#271240] border-[#B2FC00] text-[#B2FC00] shadow-sm' 
                      : 'bg-[#0E0617] border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> Online Pay
                </button>
              </div>

              {/* UPI QR Mock Box */}
              {paymentMethod === 'UPI' && (
                <div className="bg-[#0E0617] border border-[#B2FC00]/40 p-3 rounded-xl flex items-center gap-3 text-xs">
                  <div className="w-11 h-11 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                    <QrCode className="w-9 h-9 text-black" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">GPay / PhonePe / Paytm</span>
                    <span className="text-[11px] text-slate-400">UPI ID: <code className="text-[#B2FC00]">dingting@upi</code></span>
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>5% GST Tax</span>
                <span>₹{cartTax}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Store Pickup Fee</span>
                <span className="text-[#B2FC00] font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-white">
                <span>Total Amount</span>
                <span className="text-[#B2FC00] text-lg">₹{cartTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-80"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 font-headline animate-pulse text-xs">
                  <span>{SUBMIT_MESSAGES[submitStepIndex]}</span>
                </span>
              ) : (
                <>
                  <span>CONFIRM PICKUP ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
