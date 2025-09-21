import { useAuthStore } from "../stores/useAuthStore";
import type { AlbumType } from "../types/spotify";

// -------------------------------------------------------------------------------
// Get Album
// -------------------------------------------------------------------------------

export const getAlbum = async (id: string): Promise<AlbumType> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch album");

  return res.json();
};

// -------------------------------------------------------------------------------
// Get Album Tracks
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get User's Saved Albums - Improve => pages response => type
// -------------------------------------------------------------------------------

export const getUserSavedAlbums = async () => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/albums", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to obtain user saved albums");

  return res.json();
};

// -------------------------------------------------------------------------------
// Save Albums for Current User
// -------------------------------------------------------------------------------

export const saveAlbumsForCurrentUser = async (ids: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/me/albums?ids=${ids}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to save albums");
};

// -------------------------------------------------------------------------------
// Remove Saved Albums
// -------------------------------------------------------------------------------

export const removeUserSavedAlbums = async (ids: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/me/albums?ids=${ids}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to remove saved albums");
};

// -------------------------------------------------------------------------------
// Check User's Saved Albums
// -------------------------------------------------------------------------------

export const checkUserSavedAlbums = async (ids: string): Promise<boolean[]> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to check user saved albums");

  return res.json();
};
