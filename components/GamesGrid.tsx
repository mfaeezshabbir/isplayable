// components/GamesGrid.tsx

'use client';

import { GameWithRequirements } from '@/types/igdb';
import { PlayabilityReport, PlayabilityStatus } from '@/lib/matchmaker/playabilityChecker';
import { GameCard } from './GameCard';

interface GamesGridProps {
  games: GameWithRequirements[];
  playabilityReports: Map<number, PlayabilityReport>;
  selectedStatus: PlayabilityStatus | 'all';
  isLoading: boolean;
  onGameSelect: (game: GameWithRequirements) => void;
}

export function GamesGrid({
  games,
  playabilityReports,
  selectedStatus,
  isLoading,
  onGameSelect,
}: GamesGridProps) {
  // Filter games based on selected playability status
  const filteredGames = games.filter((game) => {
    if (selectedStatus === 'all') return true;
    const report = playabilityReports.get(game.id);
    return report?.status === selectedStatus;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-[spin_0.8s_linear_infinite]" />
          <div className="absolute inset-2 border-2 border-white/5 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] animate-pulse">Scanning Databases</p>
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Awaiting sector response...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center px-10">
        <div className="w-16 h-[1px] bg-slate-800 mb-8" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Zero Matches Found</p>
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest max-w-[200px] leading-relaxed">
          The requested search sector returned no viable results.
        </p>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center px-10">
        <div className="w-16 h-[1px] bg-slate-800 mb-8" />
        <p className="text-[10px] font-black text-red-500/80 uppercase tracking-[0.3em] mb-2">Filtered Output Null</p>
        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest max-w-[200px] leading-relaxed">
          No records match the active playability parameters ({selectedStatus.toUpperCase()}).
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-max p-4 lg:p-0">
      {filteredGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          playabilityStatus={playabilityReports.get(game.id)?.status}
          onClick={() => onGameSelect(game)}
        />
      ))}
    </div>
  );
}
