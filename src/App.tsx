import { useState, useEffect } from "react";

import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";
import SearchBar from "./components/SearchBar";
import Tracklist from "./components/Tracklist";

import type { SpotifyUser, SpotifyTrack } from "./types/spotify";

import { exchangeCodeForToken } from "./services/pkceAuth";
import { getUserProfile, searchTracks } from './services/spotifyApi';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("spotify_access_token"));
  const [profile, setProfile] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("spotify_access_token")) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
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

    getUserProfile(token).then((data) => {
      console.log(data);
      setProfile(data);
    }).catch((error) => console.error(error));

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
      console.error('Error searching for tracks');
    } finally {
      setSearchLoading(false);
    }
  }

  const handleLogOut = () => {
    localStorage.clear();
    setToken(null);
  }

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      {token ? (
        <>
          <UserProfile profile={profile} onLogout={handleLogOut} />
          <SearchBar onSearch={handleSearch} />
          <Tracklist tracks={tracks} />
        </>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}

export default App;
