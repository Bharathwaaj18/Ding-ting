import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { playBoingSound, playCrunchSound, playVictorySound } from '../../utils/audioFX';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Flame } from 'lucide-react';

const FUNNY_QUOTES = [
  "Pressure broasted = 100% crispy & juicy! 💦",
  "Warning: Crunch level may break sound barrier! 🔊",
  "Extra garlic dip is NOT optional, it's essential! 🧄",
  "Broasted chicken > Unfiltered drama! 🍗",
  "Sealed at 500 PSI for maximum drip! ⚡",
  "Tap me for a crunch blast! 💥",
  "One more drumstick won't hurt, trust me! 😋",
  "Crunching in progress... Please do not disturb! 🤫",
];

export interface MascotOutfit {
  id: string;
  title: string;
  imageSrc?: string;
  fallbackEmoji: string;
}

const OUTFITS: MascotOutfit[] = [
  { id: 'default', title: 'Captain Broast', imageSrc: '/refer_img/mascot-default.png', fallbackEmoji: '🍗' },
  { id: 'chef', title: 'Master Broaster', imageSrc: '/refer_img/mascot-chef.png', fallbackEmoji: '👨‍🍳' },
  { id: 'cool', title: 'Cool Cruncher', imageSrc: '/refer_img/mascot-cool.png', fallbackEmoji: '🕶️' },
  { id: 'party', title: 'Party Animal', imageSrc: '/refer_img/mascot-party.png', fallbackEmoji: '🥳' },
  { id: 'super', title: 'Hero Broast', imageSrc: '/refer_img/mascot-hero.png', fallbackEmoji: '🦸' },
  { id: 'king', title: 'King of Crunch', imageSrc: '/refer_img/mascot-king.png', fallbackEmoji: '👑' },
];

interface FloatingPop {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const FunnyMascot: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useStore();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);
  const [floatingPops, setFloatingPops] = useState<FloatingPop[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Rotate quote every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % FUNNY_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentOutfit = OUTFITS[outfitIndex];

  const handleMascotClick = (e: React.MouseEvent) => {
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 700);

    if (soundEnabled) {
      playBoingSound();
    }

    const pops = ['CRUNCH!! 💥', 'NOM NOM! 😋', 'JUICY! 💦', 'POW! ⚡', 'GARLIC BLAST! 🧄', 'CHICKEN POWER! 🍗'];
    const randomPop = pops[Math.floor(Math.random() * pops.length)];
    
    const newPop: FloatingPop = {
      id: Date.now(),
      text: randomPop,
      x: e.clientX - 40,
      y: e.clientY - 60,
    };

    setFloatingPops(prev => [...prev, newPop]);
    setTimeout(() => {
      setFloatingPops(prev => prev.filter(p => p.id !== newPop.id));
    }, 800);
  };

  const handleOutfitChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOutfitIndex(prev => (prev + 1) % OUTFITS.length);
    if (soundEnabled) playCrunchSound();
  };

  const handleCrunchCannon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playVictorySound();

    document.body.classList.add('animate-screen-shake');
    setTimeout(() => document.body.classList.remove('animate-screen-shake'), 450);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.9, y: 0.8 },
        colors: ['#B2FC00', '#FF2E4C', '#FFB703']
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <>
      {/* Render Floating Text Pops */}
      {floatingPops.map(pop => (
        <div
          key={pop.id}
          style={{ left: pop.x, top: pop.y }}
          className="fixed z-50 pointer-events-none font-headline font-black text-[#B2FC00] text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-crunch-pop"
        >
          {pop.text}
        </div>
      ))}

      {/* Floating Mascot Widget (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group">
        
        {/* Speech Bubble */}
        {!isMinimized && (
          <div className="relative bg-[#160A24] border border-white/20 text-white p-3.5 rounded-2xl rounded-br-none shadow-xl max-w-xs animate-float-mascot text-xs">
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2 -right-2 bg-[#FF2E4C] text-white w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow hover:scale-110 transition-transform"
            >
              ×
            </button>

            <div className="flex items-center gap-1.5 text-[#B2FC00] font-headline font-bold text-[11px] mb-1">
              <span>Captain Broast ({currentOutfit.title})</span>
            </div>

            <p className="font-medium text-slate-200 leading-snug">
              "{FUNNY_QUOTES[quoteIndex]}"
            </p>

            {/* Mascot Action Buttons */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1">
              <button
                onClick={handleOutfitChange}
                className="bg-[#271240] hover:bg-[#341857] text-[#B2FC00] px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border border-white/10"
                title="Change Costume"
              >
                Outfit 👔
              </button>

              <button
                onClick={handleCrunchCannon}
                className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Flame className="w-3 h-3 fill-[#0E0617]" /> Cannon 💥
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded-lg bg-[#0E0617] text-slate-300 hover:text-white border border-white/10"
                title={soundEnabled ? 'Mute FX' : 'Enable Sound FX'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#B2FC00]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>
        )}

        {/* Mascot Avatar Button */}
        <button
          onClick={handleMascotClick}
          className={`relative bg-gradient-to-br from-[#FF2E4C] via-[#271240] to-[#B2FC00] p-0.5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
            isWobbling ? 'animate-wobble-squish' : 'animate-float-mascot'
          }`}
          title="Click Captain Broast for Crunch Power!"
        >
          <div className="bg-[#0E0617] w-13 h-13 rounded-full flex items-center justify-center border border-[#B2FC00]/50 relative overflow-hidden">
            {currentOutfit.imageSrc && !imgErrors[currentOutfit.id] ? (
              <img
                src={currentOutfit.imageSrc}
                alt={currentOutfit.title}
                onError={() => setImgErrors(prev => ({ ...prev, [currentOutfit.id]: true }))}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-2xl select-none">{currentOutfit.fallbackEmoji}</span>
            )}
          </div>

          <span className="absolute -bottom-1 -right-1 bg-[#B2FC00] text-[#0E0617] text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase shadow border border-[#0E0617]">
            TAP
          </span>
        </button>

        {isMinimized && (
          <button
            onClick={() => setIsMinimized(false)}
            className="bg-[#271240] text-[#B2FC00] text-[10px] px-2 py-0.5 rounded-full font-bold shadow hover:bg-[#341857] border border-white/10"
          >
            Show Mascot 💬
          </button>
        )}

      </div>
    </>
  );
};
