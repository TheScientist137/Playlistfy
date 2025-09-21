import { useAuthStore } from "../stores/useAuthStore";
import type { UserPlaylistListType, PlaylistType } from "../types/spotify";

// -------------------------------------------------------------------------------
// Get Playlist
// -------------------------------------------------------------------------------

export const getPlaylist = async (id: string): Promise<PlaylistType> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch playlist");

  return res.json();
};

// -------------------------------------------------------------------------------
// Change Playlist Details
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Playlist Items
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Update Playlist Items
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Add Items to Playlist
// -------------------------------------------------------------------------------

export const addItemsToPlaylist = async (
  playlist_id: string,
  position: number,
  uris: string[],
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris, position }),
    },
  );

  if (!res.ok) throw new Error("Failed to add item to playlist");
};

// -------------------------------------------------------------------------------
// Remove Playlist Items
// -------------------------------------------------------------------------------

export const removeItemsFromPlaylist = async (
  playlistId: string,
  uris: string,
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracks: [{ uri: uris }] }),
    },
  );

  if (!res.ok) throw new Error("Failed to remove item from playlist");
};

// -------------------------------------------------------------------------------
// Get Current User's Playlists
// -------------------------------------------------------------------------------

export const getCurrentUserPlaylists =
  async (): Promise<UserPlaylistListType> => {
    const token = await useAuthStore.getState().getAccessToken();

    const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error getting user playlists");

    return res.json();
  };

// -------------------------------------------------------------------------------
// Get User's Playlists
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Create Playlist
// -------------------------------------------------------------------------------

export const createPlaylist = async (
  user_id: string,
  name: string,
  description: string,
): Promise<PlaylistType> => {
  const token = await useAuthStore.getState().getAccessToken();

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

// -------------------------------------------------------------------------------
// Get Features Playlists
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Category's Playlists
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Playlist Cover Image
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Add Custom Playlist Cover Image
// -------------------------------------------------------------------------------

export const addCustomPlaylistCover = async (
  playlist_id: string,
  base64: string,
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/jpeg",
      },
      body: base64,
    },
  );

  if (!res.ok) throw new Error("Failed to upload playlist cover image");
};
