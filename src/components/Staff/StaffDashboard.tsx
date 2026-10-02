import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Store
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { orders, setStaffTab } = useStore();

  const todaySales = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(o => ['PLACED', 'ACCEPTED', 'PREPARING'].includes(o.status)).length;
  const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'PICKED_UP').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Dashboard Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#160A24] border border-white/10 p-6 rounded-2xl">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            STORE OPERATIONS DASHBOARD
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Real-time daily sales, order breakdown & store performance overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setStaffTab('kds')}
            className="bg-[#B2FC00] text-[#0E0617] px-4 py-2.5 rounded-xl font-black text-xs hover:bg-[#C4FF1A] transition-all shadow-sm"
          >
            Launch KDS Kanban →
          </button>
          <button
            onClick={() => setStaffTab('new-order')}
            className="bg-[#271240] text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-white/10 hover:bg-[#341857] transition-all"
          >
            + New POS Order
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Sales</span>
            <div className="w-7 h-7 rounded-lg bg-[#B2FC00]/15 text-[#B2FC00] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-headline text-2xl font-black text-[#B2FC00]">₹{todaySales}</p>
          <span className="text-[11px] text-slate-400">Total gross revenue today</span>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-headline text-2xl font-black text-white">{totalOrdersCount}</p>
          <span className="text-[11px] text-slate-400">Received orders count</span>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Kitchen</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-headline text-2xl font-black text-amber-400">{pendingOrders}</p>
          <span className="text-[11px] text-slate-400">Placed / Preparing</span>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ready Pickup</span>
            <div className="w-7 h-7 rounded-lg bg-[#B2FC00]/15 text-[#B2FC00] flex items-center justify-center">
              <Store className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-headline text-2xl font-black text-[#B2FC00]">{readyOrders}</p>
          <span className="text-[11px] text-slate-400">Hot at counter</span>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-headline text-2xl font-black text-emerald-400">{completedOrders}</p>
          <span className="text-[11px] text-slate-400">Fulfilled orders</span>
        </div>

      </div>

      {/* Activity Stream Section */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-headline text-lg font-bold text-white flex items-center justify-between">
          <span>Recent Live Order Stream</span>
          <span className="text-xs text-[#B2FC00] font-normal">Real-time update</span>
        </h3>

        <div className="space-y-3">
          {orders.slice(0, 5).map(o => (
            <div key={o.id} className="bg-[#0E0617] border border-white/10 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-headline font-black text-sm text-[#B2FC00]">
                  #{o.orderNumber}
                </span>
                <div>
                  <span className="font-bold text-white block">{o.customerName}</span>
                  <span className="text-slate-400 text-[11px]">{o.items.length} items • {o.pickupTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  o.status === 'READY_FOR_PICKUP' ? 'bg-[#B2FC00] text-[#0E0617]' :
                  o.status === 'COMPLETED' ? 'bg-emerald-600 text-white' :
                  o.status === 'PREPARING' ? 'bg-amber-400 text-black' :
                  'bg-[#271240] text-white border border-white/10'
                }`}>
                  {o.status.replace(/_/g, ' ')}
                </span>
                <span className="font-black text-white text-sm">₹{o.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
