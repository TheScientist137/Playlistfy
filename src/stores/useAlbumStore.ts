import { create } from "zustand";
import {
  checkUserSavedAlbums,
  getAlbum,
  getUserSavedAlbums,
  removeUserSavedAlbums,
  saveAlbumsForCurrentUser,
} from "../services/albumApi";
import type { AlbumType } from "../types/spotify";

interface AlbumStore {
  album: AlbumType | null;
  savedAlbums: AlbumType[] | null;
  savedAlbumsMap: Record<string, boolean>; // album - boolean

  loadingAlbum: boolean;
  loadingSavedAlbums: boolean;

  fetchAlbum: (id: string) => Promise<void>;
  fetchSavedAlbums: () => Promise<void>;

  saveAlbums: (ids: string) => Promise<void>;
  removeSavedAlbums: (ids: string) => Promise<void>;

  checkSavedAlbums: (ids: string[]) => Promise<void>;

  reset: () => void;
}

export const useAlbumStore = create<AlbumStore>((set, get) => ({
  album: null,
  savedAlbums: null,
  savedAlbumsMap: {},

  loadingAlbum: false,
  loadingSavedAlbums: false,

  fetchAlbum: async (id) => {
    set({ loadingAlbum: true });
    try {
      const data = await getAlbum(id);
      set({ album: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingAlbum: false });
    }
  },
  fetchSavedAlbums: async () => {
    set({ loadingSavedAlbums: true });

    try {
      const data = await getUserSavedAlbums();
      set({ savedAlbums: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingSavedAlbums: false });
    }
  },

  // Later Improve to save/unsave multiple albums at once
  saveAlbums: async (ids) => {
    const { savedAlbumsMap } = get();
    try {
      await saveAlbumsForCurrentUser(ids);

      const newSavedMap = { ...savedAlbumsMap };
      newSavedMap[ids] = true;

      set({ savedAlbumsMap: newSavedMap });
    } catch (error) {
      console.error(error);
      set({ savedAlbumsMap: savedAlbumsMap });
    }
  },
  removeSavedAlbums: async (ids) => {
    const { savedAlbumsMap } = get();
    try {
      await removeUserSavedAlbums(ids);

      const newSavedMap = { ...savedAlbumsMap };
      newSavedMap[ids] = false;

      set({ savedAlbumsMap: newSavedMap });
    } catch (error) {
      console.error(error);
      set({ savedAlbumsMap: savedAlbumsMap });
    }
  },

  checkSavedAlbums: async (ids) => {
    const { savedAlbumsMap } = get();

    if (ids.length === 0) return;

    try {
      // Transform string["id", "id"] to string "id, id"
      const idsString = ids.join(",");
      const results = await checkUserSavedAlbums(idsString);

      // Update map with results
      const newSavedMap = { ...savedAlbumsMap };
      ids.forEach((id, index) => {
        newSavedMap[id] = results[index] || false; // if undefined => false
      });

      set({ savedAlbumsMap: newSavedMap });
    } catch (error) {
      console.error(error);
    }
  },

  reset: () => set({ album: null, savedAlbums: null, savedAlbumsMap: {} }),
}));
