// components/TacticalHeader.tsx
'use client';

export function TacticalHeader() {
  return (
    <header className="px-10 py-12 border-b border-white/5 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      <div className="flex items-center gap-4 group">
        <div className="relative">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 font-black italic skew-x-[-15deg] group-hover:border-blue-500 transition-colors shadow-inner text-xl">
            IP
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 animate-pulse" />
        </div>
        <div className="skew-x-[-15deg]">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-white">IS PLAYABLE</h1>
          <p className="text-[10px] font-black text-blue-500 tracking-[0.4em] mt-2 opacity-100 uppercase">System Analyzer 4.0</p>
        </div>
      </div>
      <div className="absolute bottom-2 right-4 flex gap-4 text-[8px] font-bold text-slate-700 tracking-[0.1em] uppercase">
        <span>Link: Active</span>
        <span className="text-blue-500/50">Cores: 16-STBL</span>
      </div>
    </header>
  );
}
