import { create } from "zustand";
import { getAccessToken } from "../services/pkceAuth";
import { playUris, transferPlayback } from "../services/playerApi";

interface PlayerStore {
  deviceId: string | null;
  player: Spotify.Player | null;
  isPaused: boolean;
  currentTrack: Spotify.Track | null;

  initPlayer: () => Promise<void>;
  playTrack: (track: any) => Promise<void>;
  pause: () => Promise<void>;
  logoutPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  player: null,
  deviceId: null,

  isPaused: false,
  currentTrack: null,

  initPlayer: async () => {
    const token = await getAccessToken();
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      // --- Player Events

      player.addListener(
        "ready",
        async ({ device_id }: { device_id: string }) => {
          console.log("The Web Playback SDK is ready to play music");
          console.log("Device ID:", device_id);
          await transferPlayback(device_id, false);
          set({ deviceId: device_id });
        },
      );

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        set({ deviceId: null });
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        // console.log(state);

        set({
          currentTrack: state.track_window.current_track,
          isPaused: state.paused,
        });
      });

      // --- Error Events (autoplay_failed Event)

      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.on("authentication_error", ({ message }) => {
        console.error("Failed to authenticate", message);
      });

      player.on("account_error", ({ message }) => {
        console.error("Failed to validate Spotify account", message);
      });

      player.on("playback_error", ({ message }) => {
        console.error("Failed to perform playback", message);
      });

      player.connect();
      set({ player });
    };
  },

  playTrack: async (uri) => {
    const { deviceId, player, currentTrack, isPaused } = get();
    if (!deviceId) return;

    try {
      if (currentTrack?.uri === uri && isPaused) {
        await player?.resume();
      } else {
        await playUris(deviceId, [uri]);
      }
    } catch (error) {
      console.error("Failed to play track", error);
    }
  },

  pause: async () => {
    const { deviceId, player } = get();
    if (!deviceId) return;

    try {
      // await pausePlayback(deviceId);
      await player?.pause();
    } catch (error) {
      console.error("Failed to pause track");
    }
  },

  logoutPlayer: () => {
    const player = get().player;

    if (player) {
      player.disconnect();
      player.removeListener("ready");
      player.removeListener("not_ready");
    }

    set({ player: null, deviceId: null });
  },
}));
