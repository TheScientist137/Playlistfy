import { useState, useEffect } from "react";
import { Link } from "react-router";

import { useUserStore } from "../stores/useUserStore";
import { useTrackStore } from "../stores/useTrackStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useAlbumStore } from "../stores/useAlbumStore";

import Loading from "../components/Loading";
import Track from "../components/Track";
import Pagination from "../components/Pagination";

type TabLibraryStateType = "songs" | "playlists" | "albums" | "artists";

export default function UserLibrary() {
  const [tabLibraryState, setTabLibraryState] =
    useState<TabLibraryStateType>("songs");
  const [offset, setOffset] = useState(0);

  const {
    savedTracks,
    nextTracksUrl,
    prevTracksUrl,
    loadingSavedTracks,
    fetchSavedTracks,
  } = useTrackStore();
  const {
    savedAlbums,
    nextAlbumsUrl,
    prevAlbumsUrl,
    loadingSavedAlbums,
    fetchSavedAlbums,
  } = useAlbumStore();
  const {
    cursorAfter,
    cursorBefore,
    followedArtists,
    loadingFollowedArtists,
    fetchFollowedArtists,
  } = useUserStore();
  const {
    currentUserPlaylists,
    nextPlaylistsUrl,
    prevPlaylistsUrl,
    loadingCurrentUserPlaylists,
    fetchCurrentUserPlaylists,
  } = usePlaylistStore();

  useEffect(() => {
    tabLibraryState === "songs" && fetchSavedTracks(0);
    tabLibraryState === "albums" && fetchSavedAlbums(0);
    tabLibraryState === "artists" && fetchFollowedArtists();
    tabLibraryState === "playlists" && fetchCurrentUserPlaylists(0);
  }, [tabLibraryState]);

  const handleTabChange = (newTab: TabLibraryStateType) => {
    setTabLibraryState(newTab);
    setOffset(0);
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    if (tabLibraryState === "songs") fetchSavedTracks(newOffset);
    if (tabLibraryState === "albums") fetchSavedAlbums(newOffset);
    if (tabLibraryState === "playlists") fetchCurrentUserPlaylists(newOffset);
  };

  const handleCursorPageChange = (after?: string, before?: string) => {
    fetchFollowedArtists(after, before);
  };

  const tabs: { label: string; value: TabLibraryStateType }[] = [
    { label: "Songs", value: "songs" },
    { label: "Playlists", value: "playlists" },
    { label: "Albums", value: "albums" },
    { label: "Artists", value: "artists" },
  ];

  // MEJORAR - ACTUALIZAR
  const totalMap = {
    songs: savedTracks?.total,
    playlists: currentUserPlaylists?.total,
    albums: savedAlbums?.total,
    artists: followedArtists?.total,
  };
  const total = totalMap[tabLibraryState] || 0;

  // URLS for offset Pagination
  const nextMap = {
    songs: nextTracksUrl,
    playlists: nextPlaylistsUrl,
    albums: nextAlbumsUrl,
  };

  const prevMap = {
    songs: prevTracksUrl,
    playlists: prevPlaylistsUrl,
    albums: prevAlbumsUrl,
  };

  const next = nextMap[tabLibraryState as keyof typeof nextMap] || null;
  const prev = prevMap[tabLibraryState as keyof typeof prevMap] || null;

  const isLoading =
    loadingCurrentUserPlaylists ||
    loadingSavedAlbums ||
    loadingFollowedArtists ||
    loadingSavedTracks;

  return (
    <div className="h-full flex flex-col items-center">
      <h2>Your Library</h2>

      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.value)}
            className="cursor-pointer"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <span className="mt-4">Total: {total}</span>

          <ul className="w-full flex flex-col gap-6 overflow-auto">
            {tabLibraryState === "songs" &&
              savedTracks?.items.map((item) => (
                <li key={item.track.id} className="pr-6">
                  <Track track={item.track} context="library" />
                </li>
              ))}

            {tabLibraryState === "playlists" &&
              currentUserPlaylists?.items?.map((item) => (
                <li key={item.id}>
                  <Link to={`/playlist/${item.id}`}>
                    <div className="flex items-center gap-2">
                      <img src={item.images?.[0]?.url} className="size-24" />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                </li>
              ))}

            {tabLibraryState === "albums" &&
              savedAlbums?.items?.map((item) => (
                <li key={item.album.id}>
                  <Link to={`/album/${item.album.id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={item.album.images?.[0]?.url}
                        className="size-24"
                      />
                      <p>{item.album.name}</p>
                    </div>
                  </Link>
                </li>
              ))}

            {tabLibraryState === "artists" &&
              followedArtists?.items?.map((item) => (
                <li key={item.id}>
                  <Link to={`/artist/${item.id}`}>
                    <div className="flex items-center gap-2">
                      <img src={item.images?.[0]?.url} className="size-24" />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
          {tabLibraryState === "artists" ? (
            <Pagination
              mode="cursor"
              after={cursorAfter}
              before={cursorBefore}
              onPageChange={handleCursorPageChange}
            />
          ) : (
            <Pagination
              mode="offset"
              total={total}
              limit={20}
              offset={offset}
              next={next}
              prev={prev}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
