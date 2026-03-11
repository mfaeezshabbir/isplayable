// types/hardware.ts

export interface HardwareSpecs {
  cpu: string;
  cpuCores: number;
  ram: number; // in GB
  gpu: string;
}

export interface DetectedHardware {
  estimatedRam: number;
  logicalCores: number;   // raw from navigator.hardwareConcurrency (includes HT/SMT)
  cpuCores: number;       // estimated physical cores (logicalCores / 2 for HT CPUs)
  cpuVendor: string;      // 'Intel' | 'AMD' | '' — inferred from GPU vendor or UA
  gpuRenderer: string;
  gpuVendor: string;      // raw GL vendor string e.g. 'Intel Inc.', 'NVIDIA Corporation'
}

export interface CPU {
  id: string;
  name: string;
  cores: number;
  generation?: string;
}

export interface GPU {
  id: string;
  name: string;
  vram?: number; // in GB
  architecture?: string;
}
