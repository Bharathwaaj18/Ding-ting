import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, RotateCcw } from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const { orders, setActiveOrderId, setCustomerTab, addToCart, menuItems } = useStore();

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach(item => {
      const match = menuItems.find(m => m.id === item.menuItemId);
      if (match) {
        addToCart(match, item.quantity, []);
      }
    });
    setCustomerTab('cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          MY ORDER HISTORY
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Review your recent broasted chicken pickup orders and re-order in one click.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-4 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="font-headline font-bold text-base text-white">
                  Order #{order.orderNumber}
                </span>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  order.status === 'READY_FOR_PICKUP' ? 'bg-[#B2FC00] text-[#0E0617]' :
                  order.status === 'COMPLETED' ? 'bg-emerald-600 text-white' :
                  order.status === 'PREPARING' ? 'bg-amber-500 text-black' :
                  'bg-[#271240] text-white border border-white/10'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <span className="text-lg font-black text-[#B2FC00]">
                  ₹{order.total}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-1.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-300">
                  <span>{item.quantity}× {item.name}</span>
                  <span className="font-bold text-white">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Pickup Time: {order.pickupTime}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setActiveOrderId(order.id); setCustomerTab('track'); }}
                  className="bg-[#271240] hover:bg-[#341857] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                >
                  Track Status
                </button>

                <button
                  onClick={() => handleReorder(order)}
                  className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all active:scale-[0.98] shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-Order
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
