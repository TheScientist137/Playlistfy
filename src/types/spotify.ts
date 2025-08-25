// -----------------------------------------------------------------
// Common Types
// -----------------------------------------------------------------

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface ExternalUrls {
  spotify: string;
}

// -----------------------------------------------------------------
// User Types
// -----------------------------------------------------------------

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Image[];
}

// -----------------------------------------------------------------
// Tracks Types
// -----------------------------------------------------------------

export interface Track {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  duration_ms: number;
  album: Album;
  artists: Artist[];
  external_urls: ExternalUrls;
}

// -----------------------------------------------------------------
// Artists Types
// -----------------------------------------------------------------
export interface Artist {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  external_urls: ExternalUrls;
  followers: {
    total: number;
  };
  genres: string[];
  images: Image[];
}

// -----------------------------------------------------------------
// Albums Types
// -----------------------------------------------------------------

export interface Album {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  images: Image[];
  release_date: string;
  artists: Artist[];
  tracks: Track;
}

// -----------------------------------------------------------------
// Playlists Types
// -----------------------------------------------------------------

export interface Playlist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  images: Image[];
  tracks: {
    href: string;
    total: number;
  };
}

export interface UserPlaylistList {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: Playlist[];
}

// -----------------------------------------------------------------
// Search Types
// -----------------------------------------------------------------

export type SearchType = "track" | "album" | "artist" | "playlist";

export interface Paginated<Type> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string;
  total: number;
  items: Type[];
}

export interface SearchResponse {
  tracks?: Paginated<Track>;
  artists?: Paginated<Artist>;
  albums?: Paginated<Album>;
  playlists?: Paginated<Playlist>;
}
