// lib/igdb/client.ts

import { getTwitchToken } from '@/lib/twitch/tokenManager';

export interface IGDBRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
}

/**
 * Makes an authenticated request to the IGDB API using Apicalypse syntax.
 * Automatically includes the Twitch Bearer token.
 */
export async function fetchIGDB(options: IGDBRequestOptions): Promise<unknown[]> {
  const token = await getTwitchToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!clientId) {
    throw new Error('Missing TWITCH_CLIENT_ID environment variable');
  }

  const response = await fetch(process.env.IGDB_API_ENDPOINT + '/games', {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: options.query,
  });

  if (!response.ok) {
    throw new Error(`IGDB API request failed: ${response.statusText}`);
  }

  return response.json();
}
