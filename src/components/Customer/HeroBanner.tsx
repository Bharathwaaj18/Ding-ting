import React, { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/mockData';
import { playCrunchSound } from '../../utils/audioFX';
import { Flame, Sparkles, ArrowRight, Zap, ShieldCheck, Volume2, VolumeX, Star, Clock, CheckCircle2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setCustomerTab, setSelectedCategory, addToCart, soundEnabled } = useStore();
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const toggleVideoSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = nextMuted;
      if (!nextMuted) {
        mobileVideoRef.current.play().catch(() => {});
      }
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = nextMuted;
      if (!nextMuted) {
        desktopVideoRef.current.play().catch(() => {});
      }
    }
  };

  const handleOrderSquadKit = () => {
    if (soundEnabled) playCrunchSound();
    const partyKit = {
      id: 'pk-01',
      categoryId: 'party-kit',
      name: 'DING TING Special Party Kit',
      description: 'THE SQUAD GOAL COMBO! 8 Pcs Broasted + 4 Khuboos + 1.25L Drink + Fries + 3 Dips',
      price: 999,
      imageUrl: STORE_INFO.bannerUrl,
      isVeg: false,
      isAvailable: true,
      prepTimeMinutes: 20,
    };
    addToCart(partyKit, 1, []);
    setCustomerTab('cart');
  };

  const handleGoToMenu = () => {
    if (soundEnabled) playCrunchSound();
    setSelectedCategory('all');
    setCustomerTab('menu');
  };

  return (
    <section className="relative w-full bg-[#0E0617] overflow-hidden border-b border-white/10 min-h-[calc(100svh-96px)] flex flex-col">
      
      {/* ========================================================================= */}
      {/* MOBILE VIEW (< lg): Full Screen Video Experience */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex-1 relative w-full min-h-[calc(100svh-130px)] flex flex-col justify-between p-4 overflow-hidden">
        
        {/* Full Background Video */}
        <video
          ref={mobileVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-105"
        >
          <source src="/refer_img/opening%202.mp4" type="video/mp4" />
          <source src="/refer_img/opening 2.mp4" type="video/mp4" />
        </video>

        {/* Subtle Bottom Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0617] via-[#0E0617]/40 to-transparent pointer-events-none" />

        {/* TOP MOBILE BAR: Badges & Sound Toggle */}
        <div className="relative z-20 flex items-center justify-between gap-2 pt-1">
          <span className="bg-[#B2FC00] text-[#0E0617] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 fill-[#0E0617]" /> CRISPIEST IN TOWN
          </span>

          <button
            onClick={toggleVideoSound}
            className="bg-[#0E0617]/85 text-[#B2FC00] border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            title={isMuted ? 'Unmute Video' : 'Mute Video'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                <span>Sound: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#B2FC00] animate-pulse" />
                <span>Sound: ON 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* BOTTOM MOBILE CONTROL OVERLAY */}
        <div className="relative z-20 mt-auto pb-1">
          <div className="bg-[#160A24]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl space-y-3">
            
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="font-headline text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                  NOT FRIED. <span className="text-[#B2FC00]">BROASTED.</span>
                </h1>
                <p className="text-[11px] font-bold text-slate-300 tracking-wide pt-0.5">
                  CRISPY OUTSIDE. JUICY INSIDE. ⚡
                </p>
              </div>

              <button
                onClick={handleOrderSquadKit}
                className="bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/30 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shrink-0 shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-[#FF2E4C]" /> Combo ₹999
              </button>
            </div>

            {/* Main CTA */}
            <button
              onClick={() => {
                if (soundEnabled) playCrunchSound();
                const menuEl = document.getElementById('menu-catalog-section');
                if (menuEl) {
                  menuEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleGoToMenu();
                }
              }}
              className="w-full bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" /> EXPLORE BROASTED MENU ⬇️
            </button>

            {/* Quick Highlights */}
            <div className="flex items-center justify-between text-[10px] text-slate-300 pt-2 border-t border-white/10 font-medium">
              <span className="flex items-center gap-1 text-[#B2FC00]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pressure Broasted
              </span>
              <span className="flex items-center gap-1 text-[#B2FC00]">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Halal
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <Clock className="w-3.5 h-3.5" /> 15 Min Pickup
              </span>
            </div>

          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* DESKTOP VIEW (>= lg): Direct Video Showcase with Clean Text */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:relative flex-1 w-full min-h-[580px] p-8 lg:p-12 overflow-hidden">
        
        {/* Desktop Background Video */}
        <video
          ref={desktopVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-105"
        >
          <source src="/refer_img/opening%202.mp4" type="video/mp4" />
          <source src="/refer_img/opening 2.mp4" type="video/mp4" />
        </video>

        {/* Directional Dark Vignette Gradient for Crisp Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0617]/90 via-[#0E0617]/60 to-transparent pointer-events-none" />

        {/* TOP DESKTOP BAR */}
        <div className="relative z-20 max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#B2FC00] text-[#0E0617] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#0E0617]" /> CRISPIEST IN TOWN
            </span>
            <span className="bg-[#160A24]/90 text-[#B2FC00] border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B2FC00] inline mr-1" /> Halal Certified
            </span>
            <span className="bg-[#160A24]/90 text-amber-300 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline mr-1" /> 4.9★ (1.2k+ Reviews)
            </span>
          </div>

          <button
            onClick={toggleVideoSound}
            className="bg-[#0E0617]/85 text-[#B2FC00] border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-[#160A24] active:scale-95 transition-all"
            title={isMuted ? 'Click to enable Video Audio' : 'Click to mute Video Audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Sound: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#B2FC00] animate-pulse" />
                <span>Sound: ON 🔊</span>
              </>
            )}
          </button>
        </div>

        {/* MAIN DESKTOP CONTENT */}
        <div className="relative z-20 max-w-7xl mx-auto w-full my-auto py-6">
          <div className="max-w-2xl space-y-6">
            
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-headline text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-none tracking-tight">
                NOT FRIED. <br />
                <span className="text-[#B2FC00] inline-block mt-1">
                  BROASTED.
                </span>
              </h1>
              
              <p className="font-headline text-xl lg:text-2xl font-extrabold text-slate-200 tracking-wide flex items-center gap-2">
                <span>CRISPY OUTSIDE. JUICY INSIDE.</span>
                <span className="text-[#FF2E4C]">⚡</span>
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-base text-slate-300 max-w-xl leading-relaxed font-body font-normal">
              Experience Chennai's premier pressure broasted chicken. Sealed under high-pressure broasting technology for unmatched crunch and dripping juicy tenderness.
            </p>

            {/* Action CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleGoToMenu}
                className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-7 py-3.5 rounded-xl font-extrabold text-base flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-45 transition-transform" /> ORDER NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleGoToMenu}
                className="bg-[#160A24]/90 hover:bg-[#271240] text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
              >
                VIEW MENU
              </button>

              <button
                onClick={handleOrderSquadKit}
                className="bg-[#271240]/90 hover:bg-[#341857] text-[#B2FC00] border border-[#B2FC00]/30 px-6 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Flame className="w-4 h-4 text-[#FF2E4C]" /> Squad Combo ₹999
              </button>
            </div>

            {/* Key Selling Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs max-w-md">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#B2FC00] shrink-0" />
                <span>Pressure Broasted</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#B2FC00] shrink-0" />
                <span>Extra Juicy</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>15 Min Pickup</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};



