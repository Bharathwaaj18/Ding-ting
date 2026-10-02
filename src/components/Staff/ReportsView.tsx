import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart3, PieChart } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders } = useStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Payment Breakdown
  const paymentBreakdown = orders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#B2FC00]" />
            SALES & ANALYTICS REPORTS
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Performance analytics, revenue metrics, popular items & payment breakdown.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</span>
          <p className="font-headline text-3xl font-black text-[#B2FC00]">₹{totalSales}</p>
          <p className="text-[11px] text-slate-400">Across {totalOrders} pickup orders</p>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Order Value</span>
          <p className="font-headline text-3xl font-black text-white">₹{avgOrderValue}</p>
          <p className="text-[11px] text-slate-400">Per customer pickup basket</p>
        </div>

        <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Top Bestseller</span>
          <p className="font-headline text-xl sm:text-2xl font-black text-amber-400">Special Party Kit ₹999</p>
          <p className="text-[11px] text-slate-400">Squad goal combo leader</p>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#B2FC00]" /> Payment Method Volume
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['UPI', 'CASH', 'CARD', 'ONLINE'].map(method => {
            const amount = paymentBreakdown[method] || 0;
            const pct = totalSales > 0 ? Math.round((amount / totalSales) * 100) : 0;

            return (
              <div key={method} className="bg-[#0E0617] border border-white/10 p-4 rounded-xl space-y-1">
                <span className="text-xs text-slate-400 font-bold">{method}</span>
                <p className="font-headline text-xl font-black text-[#B2FC00]">₹{amount}</p>
                <span className="text-[10px] text-slate-300 font-semibold">{pct}% of total sales</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
