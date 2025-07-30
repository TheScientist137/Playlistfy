import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyPlaylist,
} from "../types/spotify";

export const getUserProfile = async (token: string): Promise<SpotifyUser> => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
};

export const searchTracks = async (
  token: string,
  query: string,
  limit = 10,
): Promise<SpotifyTrack[]> => {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
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

export const createPlaylist = async (
  token: string,
  user_id: string,
  name: string,
  description: string,
): Promise<SpotifyPlaylist> => {
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
