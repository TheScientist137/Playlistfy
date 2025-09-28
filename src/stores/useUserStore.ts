import { create } from "zustand";
import {
  getUserProfile,
  getFollowedArtists,
  followArtistsOrUsers,
  followPlaylist,
  unFollowPlaylist,
  unFollowArtistsOrUsers,
  userFollowsArtistsOrUsers,
  currentUserFollowsPlaylist,
} from "../services/userApi";
import type { ArtistCursorPageType, UserProfile } from "../types/spotify";

interface UserStore {
  profile: UserProfile | null;
  followedArtists: ArtistCursorPageType | null;

  followedArtistsMap: Record<string, boolean>;
  followedPlaylistsMap: Record<string, boolean>;

  cursorAfter: string | null;
  cursorBefore: string | null;
  nextUrl: string | null;

  loadingProfile: boolean;
  loadingFollowedArtists: boolean;

  fetchProfile: () => Promise<void>;
  fetchFollowedArtists: (after?: string, before?: string) => Promise<void>;

  followArtistOrUser: (type: string, ids: string) => Promise<void>;
  unFollowArtistOrUser: (type: string, ids: string) => Promise<void>;
  checkUserFollowsArtistOrUser: (type: string, ids: string[]) => Promise<void>;

  followPlaylist: (playlist_id: string) => Promise<void>;
  unFollowPlaylist: (playlist_id: string) => Promise<void>;
  checkCurrentUserFollowsPlaylist: (playlist_id: string[]) => Promise<void>;

  reset: () => void;
}

// COMPROBAR LA NECESIDAD DE LLAMAR FUNCIONES DE OTROS STORES

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  followedArtists: null,

  followedArtistsMap: {},
  followedPlaylistsMap: {},

  cursorAfter: null,
  cursorBefore: null,
  nextUrl: null,

  loadingProfile: false,
  loadingFollowedArtists: false,

  fetchProfile: async () => {
    set({ loadingProfile: true });
    try {
      const data = await getUserProfile();
      set({ profile: data });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      set({ loadingProfile: false });
    }
  },

  followPlaylist: async (playlist_id) => {
    const { followedPlaylistsMap } = get();

    try {
      await followPlaylist(playlist_id);

      const newFollowedMap = { ...followedPlaylistsMap };
      newFollowedMap[playlist_id] = true;

      set({ followedPlaylistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to follow playlist", error);
    }
  },

  unFollowPlaylist: async (playlist_id) => {
    const { followedPlaylistsMap } = get();
    try {
      await unFollowPlaylist(playlist_id);

      const newFollowedMap = { ...followedPlaylistsMap };
      newFollowedMap[playlist_id] = false;

      set({ followedPlaylistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to unfollow playlist", error);
    }
  },

  fetchFollowedArtists: async (after, before) => {
    set({ loadingFollowedArtists: true });
    try {
      const data = await getFollowedArtists(after, before);
      const artistPage = data.artists;

      set({
        followedArtists: artistPage,
        cursorAfter: artistPage.cursors.after || null,
        cursorBefore: artistPage.cursors.before || null,
        nextUrl: artistPage.next,
      });
    } catch (error) {
      console.error("Failed to load followed artists", error);
    } finally {
      set({ loadingFollowedArtists: false });
    }
  },

  // Later Improve to follow/unfollow multiple artists/ursers at once
  followArtistOrUser: async (type, ids) => {
    const { followedArtistsMap } = get();
    try {
      await followArtistsOrUsers(type, ids);

      const newFollowedMap = { ...followedArtistsMap };
      newFollowedMap[ids] = true;

      set({ followedArtistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to follow artist or user", error);
    }
  },

  unFollowArtistOrUser: async (type, ids) => {
    const { followedArtistsMap } = get();
    try {
      await unFollowArtistsOrUsers(type, ids);

      const newFollowedMap = { ...followedArtistsMap };
      newFollowedMap[ids] = false;

      set({ followedArtistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to unfollow artist or user", error);
    }
  },

  checkUserFollowsArtistOrUser: async (type, ids) => {
    const { followedArtistsMap } = get();

    if (ids.length === 0) return;

    try {
      const idsString = ids.join(",");
      const results = await userFollowsArtistsOrUsers(type, idsString);

      const newFollowedMap = { ...followedArtistsMap };
      ids.forEach((id, index) => {
        newFollowedMap[id] = results[index] || false;
      });

      set({ followedArtistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to check user follows artist or user");
    }
  },

  checkCurrentUserFollowsPlaylist: async (ids: string[]) => {
    const { followedPlaylistsMap } = get();

    if (ids.length === 0) return;

    try {
      // 1 llamada por id en paralelo
      const results = await Promise.all(
        ids.map((id) => currentUserFollowsPlaylist(id)), // devuelve Promise<[boolean]>
      );

      // clonamos el estado actual
      const newFollowedMap = { ...followedPlaylistsMap };

      // construimos el mapa
      ids.forEach((id, index) => {
        newFollowedMap[id] = results[index][0] || false;
      });

      set({ followedPlaylistsMap: newFollowedMap });
    } catch (error) {
      console.error("Failed to check followed playlists", error);
    }
  },

  reset: () =>
    set({
      profile: null,
      followedArtists: null,
      followedArtistsMap: {},
      followedPlaylistsMap: {},
    }),
}));
