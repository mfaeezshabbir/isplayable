// hooks/useGames.ts

'use client';

import { useState, useEffect } from 'react';
import { GameWithRequirements } from '@/types/igdb';

interface UseGamesOptions {
  limit?: number;
  offset?: number;
  genre?: string;
  search?: string;
}

export function useGames(options: UseGamesOptions = {}) {
  const [games, setGames] = useState<GameWithRequirements[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url = '/api/games/popular?';
        if (options.limit) url += `limit=${options.limit}&`;
        if (options.offset) url += `offset=${options.offset}&`;

        // Use search endpoint if search query or genre is provided
        if (options.search || options.genre) {
          url = '/api/games/search?';
          if (options.search) url += `q=${encodeURIComponent(options.search)}&`;
          if (options.genre) url += `genre=${encodeURIComponent(options.genre)}&`;
          if (options.limit) url += `limit=${options.limit}&`;
          if (options.offset) url += `offset=${options.offset}&`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch games');

        const data = await response.json();
        setGames(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [options.limit, options.offset, options.genre, options.search]);

  return { games, isLoading, error };
}
