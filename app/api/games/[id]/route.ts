// app/api/games/[id]/route.ts

import { fetchIGDB } from '@/lib/igdb/client';
import { GameWithRequirements } from '@/types/igdb';
import { NextResponse } from 'next/server';

/**
 * Fetches detailed information for a specific game from IGDB.
 * Includes all available metadata and structured requirements.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id, 10);

    if (isNaN(gameId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    // Query for comprehensive game details
    const query = `
      fields 
        id, 
        name, 
        slug, 
        summary,
        cover.url, 
        platforms.name, 
        rating, 
        release_dates.date,
        genres.name, 
        websites.url,
        websites.category,
        game_engines.name,
        first_release_date;
      where id = ${gameId};
    `;

    const result = await fetchIGDB({ query });

    if (!result || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      );
    }

    const game = (result as any[])[0];

    // Format response
    const gameWithRequirements: GameWithRequirements = {
      id: game.id,
      name: game.name,
      slug: game.slug,
      cover: game.cover
        ? {
            id: game.cover.id,
            url: `https:${game.cover.url}`,
          }
        : undefined,
      platforms: game.platforms,
      rating: game.rating,
      genres: game.genres,
      websites: game.websites,
      game_engines: game.game_engines,
      // For now, requirements will be empty/null until IGDB provides them
      // In a production scenario, you'd integrate with a third-party requirements database
      systemRequirements: {
        minimum: {},
        recommended: {},
      },
    };

    return NextResponse.json({
      success: true,
      data: gameWithRequirements,
    });
  } catch (error) {
    console.error('Error fetching game details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch game details',
      },
      { status: 500 }
    );
  }
}
