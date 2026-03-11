// types/igdb.ts

export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  cover?: {
    id: number;
    url: string;
  };
  platforms?: IGDBPlatform[];
  game_engines?: IGDBGameEngine[];
  websites?: IGDBWebsite[];
  rating?: number;
  release_dates?: IGDBReleaseDate[];
  genres?: IGDBGenre[];
}

export interface IGDBPlatform {
  id: number;
  name: string;
  slug: string;
}

export interface IGDBGameEngine {
  id: number;
  name: string;
  slug: string;
}

export interface IGDBWebsite {
  id: number;
  url: string;
  category: number; // 1=Official, 3=Steam, 13=Epic Games, 14=GOG, etc.
  category_description?: string;
}

export interface IGDBGenre {
  id: number;
  name: string;
  slug: string;
}

export interface IGDBReleaseDate {
  id: number;
  game: number;
  platform: number;
  date: number;
  human: string;
  m: number;
  y: number;
}

export interface SystemRequirements {
  minimum: {
    os?: string;
    cpu?: string;
    ram?: number; // in GB
    gpu?: string;
    storage?: number; // in GB
    raw?: string;
  };
  recommended: {
    os?: string;
    cpu?: string;
    ram?: number; // in GB
    gpu?: string;
    storage?: number; // in GB
    raw?: string;
  };
  raw?: string;
}

export interface GameWithRequirements extends IGDBGame {
  systemRequirements?: SystemRequirements;
}
