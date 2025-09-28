import { useAuthStore } from "../stores/useAuthStore";
import type { UserProfile } from "../types/spotify";

// ----------------------------------------------------------------------------------
// Get Current User's Profile
// ----------------------------------------------------------------------------------

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
};

// ----------------------------------------------------------------------------------
// Get User's Top Items
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// Get User's Profile
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// Follow Playlist
// ----------------------------------------------------------------------------------

export const followPlaylist = async (playlist_id: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/followers`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Failed to follow playlist");
};

// ----------------------------------------------------------------------------------
// Unfollow Playlist
// ----------------------------------------------------------------------------------

export const unFollowPlaylist = async (playlist_id: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/followers`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to unfollow playlist");
};

// ----------------------------------------------------------------------------------
// Get Followes Artists
// ----------------------------------------------------------------------------------

export const getFollowedArtists = async (after?: string, before?: string) => {
  const token = await useAuthStore.getState().getAccessToken();

  const params = new URLSearchParams({ type: "artist" });
  if (after && before) throw new Error("Cannot specify both after and before");
  if (after) params.append("after", after);
  if (before) params.append("before", before);

  const res = await fetch(
    `https://api.spotify.com/v1/me/following?${params.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to get followed artists");

  return res.json();
};

// ----------------------------------------------------------------------------------
// Follow Artists or Users
// ----------------------------------------------------------------------------------

export const followArtistsOrUsers = async (
  type: string,
  ids: string,
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`Failed to follow ${type}`);
};

// ----------------------------------------------------------------------------------
// Unfollow Artists or Users
// ----------------------------------------------------------------------------------

export const unFollowArtistsOrUsers = async (
  type: string,
  ids: string,
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`Failed to unfollow ${type}`);
};

// ----------------------------------------------------------------------------------
// Check id User Follows Artists or Users
// ----------------------------------------------------------------------------------

export const userFollowsArtistsOrUsers = async (
  type: string,
  ids: string,
): Promise<boolean[]> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`Failed to get user follows ${type}`);

  return res.json();
};

// ----------------------------------------------------------------------------------
// Check if Current user Follows Playlist
// ----------------------------------------------------------------------------------

export const currentUserFollowsPlaylist = async (
  playlist_id: string,
): Promise<boolean[]> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/followers/contains`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok)
    throw new Error("Failed to get boolean if current user follows playlist");

  return res.json();
};
