import { getAccessToken } from "./pkceAuth";
import type {
  UserProfile,
  UserPlaylistListType,
  PlaylistType,
  SearchType,
  SearchResponse,
  PlaybackStateType,
} from "../types/spotify";

export const getAlbum = async (id: string) => {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch album");

  return res.json();
};

export const getArtist = async (id: string) => {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch artist");

  return res.json();
};

export const getArtistAlbums = async (id: string) => {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch artist albums");

  return res.json();
};

export const getPlaylist = async (id: string) => {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch playlist");

  return res.json();
};

// ----------------------------------------------------------------------------------
// Profile services
// ----------------------------------------------------------------------------------

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = await getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
};

// ----------------------------------------------------------------------------------
// Search services
// ----------------------------------------------------------------------------------

export const search = async (
  query: string,
  type: SearchType,
  limit: number = 20,
  offset: number = 0,
): Promise<SearchResponse> => {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: type,
    market: "ES",
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const res = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Search tracks failed");
  return res.json();
};

// ----------------------------------------------------------------------------------
//  Playlists services
// ----------------------------------------------------------------------------------

export const getCurrentUserPlaylists =
  async (): Promise<UserPlaylistListType> => {
    const token = await getAccessToken();

    const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error getting user playlists");

    return res.json();
  };

export const createPlaylist = async (
  user_id: string,
  name: string,
  description: string,
): Promise<PlaylistType> => {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    },
  );

  if (!res.ok) throw new Error("Create playlist failed");
  return res.json();
};

// ----------------------------------------------------------------------------------
//  Playback services
// ----------------------------------------------------------------------------------

// Transfer playback to new device (web player)
// If play = true, starts playback immediately.
export const transferPlayback = async (
  deviceId: string,
  play: boolean,
): Promise<void> => {
  const token = await getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device_ids: [deviceId], play: play }),
  });

  if (!res.ok) throw new Error("Failed to transfer playback");
};

// Get current playback state
export const getPlaybackState = async (): Promise<PlaybackStateType> => {
  const token = await getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obtaining current playback state");
  return res.json();
};

// Start/Resume Playback
export const playUris = async (
  deviceId: string,
  uris: string[],
): Promise<void> => {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    },
  );

  if (!res.ok) throw new Error("Failed to start/resume playback");
};

export const pausePlayback = async (deviceId?: string): Promise<void> => {
  const token = await getAccessToken();

  const url = new URL("https://api.spotify.com/v1/me/player/pause");
  if (deviceId) url.searchParams.set("device_id", deviceId);

  const res = await fetch(url.toString(), {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to pause playback: ${res.status} ${res.statusText}`,
    );
  }
};
