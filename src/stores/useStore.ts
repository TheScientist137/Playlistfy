import { create } from "zustand";
import {
  getUserProfile,
  getCurrentUserPlaylists,
  search,
} from "../services/spotifyApi";
import type {
  UserProfile,
  UserPlaylistList,
  SearchResponse,
  SearchType,
} from "../types/spotify";

interface StoreState {
  profile: UserProfile | null;
  playlists: UserPlaylistList | null;

  searchQuery: string;
  searchType: SearchType;
  searchOffset: number;
  searchLimit: number;
  searchResults: SearchResponse | null;

  loadingProfile: boolean;
  loadingPlaylists: boolean;
  loadingSearch: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchUserPlaylists: () => Promise<void>;
  fetchSearchResults: (
    query: string,
    type: SearchType,
    offset: number,
  ) => Promise<void>;

  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setSearchOffset: (offset: number) => void;

  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  profile: null,
  playlists: null,

  searchQuery: "",
  searchType: "track",
  searchOffset: 0,
  searchLimit: 20,
  searchResults: null,

  loadingProfile: false,
  loadingPlaylists: false,
  loadingSearch: false,
  error: null,

  fetchProfile: async () => {
    set({ loadingProfile: true });
    try {
      const data = await getUserProfile();
      set({ profile: data });
    } catch (error) {
      console.error(error);
      set({ profile: null, error: "Failed to load profile" });
    } finally {
      set({ loadingProfile: false });
    }
  },

  fetchUserPlaylists: async () => {
    set({ loadingPlaylists: true });
    try {
      const data = await getCurrentUserPlaylists();
      set({ playlists: data });
    } catch (error) {
      console.error(error);
      set({ playlists: null, error: "Failed to load playlists" });
    } finally {
      set({ loadingPlaylists: false });
    }
  },

  fetchSearchResults: async (
    query,
    type = get().searchType,
    offset = get().searchOffset,
  ) => {
    set({ loadingSearch: true });
    try {
      console.log(type);
      const data = await search(query, type, get().searchLimit, offset);
      set({ searchResults: data, loadingSearch: false });
    } catch (error) {
      console.error(error);
      set({ searchResults: null });
    } finally {
      set({ loadingSearch: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchType: (type) => set({ searchType: type }),
  setSearchOffset: (offset) => set({ searchOffset: offset }),

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");

    set({ profile: null, playlists: null });
  },
}));
