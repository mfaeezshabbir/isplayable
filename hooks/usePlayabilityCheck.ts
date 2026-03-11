// hooks/usePlayabilityCheck.ts

'use client';

import { useState } from 'react';
import { HardwareSpecs } from '@/types/hardware';
import { SystemRequirements } from '@/types/igdb';
import { PlayabilityReport } from '@/lib/matchmaker/playabilityChecker';

export function usePlayabilityCheck() {
  const [report, setReport] = useState<PlayabilityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPlayability = async (userSpecs: HardwareSpecs, gameRequirements: SystemRequirements) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/check-playability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSpecs,
          gameRequirements,
        }),
      });

      if (!response.ok) throw new Error('Failed to check playability');

      const data = await response.json();
      setReport(data.data);
      return data.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { report, isLoading, error, checkPlayability };
}
