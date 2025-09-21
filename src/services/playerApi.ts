import { useAuthStore } from "../stores/useAuthStore";
import type { PlaybackStateType } from "../types/spotify";

// -------------------------------------------------------------------------------
// Get Playback State
// -------------------------------------------------------------------------------

export const getPlaybackState = async (): Promise<PlaybackStateType> => {
  const token = await useAuthStore.getState().getAccessToken();

  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error obtaining current playback state");
  return res.json();
};

// -------------------------------------------------------------------------------
// Transfer Playback
// -------------------------------------------------------------------------------

export const transferPlayback = async (
  deviceId: string,
  play: boolean,
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

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

// -------------------------------------------------------------------------------
// Get Available Devices ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Currently Playing Track ??
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Start/Resume Playback
// -------------------------------------------------------------------------------

export const playUris = async (
  deviceId: string,
  uris: string[],
): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();
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

// -------------------------------------------------------------------------------
// Pause Playback
// -------------------------------------------------------------------------------

export const pausePlayback = async (deviceId?: string): Promise<void> => {
  const token = await useAuthStore.getState().getAccessToken();

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

// -------------------------------------------------------------------------------
// Skip To Next
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Skip To Previous
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Seek To Position
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Set Repeat Mode
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Set Playback Volume
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Toggle Playback Shuffle
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get Recently Played Tracks
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Get the User's Queue
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
// Add Item to Playback Queue
// -------------------------------------------------------------------------------
