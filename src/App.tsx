import { Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";
import Callback from "./pages/Callback.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Home from "./pages/Home.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Playlists from "./pages/Playlists.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import Album from "./pages/Album.tsx";
import Artist from "./pages/Artist.tsx";
import Playlist from "./pages/Playlist.tsx";

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
        <Route path="playlists" element={<Playlists />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="album/:id" element={<Album />} />
        <Route path="artist/:id" element={<Artist />} />
        <Route path="playlist/:id" element={<Playlist />} />
      </Route>
    </Routes>
  );
}
export default App;
