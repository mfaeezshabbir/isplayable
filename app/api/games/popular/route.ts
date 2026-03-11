// app/api/games/popular/route.ts

import { fetchIGDB } from '@/lib/igdb/client';
import { parseSystemRequirements, extractStoreLinks } from '@/lib/igdb/parseRequirements';
import { GameWithRequirements } from '@/types/igdb';
import { NextResponse } from 'next/server';

/**
 * Fetches popular PC games from IGDB with system requirements and metadata.
 * Uses Apicalypse syntax for precise filtering and field selection.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Apicalypse query to fetch popular PC games
    // Filters: platforms must include PC (6 for Windows) - Platforms mapping: 6=PC, 1=PC (General)
    // IGDB V4 defines PC as 6.
    const query = `
      fields id, name, slug, cover.url, platforms.name, rating, release_dates.date, genres.name, websites.url, websites.category, summary;
      where platforms = (6) & rating >= 60 & release_dates.date > 0;
      sort rating desc;
      limit ${limit};
      offset ${offset};
    `;

    const games = await fetchIGDB({ query });
    const gamesData = Array.isArray(games) ? games : [];

    // Format the games with baseline requirements
    const gamesWithRequirements: GameWithRequirements[] = gamesData.map((game: any) => ({
      ...game,
      cover: game.cover
        ? {
            id: game.cover.id,
            url: `https:${game.cover.url}`.replace('t_thumb', 't_720p'),
          }
        : undefined,
      systemRequirements: {
        minimum: {
          cpu: "Intel Core i5-4460",
          gpu: "GTX 1060",
          ram: 8,
          storage: 50
        },
        recommended: {
          cpu: "Intel Core i7-8700K",
          gpu: "RTX 2060",
          ram: 16,
          storage: 50
        }
      },
      stores: extractStoreLinks(game.websites)
    }));

    return NextResponse.json({
      success: true,
      data: gamesWithRequirements,
      pagination: {
        limit,
        offset,
        total: gamesWithRequirements.length,
      },
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch games',
      },
      { status: 500 }
    );
  }
}
