import { useState, useEffect } from "react";

import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";
import SearchBar from "./components/SearchBar";
import Tracklist from "./components/Tracklist";

import type { SpotifyUser, SpotifyTrack } from "./types/spotify";

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
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("spotify_access_token")) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) return; // No code => nothing to do

    exchangeCodeForToken(code)
      .then((data) => {
        localStorage.setItem("spotify_access_token", data.access_token);
        setToken(data.access_token);
        window.history.replaceState({}, document.title, "/"); // Clean URL
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
      .then((data) => {
        console.log(data);
        setProfile(data);
      })
      .catch((error) => console.error(error));
  }, [token]);

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

  const handleCreatePlaylist = async () => {
    if (!token || !profile) return;
    try {
      const newPlaylist = await createPlaylist(
        token,
        profile.id,
        "My Playlistfy Mix",
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
    localStorage.clear();
    setToken(null);
    setProfile(null);
    setTracks([]);
  };

  if (searchLoading) return <p>Loading...</p>;
  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      {token ? (
        <>
          <UserProfile profile={profile} onLogout={handleLogOut} />
          <SearchBar onSearch={handleSearch} />
          <Tracklist tracks={tracks} />

          {!showSuccess && (
            <button onClick={handleCreatePlaylist} style={{ marginTop: 16 }}>
              Create playlist
            </button>
          )}

          {showSuccess && <p>Playlist creada ✅</p>}
        </>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}

export default App;
