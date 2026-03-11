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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading games...</p>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center text-slate-400">
          <p className="mb-2">No games found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  if (filteredGames.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center text-slate-400">
          <p className="mb-2">No games match your filters</p>
          <p className="text-sm">Try a different {selectedStatus !== 'all' ? 'playability status' : 'filter'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
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
