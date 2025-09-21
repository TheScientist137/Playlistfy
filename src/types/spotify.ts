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

export type TrackContext =
  | "userPlaylist" // playlist del usuario (puede editar)
  | "playlist" // playlist de otro (solo ver)
  | "album"
  | "track"
  | "search"
  | "library"
  | "artist";

// -----------------------------------------------------------------
// User Types
// -----------------------------------------------------------------

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Image[];
  country: string;
  followers: { total: number };
  product: string; // premium || free
  type: "user";
  uri: string;
}

// -----------------------------------------------------------------
// User Types
// -----------------------------------------------------------------
export interface SearchType {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: TrackType[] | AlbumType[] | ArtistType[] | PlaylistType[];
}

// -----------------------------------------------------------------
// Tracks Types
// -----------------------------------------------------------------

export interface TrackType {
  id: string;
  type: string;
  href: string;
  uri: string;
  name: string;
  duration_ms: number;
  album: AlbumType;
  artists: ArtistType[];
  external_urls: ExternalUrls;
  available_markets: string[];
  disc_number: number;
  explicit: boolean;
  external_ids: {
    dis: string;
    ean: string;
    upc: string;
  };
  is_playable: boolean;
  popularity: number;
  track_number: number;
  is_local: boolean;
}

// -----------------------------------------------------------------
// Artists Types
// -----------------------------------------------------------------
export interface ArtistType {
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

export interface ArtistTopTracks {
  tracks: TrackType[];
}

export interface ArtistCursorPage {
  href: string;
  limit: number;
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  total: number;
  item: ArtistType[];
}

// -----------------------------------------------------------------
// Albums Types
// -----------------------------------------------------------------

export interface AlbumType {
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
  artists: ArtistType[];
  tracks: TrackType;
}

// -----------------------------------------------------------------
// Playlists Types
// -----------------------------------------------------------------

export interface PlaylistType {
  href: string;
  id: string;
  name: string;
  description: string;
  collaborative: boolean;
  type: string;
  uri: string;
  images?: Image[];
  tracks: {
    href: string;
    total: number;
  };
}

export interface UserPlaylistListType {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: PlaylistType[];
}

// -----------------------------------------------------------------
// Episode Types
// -----------------------------------------------------------------
export interface EpisodeType {
  id: string;
  type: "episode";
  uri: string;
  name: string;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  href: string;
  is_externally_hosted: boolean;
  is_playable: boolean;
  languages: string[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  show: {
    uri: string;
    name: string;
  };
}

// -----------------------------------------------------------------
// Search Types
// -----------------------------------------------------------------

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
  tracks?: Paginated<TrackType>;
  artists?: Paginated<ArtistType>;
  albums?: Paginated<AlbumType>;
  playlists?: Paginated<PlaylistType>;
}

// -----------------------------------------------------------------
// Playback Types
// -----------------------------------------------------------------

export interface PlaybackStateType {
  device: {
    id: string | null;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: "computer" | "smartphone" | "speaker";
    volume_percent: number | null;
    supports_volume: boolean;
  };
  repeate_state: "off" | "track" | "context";
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  } | null;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: TrackType | EpisodeType;
  currently_playing_type: string;
}
