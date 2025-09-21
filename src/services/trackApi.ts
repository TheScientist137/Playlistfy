import { useAuthStore } from "../stores/useAuthStore";
import type { TrackType } from "../types/spotify";

// -------------------------------------------------------------------------------
// Get Track ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Several Tracks ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get User's Saved Tracks => Page of tracks
// -------------------------------------------------------------------------------

export const getUserSavedTracks = async (limit: number, offset: number) => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/tracks", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to get user saved tracks");

  return res.json();
};

// -------------------------------------------------------------------------------
// Save Tracks for Current User
// -------------------------------------------------------------------------------

export const saveTracksCurrentUser = async (ids: string[]): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/tracks", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error("Failed to save tracks for current user");
};

// -------------------------------------------------------------------------------
// Removed User's Saved Tracks
// -------------------------------------------------------------------------------

export const removeUserSavedTracks = async (ids: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${ids}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to remove user saved tracks");
};

// -------------------------------------------------------------------------------
// Check User's Saved Tracks
// -------------------------------------------------------------------------------

export const checkUserSavedTracks = async (ids: string): Promise<boolean[]> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to check user saved tracks");

  return res.json();
};

// -------------------------------------------------------------------------------
// Get Several Track's Audio Features ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Track's Audio Features ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Track's Audio Analysis ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Recomendations
// -------------------------------------------------------------------------------
