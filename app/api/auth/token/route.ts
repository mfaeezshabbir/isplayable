// app/api/auth/token/route.ts

import { getTwitchToken } from '@/lib/twitch/tokenManager';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = await getTwitchToken();
    return NextResponse.json({
      success: true,
      message: 'Twitch token generated successfully',
      token: token.substring(0, 20) + '...', // Redact for security
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
