import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem } from '../../types';
import { ItemModal } from './ItemModal';
import { playAddToCartSound, playBoingSound, playCrunchSound } from '../../utils/audioFX';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Package, 
  GlassWater, 
  UtensilsCrossed, 
  Plus, 
  Filter
} from 'lucide-react';

interface CardPop {
  id: string;
  text: string;
}

export const MenuCatalog: React.FC = () => {
  const { 
    categories, 
    menuItems, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    addToCart,
    soundEnabled
  } = useStore();

  const [activeVegFilter, setActiveVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [cardPops, setCardPops] = useState<Record<string, CardPop>>({});
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  // Filter logic
  const filteredItems = menuItems.filter(item => {
    // Category check
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    // Veg/Non-Veg check
    if (activeVegFilter === 'veg' && !item.isVeg) return false;
    if (activeVegFilter === 'nonveg' && item.isVeg) return false;

    return true;
  });

  const triggerCardPop = (itemId: string, text: string) => {
    setAnimatingCardId(itemId);
    setCardPops(prev => ({ ...prev, [itemId]: { id: itemId, text } }));
    if (soundEnabled) playCrunchSound();

    setTimeout(() => {
      setAnimatingCardId(null);
    }, 600);

    setTimeout(() => {
      setCardPops(prev => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }, 900);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    const funnyPops = ['CRUNCH!! 💥', 'NOM NOM 😋', 'JUICY BLAST! 💦', '100% CRUNCH! 🔊', 'CHOMP! 🦷'];
    const randomPop = funnyPops[Math.floor(Math.random() * funnyPops.length)];
    
    if (soundEnabled) playAddToCartSound();
    addToCart(item, 1, []);
    triggerCardPop(item.id, randomPop);
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Package': return <Package className="w-4 h-4 text-[#B2FC00]" />;
      case 'Flame': return <Flame className="w-4 h-4 text-[#FF2E4C]" />;
      case 'GlassWater': return <GlassWater className="w-4 h-4 text-[#00E5FF]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-purple-300" />;
      default: return <UtensilsCrossed className="w-4 h-4 text-[#B2FC00]" />;
    }
  };

  return (
    <div id="menu-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <span>BROASTED MENU & COMBOS</span>
            <span className="bg-[#B2FC00]/15 text-[#B2FC00] border border-[#B2FC00]/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredItems.length} ITEMS
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Pick your favorites, customize toppings & prepare for maximum crunch!
          </p>
        </div>

        {/* Search & Veg/Non-Veg Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chicken, fries, drinks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#160A24] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B2FC00] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Toggle Pills */}
          <div className="flex bg-[#160A24] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                if (soundEnabled) playBoingSound();
                setActiveVegFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
                activeVegFilter === 'all' ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/30 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playBoingSound();
                setActiveVegFilter('nonveg');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 ${
                activeVegFilter === 'nonveg' ? 'bg-[#FF2E4C] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🍗 Chicken
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playBoingSound();
                setActiveVegFilter('veg');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 ${
                activeVegFilter === 'veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌿 Veg & Drinks
            </button>
          </div>

        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            if (soundEnabled) playBoingSound();
            setSelectedCategory('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all active:scale-95 ${
            selectedCategory === 'all'
              ? 'bg-[#B2FC00] text-[#0E0617] border-[#B2FC00] font-extrabold shadow-sm'
              : 'bg-[#160A24] text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
          }`}
        >
          <Filter className="w-3.5 h-3.5" /> All Categories
        </button>

        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (soundEnabled) playBoingSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#B2FC00] text-[#0E0617] border-[#B2FC00] font-extrabold shadow-sm'
                  : 'bg-[#160A24] text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              {cat.name}
              {cat.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                  isActive ? 'bg-[#0E0617] text-[#B2FC00]' : 'bg-[#FF2E4C] text-white'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Food Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#160A24] border border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <div className="text-4xl">🔍🍗</div>
          <h3 className="font-headline text-lg font-bold text-white">No Items Found</h3>
          <p className="text-xs max-w-sm mx-auto text-slate-400">
            No items match your current search or category filter. Try clearing filters to view our full menu.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setActiveVegFilter('all'); }}
            className="mt-2 bg-[#B2FC00] text-[#0E0617] px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:bg-[#C4FF1A] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => {
            const isAnimating = animatingCardId === item.id;
            const popInfo = cardPops[item.id];

            return (
              <div
                key={item.id}
                className={`group relative bg-[#160A24] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-[#B2FC00]/50 hover:shadow-md ${
                  !item.isAvailable ? 'opacity-60 grayscale' : ''
                } ${isAnimating ? 'border-[#B2FC00]' : ''}`}
              >
                {/* Floating Pop Feedback */}
                {popInfo && (
                  <div className="absolute top-2 right-2 z-30 bg-[#B2FC00] text-[#0E0617] px-3 py-1 rounded-full font-headline font-black text-xs shadow-md border border-[#0E0617] animate-crunch-pop">
                    {popInfo.text}
                  </div>
                )}

                {/* Card Image Container */}
                <div 
                  onClick={() => setSelectedItemForModal(item)}
                  className="relative h-44 w-full bg-[#0E0617] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160A24] via-transparent to-transparent opacity-80" />

                  {/* Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    {item.isVeg ? (
                      <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-400/40">
                        VEG 🌿
                      </span>
                    ) : (
                      <span className="bg-[#FF2E4C]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        CHICKEN 🍗
                      </span>
                    )}

                    {item.isPopular && (
                      <span className="bg-[#B2FC00] text-[#0E0617] text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                        POPULAR ★
                      </span>
                    )}
                  </div>

                  {/* Spice / Pieces Indicators */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                    {item.spiceLevel && (
                      <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3 fill-black" /> {item.spiceLevel}
                      </span>
                    )}
                    {item.piecesCount && (
                      <span className="bg-[#0E0617]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                        {item.piecesCount} Pcs
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => setSelectedItemForModal(item)}
                      className="font-headline text-base font-bold text-white group-hover:text-[#B2FC00] transition-colors leading-snug cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Price & Add Button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Price</span>
                      <span className="text-lg font-black text-[#B2FC00] tracking-tight">
                        ₹{item.price}
                      </span>
                    </div>

                    {item.isAvailable ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedItemForModal(item)}
                          className="bg-[#271240] hover:bg-[#341857] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
                          title="Customize & Add"
                        >
                          Options
                        </button>

                        <button
                          onClick={e => handleQuickAdd(e, item)}
                          className="bg-[#B2FC00] hover:bg-[#C4FF1A] text-[#0E0617] px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-all active:scale-[0.98] shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add
                        </button>
                      </div>
                    ) : (
                      <span className="bg-[#0E0617] text-slate-500 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Customization Modal */}
      {selectedItemForModal && (
        <ItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onAddToCart={(item, qty, addons, notes) => {
            addToCart(item, qty, addons, notes);
            if (soundEnabled) playCrunchSound();
          }}
        />
      )}
    </div>
  );
};
