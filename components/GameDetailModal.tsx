// components/GameDetailModal.tsx

'use client';

import { useEffect } from 'react';
import { GameWithRequirements } from '@/types/igdb';
import { PlayabilityReport } from '@/lib/matchmaker/playabilityChecker';

interface GameDetailModalProps {
  game: GameWithRequirements | null;
  playabilityReport: PlayabilityReport | null;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
}

export function GameDetailModal({
  game,
  playabilityReport,
  isOpen,
  isLoading = false,
  onClose,
}: GameDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !game) return null;

  const statusColors = {
    recommended: {
      bg: 'bg-green-600/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      label: 'Optimal Performance',
      icon: '✓'
    },
    minimum: {
      bg: 'bg-blue-600/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      label: 'Playable Performance',
      icon: '◐'
    },
    unplayable: {
      bg: 'bg-red-600/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      label: 'Performance Issues Likely',
      icon: '✗'
    },
  };

  const currentStatus = playabilityReport ? statusColors[playabilityReport.status] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171a21]/90 backdrop-blur-md z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-[#1b2838] border border-black/40 rounded shadow-2xl overflow-hidden z-[70] flex flex-col">
        {/* Header/Banner Area */}
        <div className="relative h-64 flex-shrink-0">
          {game.cover && (
            <img
              src={game.cover.url.replace('t_thumb', 't_1080p')}
              alt={game.name}
              className="w-full h-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-[#1b2838]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
          >
            ✕
          </button>

          <div className="absolute bottom-6 left-8 right-8">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-tight">{game.name}</h2>
            <div className="flex gap-4 mt-2">
              {game.rating && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-white/5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-[#66c0f4]">{(game.rating / 10).toFixed(1)} / 10</span>
                  <span className="text-[10px] text-[#acb2b8] font-bold uppercase tracking-widest">Score</span>
                </div>
              )}
              {game.release_dates?.[0]?.y && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-white/5 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white tracking-widest uppercase">{game.release_dates[0].y}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Analysis Report */}
          {playabilityReport && currentStatus && (
            <div className={`p-6 rounded border ${currentStatus.bg} ${currentStatus.border} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 font-black text-4xl opacity-10 uppercase italic">
                {playabilityReport.status}
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold bg-[#171a21] border ${currentStatus.border} ${currentStatus.text}`}>
                  {currentStatus.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-wider ${currentStatus.text}`}>
                    {currentStatus.label}
                  </h3>
                  {playabilityReport.reasons.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {playabilityReport.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs font-medium text-[#c7d5e0] flex items-center gap-2">
                          <span className={`${currentStatus.text}`}>•</span> {reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* System Requirements Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {['minimum', 'recommended'].map((type) => {
              const reqs = game.systemRequirements?.[type as keyof typeof game.systemRequirements];
              if (!reqs || typeof reqs === 'string') return null;
              
              return (
                <div key={type} className="bg-[#171a21] rounded border border-black/40 flex flex-col">
                  <div className="px-4 py-2 border-b border-black/40 bg-[#2a475e]/20">
                    <h4 className="text-[10px] font-black text-[#66c0f4] uppercase tracking-[0.2em]">{type} specifications</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    {[
                      { label: 'O-SYSTEM', value: (reqs as any).os },
                      { label: 'PROCESSOR', value: (reqs as any).cpu },
                      { label: 'MEMORY', value: (reqs as any).ram ? `${(reqs as any).ram}GB RAM` : null },
                      { label: 'GRAPHICS', value: (reqs as any).gpu },
                      { label: 'STORAGE', value: (reqs as any).storage ? `${(reqs as any).storage}GB SPACE` : null },
                    ].map((item, idx) => item.value && (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[9px] font-bold text-[#acb2b8] uppercase tracking-widest opacity-60">{item.label}</span>
                        <span className="text-xs font-bold text-[#c7d5e0] leading-tight mt-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Metadata */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-black/20">
            {game.platforms && game.platforms.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-[#acb2b8] uppercase tracking-widest mb-3">Target Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((p) => (
                    <span key={p.id} className="text-[10px] font-bold text-white bg-[#2a475e] px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tight">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {game.genres && game.genres.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-[#acb2b8] uppercase tracking-widest mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((g) => (
                    <span key={g.id} className="text-[10px] font-bold text-[#66c0f4] px-0 py-0 uppercase">
                      #{g.name.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
