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
          <svg className="w-4 h-4 text-blue-500/40 group-focus-within/field:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="SEARCH SECTOR..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-slate-800 focus:outline-none focus:placeholder-slate-600 transition-all border-b border-blue-500/5 focus:border-blue-500/20"
        />
        <div className="absolute right-0 bottom-0 h-[2px] w-0 bg-blue-500 transition-all duration-700 group-focus-within:w-full" />
      </div>

      {/* Playability Segment Filter */}
      <div className="flex gap-4 items-center">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:block">Status Filter</label>
        <div className="flex items-center gap-2">
           {[
             { id: 'all', label: 'All', color: 'blue' },
             { id: 'recommended', label: 'Optimal', color: 'emerald' },
             { id: 'minimum', label: 'Stable', color: 'amber' },
             { id: 'unplayable', label: 'Critical', color: 'red' }
           ].map((status) => (
             <button
               key={status.id}
               onClick={() => onStatusChange(status.id as any)}
               className={`relative h-6 px-3 flex items-center rounded overflow-hidden transition-all border ${
                 selectedStatus === status.id 
                   ? `bg-${status.color}-500/10 border-${status.color}-500/40 text-${status.color}-400` 
                   : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
               }`}
             >
                <span className="text-[9px] font-black uppercase tracking-widest z-10">{status.label}</span>
                {selectedStatus === status.id && (
                  <div className={`absolute left-0 bottom-0 w-full h-[2px] bg-current`} />
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
