// -------------------------------------
// User profile type
// -------------------------------------

export interface UserProfileType {
  id: string;
  display_name: string;
  email: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
}

// -------------------------------------
//  Track type
// -------------------------------------

interface AlbumType {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
}

interface ArtistType {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  duration_ms: number;
  album: AlbumType;
  artists: ArtistType[];
  external_urls: { spotify: string };
}

// -------------------------------------
//  Tracks type
// -------------------------------------

export interface TracksSearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

// -------------------------------------
// Playlist type
// -------------------------------------

export interface PlaylistType {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  description: string | null;
  owmer: {
    id: string;
    type: string;
    href: string;
    uri: string;
    display_name: string | null;
  };
}

// -------------------------------------
// Playlist list type
// -------------------------------------

export interface PlaylistListType {
  href: string;
  limit: string;
  items: {
    id: string;
    type: string;
    href: string;
    uri: string;
    name: string;
    tracks: {
      href: string;
      total: number;
    };
    images: {
      url: string;
      height: number | null;
      width: string | null;
    };
  }[];
}
