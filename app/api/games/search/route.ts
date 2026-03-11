// app/api/games/search/route.ts

import { fetchIGDB } from '@/lib/igdb/client';
import { GameWithRequirements } from '@/types/igdb';
import { NextResponse } from 'next/server';

/**
 * Searches for games based on query parameters.
 * Supports filtering by genre, platforms, and rating.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let apicalypseQuery = `
      fields id, name, slug, cover.url, platforms.name, rating, release_dates.date, genres.name, websites.url, websites.category, summary;
      where platforms = (6) & rating >= 60 & release_dates.date > 0
    `;

    // Add search term if provided
    if (query && query.length > 0) {
      apicalypseQuery += ` & (name ~ *"${query}"* | slug ~ *"${query}"*)`;
    }

    // Add genre filter if provided
    if (genre && genre.length > 0) {
      apicalypseQuery += ` & genres.slug = "${genre}"`;
    }

    apicalypseQuery += `;
      sort rating desc;
      limit ${limit};
      offset ${offset};
    `;

    const games = await fetchIGDB({ query: apicalypseQuery });
    const gamesData = Array.isArray(games) ? games : [];

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
      stores: {
        steam: game.websites?.find((w: any) => w.category === 3)?.url,
        epic: game.websites?.find((w: any) => w.category === 13)?.url,
      }
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
    console.error('Error searching games:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search games',
      },
      { status: 500 }
    );
  }
}
