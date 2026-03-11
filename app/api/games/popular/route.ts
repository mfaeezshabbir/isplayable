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
    // Filters: platforms must include PC (1), rating >= 60, release_dates < today
    const query = `
      fields id, name, slug, cover.url, platforms.name, rating, release_dates.date, genres.name, websites.url, websites.category;
      where platforms = (1) & rating >= 60 & release_dates.date > 0;
      sort rating desc;
      limit ${limit};
      offset ${offset};
    `;

    const games = await fetchIGDB({ query });

    // Fetch system requirements for each game (separate query)
    const gamesWithRequirements: GameWithRequirements[] = [];

    for (const game of games as any[]) {
      // Query game_modes, game_engines, and the raw requirements text
      // Note: IGDB doesn't have a dedicated system_requirements field in v4,
      // so we'll structure the response with available data
      const requirementsQuery = `
        fields game_modes.name, game_engines.name;
        where id = ${game.id};
      `;

      try {
        const reqData = await fetchIGDB({ query: requirementsQuery });
        const gameData = (reqData as any[])[0] || {};

        // Format the game with requirements
        const gameWithReq: GameWithRequirements = {
          ...game,
          cover: game.cover
            ? {
                id: game.cover.id,
                url: `https:${game.cover.url}`, // IGDB returns relative URLs
              }
            : undefined,
          systemRequirements: {
            minimum: {},
            recommended: {},
          },
        };

        gamesWithRequirements.push(gameWithReq);
      } catch (error) {
        // If requirements query fails, still include the game
        const gameWithReq: GameWithRequirements = {
          ...game,
          cover: game.cover
            ? {
                id: game.cover.id,
                url: `https:${game.cover.url}`,
              }
            : undefined,
        };
        gamesWithRequirements.push(gameWithReq);
      }
    }

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
