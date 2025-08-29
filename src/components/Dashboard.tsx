import { useEffect } from "react";
import { useStore } from "../stores/useStore.ts";
import { usePlayerStore } from "../stores/usePlayerStore.ts";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import Player from "./Player.tsx";

export default function Dashboard() {
  const { fetchProfile, fetchUserPlaylists } = useStore();
  const { initPlayer, currentTrack } = usePlayerStore();

  useEffect(() => {
    fetchProfile();
    fetchUserPlaylists();
    initPlayer();
  }, [fetchProfile, fetchUserPlaylists, initPlayer]); // comprobar necesariedad

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-stone-950 text-white">
      <Header />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

      <div>
        {currentTrack && <Player />}
        <Footer />
      </div>
    </div>
  );
}
