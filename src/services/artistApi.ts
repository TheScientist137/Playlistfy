import { useAuthStore } from "../stores/useAuthStore";
import type { ArtistType, ArtistTopTracks } from "../types/spotify";

// -------------------------------------------------------------------------------
// Get Artist
// -------------------------------------------------------------------------------

export const getArtist = async (id: string): Promise<ArtistType> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch artist");

  return res.json();
};

// -------------------------------------------------------------------------------
// Get Several Artists ?? CHECK
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Artist's Albums => Pages of albums
// -------------------------------------------------------------------------------

export const getArtistAlbums = async (id: string) => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${id}/albums`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch artist albums");

  return res.json();
};

// -------------------------------------------------------------------------------
// Get Artist's Top Tracks
// -------------------------------------------------------------------------------

export const getArtistTopTracks = async (
  id: string,
): Promise<ArtistTopTracks> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/artists/${id}/top-tracks`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Failed to get artist top tracks");

  return res.json();
};
