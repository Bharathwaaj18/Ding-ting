import React, { useState } from 'react';
import { MenuItem, CartAddon } from '../../types';
import { useStore } from '../../context/StoreContext';
import { playBoingSound, playAddToCartSound, playCrunchSound } from '../../utils/audioFX';
import { X, Plus, Minus, Flame, Clock, Check, ShoppingBag } from 'lucide-react';

interface ItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedAddons: CartAddon[], notes?: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  const { soundEnabled } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const toggleAddon = (addon: CartAddon) => {
    if (soundEnabled) playBoingSound();
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (soundEnabled) playAddToCartSound();
    onAddToCart(item, quantity, selectedAddons, specialNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#160A24] border border-white/20 rounded-2xl overflow-hidden shadow-2xl text-white animate-fade-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (soundEnabled) playBoingSound();
            onClose();
          }}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-52 w-full bg-[#0E0617]">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160A24] via-transparent to-transparent opacity-90" />
          
          {/* Badges on image */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
            {item.isVeg ? (
              <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/40">
                VEG 🌿
              </span>
            ) : (
              <span className="bg-[#FF2E4C]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                CHICKEN 🍗
              </span>
            )}

            {item.piecesCount && (
              <span className="bg-[#B2FC00] text-[#0E0617] text-[10px] font-black px-2 py-0.5 rounded">
                {item.piecesCount} PCS
              </span>
            )}

            {item.spiceLevel && (
              <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-black" /> {item.spiceLevel}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-headline text-xl sm:text-2xl font-bold text-white leading-tight">
                {item.name}
              </h3>
              <span className="text-[#B2FC00] font-black text-xl whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {item.description}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Prep time: approx {item.prepTimeMinutes} mins</span>
            </div>
          </div>

          {/* Add-ons Section */}
          {item.addons && item.addons.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <h4 className="font-headline text-xs font-bold text-[#B2FC00] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Select Add-ons / Extras 🧄</span>
                <span className="text-[11px] text-slate-400 font-normal">Optional</span>
              </h4>

              <div className="space-y-2">
                {item.addons.map(addon => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                        isChecked 
                          ? 'bg-[#271240] border-[#B2FC00] text-white shadow-sm' 
                          : 'bg-[#0E0617] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#B2FC00] border-[#B2FC00] text-[#0E0617]' : 'border-slate-500'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#B2FC00]">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div className="pt-3 border-t border-white/10">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Special Instructions ✍️
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, extra crunchy, separate sauce..."
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B2FC00] transition-colors"
            />
          </div>
        </div>

        {/* Modal Footer (Quantity Counter & Add CTA) */}
        <div className="p-4 bg-[#11071F] border-t border-white/10 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#0E0617] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => {
                if (soundEnabled) playBoingSound();
                setQuantity(q => Math.max(1, q - 1));
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#271240] transition-colors active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => {
                if (soundEnabled) playCrunchSound();
                setQuantity(q => q + 1);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B2FC00] hover:bg-[#271240] transition-colors active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Order • ₹{totalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};
