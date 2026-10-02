import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { MapPin, Phone, ShieldCheck, Clock, Instagram, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0412] border-t border-white/10 text-slate-300 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img 
              src={STORE_INFO.logoUrl} 
              alt="Ding Ting Logo" 
              className="w-10 h-10 rounded-xl border border-[#B2FC00]/60 object-cover"
            />
            <div>
              <span className="font-headline text-xl font-bold text-white tracking-wide">
                DING TING
              </span>
              <p className="text-[10px] text-[#B2FC00] font-black -mt-1 uppercase tracking-wider">
                SIGNATURE BROASTED CHICKEN
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            "{STORE_INFO.tagline}"
            <br />
            Pressure broasted chicken cooked under high pressure for extraordinary crunch.
          </p>
        </div>

        {/* Store Location */}
        <div className="space-y-2 text-xs">
          <h4 className="font-headline font-bold text-[#B2FC00] text-xs uppercase tracking-wider">Store Pickup Location</h4>
          <p className="flex items-start gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-4 h-4 text-[#B2FC00] shrink-0 mt-0.5" />
            {STORE_INFO.address}
          </p>
          <p className="flex items-center gap-1.5 text-slate-300 pt-1 font-medium">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            {STORE_INFO.phone}
          </p>
        </div>

        {/* Pickup Timings & Certifications */}
        <div className="space-y-2 text-xs">
          <h4 className="font-headline font-bold text-[#B2FC00] text-xs uppercase tracking-wider">Pickup Operating Hours</h4>
          <p className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            Everyday: {STORE_INFO.pickupTiming}
          </p>
          <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-[#B2FC00] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Halal Certified Meat Only
            </span>
            <span>FSSAI License: {STORE_INFO.fssaiLic}</span>
          </div>
        </div>

        {/* Social & Web Links */}
        <div className="space-y-3 text-xs">
          <h4 className="font-headline font-bold text-[#B2FC00] text-xs uppercase tracking-wider">Connect With Us</h4>
          <div className="flex items-center gap-3">
            <a 
              href={`https://instagram.com/${STORE_INFO.instagram}`} 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#160A24] hover:bg-[#271240] p-2.5 rounded-xl border border-white/10 text-[#B2FC00] flex items-center gap-1.5 transition-colors font-bold"
            >
              <Instagram className="w-4 h-4" /> {STORE_INFO.instagram}
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 pt-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{STORE_INFO.website}</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-500 font-medium">
        © {new Date().getFullYear()} DING TING BROASTED CHICKEN. All Rights Reserved. Built strictly for Store Pickup System v1.
      </div>
    </footer>
  );
};
