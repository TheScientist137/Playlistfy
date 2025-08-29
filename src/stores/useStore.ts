import { create } from "zustand";
import {
  getUserProfile,
  getAlbum,
  getArtist,
  getCurrentUserPlaylists,
  search,
  getArtistAlbums,
  getPlaylist,
} from "../services/spotifyApi";
import type {
  UserProfile,
  UserPlaylistListType,
  AlbumType,
  ArtistType,
  SearchResponse,
  SearchType,
  PlaylistType,
} from "../types/spotify";

interface StoreState {
  profile: UserProfile | null;
  playlists: UserPlaylistListType | null;
  album: AlbumType | null;
  artist: ArtistType | null;
  artistAlbums: AlbumType[] | null;
  playlist: PlaylistType | null;

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
  fetchAlbum: (id: string) => void;
  fetchArtist: (id: string) => void;
  fetchArtistAlbums: (id: string) => void;
  fetchPlaylist: (id: string) => void;

  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setSearchOffset: (offset: number) => void;

  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  profile: null,
  playlists: null,
  album: null,
  artist: null,
  artistAlbums: null,
  playlist: null,

  searchQuery: "",
  searchType: "track",
  searchOffset: 0,
  searchLimit: 20,
  searchResults: null,

  // Añadir loading para todas las paginas ?????
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

  fetchAlbum: async (id: string) => {
    try {
      const data = await getAlbum(id);
      set({ album: data });
    } catch (error) {
      console.error("Failed to obtain album", error);
      set({ album: null });
    }
  },

  fetchArtist: async (id: string) => {
    try {
      const data = await getArtist(id);
      set({ artist: data });
    } catch (error) {
      console.error("Failed to obtain artist", error);
      set({ artist: null });
    }
  },

  fetchArtistAlbums: async (id: string) => {
    try {
      const data = await getArtistAlbums(id);
      set({ artistAlbums: data });
    } catch (error) {
      console.error("Failed to obtain artist albums", error);
      set({ artistAlbums: null });
    }
  },

  fetchPlaylist: async (id: string) => {
    try {
      const data = await getPlaylist(id);
      set({ playlist: data });
    } catch (error) {
      console.error("Failed to obtain playlist");
      set({ playlist: null });
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
