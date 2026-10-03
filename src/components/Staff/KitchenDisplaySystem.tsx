import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  History,
  X,
  Undo2,
  Flame,
  Info,
  ArrowRight,
  ShoppingBag,
  LogIn,
  LogOut,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ─── Constants & Urgency Thresholds ──────────────────────────────────────────
const LATE_THRESHOLD_MS  = 12 * 60 * 1000; // 12 min → red late alert
const UNDO_DURATION_MS   = 5_000;
const LONG_PRESS_MS      = 700;

export type OrderTypeFilter = 'ALL' | 'PICKUP' | 'DELIVERY' | 'DINE-IN';

// ─── Helpers ────────────────────────────────────────────────────────────────
function elapsedMs(iso: string): number {
  return Date.now() - new Date(iso).getTime();
}

function isAllergyNote(note: string): boolean {
  return /\bno\b|allergy|allergic|gluten|dairy|nut|vegan/i.test(note);
}

// Remove emojis and price tags (e.g. "+₹30", "🔥", "🥂", "🍟") for minimal kitchen clarity
function cleanItemText(str: string): string {
  return str
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s*\(\+?₹\d+\)/gi, '')
    .trim();
}

// Format pickup time string to short compact format (e.g. "ASAP", "7:45 PM") so it never overflows
function formatPickupTime(pickupTime: string): string {
  if (!pickupTime) return 'ASAP';
  if (/ASAP/i.test(pickupTime)) return 'ASAP';
  const match = pickupTime.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i);
  if (match) return match[0];
  return pickupTime.replace(/\(.*?\)/g, '').trim();
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-headline font-bold text-slate-300 text-sm tabular-nums">{time}</span>;
};

// Undo Toast Entry interface
interface UndoEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  prevStatus: OrderStatus;
  nextStatus: OrderStatus;
  expiry: number;
}

