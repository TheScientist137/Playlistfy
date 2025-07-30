export interface UserImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: UserImage[];
}

interface Album {
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

interface Artist {
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
  album: Album;
  artists: Artist[];
  external_urls: { spotify: string };
}

export interface TracksSearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyPlaylist {
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

