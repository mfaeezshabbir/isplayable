// hooks/useGenres.ts

'use client';

import { useState, useEffect } from 'react';

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/genres');
        if (!response.ok) throw new Error('Failed to fetch genres');

        const data = await response.json();
        setGenres(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, isLoading, error };
}
