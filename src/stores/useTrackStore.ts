import { create } from "zustand";
import {
  getUserSavedTracks,
  saveTracksCurrentUser,
  removeUserSavedTracks,
  checkUserSavedTracks,
} from "../services/trackApi";
import type { TracksPageType } from "../types/spotify";

interface TrackStore {
  savedTracks: TracksPageType | null;
  savedTracksMap: Record<string, boolean>;

  nextTracksUrl: string | null;
  prevTracksUrl: string | null;

  loadingSavedTracks: boolean;

  fetchSavedTracks: (offset: number) => Promise<void>;

  saveTracks: (ids: string[]) => Promise<void>;
  unSaveTracks: (ids: string) => Promise<void>;
  checkSavedTracks: (ids: string[]) => Promise<void>;

  reset: () => void;
}

export const useTrackStore = create<TrackStore>((set, get) => ({
  savedTracks: null,
  savedTracksMap: {},

  nextTracksUrl: null,
  prevTracksUrl: null,

  loadingSavedTracks: false,

  fetchSavedTracks: async (offset) => {
    const { savedTracksMap } = get();
    set({ loadingSavedTracks: true });
    try {
      const saved = await getUserSavedTracks(offset);

      const newSavedMap = { ...savedTracksMap };
      saved?.items.forEach((item) => {
        newSavedMap[item.track.id] = true;
      });

      set({
        savedTracks: saved,
        savedTracksMap: newSavedMap,
        nextTracksUrl: saved.next,
        prevTracksUrl: saved.previous,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingSavedTracks: false });
    }
  },

  saveTracks: async (ids) => {
    const { savedTracksMap } = get();
    try {
      await saveTracksCurrentUser(ids);

      const newSavedMap = { ...savedTracksMap };
      newSavedMap[ids[0]] = true;

      set({ savedTracksMap: newSavedMap });
    } catch (error) {
      console.error(error);
    }
  },
  unSaveTracks: async (ids) => {
    const { savedTracksMap, savedTracks } = get();

    try {
      if (!savedTracks) return;

      await removeUserSavedTracks(ids);

      const newSavedMap = { ...savedTracksMap };
      newSavedMap[ids] = false;

      // Update saved tracks (refresh changes on library)
      const newSavedTracks = { ...savedTracks };
      newSavedTracks.items = newSavedTracks.items?.filter(
        (item) => item.track.id !== ids,
      );

      set({ savedTracksMap: newSavedMap, savedTracks: newSavedTracks });
    } catch (error) {
      console.error(error);
    }
  },
  checkSavedTracks: async (ids) => {
    const { savedTracksMap } = get();

    if (ids.length === 0) return;

    try {
      // Transform string["id", "id"] to string "id, id"
      const idsString = ids.join(",");
      const results = await checkUserSavedTracks(idsString);

      // Update map with results
      const newSavedMap = { ...savedTracksMap };
      ids.forEach((id, index) => {
        newSavedMap[id] = results[index] || false; // if undefined => false
      });

      set({ savedTracksMap: newSavedMap });
    } catch (error) {
      console.error(error);
    }
  },

  reset: () => {
    set({ savedTracks: null, savedTracksMap: {} });
  },
}));
