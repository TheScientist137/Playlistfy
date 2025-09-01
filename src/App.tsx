import { Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";
import Callback from "./pages/Callback.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Home from "./pages/Home.tsx";
import Dashboard from "./components/Dashboard.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import UserPlaylist from "./pages/UserPlaylist.tsx";
import UserLibrary from "./pages/UserLibrary.tsx";
import Album from "./pages/Album.tsx";
import Artist from "./pages/Artist.tsx";
import Playlist from "./pages/Playlist.tsx";
import CreatePlaylist from "./pages/CreatePlaylist.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        <Route index element={<Home />} />
        <Route path="playlists" element={<UserLibrary />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="playlist/:id" element={<UserPlaylist />} />
        <Route path="playlist/public/:id" element={<Playlist />} />
        <Route path="playlist/new" element={<CreatePlaylist />} />
      </Route>
    </Routes>
  );
}
export default App;
