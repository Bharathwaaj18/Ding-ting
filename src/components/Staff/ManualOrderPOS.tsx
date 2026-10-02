import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem, PaymentMethod } from '../../types';
import { Plus } from 'lucide-react';

export const ManualOrderPOS: React.FC = () => {
  const { menuItems, placeOrder, setStaffTab } = useStore();

  const [walkinName, setWalkinName] = useState<string>('Walk-in Customer');
  const [walkinPhone, setWalkinPhone] = useState<string>('+91 90000 00000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [posCart, setPosCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const addItem = (item: MenuItem) => {
    setPosCart(prev => {
      const idx = prev.findIndex(p => p.item.id === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].qty += 1;
        return copy;
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setPosCart(prev => prev.map(p => {
      if (p.item.id === id) {
        const n = p.qty + delta;
        if (n <= 0) return null;
        return { ...p, qty: n };
      }
      return p;
    }).filter(Boolean) as { item: MenuItem; qty: number }[]);
  };

  const subtotal = posCart.reduce((sum, p) => sum + (p.item.price * p.qty), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handleSubmitPOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (posCart.length === 0) return;

    // Simulate placing order by pushing to global store
    const created = placeOrder(
      { name: walkinName, phone: walkinPhone },
      'Walk-in Immediate',
      paymentMethod,
      'Created at Store Counter POS'
    );

    setSuccessMsg(`Order #${created.orderNumber} created successfully!`);
    setPosCart([]);
    setTimeout(() => {
      setSuccessMsg(null);
      setStaffTab('kds');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            WALK-IN COUNTER POS (NEW ORDER)
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Store counter staff manual order entry terminal.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-[#B2FC00] text-[#0E0617] p-4 rounded-xl font-black text-sm text-center shadow-md animate-fade-in">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Menu Items Selection Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-headline text-base font-bold text-white">Select Items to Add</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1">
            {menuItems.map(item => (
              <div
                key={item.id}
                onClick={() => item.isAvailable && addItem(item)}
                className={`bg-[#160A24] border border-white/10 p-3.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:border-[#B2FC00]/50 transition-all ${
                  !item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="min-w-0">
                  <h4 className="font-headline font-bold text-white text-sm truncate">{item.name}</h4>
                  <span className="text-xs font-black text-[#B2FC00]">₹{item.price}</span>
                </div>
                <button
                  type="button"
                  disabled={!item.isAvailable}
                  className="bg-[#B2FC00] text-[#0E0617] p-1.5 rounded-lg text-xs font-black hover:scale-105 shrink-0 transition-transform"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: POS Cart Summary & Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmitPOS} className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="font-headline text-base font-bold text-white border-b border-white/10 pb-3">
              Order Receipt ({posCart.length} Items)
            </h3>

            {/* Customer Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Customer Name</label>
                <input
                  type="text"
                  value={walkinName}
                  onChange={e => setWalkinName(e.target.value)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#B2FC00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mobile</label>
                <input
                  type="text"
                  value={walkinPhone}
                  onChange={e => setWalkinPhone(e.target.value)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#B2FC00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#B2FC00] transition-colors"
                >
                  <option value="CASH">CASH (Counter)</option>
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="CARD">CARD (POS Device)</option>
                </select>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 border-t border-white/10 pt-3 max-h-48 overflow-y-auto">
              {posCart.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-white">
                  <span className="truncate max-w-[160px] text-slate-200">{p.item.name}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQty(p.item.id, -1)} className="text-slate-300 font-bold px-1.5 bg-[#0E0617] rounded border border-white/10">-</button>
                    <span>{p.qty}</span>
                    <button type="button" onClick={() => updateQty(p.item.id, 1)} className="text-[#B2FC00] font-bold px-1.5 bg-[#0E0617] rounded border border-white/10">+</button>
                    <span className="font-bold w-12 text-right text-[#B2FC00]">₹{p.item.price * p.qty}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>5% GST</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-[#B2FC00]">₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={posCart.length === 0}
              className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 active:scale-[0.98] shadow-sm"
            >
              Print & Send to Kitchen KDS →
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
