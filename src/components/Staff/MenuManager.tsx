import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MenuItem, AddonOption } from '../../types';
import { 
  PackageCheck, 
  Plus, 
  Pencil, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Search, 
  X, 
  Flame, 
  Clock, 
  Check, 
  AlertCircle, 
  Sparkles,
  Layers,
  Utensils,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Broasted Chicken', url: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.03 (1).jpeg' },
  { label: 'Box Combo', url: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.01.jpeg' },
  { label: 'Party Kit', url: '/refer_img/WhatsApp Image 2026-09-28 at 22.28.09.jpeg' },
  { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fries', url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fizzy Mocktail', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Beverage', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' },
];

export const MenuManager: React.FC = () => {
  const { 
    menuItems, 
    categories, 
    toggleItemAvailability, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'soldout'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<{
    name: string;
    categoryId: string;
    price: string;
    description: string;
    imageUrl: string;
    isVeg: boolean;
    isAvailable: boolean;
    prepTimeMinutes: string;
    piecesCount: string;
    spiceLevel: 'None' | 'Mild' | 'Hot' | 'Extreme';
    isPopular: boolean;
    isPartyKit: boolean;
    addons: AddonOption[];
  }>({
    name: '',
    categoryId: categories[0]?.id || 'broasted-boxes',
    price: '',
    description: '',
    imageUrl: PRESET_IMAGES[0].url,
    isVeg: false,
    isAvailable: true,
    prepTimeMinutes: '15',
    piecesCount: '',
    spiceLevel: 'None',
    isPopular: false,
    isPartyKit: false,
    addons: [],
  });

  // Delete Confirmation Target
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Temp Addon Form State inside Modal
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItemId(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'broasted-boxes',
      price: '',
      description: '',
      imageUrl: PRESET_IMAGES[0].url,
      isVeg: false,
      isAvailable: true,
      prepTimeMinutes: '15',
      piecesCount: '',
      spiceLevel: 'None',
      isPopular: false,
      isPartyKit: false,
      addons: [],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price.toString(),
      description: item.description,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      prepTimeMinutes: item.prepTimeMinutes.toString(),
      piecesCount: item.piecesCount ? item.piecesCount.toString() : '',
      spiceLevel: item.spiceLevel || 'None',
      isPopular: !!item.isPopular,
      isPartyKit: !!item.isPartyKit,
      addons: item.addons ? [...item.addons] : [],
    });
    setIsModalOpen(true);
  };

  // Save Modal (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedPrice = parseFloat(formData.price) || 0;
    const parsedPrepTime = parseInt(formData.prepTimeMinutes, 10) || 15;
    const parsedPieces = formData.piecesCount ? parseInt(formData.piecesCount, 10) : undefined;

    if (editingItemId) {
      // Update existing item
      const itemToUpdate: MenuItem = {
        id: editingItemId,
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        price: parsedPrice,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || PRESET_IMAGES[0].url,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        prepTimeMinutes: parsedPrepTime,
        piecesCount: parsedPieces,
        spiceLevel: formData.spiceLevel,
        isPopular: formData.isPopular,
        isPartyKit: formData.isPartyKit,
        addons: formData.addons,
      };
      updateMenuItem(itemToUpdate);
    } else {
      // Create new item
      const newItemData: Omit<MenuItem, 'id'> = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        price: parsedPrice,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || PRESET_IMAGES[0].url,
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        prepTimeMinutes: parsedPrepTime,
        piecesCount: parsedPieces,
        spiceLevel: formData.spiceLevel,
        isPopular: formData.isPopular,
        isPartyKit: formData.isPartyKit,
        addons: formData.addons,
      };
      addMenuItem(newItemData);
    }

    setIsModalOpen(false);
  };

  // Add Addon Option inside Modal
  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    const priceVal = parseFloat(newAddonPrice) || 0;
    const addon: AddonOption = {
      id: `addon-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newAddonName.trim(),
      price: priceVal,
    };
    setFormData(prev => ({
      ...prev,
      addons: [...prev.addons, addon],
    }));
    setNewAddonName('');
    setNewAddonPrice('');
  };

  // Remove Addon Option inside Modal
  const handleRemoveAddon = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.filter(a => a.id !== addonId),
    }));
  };

  // Filter Items
  const filteredItems = menuItems.filter(item => {
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // Category Filter
    if (selectedCatFilter !== 'all' && item.categoryId !== selectedCatFilter) {
      return false;
    }

    // Stock Filter
    if (stockFilter === 'instock' && !item.isAvailable) return false;
    if (stockFilter === 'soldout' && item.isAvailable) return false;

    return true;
  });

  const totalCount = menuItems.length;
  const availableCount = menuItems.filter(i => i.isAvailable).length;
  const soldOutCount = totalCount - availableCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 select-none">
      
      {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B2FC00]/10 border border-[#B2FC00]/30 flex items-center justify-center shrink-0">
              <PackageCheck className="w-6 h-6 text-[#B2FC00]" />
            </div>
            <div>
              <h1 className="font-headline text-2xl sm:text-3xl font-black text-white tracking-wide">
                MENU & ITEM MANAGER
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Add new food items, customize pricing & descriptions, configure addons, and manage instant stock availability.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Badges + Add New Food Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#0E0617] px-3.5 py-2 rounded-xl border border-white/10 text-xs">
            <span className="text-slate-400 font-semibold">Total:</span>
            <span className="font-black text-white">{totalCount}</span>
            <span className="text-emerald-400 font-bold ml-2">● {availableCount} In Stock</span>
            <span className="text-rose-400 font-bold ml-1">● {soldOutCount} Out</span>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-[#B2FC00] hover:bg-[#c6ff33] text-[#0E0617] font-headline font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer text-sm"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add New Food</span>
          </button>
        </div>
      </div>

      {/* ═══ FILTER & SEARCH BAR ═════════════════════════════════════════════ */}
      <div className="bg-[#160A24] border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0E0617] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B2FC00]/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category & Stock Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0E0617] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <Layers className="w-3.5 h-3.5 text-[#B2FC00]" />
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#160A24] text-white">All Categories ({totalCount})</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-[#160A24] text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0E0617] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                stockFilter === 'all'
                  ? 'bg-[#271240] text-[#B2FC00] border border-[#B2FC00]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('instock')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                stockFilter === 'instock'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter('soldout')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                stockFilter === 'soldout'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sold Out
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MENU ITEM CARDS GRID ═════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-[#160A24] border border-white/10 p-12 rounded-2xl text-center space-y-3">
            <Utensils className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 font-bold text-sm">No food items found matching criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCatFilter('all'); setStockFilter('all'); }}
              className="text-[#B2FC00] underline text-xs font-semibold hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map(item => {
            const catObj = categories.find(c => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className={`bg-[#160A24] border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-white/25 group ${
                  item.isAvailable ? 'border-white/10' : 'border-rose-500/40 bg-rose-950/10'
                }`}
              >
                <div>
                  {/* Top Image + Badges */}
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-[#0E0617] border border-white/5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !item.isAvailable && 'grayscale opacity-60'
                      }`}
                    />
                    
                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm ${
                        item.isAvailable
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 backdrop-blur-md'
                          : 'bg-rose-950/90 text-rose-300 border-rose-500/50 backdrop-blur-md'
                      }`}>
                        {item.isAvailable ? '● IN STOCK' : '● SOLD OUT'}
                      </span>

                      {/* Veg / Non-Veg Indicator */}
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center border font-bold text-[10px] shadow-sm backdrop-blur-md ${
                        item.isVeg ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' : 'bg-rose-950/90 border-rose-500 text-rose-300'
                      }`}>
                        {item.isVeg ? 'V' : 'NV'}
                      </span>
                    </div>

                    {/* Bestseller / Party Tag */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                      {item.isPopular && (
                        <span className="bg-[#FF2E4C] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wider uppercase">
                          BESTSELLER
                        </span>
                      )}
                      {item.isPartyKit && (
                        <span className="bg-[#B2FC00] text-[#0E0617] text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wider uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> PARTY KIT
                        </span>
                      )}
                    </div>

                    {/* Category Label Overlay at bottom */}
                    <div className="absolute bottom-2 left-2.5 bg-[#0E0617]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 border border-white/10 font-bold">
                      {catObj?.name || item.categoryId}
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-headline font-black text-white text-base leading-tight">
                      {item.name}
                    </h3>
                    <span className="font-headline font-black text-[#B2FC00] text-base shrink-0">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Details Badges (Prep Time, Spice, Pieces, Addons) */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400 mb-4">
                    <span className="flex items-center gap-1 bg-[#0E0617] px-2 py-0.5 rounded border border-white/5 font-semibold">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {item.prepTimeMinutes} mins
                    </span>

                    {item.spiceLevel && item.spiceLevel !== 'None' && (
                      <span className="flex items-center gap-1 bg-[#0E0617] px-2 py-0.5 rounded border border-rose-500/20 text-rose-300 font-semibold">
                        <Flame className="w-3 h-3 text-rose-400" />
                        {item.spiceLevel}
                      </span>
                    )}

                    {item.piecesCount && (
                      <span className="bg-[#0E0617] px-2 py-0.5 rounded border border-white/5 font-semibold text-slate-300">
                        {item.piecesCount} pcs
                      </span>
                    )}

                    {item.addons && item.addons.length > 0 && (
                      <span className="bg-[#271240] text-[#B2FC00] px-2 py-0.5 rounded border border-[#B2FC00]/30 font-bold">
                        +{item.addons.length} Addons
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {/* Stock Toggle Button */}
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                    }`}
                  >
                    {item.isAvailable ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
                    <span>{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  {/* Edit / Customize Button */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-[#271240] border border-[#B2FC00]/40 text-[#B2FC00] hover:bg-[#341854] transition-all cursor-pointer shadow-sm"
                    title="Edit Item Details"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60 transition-all cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══ ADD / EDIT ITEM MODAL ══════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#140B1F] border border-white/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#B2FC00] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 text-[#0E0617]" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-xl text-white">
                    {editingItemId ? 'CUSTOMIZE & EDIT ITEM' : 'ADD NEW FOOD ITEM'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingItemId ? 'Modify item pricing, description, imagery and addons.' : 'Create a brand new item for customer and staff ordering.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              
              {/* Grid Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signature Broasted Wings (6 Pcs)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00] cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-[#160A24] text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid Row 2: Price, Prep Time, Pieces Count */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    placeholder="299"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="15"
                    value={formData.prepTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, prepTimeMinutes: e.target.value })}
                    className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Pieces Count (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 4 or 8"
                    value={formData.piecesCount}
                    onChange={(e) => setFormData({ ...formData, piecesCount: e.target.value })}
                    className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Item Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe crunch level, texture, dips included..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>Image URL</span>
                  <span className="text-[10px] text-slate-500 font-normal">Pick preset or paste custom link</span>
                </label>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-[#0E0617] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-9 h-9 rounded-lg object-cover border border-white/20 shrink-0 bg-black"
                    />
                  )}
                </div>

                {/* Preset image buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#B2FC00]" /> Presets:
                  </span>
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                        formData.imageUrl === img.url
                          ? 'bg-[#271240] text-[#B2FC00] border-[#B2FC00]/50'
                          : 'bg-[#0E0617] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row: Veg/Non-Veg & Spice Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0E0617] p-3 rounded-xl border border-white/10">
                {/* Veg / Non-Veg Selector */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Dietary Type</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: false })}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        !formData.isVeg
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                          : 'bg-[#140B1F] text-slate-400 border-white/10'
                      }`}
                    >
                      🍗 Non-Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isVeg: true })}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        formData.isVeg
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                          : 'bg-[#140B1F] text-slate-400 border-white/10'
                      }`}
                    >
                      🌱 Vegetarian
                    </button>
                  </div>
                </div>

                {/* Spice Level Selector */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Spice Level</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['None', 'Mild', 'Hot', 'Extreme'] as const).map(lvl => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setFormData({ ...formData, spiceLevel: lvl })}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          formData.spiceLevel === lvl
                            ? 'bg-[#271240] text-[#B2FC00] border-[#B2FC00]/60'
                            : 'bg-[#140B1F] text-slate-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checkbox Flags: Stock, Popular, Party Kit */}
              <div className="flex items-center gap-4 flex-wrap bg-[#0E0617] p-3 rounded-xl border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="accent-[#B2FC00] w-4 h-4"
                  />
                  <span>In Stock (Available for order)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="accent-[#B2FC00] w-4 h-4"
                  />
                  <span>Flag as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#B2FC00]">
                  <input
                    type="checkbox"
                    checked={formData.isPartyKit}
                    onChange={(e) => setFormData({ ...formData, isPartyKit: e.target.checked })}
                    className="accent-[#B2FC00] w-4 h-4"
                  />
                  <span>Flag as Party Kit Combo</span>
                </label>
              </div>

              {/* ═══ CUSTOM ADDONS EDITOR ═══════════════════════════════════ */}
              <div className="bg-[#0E0617] p-3.5 rounded-xl border border-white/10 space-y-2.5">
                <label className="block text-slate-200 font-bold flex items-center justify-between">
                  <span>Customizable Addon Options (Optional)</span>
                  <span className="text-[10px] text-slate-400">{formData.addons.length} Addons Added</span>
                </label>

                {/* List of current addons */}
                {formData.addons.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {formData.addons.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between bg-[#140B1F] border border-white/10 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <span className="font-semibold text-white">{addon.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#B2FC00]">+₹{addon.price}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddon(addon.id)}
                            className="text-rose-400 hover:text-rose-300 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new addon inline row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Addon Name (e.g. Extra Mayo Dip)"
                    value={newAddonName}
                    onChange={(e) => setNewAddonName(e.target.value)}
                    className="flex-1 bg-[#140B1F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                  <input
                    type="number"
                    placeholder="₹ Price"
                    value={newAddonPrice}
                    onChange={(e) => setNewAddonPrice(e.target.value)}
                    className="w-20 bg-[#140B1F] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#B2FC00]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAddon}
                    className="bg-[#271240] hover:bg-[#391a5e] border border-[#B2FC00]/40 text-[#B2FC00] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#B2FC00] hover:bg-[#c6ff33] text-[#0E0617] font-headline font-black flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingItemId ? 'Save Changes' : 'Create Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ══════════════════════════════════════ */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#140B1F] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            
            <div>
              <h3 className="font-headline font-black text-xl text-white">Delete Food Item?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove this item from the store menu? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMenuItem(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-headline font-black transition-all shadow-lg active:scale-95 cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
