'use client';

import { useState, useMemo } from 'react';
import { SystemSpecs } from '@/components/SystemSpecs';
import { FilterBar } from '@/components/FilterBar';
import { GamesGrid } from '@/components/GamesGrid';
import { GameDetailModal } from '@/components/GameDetailModal';
import { TacticalHeader } from '@/components/TacticalHeader';
import { TacticalFooter } from '@/components/TacticalFooter';
import { HardwareSpecs } from '@/types/hardware';
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
  const { game: selectedGameDetails } = useGameDetails(selectedGameId);

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

  // Derived statistics for the HUD
  const stats = useMemo(() => {
    let optimal = 0;
    let stable = 0;
    let critical = 0;

    playabilityReports.forEach((report) => {
      if (report.status === 'recommended') optimal++;
      else if (report.status === 'minimum') stable++;
      else if (report.status === 'unplayable') critical++;
    });

    return { optimal, stable, critical };
  }, [playabilityReports]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,transparent_70%)] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)] opacity-[0.03]" />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        
        {/* LEFT PANE: HUD Sidebar */}
        <aside className="w-[450px] flex-shrink-0 border-r border-white/5 bg-[#020617] flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
          <TacticalHeader />

          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-10 space-y-12">
            {/* Input Section */}
            <section className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-4 bg-blue-500 skew-x-[-15deg]" />
                   <h2 className="text-[11px] font-black text-slate-100 uppercase tracking-[0.3em] italic">Bio-Hardware Matrix</h2>
                </div>
                <div className="h-[1px] flex-grow ml-6 bg-white/5" />
              </div>
              
              <div className="bg-slate-950/40 border border-white/5 p-6 relative overflow-hidden group shadow-inner">
                <SystemSpecs onSpecsChange={setUserSpecs} />
              </div>
            </section>

            {/* Statistics Section */}
            <section className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-4 bg-blue-500 skew-x-[-15deg]" />
                   <h2 className="text-[11px] font-black text-slate-100 uppercase tracking-[0.3em] italic">Sector Stat Analysis</h2>
                </div>
                <div className="h-[1px] flex-grow ml-6 bg-white/5" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-white/5 p-5 skew-x-[-10deg] shadow-lg hover:border-cyan-500/30 transition-all">
                  <div className="skew-x-[10deg]">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-cyan-400 italic leading-none">{stats.optimal}</div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Unt</span>
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase mt-3 tracking-[0.2em]">Optimal Link</div>
                  </div>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-5 skew-x-[-10deg] shadow-lg hover:border-amber-500/30 transition-all">
                  <div className="skew-x-[10deg]">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-amber-400 italic leading-none">{stats.stable}</div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Unt</span>
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase mt-3 tracking-[0.2em]">Stable Ops</div>
                  </div>
                </div>
              </div>

              {stats.critical > 0 && (
                <div className="mt-4 p-4 border border-rose-500/20 bg-rose-500/5 skew-x-[-10deg] flex items-center justify-between">
                  <div className="skew-x-[10deg] flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.25em]">Critical Payload</span>
                  </div>
                  <div className="skew-x-[10deg]">
                    <span className="text-xs font-black text-rose-500 italic">{stats.critical}</span>
                  </div>
                </div>
              )}
            </section>
          </div>

          <TacticalFooter />
        </aside>

        {/* RIGHT PANE: Catalog */}
        <div className="flex-1 flex flex-col bg-[#020617] relative overflow-hidden">
          {/* Top Filter Bar */}
          <div className="h-28 px-12 flex items-center border-b border-white/5 z-20 bg-[#020617]/80 backdrop-blur-3xl shadow-2xl">
             <div className="w-full max-w-[1400px] mx-auto">
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

          {/* Main Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-12 pb-40">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col mb-12 relative">
                <div className="absolute top-0 right-0 opacity-10">
                  <span className="text-8xl font-black italic tracking-tighter uppercase text-white select-none">SCAN</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                   <div className="h-[2px] w-12 bg-blue-500" />
                   <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">System Strategic Feed</span>
                </div>
                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none max-w-3xl">
                  RECON CATALOGUE
                </h2>
                <div className="mt-8 p-4 border border-white/5 bg-slate-950/20 backdrop-blur-xl max-w-fit skew-x-[-15deg]">
                   <div className="skew-x-[15deg] flex items-center gap-6">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Records</span>
                         <span className="text-lg font-black text-white italic">{games.length}</span>
                      </div>
                      <div className="w-[1px] h-8 bg-white/10" />
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sector Sync</span>
                         <span className="text-lg font-black text-blue-400 italic">SEC-042</span>
                      </div>
                   </div>
                </div>
              </div>

              {!userSpecs ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 border border-white/5 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-xl font-black text-slate-100 uppercase tracking-[0.2em] italic">Initializing Sector</h3>
                  <p className="text-[10px] font-bold text-slate-600 mt-3 uppercase tracking-[0.4em]">Synchronizing telemetry...</p>
                </div>
              ) : (
                <GamesGrid
                  games={games}
                  playabilityReports={playabilityReports}
                  selectedStatus={selectedStatus}
                  isLoading={isLoadingGames}
                  onGameSelect={(game) => {
                    setSelectedGameId(game.id);
                    setModalOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <GameDetailModal
        game={selectedGameDetails}
        playabilityReport={selectedGameDetails ? (playabilityReports.get(selectedGameDetails.id) || null) : null}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}
