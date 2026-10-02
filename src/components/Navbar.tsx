import React from 'react';
import { useStore } from '../context/StoreContext';
import { playBoingSound } from '../utils/audioFX';
import { 
  ShoppingBag, 
  ChefHat, 
  UserCheck, 
  MapPin, 
  Clock, 
  ShieldCheck,
  LayoutDashboard,
  Utensils,
  PackageCheck,
  Layers,
  BarChart3,
  KeyRound,
  Home,
  Truck,
  Receipt
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    customerTab, 
    setCustomerTab, 
    staffTab, 
    setStaffTab, 
    cartCount,
    orders,
    user,
    openAuthModal,
    logoutUser
  } = useStore();

  const pendingCount = orders.filter(o => ['PLACED', 'ACCEPTED', 'PREPARING'].includes(o.status)).length;
  const readyCount = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;

  return (
    <header className="sticky top-0 z-40 bg-[#0E0617]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      {/* Top Announcement & Location Bar */}
      <div className="bg-[#160A24] text-[11px] py-1.5 px-3 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Location & Pickup info */}
          <div className="flex items-center gap-3 text-slate-300 truncate font-medium">
            <span className="flex items-center gap-1.5 text-[#B2FC00] font-semibold shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#B2FC00]" />
              <span className="truncate max-w-[150px] sm:max-w-none">{STORE_INFO.address}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {STORE_INFO.pickupTiming} (Pickup Only)
            </span>
          </div>

          {/* Badges & Staff Portal Link */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-[#B2FC00]/10 text-[#B2FC00] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-[#B2FC00]/25 text-[10px]">
              <ShieldCheck className="w-3 h-3 text-[#B2FC00]" /> Halal Certified
            </span>
            <button
              onClick={() => {
                playBoingSound();
                openAuthModal();
              }}
              className="text-slate-400 hover:text-[#B2FC00] flex items-center gap-1.5 font-semibold transition-colors text-[11px]"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#B2FC00]" /> <span className="hidden xs:inline">Staff Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { setRole('customer'); setCustomerTab('home'); }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#B2FC00]/60 shadow-sm transition-transform group-hover:scale-105">
            <img 
              src={STORE_INFO.logoUrl} 
              alt="Ding Ting Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-[#B2FC00] transition-colors leading-none">
                DING TING
              </span>
              <span className="bg-[#FF2E4C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                BROASTED
              </span>
            </div>
            <p className="text-[10px] font-bold text-[#B2FC00] tracking-wider pt-0.5 uppercase">
              Signature Broasted Chicken
            </p>
          </div>
        </div>

        {/* Dynamic Navigation depending on active Role */}
        {role === 'customer' ? (
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#160A24] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setCustomerTab('home')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  customerTab === 'home' ? 'text-[#B2FC00] bg-[#271240] border border-[#B2FC00]/30 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCustomerTab('menu')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  customerTab === 'menu' ? 'text-[#B2FC00] bg-[#271240] border border-[#B2FC00]/30 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setCustomerTab('track')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  customerTab === 'track' ? 'text-[#B2FC00] bg-[#271240] border border-[#B2FC00]/30 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Track Pickup
                {readyCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#B2FC00] animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setCustomerTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  customerTab === 'orders' ? 'text-[#B2FC00] bg-[#271240] border border-[#B2FC00]/30 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                My Orders
              </button>
            </nav>

            {/* Login / User Account Badge */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-[#160A24] border border-white/10 p-1 rounded-xl text-xs">
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-white font-bold hover:bg-[#271240] transition-colors"
                  title="Click to view account details"
                >
                  <span className="w-6 h-6 rounded-full bg-[#B2FC00] text-[#0E0617] flex items-center justify-center font-black text-[11px] shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline font-headline max-w-[90px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={() => {
                    playBoingSound();
                    logoutUser();
                  }}
                  className="px-2 py-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold transition-colors text-[10px]"
                  title="Log Out"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playBoingSound();
                  openAuthModal();
                }}
                className="bg-[#160A24] hover:bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#B2FC00]" /> <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => {
                playBoingSound();
                setCustomerTab('cart');
              }}
              className="relative bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="font-extrabold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#FF2E4C] text-white text-[10px] px-1.5 py-0.5 rounded-full font-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        ) : (
          /* Staff / Admin Nav Tabs */
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto p-1 bg-[#160A24] rounded-xl border border-white/10">
            <button
              onClick={() => setStaffTab('kds')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                staffTab === 'kds' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" /> KDS
              {pendingCount > 0 && (
                <span className="bg-[#FF2E4C] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setStaffTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                staffTab === 'dashboard' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>

            <button
              onClick={() => setStaffTab('new-order')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                staffTab === 'new-order' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> POS Terminal
            </button>

            <button
              onClick={() => setStaffTab('menu-manage')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                staffTab === 'menu-manage' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" /> Menu Manager
            </button>

            {role === 'admin' && (
              <>
                <button
                  onClick={() => setStaffTab('inventory')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    staffTab === 'inventory' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Inventory
                </button>
                <button
                  onClick={() => setStaffTab('reports')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    staffTab === 'reports' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/40 shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Reports
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Redesigned Mobile Navigation Subnav Bar */}
      {role === 'customer' && (
        <div className="md:hidden bg-[#160A24] border-t border-white/10 py-2 px-3">
          <div className="grid grid-cols-4 gap-1 text-center">
            
            <button
              onClick={() => {
                playBoingSound();
                setCustomerTab('home');
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                customerTab === 'home' 
                  ? 'bg-[#271240] text-[#B2FC00] font-bold border border-[#B2FC00]/30 shadow-sm' 
                  : 'text-slate-400 font-semibold hover:text-slate-200'
              }`}
            >
              <Home className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => {
                playBoingSound();
                setCustomerTab('menu');
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                customerTab === 'menu' 
                  ? 'bg-[#271240] text-[#B2FC00] font-bold border border-[#B2FC00]/30 shadow-sm' 
                  : 'text-slate-400 font-semibold hover:text-slate-200'
              }`}
            >
              <Utensils className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Menu</span>
            </button>

            <button
              onClick={() => {
                playBoingSound();
                setCustomerTab('track');
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                customerTab === 'track' 
                  ? 'bg-[#271240] text-[#B2FC00] font-bold border border-[#B2FC00]/30 shadow-sm' 
                  : 'text-slate-400 font-semibold hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Truck className="w-4 h-4 mb-0.5" />
                {readyCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B2FC00] animate-ping" />
                )}
              </div>
              <span className="text-[10px]">Track</span>
            </button>

            <button
              onClick={() => {
                playBoingSound();
                setCustomerTab('orders');
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                customerTab === 'orders' 
                  ? 'bg-[#271240] text-[#B2FC00] font-bold border border-[#B2FC00]/30 shadow-sm' 
                  : 'text-slate-400 font-semibold hover:text-slate-200'
              }`}
            >
              <Receipt className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">Orders</span>
            </button>

          </div>
        </div>
      )}
    </header>
  );
};

