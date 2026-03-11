'use client';

import { useState, useMemo, useEffect } from 'react';
import { SystemSpecs } from '@/components/SystemSpecs';
import { FilterBar } from '@/components/FilterBar';
import { GamesGrid } from '@/components/GamesGrid';
import { GameDetailModal } from '@/components/GameDetailModal';
import { HardwareSpecs } from '@/types/hardware';
import { GameWithRequirements } from '@/types/igdb';
import { PlayabilityStatus, PlayabilityReport, checkSpecs } from '@/lib/matchmaker/playabilityChecker';
import { useGames } from '@/hooks/useGames';
import { useGenres } from '@/hooks/useGenres';
import { useGameDetails } from '@/hooks/useGameDetails';

export default function Home() {
  const [userSpecs, setUserSpecs] = useState<HardwareSpecs | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PlayabilityStatus | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch games list
  const { games, isLoading: isLoadingGames } = useGames({
    limit: 50,
    search: searchQuery || undefined,
    genre: selectedGenre || undefined,
  });

  // Fetch full details for selected game
  const { game: selectedGameDetails, isLoading: isLoadingGameDetails } = useGameDetails(
    selectedGameId
  );

  // Fetch genres
  const { genres, isLoading: isLoadingGenres } = useGenres();

  // Calculate playability for all games in the list
  const playabilityReports = useMemo(() => {
    const reports = new Map<number, PlayabilityReport>();

    if (!userSpecs) return reports;

    games.forEach((game) => {
      const requirements = game.systemRequirements || {
        minimum: {},
        recommended: {},
      };

      const report = checkSpecs(userSpecs, requirements);
      reports.set(game.id, report);
    });

    return reports;
  }, [userSpecs, games]);

  // Get playability report for selected game details
  const selectedGameReport = selectedGameDetails
    ? playabilityReports.get(selectedGameDetails.id) || null
    : null;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Dynamic Data Stream Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e3a8a_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Layout Grid */}
      <div className="relative flex h-screen overflow-hidden">
        
        {/* LEFT PANE: Scanner HUD (Glassmorphism) */}
        <aside className="w-[420px] flex-shrink-0 border-r border-blue-500/10 bg-slate-950/40 backdrop-blur-3xl flex flex-col z-10 shadow-2xl">
          {/* Header Area */}
          <header className="p-8 border-b border-blue-500/10">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-black italic shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  IP
                </div>
                <div className="absolute -inset-1 bg-blue-500/20 blur rounded group-hover:bg-blue-500/40 transition-colors" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">IS PLAYABLE</h1>
                <p className="text-[10px] font-bold text-blue-400 tracking-[0.2em] mt-1.5 opacity-70">SYSTEM SCANNER v2.0</p>
              </div>
            </div>
          </header>

          {/* Hardware Blueprint Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Diagnostic HUD</h2>
                {!userSpecs && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-400 uppercase text-xs">Scanning...</span>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-900/40 border border-blue-500/10 rounded-2xl p-6 relative overflow-hidden group shadow-inner">
                {/* Decorative Tech Grid */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                
                <SystemSpecs
                  onSpecsChange={(specs) => {
                    setUserSpecs(specs);
                  }}
                />
              </div>

              {/* Virtual Upgrade Hint */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <div className="text-amber-500 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[10px] font-medium leading-relaxed text-amber-200/60 uppercase tracking-wider">
                  Adjust the sliders to simulate hardware upgrades and visualize potential performance gains in the command center.
                </p>
              </div>
            </section>

            {/* Quick Status Summary */}
            <section className="space-y-4">
               <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Match Statistics</h2>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-emerald-500/10 p-4 rounded-xl shadow-lg hover:border-emerald-500/30 transition-all cursor-default">
                    <div className="text-2xl font-black text-emerald-400 italic">42</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Optimal Matches</div>
                  </div>
                  <div className="bg-slate-900/60 border border-amber-500/10 p-4 rounded-xl shadow-lg hover:border-amber-500/30 transition-all cursor-default">
                    <div className="text-2xl font-black text-amber-400 italic">18</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">Needs Tweaking</div>
                  </div>
               </div>
            </section>
          </div>

          {/* Footer Context */}
          <footer className="p-8 border-t border-blue-500/10 flex justify-between items-center bg-slate-950/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">DB Sync: Online</span>
            </div>
            <p className="text-[9px] font-black text-blue-400/40 uppercase tracking-widest uppercase">
              IGDB Protocol 2026
            </p>
          </footer>
        </aside>

        {/* RIGHT PANE: Library Command Center */}
        <div className="flex-1 flex flex-col bg-[#020617]/80 backdrop-blur-sm relative overflow-hidden">
          {/* Top Filter Bar (Fixed) */}
          <div className="h-24 px-10 flex items-center border-b border-white/5 z-20 bg-slate-950/20 backdrop-blur">
             <div className="w-full max-w-6xl">
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  selectedGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                  genres={genres}
                  isLoadingGenres={isLoadingGenres}
                />
             </div>
          </div>

          {/* Games Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Mission Ready</h2>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-2">{games.length} Database entries recognized</p>
                </div>
                <div className="flex gap-2">
                   <div className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer bg-slate-900/50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                   </div>
                   <div className="w-10 h-10 border border-blue-500/20 bg-blue-500/10 rounded flex items-center justify-center text-blue-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                   </div>
                </div>
              </div>

              {!userSpecs ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Interface</h3>
                  <p className="text-xs font-medium text-slate-600 mt-2 uppercase tracking-wide">Synchronizing system telemetry...</p>
                </div>
              ) : isLoadingGames ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-900/50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : games.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {games
                    .filter(g => selectedStatus === 'all' || (playabilityReports.get(g.id)?.status === selectedStatus))
                    .map((game) => (
                      <div key={game.id} className="group relative">
                        <div className="absolute -inset-0.5 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-2xl blur transition duration-500" />
                        <div className="relative">
                          <GamesGrid
                            games={[game]}
                            playabilityReports={playabilityReports}
                            selectedStatus="all"
                            isLoading={false}
                            onGameSelect={(g) => {
                              setSelectedGameId(g.id);
                              setModalOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-3xl backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest italic">No Data Signals Detected</h3>
                  <p className="text-sm font-medium text-slate-600 mt-2 uppercase tracking-tight">Try recalibrating your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <GameDetailModal
        game={selectedGameDetails}
        playabilityReport={selectedGameReport}
        isOpen={modalOpen}
        isLoading={isLoadingGameDetails}
        onClose={() => {
          setModalOpen(false);
          setSelectedGameId(null);
        }}
      />
    </main>
  );
}
