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
      fields id, name, slug, cover.url, platforms.name, rating, release_dates.date, genres.name, websites.url, websites.category;
      where platforms = (1) & rating >= 60 & release_dates.date > 0
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

    const gamesWithRequirements: GameWithRequirements[] = (games as any[]).map((game) => ({
      ...game,
      cover: game.cover
        ? {
            id: game.cover.id,
            url: `https:${game.cover.url}`,
          }
        : undefined,
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
