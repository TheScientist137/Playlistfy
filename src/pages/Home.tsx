import { useNavigate } from "react-router";
import { useStore } from "../stores/useStore";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const navigate = useNavigate();
  const { profile, loadingProfile } = useStore();

  if (loadingProfile) return <p>Loading...</p>;

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
        <button className="bg-stone-900 hover:bg-stone-800 px-4 py-2 rounded-lg">
          New Playlist
        </button>
      </div>

      <div className="">
        <button
          onClick={() => navigate("/playlists")}
          className="bg-stone-900 hover:bg-stone-800 px-4 py-2 rounded-lg"
        >
          Manage Playlists
        </button>
      </div>
    </div>
  );
}
