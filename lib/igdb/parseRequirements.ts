// lib/igdb/parseRequirements.ts

import { SystemRequirements } from '@/types/igdb';

/**
 * Parses system requirements text from IGDB.
 * IGDB returns requirements as raw HTML/text strings.
 * This function extracts CPU, GPU, RAM, and storage info.
 */
export function parseSystemRequirements(rawText: string | null): SystemRequirements {
  if (!rawText) {
    return { minimum: {}, recommended: {}, raw: rawText || undefined };
  }

  // Remove HTML tags if present
  const cleanText = rawText.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');

  // Try to identify minimum and recommended sections
  const minMatch = cleanText.match(/minimum[^r]*/i);
  const recMatch = cleanText.match(/recommended[^\n]*/i);

  const minimum = minMatch ? parseRequirementBlock(minMatch[0]) : {};
  const recommended = recMatch ? parseRequirementBlock(recMatch[0]) : {};

  return {
    minimum,
    recommended,
    raw: cleanText,
  };
}

function parseRequirementBlock(text: string): SystemRequirements['minimum'] {
  const result: SystemRequirements['minimum'] = {};

  // Extract OS
  const osMatch = text.match(/(?:os|operating system|windows|macos|linux)[:\s]+([^\n,]+)/i);
  if (osMatch) {
    result.os = osMatch[1].trim();
  }

  // Extract CPU
  const cpuMatch = text.match(/(?:processor|cpu|intel|amd)[:\s]+([^\n,]+)/i);
  if (cpuMatch) {
    result.cpu = cpuMatch[1].trim();
  }

  // Extract RAM (various formats: "8GB", "8 GB", "8gb RAM", etc.)
  const ramMatch = text.match(/(\d+)\s*(?:gb|gig)?[^\d]*(?:ram|memory)?/i);
  if (ramMatch) {
    result.ram = parseInt(ramMatch[1], 10);
  }

  // Extract GPU
  const gpuMatch = text.match(/(?:graphics|gpu|video card|graphics card)[:\s]+([^\n,]+)/i);
  if (gpuMatch) {
    result.gpu = gpuMatch[1].trim();
  }

  // Extract Storage (various formats: "50GB", "50 GB SSD", etc.)
  const storageMatch = text.match(/(\d+)\s*(?:gb)?[^\d]*(?:disk|storage|space)/i);
  if (storageMatch) {
    result.storage = parseInt(storageMatch[1], 10);
  }

  return result;
}

/**
 * Extracts store URLs from IGDB websites data.
 * Maps IGDB category codes to store names.
 */
export function extractStoreLinks(websites: any[] | undefined): { steam?: string; epic?: string; gog?: string; official?: string } {
  const stores: { steam?: string; epic?: string; gog?: string; official?: string } = {};

  if (!websites) return stores;

  websites.forEach((site: any) => {
    const url = site.url || '';
    const category = site.category || 0;

    // Category mappings: 3=Steam, 13=Epic Games, 14=GOG, 1=Official
    if (category === 3) {
      stores.steam = url;
    } else if (category === 13) {
      stores.epic = url;
    } else if (category === 14) {
      stores.gog = url;
    } else if (category === 1) {
      stores.official = url;
    }
  });

  return stores;
}
