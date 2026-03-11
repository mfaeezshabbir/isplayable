// app/api/genres/route.ts

import { fetchIGDB } from '@/lib/igdb/client';
import { NextResponse } from 'next/server';

/**
 * Fetches all game genres from IGDB.
 * Used for genre filtering in the UI.
 */
export async function GET() {
  try {
    const query = `
      fields id, name, slug;
      sort name asc;
    `;

    const genres = await fetchIGDB({ query });

    return NextResponse.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch genres',
      },
      { status: 500 }
    );
  }
}
