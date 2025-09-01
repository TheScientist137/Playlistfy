import { create } from "zustand";
import {
  getUserProfile,
  getAlbum,
  getArtist,
  getCurrentUserPlaylists,
  search,
  getArtistAlbums,
  getPlaylist,
  followPlaylist,
  unFollowPlaylist,
  currentUserFollowsPlaylist,
  removeItemsFromPlaylist,
  addItemsToPlaylist,
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
  userPlaylists: UserPlaylistListType | null;
  album: AlbumType | null;
  artist: ArtistType | null;
  artistAlbums: AlbumType[] | null;
  playlist: PlaylistType | null;

  searchQuery: string;
  searchType: SearchType;
  searchOffset: number;
  searchLimit: number;
  searchResults: SearchResponse | null;

  feedbackTitle: string;
  feedbackMessage: string;
  isFeedbackOpen: boolean;

  loadingProfile: boolean;
  loadingPlaylists: boolean;
  loadingSearch: boolean;
  error: string | null;

  isFollowing: boolean;

  fetchProfile: () => Promise<void>;
  fetchUserPlaylists: () => Promise<void>;
  fetchSearchResults: (
    query: string,
    type: SearchType,
    offset: number,
  ) => Promise<void>;
  fetchAlbum: (id: string) => Promise<void>;
  fetchArtist: (id: string) => Promise<void>;
  fetchArtistAlbums: (id: string) => Promise<void>;
  fetchPlaylist: (id: string) => Promise<void>;
  fetchUserFollowsPlaylist: (id: string) => Promise<void>;

  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setSearchOffset: (offset: number) => void;

  followPlaylist: (playlist_id: string) => Promise<void>;
  unFollowPlaylist: (playlist_id: string) => Promise<void>;

  openFeedback: (title: string, message: string, duration?: number) => void;
  closeFeedback: () => void;

  addTrackToPlaylist: (playlist_id: string, uri: string) => Promise<void>;
  removeTrackFromPlaylist: (playlist_id: string, uri: string) => Promise<void>;

  logout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // --- Global State ---

  profile: null,
  userPlaylists: null,
  album: null,
  artist: null,
  artistAlbums: null,
  playlist: null,

  searchQuery: "",
  searchType: "track",
  searchOffset: 0,
  searchLimit: 20,
  searchResults: null,

  feedbackTitle: "",
  feedbackMessage: "",
  isFeedbackOpen: false,

  // Añadir loading para todas las paginas ?????
  loadingProfile: false,
  loadingPlaylists: false,
  loadingSearch: false,
  error: null,

  isFollowing: false,

  // --- Setters ---

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchType: (type) => set({ searchType: type }),
  setSearchOffset: (offset) => set({ searchOffset: offset }),

  // --- Fetch API ---

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
      set({ userPlaylists: data });
    } catch (error) {
      console.error(error);
      set({ userPlaylists: null, error: "Failed to load playlists" });
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

  fetchArtist: async (id) => {
    try {
      const data = await getArtist(id);
      set({ artist: data });
    } catch (error) {
      console.error("Failed to obtain artist", error);
      set({ artist: null });
    }
  },

  fetchArtistAlbums: async (id) => {
    try {
      const data = await getArtistAlbums(id);
      set({ artistAlbums: data });
    } catch (error) {
      console.error("Failed to obtain artist albums", error);
      set({ artistAlbums: null });
    }
  },

  fetchPlaylist: async (id) => {
    try {
      const data = await getPlaylist(id);
      set({ playlist: data });
    } catch (error) {
      console.error("Failed to obtain playlist", error);
      set({ playlist: null });
    }
  },

  // Fecth if current user follows specific playlist
  fetchUserFollowsPlaylist: async (id) => {
    try {
      const data = await currentUserFollowsPlaylist(id);
      console.log(data[0]);
      set({ isFollowing: data[0] });
    } catch (error) {
      console.error(
        "Failed to obtain current user follows playlist boolean value",
      );
    }
  },

  followPlaylist: async (playlist_id) => {
    const { openFeedback, fetchUserPlaylists } = get();
    try {
      await followPlaylist(playlist_id);
      set({ isFollowing: true });
      await fetchUserPlaylists();
      openFeedback("Success", "Added Playlist!", 2000);
    } catch (error) {
      console.error("Failed to follow playlist", error);
      openFeedback("Error", "Could not follow playlist", 2000);
    }
  },

  unFollowPlaylist: async (playlist_id) => {
    const { openFeedback, fetchUserPlaylists } = get();
    try {
      await unFollowPlaylist(playlist_id);
      set({ isFollowing: false });
      await fetchUserPlaylists();
      openFeedback("Success", "Removed Playlist!", 2000);
    } catch (error) {
      console.error("Failed to unfollow playlist", error);
      openFeedback("Error", "Failed to unfollow playlist", 2000);
    }
  },

  addTrackToPlaylist: async (playlist_id, uri) => {
    const { fetchUserPlaylists, fetchPlaylist, openFeedback } = get();

    try {
      const selectedPlaylist = await getPlaylist(playlist_id);
      const isTrackAlreadyInPlaylist = selectedPlaylist.tracks.items.some(
        (item) => item.track.uri === uri,
      );

      if (isTrackAlreadyInPlaylist) {
        openFeedback("Info", "Track already in playlist");
        return;
      }

      await addItemsToPlaylist(playlist_id, [uri]);
      await fetchPlaylist(playlist_id);
      await fetchUserPlaylists();

      openFeedback("Success", "Added track to playlist", 2000);
    } catch (error) {
      console.error("Failed to add track to playlist", error);
      openFeedback("Error", "Failed to add track to playlist", 2000);
    }
  },

  removeTrackFromPlaylist: async (playlist_id, uri) => {
    const { fetchPlaylist, openFeedback } = get();

    try {
      await removeItemsFromPlaylist(playlist_id, [uri]);
      await fetchPlaylist(playlist_id); // refresh playlist

      openFeedback("Success", "Removed track from playlist", 2000);
    } catch (error) {
      console.error("Failed to delete track", error);
      openFeedback("Error", "Could not delete track from playlist", 2000);
    }
  },

  openFeedback: (title, message, duration?) => {
    const { closeFeedback } = get();
    set({
      feedbackTitle: title,
      feedbackMessage: message,
      isFeedbackOpen: true,
    });
    if (duration) setTimeout(closeFeedback, duration);
  },
  closeFeedback: () => {
    set({ feedbackTitle: "", feedbackMessage: "", isFeedbackOpen: false });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    set({ profile: null, userPlaylists: null });
  },
}));
