// lib/hardware/cpuGpuDatabase.ts

import { CPU, GPU } from '@/types/hardware';

export const CPUs: CPU[] = [
  // Intel Core i3
  { id: 'i3-10100', name: 'Intel Core i3-10100', cores: 4, generation: '10th' },
  { id: 'i3-12100', name: 'Intel Core i3-12100', cores: 4, generation: '12th' },
  { id: 'i3-13100', name: 'Intel Core i3-13100', cores: 4, generation: '13th' },

  // Intel Core i5
  { id: 'i5-10400', name: 'Intel Core i5-10400', cores: 6, generation: '10th' },
  { id: 'i5-12400', name: 'Intel Core i5-12400', cores: 6, generation: '12th' },
  { id: 'i5-13400', name: 'Intel Core i5-13400', cores: 10, generation: '13th' },
  { id: 'i5-14400', name: 'Intel Core i5-14400', cores: 10, generation: '14th' },

  // Intel Core i7
  { id: 'i7-10700', name: 'Intel Core i7-10700', cores: 8, generation: '10th' },
  { id: 'i7-12700', name: 'Intel Core i7-12700', cores: 12, generation: '12th' },
  { id: 'i7-13700', name: 'Intel Core i7-13700', cores: 16, generation: '13th' },
  { id: 'i7-14700', name: 'Intel Core i7-14700', cores: 20, generation: '14th' },

  // Intel Core i9
  { id: 'i9-12900', name: 'Intel Core i9-12900', cores: 16, generation: '12th' },
  { id: 'i9-13900', name: 'Intel Core i9-13900', cores: 24, generation: '13th' },
  { id: 'i9-14900', name: 'Intel Core i9-14900', cores: 24, generation: '14th' },

  // AMD Ryzen 5
  { id: 'r5-5600', name: 'AMD Ryzen 5 5600', cores: 6, generation: '5000' },
  { id: 'r5-7600', name: 'AMD Ryzen 5 7600', cores: 6, generation: '7000' },

  // AMD Ryzen 7
  { id: 'r7-5700x', name: 'AMD Ryzen 7 5700X', cores: 8, generation: '5000' },
  { id: 'r7-7700x', name: 'AMD Ryzen 7 7700X', cores: 8, generation: '7000' },
  { id: 'r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', cores: 8, generation: '7000' },

  // AMD Ryzen 9
  { id: 'r9-5950x', name: 'AMD Ryzen 9 5950X', cores: 16, generation: '5000' },
  { id: 'r9-7950x', name: 'AMD Ryzen 9 7950X', cores: 16, generation: '7000' },
];

export const GPUs: GPU[] = [
  // NVIDIA GeForce GTX
  { id: 'gtx-1650', name: 'NVIDIA GeForce GTX 1650', vram: 4, architecture: 'Turing' },
  { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660', vram: 6, architecture: 'Turing' },
  { id: 'gtx-1660s', name: 'NVIDIA GeForce GTX 1660 SUPER', vram: 6, architecture: 'Turing' },

  // NVIDIA GeForce RTX 30 Series
  { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050', vram: 8, architecture: 'Ampere' },
  { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060', vram: 12, architecture: 'Ampere' },
  { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070', vram: 8, architecture: 'Ampere' },
  { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080', vram: 10, architecture: 'Ampere' },
  { id: 'rtx-3090', name: 'NVIDIA GeForce RTX 3090', vram: 24, architecture: 'Ampere' },

  // NVIDIA GeForce RTX 40 Series
  { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060', vram: 8, architecture: 'Ada' },
  { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070', vram: 12, architecture: 'Ada' },
  { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080', vram: 16, architecture: 'Ada' },
  { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', vram: 24, architecture: 'Ada' },

  // AMD Radeon RX 6000 Series
  { id: 'rx-6600', name: 'AMD Radeon RX 6600', vram: 8, architecture: 'RDNA 2' },
  { id: 'rx-6700', name: 'AMD Radeon RX 6700 XT', vram: 12, architecture: 'RDNA 2' },
  { id: 'rx-6800', name: 'AMD Radeon RX 6800', vram: 16, architecture: 'RDNA 2' },
  { id: 'rx-6800-xt', name: 'AMD Radeon RX 6800 XT', vram: 16, architecture: 'RDNA 2' },

  // AMD Radeon RX 7000 Series
  { id: 'rx-7600', name: 'AMD Radeon RX 7600', vram: 16, architecture: 'RDNA 3' },
  { id: 'rx-7700', name: 'AMD Radeon RX 7700 XT', vram: 12, architecture: 'RDNA 3' },
  { id: 'rx-7800', name: 'AMD Radeon RX 7800 XT', vram: 16, architecture: 'RDNA 3' },
  { id: 'rx-7900-gre', name: 'AMD Radeon RX 7900 GRE', vram: 12, architecture: 'RDNA 3' },
  { id: 'rx-7900-xt', name: 'AMD Radeon RX 7900 XT', vram: 20, architecture: 'RDNA 3' },

  // Intel Arc
  { id: 'arc-a770', name: 'Intel Arc A770', vram: 8, architecture: 'Alchemist' },
  { id: 'arc-a750', name: 'Intel Arc A750', vram: 8, architecture: 'Alchemist' },

  // Integrated / No Discrete GPU
  { id: 'integrated-gen', name: 'Integrated Graphics (General)', vram: 0, architecture: 'Integrated' },
  { id: 'no-gpu', name: 'No Discrete Graphics Card', vram: 0, architecture: 'None' },
];
