// lib/matchmaker/playabilityChecker.ts

import { HardwareSpecs } from '@/types/hardware';
import { SystemRequirements } from '@/types/igdb';
import { estimateCPUTier, estimateGPUTier, CPU_TIERS, GPU_TIERS } from './hardwareTiers';
import {
  parseGPUFromRequirement,
  parseCPUFromRequirement,
  parseRAMFromRequirement,
  parseStorageFromRequirement,
} from './requirementParser';

export type PlayabilityStatus = 'unplayable' | 'minimum' | 'recommended';

export interface PlayabilityReport {
  status: PlayabilityStatus;
  canRunMinimum: boolean;
  canRunRecommended: boolean;
  reasons: string[];
  details: {
    cpu: { meets: boolean; userTier: number; reqTier: number };
    ram: { meets: boolean; userGB: number; reqGB: number };
    gpu: { meets: boolean; userTier: number; reqTier: number };
    storage: { meets: boolean; userGB: number; reqGB: number };
  };
}

/**
 * Main playability checker function
 * Compares user hardware specs with game requirements
 * Returns detailed playability status: unplayable, minimum, or recommended
 */
export function checkSpecs(
  userSpecs: HardwareSpecs,
  gameRequirements: SystemRequirements
): PlayabilityReport {
  const report: PlayabilityReport = {
    status: 'unplayable',
    canRunMinimum: false,
    canRunRecommended: false,
    reasons: [],
    details: {
      cpu: { meets: false, userTier: 0, reqTier: 0 },
      ram: { meets: false, userGB: 0, reqGB: 0 },
      gpu: { meets: false, userTier: 0, reqTier: 0 },
      storage: { meets: false, userGB: 0, reqGB: 0 },
    },
  };

  // Get user hardware tiers
  const userCpuTier = CPU_TIERS[userSpecs.cpu as keyof typeof CPU_TIERS] ||
    estimateCPUTier(userSpecs.cpu) || 8000;
  const userGpuTier = GPU_TIERS[userSpecs.gpu as keyof typeof GPU_TIERS] ||
    estimateGPUTier(userSpecs.gpu) || 2000;
  const userRam = userSpecs.ram;
  const userStorage = 500; // Assume 500GB free space (can be configurable later)

  // Check minimum requirements
  if (gameRequirements.minimum) {
    const minCpuTier = parseCPUTier(gameRequirements.minimum.cpu);
    const minGpuTier = parseGPUTier(gameRequirements.minimum.gpu);
    const minRam = gameRequirements.minimum.ram || 0;
    const minStorage = gameRequirements.minimum.storage || 0;

    const cpuMeets = userCpuTier >= minCpuTier;
    const gpuMeets = userGpuTier >= minGpuTier;
    const ramMeets = userRam >= minRam;
    const storageMeets = userStorage >= minStorage;

    report.canRunMinimum = cpuMeets && gpuMeets && ramMeets && storageMeets;

    // Track details
    if (!cpuMeets) {
      report.reasons.push(`CPU is below minimum (user tier: ${userCpuTier}, required: ${minCpuTier})`);
    }
    if (!gpuMeets) {
      report.reasons.push(`GPU is below minimum (user tier: ${userGpuTier}, required: ${minGpuTier})`);
    }
    if (!ramMeets) {
      report.reasons.push(`RAM is below minimum (you have: ${userRam}GB, required: ${minRam}GB)`);
    }
    if (!storageMeets) {
      report.reasons.push(`Storage is insufficient (you have: ${userStorage}GB, required: ${minStorage}GB)`);
    }
  }

  // Check recommended requirements
  if (gameRequirements.recommended) {
    const recCpuTier = parseCPUTier(gameRequirements.recommended.cpu);
    const recGpuTier = parseGPUTier(gameRequirements.recommended.gpu);
    const recRam = gameRequirements.recommended.ram || 0;
    const recStorage = gameRequirements.recommended.storage || 0;

    const cpuMeets = userCpuTier >= recCpuTier;
    const gpuMeets = userGpuTier >= recGpuTier;
    const ramMeets = userRam >= recRam;
    const storageMeets = userStorage >= recStorage;

    report.canRunRecommended = cpuMeets && gpuMeets && ramMeets && storageMeets;
  }

  // Determine overall status
  if (report.canRunRecommended) {
    report.status = 'recommended';
  } else if (report.canRunMinimum) {
    report.status = 'minimum';
  } else {
    report.status = 'unplayable';
  }

  return report;
}

/**
 * Helper: Parse CPU requirement string to performance tier
 */
function parseCPUTier(cpuString: string | undefined): number {
  if (!cpuString) return 0;

  const cpuName = parseCPUFromRequirement(cpuString);
  if (!cpuName) return 5000; // Default assumption

  return CPU_TIERS[cpuName as keyof typeof CPU_TIERS] ||
    estimateCPUTier(cpuName) || 5000;
}

/**
 * Helper: Parse GPU requirement string to performance tier
 */
function parseGPUTier(gpuString: string | undefined): number {
  if (!gpuString) return 0;

  const gpuName = parseGPUFromRequirement(gpuString);
  if (!gpuName) return 1000; // Default assumption

  return GPU_TIERS[gpuName as keyof typeof GPU_TIERS] ||
    estimateGPUTier(gpuName) || 1000;
}
