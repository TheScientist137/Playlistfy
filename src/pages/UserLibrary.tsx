import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useUserStore } from "../stores/useUserStore";
import { useTrackStore } from "../stores/useTrackStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useAlbumStore } from "../stores/useAlbumStore";
import Loading from "../components/Loading";
import Track from "../components/Track";

export default function UserLibrary() {
  const [tabLibraryState, setTabLibraryState] = useState("songs");

  const { followedArtists, loadingFollowedArtists, fetchFollowedArtists } =
    useUserStore();
  const {
    currentUserPlaylists,
    loadingCurrentUserPlaylists,
    fetchCurrentUserPlaylists,
  } = usePlaylistStore();
  const { savedAlbums, fetchSavedAlbums, loadingSavedAlbums } = useAlbumStore();
  const { loadingSavedTracks, savedTracks, fetchSavedTracks } = useTrackStore();

  useEffect(() => {
    if (!currentUserPlaylists) fetchCurrentUserPlaylists();
    if (!savedAlbums) fetchSavedAlbums();
    if (!followedArtists) fetchFollowedArtists();
    if (!savedTracks) fetchSavedTracks();
  }, []);

  const tabs: { label: string; value: string }[] = [
    { label: "Songs", value: "songs" },
    { label: "Playlists", value: "playlists" },
    { label: "Albums", value: "albums" },
    { label: "Artists", value: "artists" },
  ];

  if (
    loadingCurrentUserPlaylists ||
    loadingSavedAlbums ||
    loadingFollowedArtists ||
    loadingSavedTracks
  )
    return <Loading />;

  return (
    <div className="h-full flex flex-col items-center">
      <h2>Your Library</h2>

      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setTabLibraryState(tab.value)}
            className="cursor-pointer"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <span className="mt-4">
        Total:{" "}
        {tabLibraryState === "playlists"
          ? currentUserPlaylists?.total
          : tabLibraryState === "albums"
            ? savedAlbums?.total
            : tabLibraryState === "artists"
              ? followedArtists?.total
              : savedTracks?.total}
      </span>

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
                  <img src={item.album.images?.[0]?.url} className="size-24" />
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
    </div>
  );
}
