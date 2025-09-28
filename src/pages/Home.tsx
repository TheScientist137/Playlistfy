import { useNavigate } from "react-router";
import { useUserStore } from "../stores/useUserStore";
import { useAlbumStore } from "../stores/useAlbumStore";
import { useTrackStore } from "../stores/useTrackStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const navigate = useNavigate();
  const { profile, loadingProfile } = useUserStore();

  if (loadingProfile) return <p>Loading...</p>;

  const handleLibraryClick = () => {
    useTrackStore.getState().fetchSavedTracks(0);
    useAlbumStore.getState().fetchSavedAlbums(0);
    usePlaylistStore.getState().fetchCurrentUserPlaylists(0);

    navigate("/library");
  };

  return (
    <div className="h-full flex flex-col items-center">
      {/* Sidebar Menu ??? */}
      <h2 className="py-6 text-2xl font-semibold  text-center">
        Welcome back
        <br />
        <span className="text-green-400">{profile?.display_name}</span>
      </h2>

      <SearchBar redirectOnSubmit={true} />

      <div className="mb-6">
        <button
          onClick={() => navigate("/playlist/new")}
          className="bg-stone-900 hover:bg-stone-800 px-4 py-2 rounded-lg cursor-pointer"
        >
          New Playlist
        </button>
      </div>

      <div className="">
        <button
          onClick={() => handleLibraryClick()}
          className="bg-stone-900 hover:bg-stone-800 px-4 py-2 rounded-lg cursor-pointer"
        >
          Your Library
        </button>
      </div>
    </div>
  );
}
