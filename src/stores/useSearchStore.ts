import { create } from "zustand";
import { search } from "../services/searchApi";
import { useTrackStore } from "./useTrackStore";
import { useAlbumStore } from "./useAlbumStore";
import { useUserStore } from "./useUserStore";
import type { SearchResponse } from "../types/spotify";

interface SearchStore {
  searchQuery: string;
  searchType: string;
  searchOffset: number;
  searchLimit: number;
  searchResults: SearchResponse | null;

  loadingSearch: boolean;

  setSearchQuery: (query: string) => void;
  setSearchType: (type: string) => void;
  setSearchOffset: (offset: number) => void;

  fetchSearchResults: (
    query: string,
    type: string,
    offset: number,
  ) => Promise<void>;

  resetSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  searchQuery: "",
  searchType: "track",
  searchOffset: 0,
  searchLimit: 20,
  searchResults: null,

  loadingSearch: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchType: (type) => set({ searchType: type }),
  setSearchOffset: (offset) => set({ searchOffset: offset }),

  fetchSearchResults: async (
    query,
    type = get().searchType,
    offset = get().searchOffset,
  ) => {
    const { checkSavedAlbums } = useAlbumStore.getState();
    const { checkUserFollowsArtistOrUser, checkCurrentUserFollowsPlaylist } =
      useUserStore.getState();
    const { checkSavedTracks } = useTrackStore.getState();

    set({ loadingSearch: true, searchResults: null });

    try {
      const data = await search(query, type, get().searchLimit, offset);

      if (type === "album" && data.albums?.items) {
        const albumsIds = data.albums.items.map((item) => item.id);
        if (albumsIds.length > 0) await checkSavedAlbums(albumsIds);
      }

      if (type === "artist" && data.artists?.items) {
        const artistIds = data.artists.items.map((item) => item.id);
        if (artistIds.length > 0)
          await checkUserFollowsArtistOrUser("artist", artistIds);
      }

      if (type === "playlist" && data.playlists?.items) {
        const playlistsIds = data.playlists.items
          ?.filter((item) => item)
          .map((item) => item!.id);

        if (playlistsIds.length > 0)
          await checkCurrentUserFollowsPlaylist(playlistsIds);
      }

      if (type === "track" && data.tracks?.items) {
        const trackIds = data.tracks.items.map((item) => item.id);
        if (trackIds.length > 0) await checkSavedTracks(trackIds);
      }

      set({ searchResults: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingSearch: false });
    }
  },

  resetSearch: () =>
    set({
      searchQuery: "",
      searchType: "",
      searchOffset: 0,
      searchResults: null,
      loadingSearch: false,
    }),
}));
