// components/TacticalFooter.tsx
'use client';

export function TacticalFooter() {
  return (
    <footer className="px-10 py-8 border-t border-white/5 flex justify-between items-center bg-[#020617] relative">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-none bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Link Status: Secure</span>
      </div>
      <div className="flex items-center gap-6">
         <span className="text-[8px] font-bold text-slate-800 tracking-[0.2em] uppercase">Auth: P_GDS_4.0</span>
         <span className="text-[9px] font-black text-blue-500/40 uppercase tracking-[0.2em]">IGDB PROTOCOL © 2026</span>
      </div>
    </footer>
  );
}
