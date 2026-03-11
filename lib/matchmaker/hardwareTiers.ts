// lib/matchmaker/hardwareTiers.ts

/**
 * CPU Performance Tier System
 * Based on synthetic benchmarks (Passmark, Cinebench)
 * Relative performance score (lower = older/slower)
 */
export const CPU_TIERS = {
  'Intel Core i3-10100': 8000,
  'Intel Core i3-12100': 10000,
  'Intel Core i3-13100': 11000,

  'Intel Core i5-10400': 13000,
  'Intel Core i5-12400': 16000,
  'Intel Core i5-13400': 18000,
  'Intel Core i5-14400': 20000,

  'Intel Core i7-10700': 16000,
  'Intel Core i7-12700': 22000,
  'Intel Core i7-13700': 25000,
  'Intel Core i7-14700': 28000,

  'Intel Core i9-12900': 26000,
  'Intel Core i9-13900': 30000,
  'Intel Core i9-14900': 33000,

  'AMD Ryzen 5 5600': 12000,
  'AMD Ryzen 5 7600': 15000,

  'AMD Ryzen 7 5700X': 16000,
  'AMD Ryzen 7 7700X': 20000,
  'AMD Ryzen 7 7800X3D': 22000,

  'AMD Ryzen 9 5950X': 24000,
  'AMD Ryzen 9 7950X': 29000,
};

/**
 * GPU Performance Tier System
 * Based on synthetic benchmarks (3DMark, GFXBench)
 * Relative performance score (lower = older/slower)
 */
export const GPU_TIERS = {
  // NVIDIA GTX
  'NVIDIA GeForce GTX 1650': 3000,
  'NVIDIA GeForce GTX 1660': 4000,
  'NVIDIA GeForce GTX 1660 SUPER': 4500,

  // NVIDIA RTX 30 Series
  'NVIDIA GeForce RTX 3050': 5000,
  'NVIDIA GeForce RTX 3060': 7000,
  'NVIDIA GeForce RTX 3070': 10000,
  'NVIDIA GeForce RTX 3080': 14000,
  'NVIDIA GeForce RTX 3090': 18000,

  // NVIDIA RTX 40 Series
  'NVIDIA GeForce RTX 4060': 6000,
  'NVIDIA GeForce RTX 4070': 12000,
  'NVIDIA GeForce RTX 4080': 16000,
  'NVIDIA GeForce RTX 4090': 20000,

  // AMD Radeon RX 6000
  'AMD Radeon RX 6600': 5500,
  'AMD Radeon RX 6700 XT': 9000,
  'AMD Radeon RX 6800': 11000,
  'AMD Radeon RX 6800 XT': 13000,

  // AMD Radeon RX 7000
  'AMD Radeon RX 7600': 6500,
  'AMD Radeon RX 7700 XT': 10000,
  'AMD Radeon RX 7800 XT': 14000,
  'AMD Radeon RX 7900 GRE': 12500,
  'AMD Radeon RX 7900 XT': 17000,

  // Intel Arc
  'Intel Arc A770': 8000,
  'Intel Arc A750': 6500,

  // Integrated / No GPU
  'Integrated Graphics (General)': 800,
  'No Discrete Graphics Card': 200,
};

/**
 * Estimate GPU tier based on GPU name/renderer string
 * Used when user's GPU doesn't exactly match our database
 */
export function estimateGPUTier(gpuRenderer: string): number {
  const renderer = gpuRenderer.toLowerCase();

  // Exact matches
  for (const [gpuName, tier] of Object.entries(GPU_TIERS)) {
    if (renderer.includes(gpuName.toLowerCase())) {
      return tier;
    }
  }

  // Common laptop/integrated GPU strings
  if (renderer.includes('uhd graphics') || renderer.includes('intel iris') || renderer.includes('intel hd graphics')) {
    if (renderer.includes('630')) return 1200; // Intel UHD 630
    if (renderer.includes('620')) return 1000;
    return 1000; // Base integrated
  }

  if (renderer.includes('adreno')) return 800; // Smartphone/Base
  if (renderer.includes('apple') || renderer.includes('m1') || renderer.includes('m2')) return 5000; // Base M1

  // Pattern-based estimation
  if (renderer.includes('rtx 4090')) return 20000;
  if (renderer.includes('rtx 4080')) return 16000;
  if (renderer.includes('rtx 4070')) return 12000;
  if (renderer.includes('rtx 4060')) return 6000;
  if (renderer.includes('rtx 3090')) return 18000;
  if (renderer.includes('rtx 3080')) return 14000;
  if (renderer.includes('rtx 3070')) return 10000;
  if (renderer.includes('rtx 3060')) return 7000;
  if (renderer.includes('gtx 166')) return 4000;
  if (renderer.includes('gtx 165')) return 3000;

  if (renderer.includes('rx 7900')) return 17000;
  if (renderer.includes('rx 7800')) return 14000;
  if (renderer.includes('rx 7700')) return 10000;
  if (renderer.includes('rx 6800')) return 12000;
  if (renderer.includes('rx 6700')) return 9000;

  if (renderer.includes('arc a770')) return 8000;
  if (renderer.includes('arc a750')) return 6500;

  // Fallback: assume integrated graphics or unknown
  return 2000;
}

/**
 * Estimate CPU tier based on CPU name string
 * Used when user's CPU doesn't exactly match our database
 */
export function estimateCPUTier(cpuName: string): number {
  const cpu = cpuName.toLowerCase();

  // Exact matches
  for (const [cpuFullName, tier] of Object.entries(CPU_TIERS)) {
    if (cpu === cpuFullName.toLowerCase()) {
      return tier;
    }
  }

  // Pattern-based estimation for Intel
  if (cpu.includes('i9-14')) return 33000;
  if (cpu.includes('i9-13')) return 30000;
  if (cpu.includes('i9-12')) return 26000;
  if (cpu.includes('i7-14')) return 28000;
  if (cpu.includes('i7-13')) return 25000;
  if (cpu.includes('i7-12')) return 22000;
  if (cpu.includes('i5-14')) return 20000;
  if (cpu.includes('i5-13')) return 18000;
  if (cpu.includes('i5-12')) return 16000;
  if (cpu.includes('i3-13')) return 11000;
  if (cpu.includes('i3-12')) return 10000;

  // Pattern-based estimation for AMD
  if (cpu.includes('ryzen 9 7950')) return 29000;
  if (cpu.includes('ryzen 9 5950')) return 24000;
  if (cpu.includes('ryzen 7 7800x3d')) return 22000;
  if (cpu.includes('ryzen 7 7700')) return 20000;
  if (cpu.includes('ryzen 7 5700')) return 16000;
  if (cpu.includes('ryzen 5 7600')) return 15000;
  if (cpu.includes('ryzen 5 5600')) return 12000;

  // Fallback: generic estimation
  return 8000;
}
