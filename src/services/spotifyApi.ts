import { getAccessToken } from "./pkceAuth";
import type {
  UserProfile,
  UserPlaylistList,
  Playlist,
  SearchType,
  SearchResponse,
} from "../types/spotify";

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
): Promise<Playlist> => {
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
