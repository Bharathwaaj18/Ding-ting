import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { STORE_INFO, STATUS_IMAGE_MAP } from '../../data/mockData';
import { 
  playBoingSound, 
  playOrderAcceptedSound, 
  playOrderPreparingSound, 
  playOrderReadySound 
} from '../../utils/audioFX';
import {
  Clock,
  Flame,
  ShoppingBag,
  QrCode,
  ChefHat,
  Store,
  MapPin,
  ArrowRight,
  MessageCircleQuestion,
  Eye,
  X,
  Phone,
  Star,
  Check,
} from 'lucide-react';

// ─── constants ────────────────────────────────────────────────────────────────
const CHEF_SHOUTS = [
  "Chef Shouts: 'Broaster pressure at 500 PSI! Crunch level guaranteed 1000%!' ⚡",
  "Chef Shouts: 'Extra garlic sauce packed with 200% love!' 🧄",
  "Chef Shouts: 'Frying skin to maximum golden crispiness right now!' 🍗",
  "Chef Shouts: 'French fries tossed in signature spice magic!' 🍟",
  "Chef Shouts: 'Khuboos warm & soft, ready for the ultimate wrap!' 🌯",
];

const CONFETTI_COLORS = [
  '#B2FC00', '#FFB703', '#00E5FF', '#FF2E4C',
  '#C4FF1A', '#fff', '#A78BFA', '#FB923C',
];

