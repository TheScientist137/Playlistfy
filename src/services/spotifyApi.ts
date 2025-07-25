import type { SpotifyUser, TracksSearchResponse } from "../types/spotify";

export const getUserProfile = async (token: string): Promise<SpotifyUser> => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
}

export const searchTracks = async (token: string, query: string, limit = 20): Promise<TracksSearchResponse> => {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: String(limit)
  })

  const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("Search tracks failed");
  return res.json();
}