import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { STORE_INFO } from '../../data/mockData';
import { playBoingSound, playSizzleSound, playVictorySound } from '../../utils/audioFX';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  ShoppingBag, 
  QrCode, 
  ChefHat, 
  Store, 
  MapPin, 
  ArrowRight,
  MessageCircleQuestion
} from 'lucide-react';

const CHEF_SHOUTS = [
  "Chef Shouts: 'Broaster pressure at 500 PSI! Crunch level guaranteed 1000%!' ⚡",
  "Chef Shouts: 'Extra garlic sauce packed with 200% love!' 🧄",
  "Chef Shouts: 'Frying skin to maximum golden crispiness right now!' 🍗",
  "Chef Shouts: 'French fries tossed in signature spice magic!' 🍟",
  "Chef Shouts: 'Khuboos warm & soft, ready for the ultimate wrap!' 🌯",
];

export const OrderTracker: React.FC = () => {
  const { orders, activeOrderId, setActiveOrderId, updateOrderStatus, setCustomerTab, soundEnabled } = useStore();
  const [chefPopIndex, setChefPopIndex] = useState<number | null>(null);
  const [isWobblingMascot, setIsWobblingMascot] = useState(false);

  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl animate-bounce">🍗</div>
        <h2 className="font-headline text-2xl font-bold text-white">No Active Pickup Orders</h2>
        <p className="text-xs text-gray-400">Place an order from the menu to track live kitchen preparation.</p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="bg-[#B2FC00] text-[#0D0218] px-6 py-2.5 rounded-xl font-black text-xs shadow hover:animate-wiggle"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode; funnyEmoji: string }[] = [
    {
      status: 'PLACED',
      label: 'Order Placed',
      desc: 'Ticket printed at Ding Ting counter',
      icon: <ShoppingBag className="w-4 h-4" />,
      funnyEmoji: '🎟️'
    },
    {
      status: 'ACCEPTED',
      label: 'Kitchen Confirmed',
      desc: 'Chef accepted ticket with a grin',
      icon: <ChefHat className="w-4 h-4" />,
      funnyEmoji: '👨‍🍳'
    },
    {
      status: 'PREPARING',
      label: 'Pressure Broasting',
      desc: 'Crispy skin & juicy chicken sizzling at 500 PSI',
      icon: <Flame className="w-4 h-4 text-[#FF2E4C]" />,
      funnyEmoji: '🍗💨'
    },
    {
      status: 'READY_FOR_PICKUP',
      label: 'Ready for Pickup!',
      desc: 'Hot & packaged at store counter!',
      icon: <Store className="w-4 h-4 text-[#B2FC00]" />,
      funnyEmoji: '📦🥳'
    },
    {
      status: 'COMPLETED',
      label: 'Picked Up',
      desc: 'Thank you for munching! Food coma time!',
      icon: <CheckCircle2 className="w-4 h-4" />,
      funnyEmoji: '😴👑'
    }
  ];

  const getStepState = (stepStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentOrder.status === 'CANCELLED') return 'cancelled';
    if (currentIndex > stepIndex || currentOrder.status === 'COMPLETED') return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
    PLACED: 'ACCEPTED',
    ACCEPTED: 'PREPARING',
    PREPARING: 'READY_FOR_PICKUP',
    READY_FOR_PICKUP: 'PICKED_UP',
    PICKED_UP: 'COMPLETED'
  };

  const handleSimulateNext = () => {
    const next = nextStatusMap[currentOrder.status];
    if (next) {
      if (soundEnabled) {
        if (next === 'PREPARING') playSizzleSound();
        else if (next === 'READY_FOR_PICKUP' || next === 'COMPLETED') playVictorySound();
        else playBoingSound();
      }
      updateOrderStatus(currentOrder.id, next, 'Simulated Action');
    }
  };

  const handlePokeChef = () => {
    setIsWobblingMascot(true);
    setTimeout(() => setIsWobblingMascot(false), 600);
    if (soundEnabled) playBoingSound();
    const nextIndex = Math.floor(Math.random() * CHEF_SHOUTS.length);
    setChefPopIndex(nextIndex);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#B2FC00] text-[#0E0617] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                PICKUP ORDER #{currentOrder.orderNumber}
              </span>
              <span className="bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {currentOrder.orderType}
              </span>
            </div>

            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              {currentOrder.status === 'READY_FOR_PICKUP' ? (
                <span className="text-[#B2FC00]">🎉 YOUR ORDER IS READY AT COUNTER!</span>
              ) : currentOrder.status === 'COMPLETED' ? (
                <span className="text-emerald-400">✅ ORDER PICKED UP & COMPLETED</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Preparing Your Broasted Order</span>
                  <span className="animate-pulse text-lg">⏳</span>
                </span>
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B2FC00]" />
              Pickup Location: {STORE_INFO.address}
            </p>
          </div>

          {/* Pickup QR Badge */}
          <div className="bg-[#0E0617] border border-white/10 p-3 rounded-xl text-center shrink-0">
            <div className="w-18 h-18 bg-white p-1 rounded-lg mx-auto flex items-center justify-center shadow-sm">
              <QrCode className="w-14 h-14 text-black" />
            </div>
            <span className="text-[10px] font-bold text-[#B2FC00] block mt-1">
              Show at Counter
            </span>
          </div>
        </div>

        {/* Live Simulation Controls & Poke Chef Button */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Target Pickup Time: <strong className="text-white">{currentOrder.pickupTime}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePokeChef}
              className={`bg-[#271240] hover:bg-[#341857] text-[#B2FC00] border border-[#B2FC00]/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all active:scale-[0.98] ${isWobblingMascot ? 'animate-wiggle' : ''}`}
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" /> Poke Kitchen Chef 👨‍🍳
            </button>

            {currentOrder.status !== 'COMPLETED' && currentOrder.status !== 'CANCELLED' && (
              <button
                onClick={handleSimulateNext}
                className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1 transition-all active:scale-[0.98] shadow-sm"
              >
                Next Status: <span className="underline">{nextStatusMap[currentOrder.status]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chef Shout Popup */}
        {chefPopIndex !== null && (
          <div className="mt-3 bg-[#B2FC00] text-[#0E0617] p-3 rounded-xl font-headline font-black text-xs shadow-md border border-[#0E0617] flex items-center justify-between">
            <span>{CHEF_SHOUTS[chefPopIndex]}</span>
            <button 
              onClick={() => setChefPopIndex(null)}
              className="text-xs bg-[#0E0617] text-[#B2FC00] px-2 py-0.5 rounded font-bold"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* State Machine Stepper Progress Bar */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-6">
        <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
          <span>Live Order Status Progress</span>
          <span className="text-sm">🔥</span>
        </h3>

        <div className="relative space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {steps.map((step, idx) => {
            const state = getStepState(step.status);
            
            let bulletStyle = 'bg-[#0E0617] border-slate-700 text-slate-500';
            let titleStyle = 'text-slate-400';
            
            if (state === 'completed') {
              bulletStyle = 'bg-[#B2FC00] border-[#B2FC00] text-[#0E0617] shadow-sm';
              titleStyle = 'text-white font-bold';
            } else if (state === 'current') {
              bulletStyle = 'bg-[#FF2E4C] border-[#FF2E4C] text-white animate-pulse shadow-sm';
              titleStyle = 'text-[#B2FC00] font-black text-base';
            }

            return (
              <div key={idx} className="relative flex items-start gap-4 z-10 group">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${bulletStyle}`}>
                  {step.icon}
                </div>

                <div className="pt-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-headline ${titleStyle} flex items-center gap-2`}>
                      <span>{step.label}</span>
                      {state === 'current' && (
                        <span className="bg-[#FF2E4C] text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                          IN PROGRESS
                        </span>
                      )}
                    </h4>
                    <span className="text-base opacity-80">
                      {step.funnyEmoji}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Itemized Receipt */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-headline text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Order Summary & Payment</span>
          <span className="text-xs text-[#B2FC00] font-normal">Stored in session</span>
        </h3>

        <div className="space-y-2.5">
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs text-slate-300">
              <div>
                <span className="font-bold text-white">{item.quantity}× {item.name}</span>
                {item.addonsList && item.addonsList.length > 0 && (
                  <span className="block text-[11px] text-slate-400">
                    + {item.addonsList.join(', ')}
                  </span>
                )}
              </div>
              <span className="font-bold text-[#B2FC00]">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Payment Method: <strong className="text-white">{currentOrder.paymentMethod}</strong></span>
            <span>Status: <strong className="text-emerald-400">{currentOrder.paymentStatus}</strong></span>
          </div>
          <div className="flex justify-between text-base font-black text-white pt-2">
            <span>Total Paid</span>
            <span className="text-[#B2FC00]">₹{currentOrder.total}</span>
          </div>
        </div>
      </div>

      {/* Switch between orders dropdown */}
      {orders.length > 1 && (
        <div className="text-center pt-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Switch Active Order:</span>
          <select
            value={currentOrder.id}
            onChange={e => setActiveOrderId(e.target.value)}
            className="bg-[#160A24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B2FC00]"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                #{o.orderNumber} - {o.customerName} (₹{o.total})
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
};
