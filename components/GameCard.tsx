// components/GameCard.tsx

'use client';

import Image from 'next/image';
import { GameWithRequirements } from '@/types/igdb';
import { PlayabilityStatus } from '@/lib/matchmaker/playabilityChecker';

interface GameCardProps {
  game: GameWithRequirements;
  playabilityStatus?: PlayabilityStatus;
  onClick?: () => void;
}

const statusConfig = {
  recommended: {
    label: 'OPTIMAL SENSOR',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    indicator: 'bg-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
  },
  minimum: {
    label: 'STABLE LINK',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    indicator: 'bg-amber-400',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  unplayable: {
    label: 'CRITICAL VOID',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    indicator: 'bg-rose-400',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  },
};

export function GameCard({ game, playabilityStatus, onClick }: GameCardProps) {
  const config = playabilityStatus ? statusConfig[playabilityStatus] : null;
  const coverUrl = game.cover?.url?.replace('t_thumb', 't_720p') || '/placeholder-game.png';

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#020617] rounded-none border border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-500/40"
    >
      {/* Structural Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-blue-400 z-30 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-blue-400 z-30 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-blue-400 z-30 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-blue-400 z-30 transition-colors" />

      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={coverUrl}
          alt={game.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-90 grayscale-[0.3] group-hover:grayscale-0"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Scanning Overlay Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity z-20" />

        {/* Status HUD Element */}
        {config && (
          <div className="absolute top-2 right-2 z-30">
            <div className={`px-2 py-0.5 border skew-x-[-12deg] backdrop-blur-sm ${config.bgColor} ${config.borderColor} ${config.glow}`}>
              <div className="flex items-center gap-1.5 skew-x-[12deg]">
                <div className={`w-1 h-1 ${config.indicator} animate-ping`} />
                <span className={`text-[9px] font-black uppercase tracking-tighter ${config.textColor}`}>{config.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Year Tag */}
        <div className="absolute bottom-2 left-2 z-30 flex items-center gap-1 cursor-default">
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-black/40 px-1 hover:text-blue-400 transition-colors">
            {game.release_dates?.[0]?.y || '20XX'}
           </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 relative bg-[#020617] border-t border-white/5">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-black text-slate-100 tracking-tighter line-clamp-1 uppercase italic leading-none group-hover:text-blue-400 transition-colors">
              {game.name}
            </h3>
            {game.rating && (
              <span className="text-[10px] font-black text-blue-500/80 italic ml-2">
                {(game.rating / 10).toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <div className="h-[1px] flex-grow bg-slate-800" />
             <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">Sector Verified</span>
          </div>
        </div>
      </div>

      {/* Hover Selection Glow */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}
