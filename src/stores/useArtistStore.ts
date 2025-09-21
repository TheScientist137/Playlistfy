import { create } from "zustand";
import type { AlbumType, ArtistType } from "../types/spotify";
import { getArtist, getArtistAlbums } from "../services/artistApi";

interface ArtistStore {
  artist: ArtistType | null;
  artistAlbums: AlbumType[] | null;

  loadingArtist: boolean;
  loadingArtistAlbums: boolean;

  fetchArtist: (id: string) => Promise<void>;
  fetchArtistAlbums: (id: string) => Promise<void>;

  reset: () => void;
}

export const useArtistStore = create<ArtistStore>((set, get) => ({
  artist: null,
  artistAlbums: null,

  loadingArtist: false,
  loadingArtistAlbums: false,

  fetchArtist: async (id) => {
    set({ loadingArtist: true });
    try {
      const data = await getArtist(id);
      set({ artist: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingArtist: false });
    }
  },
  fetchArtistAlbums: async (id) => {
    set({ loadingArtistAlbums: true });
    try {
      const data = await getArtistAlbums(id);
      set({ artistAlbums: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingArtistAlbums: false });
    }
  },

  reset: () => set({ artist: null, artistAlbums: null }),
}));
