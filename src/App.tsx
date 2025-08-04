import { useState, useEffect } from "react";

import LoginButton from "./components/LoginButton.tsx";
import UserProfile from "./components/UserProfile.tsx";

import SearchBar from "./components/SearchBar.tsx";
import CreatePlaylistForm from "./components/CreatePlaylistForm.tsx";

import Tracklist from "./components/Tracklist";
import PlaylistList from "./components/PlaylistList";

import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyPlaylist,
} from "./types/spotify";

import { exchangeCodeForToken } from "./services/pkceAuth";
import {
  getUserProfile,
  searchTracks,
  createPlaylist,
} from "./services/spotifyApi";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("spotify_access_token"),
  );
  const [profile, setProfile] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect for authorization with token
  useEffect(() => {
    // If already is a token => return
    if (localStorage.getItem("spotify_access_token")) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return; // No code => nothing to do

    // 3. Limpiamos la URL **antes** de la segunda montura
    // El segundo render no ve "code" ya que lo hemos limpiado
    window.history.replaceState({}, "", "/");

    exchangeCodeForToken(code)
      .then((data) => {
        localStorage.setItem("spotify_access_token", data.access_token);
        setToken(data.access_token);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Effect for user info if it is already logued in
  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
      .then((data) => {
        console.log(data);
        setProfile(data);
      })
      .catch((error) => console.error(error));
  }, [token]);

  // Search handler
  const handleSearch = async (query: string) => {
    if (!query) {
      setTracks([]);
      return;
    }
    try {
      const data = await searchTracks(token!, query);
      setTracks(data.tracks.items);
    } catch (error) {
      setTracks([]);
      console.error("Error searching for tracks", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Create playlist handler
  const handleCreatePlaylist = async (name: string, description: string) => {
    if (!token || !profile) return;
    try {
      const newPlaylist = await createPlaylist(
        token,
        profile.id,
        name,
        description,
      );
      setPlaylist(newPlaylist);
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setPlaylist(null);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("spotify_access_token");
    setToken(null);
    setProfile(null);
    setTracks([]);
  };

  if (!token) return <LoginButton />;
  if (!profile) return <p>Loading profile</p>;

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      <UserProfile profile={profile} onLogout={handleLogOut} />
      <SearchBar onSearch={handleSearch} />
      <Tracklist tracks={tracks} />

      <PlaylistList token={token} />

      {!showForm && !showSuccess && (
        <button onClick={() => setShowForm(true)} style={{ marginTop: 16 }}>
          Create new playlist
        </button>
      )}

      {showForm && (
        <div>
          <CreatePlaylistForm />
          <button onClick={() => setShowForm(false)}>close</button>
        </div>
      )}

      {showSuccess && <p>Playlist creada ✅</p>}
    </main>
  );
}

export default App;
