// lib/twitch/tokenManager.ts

interface CachedToken {
  access_token: string;
  token_type: string;
  expires_at: number;
}

let cachedToken: CachedToken | null = null;

/**
 * Generates a new Twitch OAuth2 token using Client Credentials flow.
 * Twitch requires a valid Bearer token for all IGDB API requests.
 */
async function generateNewToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET environment variables'
    );
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.statusText}`);
  }

  const data = await response.json();

  // Cache the token with expiration time (subtract 60 seconds for safety margin)
  cachedToken = {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.access_token;
}

/**
 * Retrieves a valid Twitch OAuth2 token, using cached token if still valid.
 * Automatically generates a new token if the cached one is expired.
 */
export async function getTwitchToken(): Promise<string> {
  // If we have a cached token and it hasn't expired, return it
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  // Otherwise, generate a new token
  return generateNewToken();
}

/**
 * Clears the cached token (useful for testing or manual token reset).
 */
export function clearTokenCache(): void {
  cachedToken = null;
}
