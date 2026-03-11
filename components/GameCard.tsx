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
    label: 'ULTRA READY',
    bgColor: 'bg-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    indicator: 'bg-emerald-500',
  },
  minimum: {
    label: 'PLAYABLE',
    bgColor: 'bg-amber-600/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    indicator: 'bg-amber-500',
  },
  unplayable: {
    label: 'UPGRADE REQ.',
    bgColor: 'bg-red-600/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    indicator: 'bg-red-500',
  },
};

export function GameCard({ game, playabilityStatus, onClick }: GameCardProps) {
  const config = playabilityStatus ? statusConfig[playabilityStatus] : null;
  const coverUrl = game.cover?.url?.replace('t_thumb', 't_720p') || '/placeholder-game.png';

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-950/20 rounded-2xl border border-white/5 overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={coverUrl}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Cyber-Industrial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

        {/* Tactical Playability Badge */}
        {config && (
          <div className="absolute top-4 left-4 z-20">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-2xl ${config.bgColor} ${config.borderColor}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${config.indicator} animate-pulse shadow-[0_0_8px_currentColor]`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${config.textColor}`}>{config.label}</span>
            </div>
          </div>
        )}

        {/* Corner Cyber Accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
           <div className="absolute bottom-4 right-4 w-4 h-[2px] bg-blue-500" />
           <div className="absolute bottom-4 right-4 h-4 w-[2px] bg-blue-500" />
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-5 space-y-3 relative bg-slate-950/40 backdrop-blur-xl">
        <h3 className="text-sm font-black text-white tracking-tight line-clamp-2 uppercase italic leading-tight group-hover:text-blue-400 transition-colors">
          {game.name}
        </h3>
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Release Segment</span>
            <span className="text-[11px] font-black text-slate-300 mt-1 uppercase italic">{game.release_dates?.[0]?.y || 'Unknown'}</span>
          </div>
          {game.rating && (
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none mb-1">Impact</span>
              <span className="text-sm font-black text-blue-400 italic">{(game.rating / 10).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
