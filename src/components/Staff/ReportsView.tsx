import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BarChart3, 
  PieChart, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  History, 
  Utensils
} from 'lucide-react';

export type ReportPeriodMode = 'ALL' | 'SHIFT' | 'DAY' | 'MONTH' | 'YEAR';

export const ReportsView: React.FC = () => {
  const { 
    orders, 
    isStoreOpen, 
    checkInTime, 
    shiftHistory, 
    toggleStoreOpenStatus 
  } = useStore();

  // Date Filter Controls
  const [periodMode, setPeriodMode] = useState<ReportPeriodMode>('DAY');
  
  // Default values
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentYearStr = new Date().getFullYear().toString(); // YYYY

  const [selectedDay, setSelectedDay] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);

  // Filter Orders based on selected Period
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      if (periodMode === 'ALL') {
        return true;
      }
      
      if (periodMode === 'SHIFT') {
        if (!checkInTime) return true;
        return orderDate.getTime() >= new Date(checkInTime).getTime();
      }

      if (periodMode === 'DAY') {
        const orderDayStr = orderDate.toISOString().slice(0, 10);
        return orderDayStr === selectedDay;
      }

      if (periodMode === 'MONTH') {
        const orderMonthStr = orderDate.toISOString().slice(0, 7);
        return orderMonthStr === selectedMonth;
      }

      if (periodMode === 'YEAR') {
        const orderYearStr = orderDate.getFullYear().toString();
        return orderYearStr === selectedYear;
      }

      return true;
    });
  }, [orders, periodMode, selectedDay, selectedMonth, selectedYear, checkInTime]);

  // Key Analytics Metrics
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const completedOrders = filteredOrders.filter(o => o.status === 'COMPLETED' || o.status === 'PICKED_UP').length;
  const cancelledOrders = filteredOrders.filter(o => o.status === 'CANCELLED').length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;

  // Total Food Items Sold
  const totalItemsSold = filteredOrders.reduce((sum, o) => {
    return sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0);
  }, 0);

  // Payment Breakdown
  const paymentBreakdown = filteredOrders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + o.total;
    return acc;
  }, {} as Record<string, number>);

  // Item Bestsellers Ranking for filtered period
  const itemRankings = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      o.items.forEach(item => {
        if (!map[item.menuItemId]) {
          map[item.menuItemId] = { name: item.name, qty: 0, revenue: 0 };
        }
        map[item.menuItemId].qty += item.quantity;
        map[item.menuItemId].revenue += item.totalPrice;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Hourly Peak Sales Breakdown (11 AM - 11 PM)
  const hourlyBreakdown = useMemo(() => {
    const slots = [
      { label: 'Morning (11 AM - 2 PM)', startHour: 11, endHour: 14, sales: 0, orders: 0 },
      { label: 'Afternoon (2 PM - 5 PM)', startHour: 14, endHour: 17, sales: 0, orders: 0 },
      { label: 'Evening Peak (5 PM - 8 PM)', startHour: 17, endHour: 20, sales: 0, orders: 0 },
      { label: 'Night Shift (8 PM - 11:30 PM)', startHour: 20, endHour: 24, sales: 0, orders: 0 },
    ];

    filteredOrders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      const slot = slots.find(s => h >= s.startHour && h < s.endHour);
      if (slot) {
        slot.sales += o.total;
        slot.orders += 1;
      }
    });

    return slots;
  }, [filteredOrders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      
      {/* ═══ HEADER & STORE SHIFT BAR ═════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B2FC00]/10 border border-[#B2FC00]/30 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-[#B2FC00]" />
          </div>
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-black text-white tracking-wide">
              SALES & SHIFT REPORTS
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              View daily, monthly, yearly, and shift revenue performance with store check-in/out tracking.
            </p>
          </div>
        </div>

        {/* Store Check-In / Check-Out Shift Widget */}
        <div className="flex items-center gap-3 bg-[#0E0617] border border-white/10 p-2.5 rounded-xl">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Store Operations</span>
            <span className={`text-xs font-black flex items-center gap-1 ${isStoreOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isStoreOpen ? '● STORE OPEN (CHECKED IN)' : '● STORE CLOSED (CHECKED OUT)'}
            </span>
          </div>

          <button
            onClick={() => toggleStoreOpenStatus('Manager Portal')}
            className={`px-3.5 py-1.5 rounded-lg font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isStoreOpen
                ? 'bg-rose-950 text-rose-300 border border-rose-500/50 hover:bg-rose-900'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 animate-pulse'
            }`}
          >
            {isStoreOpen ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{isStoreOpen ? 'Check Out' : 'Check In'}</span>
          </button>
        </div>
      </div>

      {/* ═══ PERIOD FILTER CONTROLS (DAY / MONTH / YEAR / SHIFT) ═════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B2FC00]" />
            <h2 className="font-headline font-bold text-white text-base">
              Select Report Timeframe
            </h2>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-[#B2FC00]">{totalOrdersCount}</strong> orders for this period
          </span>
        </div>

        {/* Period Mode Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => setPeriodMode('DAY')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              periodMode === 'DAY'
                ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm'
                : 'bg-[#0E0617] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            📅 Specific Day
          </button>

          <button
            onClick={() => setPeriodMode('MONTH')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              periodMode === 'MONTH'
                ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm'
                : 'bg-[#0E0617] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            🗓️ Specific Month
          </button>

          <button
            onClick={() => setPeriodMode('YEAR')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              periodMode === 'YEAR'
                ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm'
                : 'bg-[#0E0617] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            📊 Specific Year
          </button>

          <button
            onClick={() => setPeriodMode('SHIFT')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              periodMode === 'SHIFT'
                ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm'
                : 'bg-[#0E0617] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            ⏱️ Current Shift
          </button>

          <button
            onClick={() => setPeriodMode('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              periodMode === 'ALL'
                ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm'
                : 'bg-[#0E0617] text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            🌐 All Time
          </button>
        </div>

        {/* Specific Date Picker Sub-Inputs */}
        <div className="pt-2 flex items-center gap-3">
          {periodMode === 'DAY' && (
            <div className="flex items-center gap-2 bg-[#0E0617] border border-white/10 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-bold">Select Date:</span>
              <input
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-transparent text-[#B2FC00] font-black focus:outline-none cursor-pointer"
              />
            </div>
          )}

          {periodMode === 'MONTH' && (
            <div className="flex items-center gap-2 bg-[#0E0617] border border-white/10 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-bold">Select Month:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-[#B2FC00] font-black focus:outline-none cursor-pointer"
              />
            </div>
          )}

          {periodMode === 'YEAR' && (
            <div className="flex items-center gap-2 bg-[#0E0617] border border-white/10 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-slate-400 font-bold">Select Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-[#B2FC00] font-black focus:outline-none cursor-pointer"
              >
                <option value="2026" className="bg-[#160A24] text-white">Year 2026</option>
                <option value="2025" className="bg-[#160A24] text-white">Year 2025</option>
                <option value="2024" className="bg-[#160A24] text-white">Year 2024</option>
              </select>
            </div>
          )}

          {periodMode === 'SHIFT' && (
            <div className="text-xs text-slate-300">
              Orders recorded since check-in at: <span className="text-[#B2FC00] font-bold">{checkInTime ? new Date(checkInTime).toLocaleTimeString('en-IN') : 'N/A'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══ KEY STATS METRICS CARDS ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Sales Revenue</span>
            <div className="p-2 rounded-lg bg-[#B2FC00]/10 text-[#B2FC00]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline text-3xl font-black text-[#B2FC00]">₹{totalSales}</p>
          <span className="text-[11px] text-slate-400 block font-medium">
            From {totalOrdersCount} total orders
          </span>
        </div>

        {/* Order Completion Rate */}
        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Completed Orders</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline text-3xl font-black text-white">{completedOrders}</p>
          <span className="text-[11px] text-slate-400 block font-medium">
            {cancelledOrders > 0 ? `${cancelledOrders} orders cancelled` : '0 cancellations'}
          </span>
        </div>

        {/* Avg Order Value */}
        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline text-3xl font-black text-white">₹{avgOrderValue}</p>
          <span className="text-[11px] text-slate-400 block font-medium">
            Average basket spend
          </span>
        </div>

        {/* Total Items Sold */}
        <div className="bg-[#160A24] border border-white/10 p-5 rounded-2xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Items Sold</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-headline text-3xl font-black text-[#B2FC00]">{totalItemsSold}</p>
          <span className="text-[11px] text-slate-400 block font-medium">
            Chicken boxes & mocktails
          </span>
        </div>
      </div>

      {/* ═══ PAYMENT METHOD DISTRIBUTION ═════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg">
        <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#B2FC00]" /> Payment Method Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['UPI', 'CASH', 'CARD', 'ONLINE'] as const).map(method => {
            const amount = paymentBreakdown[method] || 0;
            const pct = totalSales > 0 ? Math.round((amount / totalSales) * 100) : 0;

            return (
              <div key={method} className="bg-[#0E0617] border border-white/10 p-4 rounded-xl space-y-1">
                <span className="text-xs text-slate-400 font-bold">{method}</span>
                <p className="font-headline text-2xl font-black text-[#B2FC00]">₹{amount}</p>
                <span className="text-[10px] text-slate-300 font-semibold block">{pct}% of period revenue</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ BESTSELLING ITEMS TABLE FOR PERIOD ══════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#B2FC00]" /> Bestselling Food Items Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{itemRankings.length} items sold</span>
        </div>

        {itemRankings.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-xs italic">
            No items sold during selected timeframe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0E0617] text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Qty Sold</th>
                  <th className="py-2.5 px-3">Total Revenue</th>
                  <th className="py-2.5 px-3">% Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {itemRankings.slice(0, 8).map((item, idx) => {
                  const contrib = totalSales > 0 ? Math.round((item.revenue / totalSales) * 100) : 0;
                  return (
                    <tr key={item.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#B2FC00]">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                      <td className="py-2.5 px-3 font-extrabold">{item.qty} pcs</td>
                      <td className="py-2.5 px-3 font-black text-[#B2FC00]">₹{item.revenue}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-[#0E0617] h-2 rounded-full overflow-hidden border border-white/10">
                            <div className="bg-[#B2FC00] h-full" style={{ width: `${contrib}%` }} />
                          </div>
                          <span className="font-bold text-[10px]">{contrib}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══ HOURLY PEAK ORDER SLOTS ══════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg">
        <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Hourly Peak Time Performance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hourlyBreakdown.map(slot => (
            <div key={slot.label} className="bg-[#0E0617] border border-white/10 p-4 rounded-xl space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 block">{slot.label}</span>
              <p className="font-headline text-xl font-black text-[#B2FC00]">₹{slot.sales}</p>
              <span className="text-[10px] text-slate-400 font-semibold block">{slot.orders} orders processed</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SHIFT HISTORY LOG ═══════════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#B2FC00]" /> Store Shift History & Check-In Logs
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{shiftHistory.length} Shifts Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0E0617] text-slate-400 font-bold uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3">Shift #</th>
                <th className="py-2.5 px-3">Checked In (Opened)</th>
                <th className="py-2.5 px-3">Checked Out (Closed)</th>
                <th className="py-2.5 px-3">Shift Orders</th>
                <th className="py-2.5 px-3">Shift Revenue</th>
                <th className="py-2.5 px-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {shiftHistory.map((shift) => (
                <tr key={shift.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#B2FC00]">Shift #{shift.shiftNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {new Date(shift.openedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-300">
                    {shift.closedAt ? new Date(shift.closedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : <span className="text-emerald-400 font-extrabold">🟢 ACTIVE NOW</span>}
                  </td>
                  <td className="py-2.5 px-3 font-extrabold">{shift.ordersCount} orders</td>
                  <td className="py-2.5 px-3 font-black text-[#B2FC00]">₹{shift.totalRevenue}</td>
                  <td className="py-2.5 px-3 text-slate-400">{shift.openedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