// ─── Compact Minimalist Order Card (Tap to reveal Overlay Action) ────────────
interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string, e: React.MouseEvent) => void;
  onAdvanceStatus: (orderId: string, nextStatus: OrderStatus, label: string) => void;
  onOpenDetails: (order: Order) => void;
  onCancelConfirm: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isSelected,
  onSelect,
  onAdvanceStatus,
  onOpenDetails,
  onCancelConfirm,
}) => {
  const elapsed = elapsedMs(order.createdAt);
  const isLate  = elapsed >= LATE_THRESHOLD_MS;
  const isCash  = order.paymentMethod === 'CASH' && order.paymentStatus !== 'PAID';
  const orderNum = order.orderNumber.replace('DT-', '');

  // Primary Action Button Mapping according to status
  let actionLabel = 'ADVANCE';
  let nextStatus: OrderStatus = 'PREPARING';
  let buttonColor = 'bg-[#B2FC00] text-[#0E0617] hover:bg-[#C4FF1A]';

  if (order.status === 'PLACED' || order.status === 'ACCEPTED') {
    actionLabel = 'START COOKING';
    nextStatus = 'PREPARING';
    buttonColor = 'bg-cyan-400 text-slate-950 hover:bg-cyan-300';
  } else if (order.status === 'PREPARING') {
    actionLabel = 'MARK READY';
    nextStatus = 'READY_FOR_PICKUP';
    buttonColor = 'bg-amber-400 text-slate-950 hover:bg-amber-300';
  } else if (order.status === 'READY_FOR_PICKUP') {
    actionLabel = 'HAND OVER';
    nextStatus = 'PICKED_UP';
    buttonColor = 'bg-[#B2FC00] text-[#0E0617] hover:bg-[#C4FF1A]';
  }

  // Long-press handler to cancel order
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => onCancelConfirm(order.id), LONG_PRESS_MS);
  };
  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Card Border Styling (Minimal, compact - NO PERMANENT BOTTOM BUTTON!)
  const borderClass = isSelected
    ? 'border-[#B2FC00] bg-[#1C0E2D] shadow-md ring-2 ring-[#B2FC00]/40'
    : isLate
    ? 'border-rose-500/80 bg-[#14050E]'
    : 'border-white/10 hover:border-white/20 bg-[#140B1F]';

  // Status Chip styling
  const statusChipClass =
    order.status === 'PLACED' || order.status === 'ACCEPTED'
      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
      : order.status === 'PREPARING'
      ? 'bg-amber-950 text-amber-300 border-amber-500/30'
      : order.status === 'READY_FOR_PICKUP'
      ? 'bg-[#1A2800] text-[#B2FC00] border-[#B2FC00]/30'
      : 'bg-purple-950 text-purple-300 border-purple-500/30';

  return (
    <div
      onClick={(e) => onSelect(order.id, e)}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
      className={`relative flex flex-col rounded-xl border ${borderClass} select-none overflow-hidden cursor-pointer transition-all duration-150`}
    >
      {/* ── HEADER ROW (Order # left, Short Target Time + LATE badge right) ── */}
      <div className="flex items-center justify-between gap-1.5 px-3 pt-2 pb-1.5 shrink-0 bg-[#0E0617]/40 border-b border-white/5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-headline font-black text-white text-xl tabular-nums leading-none">
            #{orderNum}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(order);
            }}
            className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all min-w-[26px] min-h-[26px] flex items-center justify-center shrink-0"
            title="Order details"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Target Time + simple LATE badge (Short format, zero overlap) */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{formatPickupTime(order.pickupTime)}</span>
          </span>

          {isLate && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-500/80 px-1.5 py-0.5 rounded shrink-0">
              LATE
            </span>
          )}
        </div>
      </div>

      {/* ── META ROW (Status chip + Tags) ── */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 flex-wrap shrink-0 border-b border-white/5">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 whitespace-nowrap ${statusChipClass}`}>
          {order.status.replace(/_/g, ' ')}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-[#221038] text-slate-300 border-white/10 shrink-0">
          {order.orderType}
        </span>

        {isCash && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-950 text-amber-300 border-amber-400/40 shrink-0">
            CASH COLLECT
          </span>
        )}
      </div>

      {/* ── ITEM LIST (Compact, Clean text, NO EMOJIS, NO PRICES) ── */}
      <div className="flex-1 px-3 py-2 space-y-1 max-h-[140px] overflow-y-auto">
        {order.items.map((item, idx) => {
          const isMultiple = item.quantity > 1;
          const cleanName = cleanItemText(item.name);
          return (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-start gap-1.5">
                <span
                  className={`shrink-0 font-extrabold rounded flex items-center justify-center min-w-[1.3rem] h-4.5 text-[11px] px-1 mt-0.5 ${
                    isMultiple
                      ? 'bg-[#B2FC00] text-[#0E0617]'
                      : 'bg-white/10 text-slate-200'
                  }`}
                >
                  {item.quantity}×
                </span>
                <span className="text-white font-bold text-xs leading-snug">
                  {cleanName}
                </span>
              </div>
              {item.addonsList && item.addonsList.length > 0 && (
                <ul className="pl-5 space-y-0">
                  {item.addonsList.map((addon, ai) => (
                    <li key={ai} className="text-slate-300 font-medium text-[11px]">
                      + {cleanItemText(addon)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* ── NOTES BLOCK (Minimal allergy warning) ── */}
      {order.notes && (
        <div className="px-3 pb-2 shrink-0">
          {isAllergyNote(order.notes) ? (
            <div className="bg-rose-950 border border-rose-500/80 text-rose-100 p-1.5 rounded text-[11px] font-bold uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
              <span>{cleanItemText(order.notes)}</span>
            </div>
          ) : (
            <div className="bg-amber-950/60 border border-amber-400/30 text-amber-200 p-1.5 rounded text-[11px] font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{cleanItemText(order.notes)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── ACTION OVERLAY LAYER (REVEALED WHEN USER CLICKS/TAPS THE ORDER) ── */}
      {isSelected && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-[#080412]/95 backdrop-blur-sm z-30 p-3 flex flex-col items-center justify-center gap-2 text-center"
        >
          <div className="flex items-center justify-between w-full pb-1 border-b border-white/10">
            <span className="font-headline font-black text-white text-base">#{orderNum}</span>
            <button
              onClick={(e) => onSelect('', e)}
              className="p-1 rounded bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdvanceStatus(order.id, nextStatus, actionLabel);
            }}
            className={`w-full font-headline font-black text-xs uppercase tracking-wider rounded-lg py-3 px-3 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg min-h-[44px] ${buttonColor}`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <span className="text-[10px] text-slate-400 font-medium">Tap button to update status</span>
        </div>
      )}
    </div>
  );
};

// ─── History Drawer Component ───────────────────────────────────────────────
interface HistoryDrawerProps { orders: Order[]; onClose: () => void }
const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ orders, onClose }) => {
  const done = orders.filter(o => o.status === 'COMPLETED' || o.status === 'PICKED_UP' || o.status === 'CANCELLED');
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal aria-label="Done today">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative bg-[#140B1F] border-l border-white/10 w-full max-w-md h-full overflow-y-auto p-4 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between sticky top-0 bg-[#140B1F] pb-3 border-b border-white/10 z-10">
          <h2 className="font-headline text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#B2FC00]" />
            Done Today ({done.length})
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white min-w-[40px] min-h-[40px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>
        {done.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No completed orders yet today.</p>
        ) : (
          done.map(o => (
            <div key={o.id} className="bg-[#0E0617] border border-white/8 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-headline font-black text-white text-lg">#{o.orderNumber.replace('DT-', '')}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${o.status === 'CANCELLED' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-[#1A2800] text-[#B2FC00] border border-[#B2FC00]/30'}`}>
                  {o.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-slate-300 text-xs">{o.customerName} · {o.items.length} items</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Order Detail Modal Component ───────────────────────────────────────────
interface DetailModalProps { order: Order; onClose: () => void; onCancelConfirm: (id: string) => void }
const DetailModal: React.FC<DetailModalProps> = ({ order, onClose, onCancelConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label="Order Details">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative bg-[#140B1F] border border-white/15 rounded-2xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl z-10 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-headline text-xl font-black text-white">Order #{order.orderNumber.replace('DT-', '')}</h3>
            <p className="text-xs text-slate-400">{order.customerName} · {order.customerPhone}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#0E0617] p-2.5 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-slate-500 block font-bold uppercase text-[10px]">Order Type</span>
            <span className="font-headline font-black text-white text-sm">{order.orderType}</span>
          </div>
          <div className="bg-[#0E0617] p-2.5 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-slate-500 block font-bold uppercase text-[10px]">Payment</span>
            <span className="font-headline font-black text-amber-300 text-sm">{order.paymentMethod} ({order.paymentStatus})</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Ordered Items</h4>
          <div className="space-y-1.5 bg-[#0E0617] p-3 rounded-xl border border-white/5">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
                <div>
                  <span className="font-black text-[#B2FC00] mr-2">{item.quantity}×</span>
                  <span className="font-bold text-white">{cleanItemText(item.name)}</span>
                  {item.addonsList && item.addonsList.length > 0 && (
                    <div className="text-[11px] text-slate-400 pl-5">+ {item.addonsList.map(cleanItemText).join(', ')}</div>
                  )}
                </div>
                <span className="font-headline font-bold text-slate-300">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>

        {order.notes && (
          <div className="bg-amber-950/60 border border-amber-400/30 p-2.5 rounded-xl text-xs text-amber-200 space-y-0.5">
            <span className="font-bold block uppercase text-[10px] text-amber-300">Special Instructions</span>
            <p>{cleanItemText(order.notes)}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onCancelConfirm(order.id);
            }}
            className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold py-2.5 rounded-xl text-xs transition-all"
          >
            Cancel Order
          </button>
          <button
            onClick={onClose}
            className="w-full bg-[#221038] hover:bg-[#31184f] text-white font-bold py-2.5 rounded-xl text-xs transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Cancel Confirmation Modal ───────────────────────────────────────────────
interface CancelModalProps { orderNumber: string; onConfirm: () => void; onCancel: () => void }
const CancelModal: React.FC<CancelModalProps> = ({ orderNumber, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-label="Cancel order">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} aria-hidden />
    <div className="relative bg-[#140B1F] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
      <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" aria-hidden />
      <div className="space-y-1">
        <h3 className="font-headline text-xl font-black text-white">Cancel Order?</h3>
        <p className="text-slate-300 text-xs">Order <strong className="text-white">#{orderNumber.replace('DT-', '')}</strong> will be marked as cancelled.</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 bg-[#221038] hover:bg-[#31184f] text-white font-bold rounded-xl py-3 text-xs min-h-[48px]">
          Keep Order
        </button>
        <button onClick={onConfirm} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl py-3 text-xs min-h-[48px]">
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Minimalist 3-Lane Kanban KDS Component ──────────────────────────────
export const KitchenDisplaySystem: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    isStoreOpen,
    toggleStoreOpenStatus,
    checkInTime,
    isKDSFullscreen,
    setIsKDSFullscreen
  } = useStore();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      setIsKDSFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      }
      setIsKDSFullscreen(false);
    }
  }, [setIsKDSFullscreen]);

  useEffect(() => {
    const handleFSChange = () => {
      setIsKDSFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, [setIsKDSFullscreen]);

  const [typeFilter, setTypeFilter]       = useState<OrderTypeFilter>('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [showHistory, setShowHistory]     = useState(false);
  const [cancelTarget, setCancelTarget]   = useState<string | null>(null);
  const [detailTarget, setDetailTarget]   = useState<Order | null>(null);
  const [lateAlertMuted, setLateAlertMuted] = useState(false);
  const [undoQueue, setUndoQueue]         = useState<UndoEntry[]>([]);

  // Advance order status with undo toast
  const handleAdvanceStatus = useCallback((orderId: string, nextStatus: OrderStatus, _label: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const prevStatus = order.status;

    const res = updateOrderStatus(orderId, nextStatus, 'KDS Operator');
    if (!res.success) return;

    const entry: UndoEntry = {
      id: `${orderId}-${Date.now()}`,
      orderId,
      orderNumber: order.orderNumber,
      prevStatus,
      nextStatus,
      expiry: Date.now() + UNDO_DURATION_MS,
    };
    setUndoQueue(q => [...q, entry]);
    setTimeout(() => setUndoQueue(q => q.filter(e => e.id !== entry.id)), UNDO_DURATION_MS);
    setSelectedOrderId('');
  }, [orders, updateOrderStatus]);

  // Undo status change
  const handleUndo = useCallback((entry: UndoEntry) => {
    updateOrderStatus(entry.orderId, entry.prevStatus, 'KDS Undo');
    setUndoQueue(q => q.filter(e => e.id !== entry.id));
  }, [updateOrderStatus]);

  // Active orders list
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'PICKED_UP' && o.status !== 'CANCELLED');
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return activeOrders.filter(o => {
      if (typeFilter !== 'ALL' && o.orderType.toUpperCase() !== typeFilter) return false;
      return true;
    });
  }, [activeOrders, typeFilter]);

  // Sorting helper: oldest or most late first
  const sortLaneOrders = (laneOrders: Order[]) => {
    return [...laneOrders].sort((a, b) => {
      const aLate = elapsedMs(a.createdAt) >= LATE_THRESHOLD_MS ? 1 : 0;
      const bLate = elapsedMs(b.createdAt) >= LATE_THRESHOLD_MS ? 1 : 0;
      if (aLate !== bLate) return bLate - aLate;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  };

  // 3 Lanes
  const newLaneOrders     = sortLaneOrders(filteredOrders.filter(o => o.status === 'PLACED' || o.status === 'ACCEPTED'));
  const cookingLaneOrders = sortLaneOrders(filteredOrders.filter(o => o.status === 'PREPARING'));
  const readyLaneOrders   = sortLaneOrders(filteredOrders.filter(o => o.status === 'READY_FOR_PICKUP'));

  const lateCount = activeOrders.filter(o => elapsedMs(o.createdAt) >= LATE_THRESHOLD_MS).length;
  const doneOrdersCount = orders.filter(o => o.status === 'COMPLETED' || o.status === 'PICKED_UP' || o.status === 'CANCELLED').length;

  return (
    <div
      onClick={() => setSelectedOrderId('')}
      className="flex flex-col h-screen bg-[#080412] overflow-hidden font-body text-slate-100 select-none"
    >
      
      {/* ═══ 1. SLIM TOP BAR ══════════════════════════════════════════════════ */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 bg-[#0E0617] border-b border-white/10 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5 shadow-sm z-30"
      >
        {/* Left: Brand + Live Clock */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#B2FC00] flex items-center justify-center shrink-0">
            <ChefHat className="w-4 h-4 text-[#0E0617]" />
          </div>
          <div>
            <span className="font-headline font-black text-white text-sm leading-none block">DING TING KDS</span>
            <span className="text-slate-500 text-[10px]">Kitchen Operations</span>
          </div>
          <div className="hidden sm:block ml-2 pl-2.5 border-l border-white/10">
            <LiveClock />
          </div>
        </div>

        {/* Center: Lane Order Counts Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <span>NEW: {newLaneOrders.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <span>COOKING: {cookingLaneOrders.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#1A2800] border border-[#B2FC00]/30 text-[#B2FC00] text-xs font-bold">
            <span>READY: {readyLaneOrders.length}</span>
          </div>

          {lateCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-950 border border-rose-500/80 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>LATE: {lateCount}</span>
              <button
                onClick={() => setLateAlertMuted(m => !m)}
                className="ml-1 underline text-[10px] text-rose-200"
              >
                {lateAlertMuted ? 'unmute' : 'mute'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Type Filter + Controls */}
        <div className="flex items-center gap-2">
          {/* Order Type Filter */}
          <div className="hidden md:flex items-center gap-1 bg-[#140B1F] border border-white/10 rounded-lg p-1">
            {(['ALL', 'PICKUP', 'DELIVERY', 'DINE-IN'] as const).map(flt => (
              <button
                key={flt}
                onClick={() => setTypeFilter(flt)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === flt
                    ? 'bg-[#221038] text-[#B2FC00] border border-[#B2FC00]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {flt}
              </button>
            ))}
          </div>

          {/* Store Check-In / Check-Out Button */}
          <button
            onClick={() => toggleStoreOpenStatus('KDS Staff')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-extrabold text-xs transition-all min-h-[34px] cursor-pointer shadow-md active:scale-95 ${
              isStoreOpen
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/60'
                : 'bg-rose-950 text-rose-300 border-rose-500 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/60 animate-pulse'
            }`}
            title={isStoreOpen ? `Store OPEN since ${checkInTime ? new Date(checkInTime).toLocaleTimeString('en-IN') : 'Check-In'}. Click to Check-Out & Close Store` : 'Store is Currently CLOSED. Click to Check-In & Open Store'}
          >
            {isStoreOpen ? <LogOut className="w-3.5 h-3.5 text-emerald-400" /> : <LogIn className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isStoreOpen ? 'STORE OPEN (Check Out)' : 'STORE CLOSED (Check In)'}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#140B1F] border border-white/10 text-slate-200 hover:text-white font-bold text-xs transition-all min-h-[34px] cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#B2FC00]" />
            <span className="hidden sm:inline">Done</span>
            <span className="bg-[#B2FC00] text-[#0E0617] text-[11px] font-black px-1.5 py-0.2 rounded">{doneOrdersCount}</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-extrabold text-xs transition-all min-h-[34px] cursor-pointer shadow-md active:scale-95 ${
              isKDSFullscreen
                ? 'bg-[#B2FC00] text-[#0E0617] border-[#B2FC00] hover:bg-[#c3ff33]'
                : 'bg-[#140B1F] text-slate-200 border-white/10 hover:border-white/30 hover:text-white'
            }`}
            title={isKDSFullscreen ? "Exit Fullscreen Mode" : "Enter Fullscreen Mode (Fits maximum orders on screen)"}
          >
            {isKDSFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isKDSFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* ═══ 2. KANBAN BOARD (3 LANES: NEW → COOKING → READY) ════════════════ */}
      <main className="flex-1 min-h-0 flex gap-2.5 p-2.5 overflow-hidden">
        
        {/* ── LANE 1: NEW ── */}
        <section className="flex-1 min-w-0 flex flex-col bg-[#0E0617] border-t-2 border-cyan-400 border-x border-b border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8 bg-[#0E0617] shrink-0">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
              <h2 className="font-headline font-black text-white tracking-wider uppercase text-xs">NEW</h2>
            </div>
            <span className="font-headline font-bold text-xs px-2 py-0.5 rounded border bg-cyan-950 text-cyan-300 border-cyan-500/30">
              {newLaneOrders.length}
            </span>
          </div>

          <div className={`flex-1 overflow-y-auto min-h-0 p-2 ${
            isKDSFullscreen || newLaneOrders.length > 2
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 content-start'
              : 'flex flex-col gap-2'
          }`}>
            {newLaneOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs font-medium italic">
                No new orders
              </div>
            ) : (
              newLaneOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    setSelectedOrderId(prev => prev === id ? '' : id);
                  }}
                  onAdvanceStatus={handleAdvanceStatus}
                  onOpenDetails={(ord) => setDetailTarget(ord)}
                  onCancelConfirm={(id) => setCancelTarget(id)}
                />
              ))
            )}
          </div>
        </section>

        {/* ── LANE 2: COOKING ── */}
        <section className="flex-1 min-w-0 flex flex-col bg-[#0E0617] border-t-2 border-amber-400 border-x border-b border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8 bg-[#0E0617] shrink-0">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="font-headline font-black text-white tracking-wider uppercase text-xs">COOKING</h2>
            </div>
            <span className="font-headline font-bold text-xs px-2 py-0.5 rounded border bg-amber-950 text-amber-300 border-amber-500/30">
              {cookingLaneOrders.length}
            </span>
          </div>

          <div className={`flex-1 overflow-y-auto min-h-0 p-2 ${
            isKDSFullscreen || cookingLaneOrders.length > 2
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 content-start'
              : 'flex flex-col gap-2'
          }`}>
            {cookingLaneOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs font-medium italic">
                Nothing cooking
              </div>
            ) : (
              cookingLaneOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    setSelectedOrderId(prev => prev === id ? '' : id);
                  }}
                  onAdvanceStatus={handleAdvanceStatus}
                  onOpenDetails={(ord) => setDetailTarget(ord)}
                  onCancelConfirm={(id) => setCancelTarget(id)}
                />
              ))
            )}
          </div>
        </section>

        {/* ── LANE 3: READY ── */}
        <section className="flex-1 min-w-0 flex flex-col bg-[#0E0617] border-t-2 border-[#B2FC00] border-x border-b border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/8 bg-[#0E0617] shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B2FC00]" />
              <h2 className="font-headline font-black text-white tracking-wider uppercase text-xs">READY</h2>
            </div>
            <span className="font-headline font-bold text-xs px-2 py-0.5 rounded border bg-[#1A2800] text-[#B2FC00] border-[#B2FC00]/30">
              {readyLaneOrders.length}
            </span>
          </div>

          <div className={`flex-1 overflow-y-auto min-h-0 p-2 ${
            isKDSFullscreen || readyLaneOrders.length > 2
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 content-start'
              : 'flex flex-col gap-2'
          }`}>
            {readyLaneOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs font-medium italic">
                Nothing ready yet
              </div>
            ) : (
              readyLaneOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    setSelectedOrderId(prev => prev === id ? '' : id);
                  }}
                  onAdvanceStatus={handleAdvanceStatus}
                  onOpenDetails={(ord) => setDetailTarget(ord)}
                  onCancelConfirm={(id) => setCancelTarget(id)}
                />
              ))
            )}
          </div>
        </section>

      </main>

      {/* ═══ 3. UNDO TOAST STACK ═════════════════════════════════════════════ */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {undoQueue.map(entry => (
          <div
            key={entry.id}
            className="pointer-events-auto flex items-center gap-3 bg-[#1D0C30] border border-[#B2FC00]/50 text-white rounded-xl px-3.5 py-2.5 shadow-2xl"
          >
            <Undo2 className="w-4 h-4 text-[#B2FC00] shrink-0" />
            <span className="text-xs font-bold">
              Order #{entry.orderNumber.replace('DT-', '')} updated to {entry.nextStatus.replace(/_/g, ' ')}
            </span>
            <button
              onClick={() => handleUndo(entry)}
              className="bg-[#B2FC00] text-[#0E0617] font-black text-xs px-2.5 py-1 rounded-lg hover:bg-[#C4FF1A] transition-all cursor-pointer min-h-[32px]"
            >
              UNDO
            </button>
          </div>
        ))}
      </div>

      {/* ═══ 4. HISTORY DRAWER ═══════════════════════════════════════════════ */}
      {showHistory && <HistoryDrawer orders={orders} onClose={() => setShowHistory(false)} />}

      {/* ═══ 5. DETAIL MODAL ═════════════════════════════════════════════════ */}
      {detailTarget && (
        <DetailModal
          order={detailTarget}
          onClose={() => setDetailTarget(null)}
          onCancelConfirm={(id) => setCancelTarget(id)}
        />
      )}

      {/* ═══ 6. CANCEL MODAL ═════════════════════════════════════════════════ */}
      {cancelTarget && (
        <CancelModal
          orderNumber={orders.find(o => o.id === cancelTarget)?.orderNumber ?? ''}
          onConfirm={() => {
            if (cancelTarget) {
              updateOrderStatus(cancelTarget, 'CANCELLED', 'KDS Operator');
              setCancelTarget(null);
            }
          }}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
};
