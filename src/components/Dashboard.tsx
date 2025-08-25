import { useEffect } from "react";
import { useStore } from "../stores/useStore.ts";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function Dashboard() {
  const { fetchProfile, fetchUserPlaylists } = useStore();

  useEffect(() => {
    fetchProfile();
    fetchUserPlaylists();
  }, [fetchProfile, fetchUserPlaylists]);

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-stone-950 text-white">
      <Header />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
