import { create } from "zustand";
import { useUserStore } from "./useUserStore";
import { usePlaylistStore } from "./usePlaylistStore";
import { useAlbumStore } from "./useAlbumStore";
import { useTrackStore } from "./useTrackStore";
import {
  exchangeCodeForToken,
  redirectToSpotifyLogin,
  getRefreshToken,
} from "../services/pkceAuth";

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isLoguedIn: boolean;

  exchange: (code: string) => Promise<void>;
  getAccessToken: () => Promise<string>;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  expiresIn: Number(localStorage.getItem("expires_in")) || null,
  isLoguedIn: localStorage.getItem("access_token") !== null,

  exchange: async (code) => {
    // Get and Set an access_token
    const data = await exchangeCodeForToken(code);
    set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: Date.now() + data.expires_in * 1000,
      isLoguedIn: true,
    });
  },

  getAccessToken: async () => {
    const { accessToken, expiresIn } = get();

    // Return a valid access_token
    return !accessToken || Date.now() >= Number(expiresIn)
      ? await getRefreshToken()
      : accessToken;
  },

  login: () => redirectToSpotifyLogin(),

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");

    set({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      isLoguedIn: false,
    });

    useTrackStore.getState().reset();
    useUserStore.getState().reset();
    usePlaylistStore.getState().reset();
    useAlbumStore.getState().reset();
  },
}));
