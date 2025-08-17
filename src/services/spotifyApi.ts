import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyPlaylist,
} from "../types/spotify";

import type { UserPlaylistList } from "../components/PlaylistList";

import { getAccessToken } from "./pkceAuth";

export const getUserProfile = async (): Promise<SpotifyUser> => {
  const token = await getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
};

export const searchTracks = async (
  query: string,
  limit = 10,
): Promise<SpotifyTrack[]> => {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: limit.toString(),
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
// Manage playlists services
// ----------------------------------------------------------------------------------

export const getCurrentUserPlaylists = async (): Promise<UserPlaylistList> => {
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
): Promise<SpotifyPlaylist> => {
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
