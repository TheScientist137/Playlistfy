import { create } from "zustand";
import {
  getPlaylist,
  getCurrentUserPlaylists,
  addItemsToPlaylist,
  removeItemsFromPlaylist,
  createPlaylist,
  addCustomPlaylistCover,
} from "../services/playlistApi";
import type { PlaylistType, PlaylistsPageType } from "../types/spotify";
import { fileToBase64 } from "../utils/utils";

interface PlaylistStore {
  playlist: PlaylistType | null;
  currentUserPlaylists: PlaylistsPageType | null;
  playlistTracksMap: Record<string, boolean>;

  nextPlaylistsUrl: string | null;
  prevPlaylistsUrl: string | null;

  loadingPlaylist: boolean;
  loadingCurrentUserPlaylists: boolean;

  fetchPlaylist: (id: string) => Promise<void>;
  fetchCurrentUserPlaylists: (offset: number) => Promise<void>;

  addItemsToPlaylist: (playlist_id: string, uri: string) => Promise<void>;
  removeItemsFromPlaylist: (playlist_id: string, uri: string) => Promise<void>;

  createPlaylist: (
    user_id: string,
    name: string,
    description: string,
    coverFile?: File | null,
  ) => Promise<string | undefined>;

  reset: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlist: null,
  currentUserPlaylists: null,
  playlistTracksMap: {},

  nextPlaylistsUrl: null,
  prevPlaylistsUrl: null,

  loadingPlaylist: false,
  loadingCurrentUserPlaylists: false,

  fetchPlaylist: async (id) => {
    const { playlistTracksMap } = get();
    set({ loadingPlaylist: true });

    try {
      const data = await getPlaylist(id);

      // REVISAR - ENTENDER MEJOR
      // Obtener mapa actualizado
      // (despues de haber agregado playlist por ejemplo)
      // Evitar duplicados
      const newMap = { ...playlistTracksMap };
      data.tracks.items.forEach((item) => {
        newMap[item.track.uri] = true;
      });

      set({ playlist: data, playlistTracksMap: newMap });
    } catch (error) {
      console.error("Failed to fetch Playlist", error);
    } finally {
      set({ loadingPlaylist: false });
    }
  },

  fetchCurrentUserPlaylists: async (offset) => {
    set({ loadingCurrentUserPlaylists: true });

    try {
      const data = await getCurrentUserPlaylists(offset);
      set({
        currentUserPlaylists: data,
        nextPlaylistsUrl: data.next,
        prevPlaylistsUrl: data.previous,
      });
    } catch (error) {
      console.error("Failed to fetch current user playlists", error);
    } finally {
      set({ loadingCurrentUserPlaylists: false });
    }
  },

  addItemsToPlaylist: async (playlist_id, uri) => {
    const { playlistTracksMap } = get();
    try {
      if (playlistTracksMap[uri]) {
        console.log("Track already exists in playlist");
        return;
      }

      await addItemsToPlaylist(playlist_id, 0, [uri]);

      const newPlaylistItemsMap = { ...playlistTracksMap };
      newPlaylistItemsMap[uri] = true;
      set({ playlistTracksMap: newPlaylistItemsMap });
    } catch (error) {
      console.error("Failed to add item to playlist");
    }
  },

  removeItemsFromPlaylist: async (playlist_id, uri) => {
    const { playlist, playlistTracksMap } = get();

    try {
      if (!playlist) return;

      await removeItemsFromPlaylist(playlist_id, uri);

      const updated = { ...playlist };
      if (updated.tracks) {
        updated.tracks.items = updated.tracks.items.filter(
          (item) => item.track.uri !== uri,
        );
      }

      const newPlaylistTracksMap = { ...playlistTracksMap };
      newPlaylistTracksMap[uri] = false;

      set({ playlistTracksMap: newPlaylistTracksMap, playlist: updated });
    } catch (error) {
      console.error("Failed to remove items from playlist");
    }
  },

  createPlaylist: async (user_id, name, description, coverFile) => {
    const { fetchCurrentUserPlaylists } = get();
    try {
      const newPlaylist = await createPlaylist(user_id, name, description);

      if (coverFile) {
        const base64 = await fileToBase64(coverFile);
        await addCustomPlaylistCover(newPlaylist.id, base64);
      }

      // NECESARIO ????????????????
      // Refresh user playlists
      await fetchCurrentUserPlaylists(0);

      return newPlaylist.id;
    } catch (error) {
      console.error("Failed to create new playlist", error);
    }
  },

  reset: () =>
    set({ playlist: null, currentUserPlaylists: null, playlistTracksMap: {} }),
}));
