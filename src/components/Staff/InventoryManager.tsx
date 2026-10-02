import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Layers, AlertTriangle, Plus, Minus, CheckCircle2 } from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { inventory, updateInventoryQuantity } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#B2FC00]" />
            RAW INVENTORY & STOCK CONTROL
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Track raw ingredients, chicken stock, khuboos breading, dips & packaging supply.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(item => {
          const isLowStock = item.currentQuantity <= item.minimumQuantity;

          return (
            <div
              key={item.id}
              className={`bg-[#160A24] border p-5 rounded-2xl space-y-4 ${
                isLowStock ? 'border-amber-500/60 bg-amber-950/20' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">{item.category}</span>
                  <h3 className="font-headline font-bold text-base text-white">{item.name}</h3>
                </div>
                {isLowStock ? (
                  <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Low Stock
                  </span>
                ) : (
                  <span className="bg-emerald-600/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Healthy
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-xs text-slate-400">Current Qty:</span>
                  <p className="font-headline text-2xl font-black text-[#B2FC00]">
                    {item.currentQuantity} <span className="text-xs text-slate-300 font-normal">{item.unit}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-400">Min Threshold: {item.minimumQuantity} {item.unit}</span>
              </div>

              {/* Adjust Stock Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => updateInventoryQuantity(item.id, -5)}
                  className="flex-1 bg-[#0E0617] hover:bg-[#271240] border border-white/10 text-slate-300 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" /> -5 {item.unit}
                </button>
                <button
                  onClick={() => updateInventoryQuantity(item.id, 10)}
                  className="flex-1 bg-[#B2FC00] text-[#0E0617] hover:bg-[#C4FF1A] py-1.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-[0.98] shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> +10 {item.unit}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
