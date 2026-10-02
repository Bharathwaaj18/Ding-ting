import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { 
  ChefHat, 
  Volume2, 
  VolumeX, 
  Search, 
  Clock, 
  AlertCircle
} from 'lucide-react';

export const KitchenDisplaySystem: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    soundEnabled, 
    setSoundEnabled 
  } = useStore();

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredOrders = orders.filter(o => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q)
    );
  });

  const columns: { status: OrderStatus; title: string; color: string; badgeBg: string }[] = [
    { status: 'PLACED', title: 'NEW ORDERS', color: 'border-[#FF2E4C]', badgeBg: 'bg-[#FF2E4C] text-white' },
    { status: 'ACCEPTED', title: 'ACCEPTED', color: 'border-amber-400', badgeBg: 'bg-amber-400 text-black' },
    { status: 'PREPARING', title: 'PREPARING 🍗', color: 'border-blue-400', badgeBg: 'bg-blue-500 text-white' },
    { status: 'READY_FOR_PICKUP', title: 'READY FOR PICKUP 🛍️', color: 'border-[#B2FC00]', badgeBg: 'bg-[#B2FC00] text-[#0D0218]' },
    { status: 'COMPLETED', title: 'COMPLETED', color: 'border-emerald-500', badgeBg: 'bg-emerald-600 text-white' },
  ];

  const handleAction = (orderId: string, nextStatus: OrderStatus, actionName: string) => {
    const res = updateOrderStatus(orderId, nextStatus, 'Kitchen KDS Operator', actionName);
    if (!res.success) {
      setFeedbackMsg({ type: 'error', text: res.message || 'Error updating status' });
    } else {
      setFeedbackMsg({ type: 'success', text: `Order updated to ${nextStatus.replace(/_/g, ' ')}` });
    }
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const getNextActionConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return { next: 'ACCEPTED' as OrderStatus, label: 'Accept Order', btnClass: 'bg-[#B2FC00] text-[#0D0218] hover:bg-[#C5FF2E]' };
      case 'ACCEPTED':
        return { next: 'PREPARING' as OrderStatus, label: 'Start Preparing', btnClass: 'bg-amber-400 text-black hover:bg-amber-300' };
      case 'PREPARING':
        return { next: 'READY_FOR_PICKUP' as OrderStatus, label: 'Mark Ready', btnClass: 'bg-blue-500 text-white hover:bg-blue-400' };
      case 'READY_FOR_PICKUP':
        return { next: 'PICKED_UP' as OrderStatus, label: 'Mark Picked Up', btnClass: 'bg-[#B2FC00] text-[#0D0218] hover:bg-[#C5FF2E]' };
      case 'PICKED_UP':
        return { next: 'COMPLETED' as OrderStatus, label: 'Complete Order', btnClass: 'bg-emerald-500 text-white hover:bg-emerald-400' };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* KDS Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#160A24] border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B2FC00] text-[#0E0617] flex items-center justify-center font-black">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              KITCHEN DISPLAY SYSTEM (KDS)
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Real-time live order status Kanban board & pickup verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order #, customer..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="bg-[#0E0617] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B2FC00] transition-colors"
            />
          </div>

          {/* Sound Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              soundEnabled
                ? 'bg-[#271240] text-[#B2FC00] border-[#B2FC00]/40'
                : 'bg-[#0E0617] text-slate-400 border-white/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#B2FC00]" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Audio Alerts ON' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in ${
          feedbackMsg.type === 'error' ? 'bg-rose-900/80 text-rose-200 border border-rose-500/50' : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50'
        }`}>
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {feedbackMsg.text}
          </span>
          <button onClick={() => setFeedbackMsg(null)}>×</button>
        </div>
      )}

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colOrders = filteredOrders.filter(o => o.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-[#11071F] border-t-2 ${col.color} border-x border-b border-white/10 rounded-xl p-3 space-y-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="font-headline text-xs font-black tracking-wider text-white uppercase">
                  {col.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${col.badgeBg}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 italic">
                    No orders
                  </div>
                ) : (
                  colOrders.map(order => {
                    const actionCfg = getNextActionConfig(order.status);

                    return (
                      <div
                        key={order.id}
                        className="bg-[#160A24] border border-white/10 p-3.5 rounded-xl space-y-3 shadow-sm hover:border-white/20 transition-all"
                      >
                        {/* Card Header: Order # & Total */}
                        <div className="flex justify-between items-start border-b border-white/5 pb-2">
                          <div>
                            <span className="font-headline font-black text-sm text-[#B2FC00]">
                              #{order.orderNumber}
                            </span>
                            <span className="block text-[11px] font-bold text-white">
                              {order.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {order.customerPhone}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-white block">
                              ₹{order.total}
                            </span>
                            <span className={`text-[10px] font-bold ${
                              order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {order.paymentStatus} ({order.paymentMethod})
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-1.5 text-xs text-slate-200">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start leading-tight">
                              <span>
                                <strong className="text-[#B2FC00]">{item.quantity}×</strong> {item.name}
                                {item.addonsList && item.addonsList.length > 0 && (
                                  <span className="block text-[10px] text-slate-400 pl-3">
                                    + {item.addonsList.join(', ')}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="bg-[#0E0617] p-2 rounded-lg text-[11px] text-amber-300 italic border border-white/10">
                            "{order.notes}"
                          </div>
                        )}

                        {/* Pickup Time */}
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" /> {order.pickupTime}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        {actionCfg && (
                          <div className="pt-2 border-t border-white/5 flex gap-2">
                            <button
                              onClick={() => handleAction(order.id, actionCfg.next, actionCfg.label)}
                              className={`w-full py-2 px-3 rounded-lg text-xs font-black transition-transform active:scale-[0.98] shadow-sm ${actionCfg.btnClass}`}
                            >
                              {actionCfg.label} →
                            </button>

                            {order.status === 'PLACED' && (
                              <button
                                onClick={() => handleAction(order.id, 'CANCELLED', 'Order Cancelled')}
                                className="bg-rose-950/60 hover:bg-rose-900 text-rose-200 px-2 rounded-lg text-xs font-bold border border-rose-500/30"
                                title="Cancel order"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