// ─── Confetti burst (pure CSS + inline style, no library) ────────────────────
const ConfettiBurst: React.FC = () => {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden>
      {pieces.map((i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const left = `${Math.random() * 100}%`;
        const delay = `${(Math.random() * 0.5).toFixed(2)}s`;
        const size = `${6 + Math.floor(Math.random() * 8)}px`;
        const shape = i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0%';
        return (
          <span
            key={i}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left,
              animationDelay: delay,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: shape,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Step definition type ─────────────────────────────────────────────────────
interface TimelineStep {
  status: OrderStatus;
  label: string;
  desc: string;
  nextHint: string;
  icon: React.ReactNode;
  image: string;
}

// ─── Timeline step icons (neutral, no red) ───────────────────────────────────
const stepIconNode = (status: OrderStatus, state: 'completed' | 'current' | 'upcoming') => {
  const iconClass = state === 'completed'
    ? 'text-[#0E0617]'
    : state === 'current'
    ? 'text-[#B2FC00]'
    : 'text-slate-500';

  const icons: Record<string, React.ReactNode> = {
    PLACED:          <ShoppingBag className={`w-4 h-4 ${iconClass}`} />,
    ACCEPTED:        <ChefHat     className={`w-4 h-4 ${iconClass}`} />,
    PREPARING:       <Flame       className={`w-4 h-4 ${iconClass}`} />,
    READY_FOR_PICKUP:<Store       className={`w-4 h-4 ${iconClass}`} />,
    COMPLETED:       <Check       className={`w-4 h-4 ${iconClass}`} />,
  };
  return icons[status] ?? <ShoppingBag className={`w-4 h-4 ${iconClass}`} />;
};

// ─── Main component ───────────────────────────────────────────────────────────
export const OrderTracker: React.FC = () => {
  const { orders, activeOrderId, setActiveOrderId, updateOrderStatus, setCustomerTab, soundEnabled } = useStore();
  const [chefPopIndex, setChefPopIndex]     = useState<number | null>(null);
  const [isWobblingMascot, setIsWobblingMascot] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<{ src: string; title: string } | null>(null);
  const [animatingStep, setAnimatingStep]   = useState<OrderStatus | null>(null);
  const [ratingGiven, setRatingGiven]       = useState<number>(0);
  const prevStatusRef = useRef<OrderStatus | null>(null);

  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  // Detect status change → trigger step animation & status sounds
  useEffect(() => {
    if (!currentOrder) return;
    if (prevStatusRef.current !== null && prevStatusRef.current !== currentOrder.status) {
      setAnimatingStep(currentOrder.status);
      setTimeout(() => setAnimatingStep(null), 600);

      // Status Update Sound Effects
      if (soundEnabled) {
        if (currentOrder.status === 'ACCEPTED') {
          playOrderAcceptedSound();
        } else if (currentOrder.status === 'PREPARING') {
          playOrderPreparingSound();
        } else if (currentOrder.status === 'READY_FOR_PICKUP') {
          playOrderReadySound();
        }
      }
    }
    prevStatusRef.current = currentOrder.status;
  }, [currentOrder?.status, soundEnabled]);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-6xl animate-bounce">🍗</div>
        <h2 className="font-headline text-2xl font-bold text-white">No Active Pickup Orders</h2>
        <p className="text-xs text-gray-400">Place an order from the menu to track live kitchen preparation.</p>
        <button
          onClick={() => setCustomerTab('menu')}
          className="bg-[#B2FC00] text-[#0D0218] px-6 py-2.5 rounded-xl font-black text-xs shadow hover:scale-105 transition-transform"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const activeStatusData = STATUS_IMAGE_MAP[currentOrder.status] || STATUS_IMAGE_MAP.PLACED;

  // ── Timeline step definitions ────────────────────────────────────────────────
  const steps: TimelineStep[] = [
    {
      status: 'PLACED',
      label: 'Order Placed',
      desc: 'Ticket printed at Ding Ting counter',
      nextHint: 'Next: Kitchen will confirm your ticket',
      icon: null,
      image: STATUS_IMAGE_MAP.PLACED.image,
    },
    {
      status: 'ACCEPTED',
      label: 'Kitchen Confirmed',
      desc: 'Chef accepted ticket with a grin',
      nextHint: 'Next: Your chicken is hitting the broaster',
      icon: null,
      image: STATUS_IMAGE_MAP.ACCEPTED.image,
    },
    {
      status: 'PREPARING',
      label: 'Pressure Broasting',
      desc: 'Crispy skin & juicy chicken sizzling at 500 PSI',
      nextHint: 'Next: Your order will be ready at the counter',
      icon: null,
      image: STATUS_IMAGE_MAP.PREPARING.image,
    },
    {
      status: 'READY_FOR_PICKUP',
      label: 'Ready for Pickup',
      desc: 'Hot & packaged — waiting at the Ding Ting counter!',
      nextHint: 'Next: Pick up your order at the counter',
      icon: null,
      image: STATUS_IMAGE_MAP.READY_FOR_PICKUP.image,
    },
    {
      status: 'COMPLETED',
      label: 'Picked Up',
      desc: 'Thank you for munching! Food coma time!',
      nextHint: '',
      icon: null,
      image: STATUS_IMAGE_MAP.COMPLETED.image,
    },
  ];

  // ── Status ordering ──────────────────────────────────────────────────────────
  const STATUS_ORDER: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'COMPLETED'];
  const currentIndex = STATUS_ORDER.indexOf(currentOrder.status);

  const getStepState = (stepStatus: OrderStatus): 'completed' | 'current' | 'upcoming' | 'cancelled' => {
    if (currentOrder.status === 'CANCELLED') return 'cancelled';
    const stepIdx = STATUS_ORDER.indexOf(stepStatus);
    if (currentOrder.status === 'COMPLETED') return stepStatus === 'COMPLETED' ? 'current' : 'completed';
    if (currentIndex > stepIdx) return 'completed';
    if (currentIndex === stepIdx) return 'current';
    return 'upcoming';
  };

  // ── Step counter (1-based, maps to display index 1–5) ───────────────────────
  const displayStepNum = Math.min(currentIndex + 1, steps.length);

  // ── Progress bar width ───────────────────────────────────────────────────────
  const progressPct = Math.round(((displayStepNum - 1) / (steps.length - 1)) * 100);

  // ── Simulate next ────────────────────────────────────────────────────────────
  const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
    PLACED:          'ACCEPTED',
    ACCEPTED:        'PREPARING',
    PREPARING:       'READY_FOR_PICKUP',
    READY_FOR_PICKUP:'PICKED_UP',
    PICKED_UP:       'COMPLETED',
  };

  const handleSimulateNext = () => {
    const next = nextStatusMap[currentOrder.status];
    if (next) {
      updateOrderStatus(currentOrder.id, next, 'Simulated Action');
    }
  };

  const handlePokeChef = () => {
    setIsWobblingMascot(true);
    setTimeout(() => setIsWobblingMascot(false), 600);
    if (soundEnabled) playBoingSound();
    setChefPopIndex(Math.floor(Math.random() * CHEF_SHOUTS.length));
  };

  const isCompleted = currentOrder.status === 'COMPLETED';

  // ── Get timestamp for a completed step from history ──────────────────────────
  const getStepTimestamp = (stepStatus: OrderStatus): string | null => {
    const mapped: Partial<Record<OrderStatus, OrderStatus>> = {
      PLACED:          'PLACED',
      ACCEPTED:        'ACCEPTED',
      PREPARING:       'PREPARING',
      READY_FOR_PICKUP:'READY_FOR_PICKUP',
      COMPLETED:       'COMPLETED',
    };
    const entry = currentOrder.statusHistory?.find(h => h.newStatus === mapped[stepStatus]);
    if (!entry) return null;
    try {
      return new Date(entry.changedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* ── Dynamic Status Image Hero Visual (unchanged) ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#160A24] border border-white/10 p-2 shadow-2xl group">
        <div className="relative h-48 sm:h-64 w-full rounded-xl overflow-hidden">
          <img
            src={activeStatusData.image}
            alt={activeStatusData.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0617] via-[#0E0617]/50 to-transparent flex flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <span className="bg-[#0E0617]/80 backdrop-blur-md text-[#B2FC00] border border-[#B2FC00]/30 text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider shadow">
                LIVE STATUS: {currentOrder.status.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() => setSelectedImagePreview({ src: activeStatusData.image, title: activeStatusData.title })}
                className="bg-[#0E0617]/80 hover:bg-[#0E0617] text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 border border-white/20"
                aria-label="View full status image"
              >
                <Eye className="w-4 h-4 text-[#B2FC00]" />
                <span className="hidden sm:inline">View Image</span>
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded inline-block">
                ORDER #{currentOrder.orderNumber}
              </span>
              <h2 className="font-headline text-xl sm:text-3xl font-black text-white drop-shadow-md">
                {activeStatusData.title}
              </h2>
              <p className="text-xs text-slate-200 font-medium drop-shadow-sm">
                {activeStatusData.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Header Details Card (unchanged) ── */}
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
                <span className="text-emerald-400">✅ ORDER PICKED UP &amp; COMPLETED</span>
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

            {/* Step counter + progress bar — lives inside summary card */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Step <span className="text-white font-bold">{displayStepNum}</span> of {steps.length}
                </span>
                <span className="text-[#B2FC00] font-bold">{progressPct}% complete</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded-full bg-[#B2FC00] transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ETA: <strong className="text-white">{currentOrder.pickupTime}</strong>
              </p>
            </div>
          </div>

          {/* Pickup QR Badge */}
          <div className="bg-[#0E0617] border border-white/10 p-3 rounded-xl text-center shrink-0">
            <div className="w-18 h-18 bg-white p-1 rounded-lg mx-auto flex items-center justify-center shadow-sm">
              <QrCode className="w-14 h-14 text-black" />
            </div>
            <span className="text-[10px] font-bold text-[#B2FC00] block mt-1">Show at Counter</span>
          </div>
        </div>

        {/* Simulation + Poke Chef Controls */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePokeChef}
              className={`bg-[#271240] hover:bg-[#341857] text-[#B2FC00] border border-[#B2FC00]/30 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all min-h-[44px] ${isWobblingMascot ? 'animate-wiggle' : ''}`}
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" /> Poke Kitchen Chef 👨‍🍳
            </button>
            {!isCompleted && currentOrder.status !== 'CANCELLED' && (
              <button
                onClick={handleSimulateNext}
                className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-3 py-2 rounded-xl font-extrabold flex items-center gap-1 transition-all min-h-[44px]"
              >
                Simulate Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chef Shout */}
        {chefPopIndex !== null && (
          <div className="mt-2 bg-[#B2FC00] text-[#0E0617] p-3 rounded-xl font-headline font-black text-xs shadow-md border border-[#0E0617] flex items-center justify-between">
            <span>{CHEF_SHOUTS[chefPopIndex]}</span>
            <button onClick={() => setChefPopIndex(null)} className="bg-[#0E0617] text-[#B2FC00] px-2 py-0.5 rounded font-bold ml-2 shrink-0">OK</button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          REDESIGNED TIMELINE
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
        {/* Timeline header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/8">
          <h3 className="font-headline text-base font-bold text-white">Live Kitchen Progress</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Updates in real-time as your order moves through the kitchen.</p>
        </div>

        {/* Completed end-state celebratory banner */}
        {isCompleted && (
          <div className="relative mx-4 mt-4 bg-gradient-to-r from-[#1A2800] to-[#0F1F00] border border-[#B2FC00]/40 rounded-xl p-5 overflow-hidden">
            <ConfettiBurst />
            <div className="relative z-10 text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h4 className="font-headline text-xl font-black text-[#B2FC00]">Order Complete! Food coma incoming.</h4>
              <p className="text-xs text-slate-300">Hope every bite was worth the crunch. See you next time!</p>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-medium">Rate your Ding Ting meal:</p>
                <div className="flex items-center justify-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRatingGiven(n)}
                      className={`transition-all hover:scale-110 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl ${
                        n <= ratingGiven ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'
                      }`}
                      aria-label={`Rate ${n} stars`}
                    >
                      <Star className={`w-6 h-6 ${n <= ratingGiven ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
                {ratingGiven > 0 && (
                  <p className="text-xs text-[#B2FC00] font-bold animate-fade-slide-up">
                    {ratingGiven === 5 ? 'Legendary! 🏆' : ratingGiven >= 4 ? 'Thanks a ton! 🍗' : 'We\'ll keep improving!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <ol className="relative px-4 pt-4 pb-2 space-y-0" aria-label="Order progress steps">
          {steps.map((step, idx) => {
            const state = getStepState(step.status);
            const isLast = idx === steps.length - 1;
            const isCurrent = state === 'current';
            const isDone = state === 'completed';
            const isUpcoming = state === 'upcoming' || state === 'cancelled';
            const isAnimating = animatingStep === step.status;

            // ── Resolved icon with correct colour ──────────────────────────
            const resolvedIcon = stepIconNode(step.status, state as 'completed' | 'current' | 'upcoming');

            // ── Connector colour: lime solid between done pairs, dashed-dim for rest ─
            const connectorFilled = isDone; // connector below this step is filled

            // ── Timestamp from history ──────────────────────────────────────
            const timestamp = (isDone || isCurrent) ? getStepTimestamp(step.status) : null;

            // ── Next hint: show only on the step immediately after current ──
            const nextStepAfterCurrent = steps[steps.findIndex(s => s.status === currentOrder.status) + 1];
            const showNextHint = isUpcoming && step === nextStepAfterCurrent;

            return (
              <li key={step.status} className="relative flex gap-4">
                {/* ── Connector track ─────────────────────────────────────── */}
                {!isLast && (
                  <div className="absolute left-[18px] top-9 bottom-0 w-0.5 z-0" aria-hidden>
                    {/* Base dim track */}
                    <div className="absolute inset-0 bg-white/10" />
                    {/* Filled lime portion */}
                    {connectorFilled && (
                      <div className="absolute inset-0 bg-[#B2FC00]" />
                    )}
                  </div>
                )}

                {/* ── Node icon ───────────────────────────────────────────── */}
                <div className="relative z-10 shrink-0 mt-1" aria-hidden>
                  {isDone ? (
                    // Filled lime circle with animated check
                    <div className={`w-9 h-9 rounded-full bg-[#B2FC00] flex items-center justify-center shadow-[0_0_12px_rgba(178,252,0,0.4)] ${isAnimating ? 'animate-check-pop' : ''}`}>
                      <Check className="w-4 h-4 text-[#0E0617] stroke-[2.5]" />
                    </div>
                  ) : isCurrent ? (
                    // Lime-outlined pulsing ring
                    <div className={`w-9 h-9 rounded-full bg-[#1A2800] border-2 border-[#B2FC00] flex items-center justify-center animate-ring-pulse ${isAnimating ? 'animate-step-expand' : ''}`}>
                      {resolvedIcon}
                    </div>
                  ) : (
                    // Dim grey-purple outline
                    <div className="w-9 h-9 rounded-full bg-[#160A24] border border-slate-700 flex items-center justify-center opacity-40">
                      {resolvedIcon}
                    </div>
                  )}
                </div>

                {/* ── Step body ───────────────────────────────────────────── */}
                <div className={`flex-1 pb-6 min-w-0 ${isAnimating ? 'animate-step-expand' : ''}`}>

                  {/* ─ COMPLETED: compact one-liner ─────────────────────── */}
                  {isDone && (
                    <div className="flex items-center justify-between gap-2 py-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-headline text-sm font-bold text-white truncate">{step.label}</h4>
                        {timestamp && (
                          <span className="text-[10px] text-slate-500 font-medium shrink-0">{timestamp}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 hidden sm:block shrink-0">{step.desc}</p>
                    </div>
                  )}

                  {/* ─ CURRENT: expanded card with lime glow ────────────── */}
                  {isCurrent && (
                    <div className="bg-[#1A2800]/60 border border-[#B2FC00] rounded-xl p-4 shadow-[0_0_20px_rgba(178,252,0,0.12)] ring-1 ring-[#B2FC00]/20 mt-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-headline text-base font-black text-[#B2FC00] leading-tight">{step.label}</h4>
                            <span className="bg-[#B2FC00]/20 text-[#B2FC00] border border-[#B2FC00]/40 text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                              In Progress
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                        </div>

                        {/* Illustration — only on current step */}
                        <div
                          onClick={() => setSelectedImagePreview({ src: step.image, title: step.label })}
                          className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-xl overflow-hidden border border-[#B2FC00]/30 shadow-[0_0_16px_rgba(178,252,0,0.15)] cursor-pointer group/img relative"
                          aria-label="View step illustration"
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => e.key === 'Enter' && setSelectedImagePreview({ src: step.image, title: step.label })}
                        >
                          {/* Dark purple tinted container — handles fake-transparent PNGs */}
                          <div className="absolute inset-0 bg-[#0E0617]" />
                          <div className="absolute inset-0 bg-radial-gradient" style={{ background: 'radial-gradient(circle, rgba(178,252,0,0.08) 0%, transparent 70%)' }} />
                          <img
                            src={step.image}
                            alt={step.label}
                            className="absolute inset-0 w-full h-full object-contain p-1 transition-transform duration-300 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─ UPCOMING: dimmed, minimal ─────────────────────────── */}
                  {isUpcoming && (
                    <div className="py-1 opacity-45">
                      <h4 className="font-headline text-sm font-semibold text-slate-400">{step.label}</h4>
                      {showNextHint ? (
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">{step.nextHint}</p>
                      ) : (
                        <p className="text-[11px] text-slate-600 mt-0.5">{step.desc}</p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Help footer */}
        <div className="px-4 pb-5 pt-2 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Questions about your order?
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 bg-[#271240] hover:bg-[#341857] border border-white/10 hover:border-[#B2FC00]/40 text-white text-xs font-bold rounded-xl transition-all"
              aria-label="Call Ding Ting store"
            >
              <Phone className="w-3.5 h-3.5 text-[#B2FC00]" />
              Call Store
            </a>
            <button
              onClick={handlePokeChef}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 bg-[#271240] hover:bg-[#341857] border border-white/10 hover:border-[#B2FC00]/40 text-white text-xs font-bold rounded-xl transition-all"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5 text-[#B2FC00]" />
              Poke Chef
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Lightbox Modal ── */}
      {selectedImagePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImagePreview(null)}
        >
          <div
            className="bg-[#160A24] border border-white/20 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-step-expand"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-headline font-bold text-white text-base">{selectedImagePreview.title}</h3>
              <button
                onClick={() => setSelectedImagePreview(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#0E0617] flex items-center justify-center p-4 min-h-48">
              <img
                src={selectedImagePreview.src}
                alt={selectedImagePreview.title}
                className="max-h-[65vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-3 bg-[#0E0617] text-center text-[11px] text-slate-500">
              Ding Ting Signature Status Graphic • Mandapam Rd Kitchen
            </div>
          </div>
        </div>
      )}

      {/* ── Order Itemized Receipt ── */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl space-y-4">
        <h3 className="font-headline text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Order Summary &amp; Payment</span>
          <span className="text-xs text-[#B2FC00] font-normal">Stored in session</span>
        </h3>
        <div className="space-y-2.5">
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs text-slate-300">
              <div>
                <span className="font-bold text-white">{item.quantity}× {item.name}</span>
                {item.addonsList && item.addonsList.length > 0 && (
                  <span className="block text-[11px] text-slate-400">+ {item.addonsList.join(', ')}</span>
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

      {/* ── Switch orders dropdown ── */}
      {orders.length > 1 && (
        <div className="text-center pt-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Switch Active Order:</span>
          <select
            value={currentOrder.id}
            onChange={e => setActiveOrderId(e.target.value)}
            className="bg-[#160A24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B2FC00]"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>#{o.orderNumber} - {o.customerName} (₹{o.total})</option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
};
