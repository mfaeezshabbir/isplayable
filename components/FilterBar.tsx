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
    active: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
    indicator: 'bg-emerald-500'
  },
  minimum: {
    active: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
    indicator: 'bg-amber-500'
  },
  unplayable: {
    active: 'bg-red-500/10 border-red-500/40 text-red-400',
    indicator: 'bg-red-500'
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
    <div className="flex items-center gap-10">
      {/* Search Input - Cyber Edition */}
      <div className="flex-1 relative group">
        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-blue-500/40 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH SECTOR..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent pl-8 pr-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-slate-800 focus:outline-none focus:placeholder-slate-600 transition-all border-b border-white/5 focus:border-blue-500/40 shadow-[inset_0_-1px_0_rgba(255,255,255,0.02)]"
        />
        <div className="absolute left-0 bottom-0 h-[1.5px] w-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-700 group-focus-within:w-full" />
      </div>

      {/* Playability Segment Filter */}
      <div className="flex gap-4 items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">System Status</label>
        <div className="flex items-center gap-2">
           {[
             { id: 'all', label: 'All' },
             { id: 'recommended', label: 'Optimal' },
             { id: 'minimum', label: 'Stable' },
             { id: 'unplayable', label: 'Critical' }
           ].map((status) => (
             <button
               key={status.id}
               onClick={() => onStatusChange(status.id as any)}
               className={`relative h-7 px-4 flex items-center rounded-lg overflow-hidden transition-all border ${
                 selectedStatus === status.id 
                   ? (statusColors[status.id as keyof typeof statusColors].active)
                   : 'bg-slate-950/40 border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/10'
               }`}
             >
                <span className="text-[9px] font-black uppercase tracking-[0.15em] z-10 italic">{status.label}</span>
                {selectedStatus === status.id && (
                  <div className={`absolute inset-0 bg-gradient-to-t from-current/5 to-transparent pointer-events-none`} />
                )}
             </button>
           ))}
        </div>
      </div>

      {/* Genre Selector */}
      <div className="flex items-center gap-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">Category</label>
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
