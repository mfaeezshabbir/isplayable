// lib/matchmaker/requirementParser.ts

/**
 * Advanced requirement parser using pattern matching and keyword extraction
 * Handles various formats: "GTX 1060", "GeForce 1060", "RTX 3060 Ti", "Radeon RX 6700", etc.
 */

export function parseGPUFromRequirement(requirementText: string): string | null {
  if (!requirementText) return null;

  const text = requirementText.toLowerCase();

  // NVIDIA patterns
  const nvidiaMatch = text.match(/(?:nvidia\s+)?(?:geforce\s+)?(?:gtx|rtx)\s+(?:super|ti)?\s*(\d+)/i);
  if (nvidiaMatch) {
    const number = nvidiaMatch[1];
    // Try to identify series and model
    if (text.includes('4090')) return 'NVIDIA GeForce RTX 4090';
    if (text.includes('4080')) return 'NVIDIA GeForce RTX 4080';
    if (text.includes('4070')) return 'NVIDIA GeForce RTX 4070';
    if (text.includes('4060')) return 'NVIDIA GeForce RTX 4060';
    if (text.includes('3090')) return 'NVIDIA GeForce RTX 3090';
    if (text.includes('3080')) return 'NVIDIA GeForce RTX 3080';
    if (text.includes('3070')) return 'NVIDIA GeForce RTX 3070';
    if (text.includes('3060')) return 'NVIDIA GeForce RTX 3060';
    if (text.includes('1660')) return 'NVIDIA GeForce GTX 1660';
    if (text.includes('1650')) return 'NVIDIA GeForce GTX 1650';
  }

  // AMD patterns
  const amdMatch = text.match(/(?:amd\s+)?(?:radeon\s+)?rx\s+(\d+)/i);
  if (amdMatch) {
    if (text.includes('7900')) return 'AMD Radeon RX 7900 XT';
    if (text.includes('7800')) return 'AMD Radeon RX 7800 XT';
    if (text.includes('7700')) return 'AMD Radeon RX 7700 XT';
    if (text.includes('7600')) return 'AMD Radeon RX 7600';
    if (text.includes('6800')) return 'AMD Radeon RX 6800 XT';
    if (text.includes('6700')) return 'AMD Radeon RX 6700 XT';
  }

  // Intel Arc patterns
  if (text.includes('arc a770')) return 'Intel Arc A770';
  if (text.includes('arc a750')) return 'Intel Arc A750';

  // Fallback: return original text if no pattern matched
  return requirementText || null;
}

export function parseCPUFromRequirement(requirementText: string): string | null {
  if (!requirementText) return null;

  const text = requirementText.toLowerCase();

  // Intel Core patterns
  const intelMatch = text.match(/intel\s+core\s+i[3579]-(\d+)(?:[kf]?)/i);
  if (intelMatch) {
    const gen = intelMatch[1].toString().substring(0, 2);
    if (text.includes('i9')) {
      if (text.includes('14')) return 'Intel Core i9-14900';
      if (text.includes('13')) return 'Intel Core i9-13900';
      if (text.includes('12')) return 'Intel Core i9-12900';
    }
    if (text.includes('i7')) {
      if (text.includes('14')) return 'Intel Core i7-14700';
      if (text.includes('13')) return 'Intel Core i7-13700';
      if (text.includes('12')) return 'Intel Core i7-12700';
    }
    if (text.includes('i5')) {
      if (text.includes('14')) return 'Intel Core i5-14400';
      if (text.includes('13')) return 'Intel Core i5-13400';
      if (text.includes('12')) return 'Intel Core i5-12400';
    }
  }

  // AMD Ryzen patterns
  const amdMatch = text.match(/amd\s+ryzen\s+([579])\s+(\d+)(?:x|g)?/i);
  if (amdMatch) {
    const series = amdMatch[1];
    if (text.includes('ryzen 9 7950')) return 'AMD Ryzen 9 7950X';
    if (text.includes('ryzen 7 7800x3d')) return 'AMD Ryzen 7 7800X3D';
    if (text.includes('ryzen 7 7700')) return 'AMD Ryzen 7 7700X';
    if (text.includes('ryzen 5 7600')) return 'AMD Ryzen 5 7600';
  }

  return requirementText || null;
}

export function parseRAMFromRequirement(requirementText: string): number | null {
  if (!requirementText) return null;

  // Match various formats: "8GB", "8 GB", "8mb", "8 MB", etc.
  const match = requirementText.match(/(\d+)\s*(?:gb|gig|gigabyte)/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}

export function parseStorageFromRequirement(requirementText: string): number | null {
  if (!requirementText) return null;

  // Match storage sizes
  const match = requirementText.match(/(\d+)\s*(?:gb|gig|gigabyte)?(?:\s*(?:disk|storage|space|ssd|hdd))?/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}
