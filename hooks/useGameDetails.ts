// hooks/useGameDetails.ts

'use client';

import { useState, useEffect } from 'react';
import { GameWithRequirements } from '@/types/igdb';

export function useGameDetails(gameId: number | null) {
  const [game, setGame] = useState<GameWithRequirements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      return;
    }

    const fetchGameDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) throw new Error('Failed to fetch game details');

        const data = await response.json();
        setGame(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  return { game, isLoading, error };
}
