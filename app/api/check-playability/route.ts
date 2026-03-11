// app/api/check-playability/route.ts

import { checkSpecs } from '@/lib/matchmaker/playabilityChecker';
import { HardwareSpecs } from '@/types/hardware';
import { SystemRequirements } from '@/types/igdb';
import { NextResponse } from 'next/server';

export interface CheckPlayabilityRequest {
  userSpecs: HardwareSpecs;
  gameRequirements: SystemRequirements;
}

/**
 * Checks if user's hardware can run a specific game
 * Returns detailed playability status and reasoning
 */
export async function POST(request: Request) {
  try {
    const body: CheckPlayabilityRequest = await request.json();

    // Validate input
    if (!body.userSpecs || !body.gameRequirements) {
      return NextResponse.json(
        { success: false, error: 'Missing userSpecs or gameRequirements' },
        { status: 400 }
      );
    }

    const report = checkSpecs(body.userSpecs, body.gameRequirements);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error checking playability:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check playability',
      },
      { status: 500 }
    );
  }
}
