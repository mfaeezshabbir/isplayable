// components/SystemSpecs.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { HardwareSpecs } from '@/types/hardware';
import { CPUs, GPUs } from '@/lib/hardware/cpuGpuDatabase';

interface SystemSpecsProps {
  onSpecsChange?: (specs: HardwareSpecs) => void;
}

export function SystemSpecs({ onSpecsChange }: SystemSpecsProps) {
  const [specs, setSpecs] = useState<HardwareSpecs>({
    cpu: '',
    cpuCores: 0,
    ram: 16,
    gpu: '',
  });

  const [cpuSearch, setCpuSearch] = useState('');
  const [gpuSearch, setGpuSearch] = useState('');
  const [showCpuDropdown, setShowCpuDropdown] = useState(false);
  const [showGpuDropdown, setShowGpuDropdown] = useState(false);

  const cpuDropdownRef = useRef<HTMLDivElement>(null);
  const gpuDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize with defaults if no selection has been made
  useEffect(() => {
    if (specs.cpu === '' && CPUs.length > 0) {
      const defaultCpu = CPUs[0];
      const defaultGpu = GPUs[0];
      const initialSpecs = {
        cpu: defaultCpu.name,
        cpuCores: defaultCpu.cores,
        ram: 16,
        gpu: defaultGpu.name
      };
      setSpecs(initialSpecs);
      onSpecsChange?.(initialSpecs);
    }
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cpuDropdownRef.current && !cpuDropdownRef.current.contains(event.target as Node)) {
        setShowCpuDropdown(false);
      }
      if (gpuDropdownRef.current && !gpuDropdownRef.current.contains(event.target as Node)) {
        setShowGpuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCPUs = CPUs.filter((cpu) =>
    cpu.name.toLowerCase().includes(cpuSearch.toLowerCase())
  );

  const filteredGPUs = GPUs.filter((gpu) =>
    gpu.name.toLowerCase().includes(gpuSearch.toLowerCase())
  );

  const handleCpuSelect = (cpu: typeof CPUs[0]) => {
    const newSpecs = { ...specs, cpu: cpu.name, cpuCores: cpu.cores };
    setSpecs(newSpecs);
    setCpuSearch('');
    setShowCpuDropdown(false);
    onSpecsChange?.(newSpecs);
  };

  const handleGpuSelect = (gpu: typeof GPUs[0]) => {
    const newSpecs = { ...specs, gpu: gpu.name };
    setSpecs(newSpecs);
    setGpuSearch('');
    setShowGpuDropdown(false);
    onSpecsChange?.(newSpecs);
  };

  const handleRamChange = (value: number) => {
    const newSpecs = { ...specs, ram: value };
    setSpecs(newSpecs);
    onSpecsChange?.(newSpecs);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* HUD Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          <div className="w-4 h-4 bg-blue-500 rounded-sm animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">Scanner HUD</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Input Override</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* CPU Selector */}
        <div className="relative group/field" ref={cpuDropdownRef}>
          <div className="flex justify-between items-end mb-2.5 px-1">
            <label className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.2em] group-focus-within/field:text-blue-400 transition-colors">Neural Core Processor</label>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{specs.cpuCores} Physical Cores</span>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search database..."
              value={cpuSearch || specs.cpu}
              onChange={(e) => {
                setCpuSearch(e.target.value);
                setShowCpuDropdown(true);
              }}
              onFocus={() => setShowCpuDropdown(true)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800 shadow-inner group-hover/field:border-white/10"
            />
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500/20 group-focus-within/field:bg-blue-500 transition-colors" />
          </div>

          {showCpuDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredCPUs.length > 0 ? (
                filteredCPUs.map((cpu) => (
                  <button
                    key={cpu.id}
                    onClick={() => handleCpuSelect(cpu)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-500/10 text-sm text-slate-400 hover:text-white transition-all border-b border-white/5 last:border-0"
                  >
                    <p className="font-bold uppercase tracking-tight">{cpu.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">{cpu.cores} Physical Cores • {cpu.generation} Generation</p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase italic">No matches in local database</div>
              )}
            </div>
          )}
        </div>

        {/* GPU Selector */}
        <div className="relative group/field" ref={gpuDropdownRef}>
          <label className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.2em] mb-2.5 px-1 block group-focus-within/field:text-blue-400 transition-colors">Graphics Engine</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search database..."
              value={gpuSearch || specs.gpu}
              onChange={(e) => {
                setGpuSearch(e.target.value);
                setShowGpuDropdown(true);
              }}
              onFocus={() => setShowGpuDropdown(true)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800 shadow-inner group-hover/field:border-white/10"
            />
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500/20 group-focus-within/field:bg-blue-500 transition-colors" />
          </div>
          
          {showGpuDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredGPUs.length > 0 ? (
                filteredGPUs.map((gpu) => (
                  <button
                    key={gpu.id}
                    onClick={() => handleGpuSelect(gpu)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-500/10 text-sm text-slate-400 hover:text-white transition-all border-b border-white/5 last:border-0"
                  >
                    <p className="font-bold uppercase tracking-tight">{gpu.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">{gpu.architecture} Architecture</p>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-[10px] font-bold text-slate-600 uppercase italic">No matches in local database</div>
              )}
            </div>
          )}
        </div>

        {/* RAM Selector - REIMAGINED TACTILE SLIDER */}
        <div className="group/field">
          <div className="flex justify-between items-end mb-4 px-1">
            <label className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.2em] group-focus-within/field:text-blue-400 transition-colors">Volatile Memory</label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white italic leading-none">{specs.ram}</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">GIGABYTES</span>
            </div>
          </div>
          <div className="relative pt-2 pb-6">
            <input
              type="range"
              min="2"
              max="128"
              step="2"
              value={specs.ram}
              onChange={(e) => handleRamChange(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
            {/* Tick Marks for Common RAM sizes */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-0.5">
              {[8, 16, 32, 64, 128].map(size => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <div className={`w-0.5 h-1.5 rounded-full ${specs.ram >= size ? 'bg-blue-500/40' : 'bg-slate-800'}`} />
                  <span className={`text-[8px] font-black ${specs.ram === size ? 'text-blue-400' : 'text-slate-700'} transition-colors`}>{size}G</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
