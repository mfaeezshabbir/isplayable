// components/FilterBar.tsx

'use client';

import { PlayabilityStatus } from '@/lib/matchmaker/playabilityChecker';
import { Genre } from '@/hooks/useGenres';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: PlayabilityStatus | 'all';
  onStatusChange: (status: PlayabilityStatus | 'all') => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: Genre[];
  isLoadingGenres: boolean;
}

const statusColors = {
  all: {
    active: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
    indicator: 'bg-blue-500'
  },
  recommended: {
    active: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400',
    indicator: 'bg-cyan-500'
  },
  minimum: {
    active: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
    indicator: 'bg-amber-500'
  },
  unplayable: {
    active: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
    indicator: 'bg-rose-500'
  }
};

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedGenre,
  onGenreChange,
  genres,
  isLoadingGenres,
}: FilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-4 lg:p-0">
      {/* Search Input - Cyber Edition */}
      <div className="flex-1 relative group">
        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-blue-500/40 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="ENTER SEARCH QUERY..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent pl-8 pr-4 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white placeholder-slate-700 focus:outline-none focus:placeholder-slate-500 transition-all border-b border-white/5 focus:border-blue-500/40 shadow-[inset_0_-1px_0_rgba(255,255,255,0.01)]"
        />
        <div className="absolute left-0 bottom-0 h-[1px] w-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-1000 group-focus-within:w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-8">
        {/* Playability Segment Filter */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
             {[
               { id: 'all', label: 'ALL' },
               { id: 'recommended', label: 'OPTIMAL' },
               { id: 'minimum', label: 'STABLE' },
               { id: 'unplayable', label: 'CRITICAL' }
             ].map((status) => (
               <button
                 key={status.id}
                 onClick={() => onStatusChange(status.id as any)}
                 className={`relative h-8 px-4 flex items-center transition-all border skew-x-[-15deg] ${
                   selectedStatus === status.id 
                     ? (statusColors[status.id as keyof typeof statusColors].active)
                     : 'bg-[#020617] border-white/5 text-slate-600 hover:text-slate-400 hover:border-white/20'
                 }`}
               >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] z-10 italic skew-x-[15deg]">{status.label}</span>
                  {selectedStatus === status.id && (
                    <div className="absolute top-0 right-0 w-1 h-1 bg-current animate-pulse skew-x-[15deg]" />
                  )}
               </button>
             ))}
          </div>
        </div>

        {/* Genre Selector */}
        <div className="relative group">
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            disabled={isLoadingGenres}
            className="bg-slate-900 border border-white/5 rounded px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-blue-500/30 transition-all appearance-none pr-8 cursor-pointer disabled:opacity-20"
          >
            <option value="">Full Range</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-600 group-hover:text-blue-500 transition-colors">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
