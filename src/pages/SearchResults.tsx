import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";

import { useSearchStore } from "../stores/useSearchStore";
import { useAlbumStore } from "../stores/useAlbumStore";
import { useUserStore } from "../stores/useUserStore";

import Track from "../components/Track";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

import type { SearchResponse } from "../types/spotify";

export default function SearchResults() {
  const [searchParams] = useSearchParams(); // Read url
  const {
    searchQuery,
    searchType,
    searchOffset,
    searchLimit,
    searchResults,
    loadingSearch,
    setSearchQuery,
    setSearchType,
    setSearchOffset,
    fetchSearchResults,
  } = useSearchStore();
  const { savedAlbumsMap, saveAlbums, removeSavedAlbums } = useAlbumStore();
  const {
    followedArtistsMap,
    followedPlaylistsMap,
    unFollowArtistOrUser,
    followArtistOrUser,
    followPlaylist,
    unFollowPlaylist,
  } = useUserStore();

  // Component mounts => read URL => upload store
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const type = (searchParams.get("type") as string) || "track";
    const offset = Number(searchParams.get("offset")) || 0;

    setSearchQuery(q);
    setSearchType(type);
    setSearchOffset(offset);
  }, [searchParams]);

  // if there is a query => Search => Upload URL with store values
  useEffect(() => {
    if (!searchQuery || !searchType) return;
    fetchSearchResults(searchQuery, searchType, searchOffset);

    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set("q", searchQuery);
    newParams.set("type", searchType); // no if => There is always a type
    if (searchOffset) newParams.set("offset", String(searchOffset));

    // Change url without a page reload
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  }, [searchQuery, searchType, searchOffset]);

  // Clear search state when component unmounts
  useEffect(() => {
    return () => useSearchStore.getState().resetSearch();
  }, []);

  // Pagination (Reahcer mejorando y entendiendo mejor el proceso)
  const pageType = searchType + "s";
  const results = searchResults?.[pageType as keyof SearchResponse];
  const total = results?.total ?? 0;
  const next = results?.next;
  const previous = results?.previous;

  // Type tabs
  const tabs: { label: string; value: string }[] = [
    { label: "Songs", value: "track" },
    { label: "Albums", value: "album" },
    { label: "Artists", value: "artist" },
    { label: "Playlists", value: "playlist" },
  ];

  const handleTabChange = (newType: string) => {
    setSearchType(newType);
    setSearchOffset(0);
  };

  const handleSaveAlbum = async (albumId: string) => {
    const currentlySaved = savedAlbumsMap[albumId];
    currentlySaved
      ? await removeSavedAlbums(albumId)
      : await saveAlbums(albumId);
  };
  const handleFollowArtist = async (artistId: string) => {
    const currentlyFollowed = followedArtistsMap[artistId];
    currentlyFollowed
      ? await unFollowArtistOrUser("artist", artistId)
      : await followArtistOrUser("artist", artistId);
  };
  const handleFollowPlaylist = async (playlistId: string) => {
    const currentlyFollowed = followedPlaylistsMap[playlistId];
    currentlyFollowed
      ? await unFollowPlaylist(playlistId)
      : await followPlaylist(playlistId);
  };

  // set an error to show if no results was found!

  return (
    <div className="h-full flex flex-col items-center">
      <SearchBar />

      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className="p-2 bg-stone-800 rounded-lg cursor-pointer"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {loadingSearch && <p>Searching…</p>}

      {searchResults && (
        <>
          <ul className="w-full flex flex-col items-center gap-6 mt-4 overflow-auto">
            {searchType === "track" &&
              searchResults.tracks?.items.map((item) => (
                <li key={item.id} className="w-full">
                  <Track track={item} context="search" />
                </li>
              ))}

            {searchType === "album" &&
              searchResults.albums?.items.map((item) => (
                <li
                  key={item.id}
                  className="w-full px-6 flex justify-between items-center gap-8"
                >
                  <Link to={`/album/${item.id}`} className="w-full flex gap-4">
                    <img src={item.images[0]?.url} className="size-16" />
                    <div className="flex flex-col justify-center">
                      <span>{item.name}</span>
                      <span className="text-stone-400">
                        {item.artists[0]?.name}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleSaveAlbum(item.id)}
                    className="cursor-pointer"
                  >
                    {savedAlbumsMap[item.id] ? (
                      <FiMinusCircle className="size-5 text-green-500" />
                    ) : (
                      <FiPlusCircle className="size-5" />
                    )}
                  </button>
                </li>
              ))}

            {searchType === "artist" &&
              searchResults.artists?.items.map((item) => (
                <li
                  key={item.id}
                  className="w-full px-6 flex justify-between items-center gap-8"
                >
                  <Link
                    to={`/artist/${item.id}`}
                    className="w-full flex items-center gap-4"
                  >
                    <img
                      src={item.images[0]?.url}
                      className="size-18 rounded-full"
                    />
                    <span>{item.name}</span>
                  </Link>

                  <button
                    onClick={() => handleFollowArtist(item.id)}
                    className="border rounded-xl px-3 py-1 border-stone-400 border-2 cursor-pointer"
                  >
                    {followedArtistsMap[item.id] ? "unfollow" : "follow"}
                  </button>
                </li>
              ))}

            {searchType === "playlist" &&
              searchResults.playlists?.items?.map((item) => {
                if (!item || !item.id) return null;
                return (
                  <li
                    key={item.id}
                    className="w-full px-6 flex justify-between items-center gap-8"
                  >
                    <Link
                      to={`/playlist/${item.id}`}
                      className="flex items-center gap-4"
                    >
                      {item.images?.[0] && (
                        <img src={item.images[0].url} className="size-16" />
                      )}
                      <span>{item.name}</span>
                    </Link>

                    <button
                      onClick={() => handleFollowPlaylist(item.id)}
                      className="cursor-pointer"
                    >
                      {followedPlaylistsMap[item.id] ? (
                        <FiMinusCircle className="size-5 text-green-500" />
                      ) : (
                        <FiPlusCircle className="size-5" />
                      )}
                    </button>
                  </li>
                );
              })}
          </ul>

          <Pagination
            mode="offset"
            total={total}
            limit={searchLimit}
            offset={searchOffset}
            next={next}
            prev={previous}
            onPageChange={setSearchOffset}
          />
        </>
      )}
    </div>
  );
}
