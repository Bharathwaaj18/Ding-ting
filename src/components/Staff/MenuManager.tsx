import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PackageCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export const MenuManager: React.FC = () => {
  const { menuItems, toggleItemAvailability } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-[#B2FC00]" />
            MENU AVAILABILITY MANAGER
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Instantly mark items as In Stock or Sold Out for customer ordering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`bg-[#160A24] border p-4 rounded-xl flex items-center justify-between gap-4 transition-all ${
              item.isAvailable ? 'border-white/10' : 'border-rose-500/40 bg-rose-950/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#0E0617]"
              />
              <div>
                <h4 className="font-headline font-bold text-white text-sm leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-black text-[#B2FC00]">₹{item.price}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                  item.isAvailable ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {item.isAvailable ? 'AVAILABLE FOR ORDER' : 'SOLD OUT / UNAVAILABLE'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleItemAvailability(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                item.isAvailable
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                  : 'bg-rose-600 text-white hover:bg-rose-500'
              }`}
            >
              {item.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {item.isAvailable ? 'In Stock' : 'Mark Out'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
