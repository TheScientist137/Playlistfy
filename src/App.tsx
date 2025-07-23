import { useState, useEffect } from "react";

import LoginButton from "./components/LoginButton";
import UserProfile from "./components/UserProfile";

import type { SpotifyUser } from "./types/spotify";

import { exchangeCodeForToken } from "./services/pkceAuth";
import { getUserProfile } from './services/spotifyApi';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("spotify_access_token"));
  const [profile, setProfile] = useState<SpotifyUser | null>(null);

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

  const handleLogOut = () => {
    localStorage.clear();
    setToken(null);
  }

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      {token ? (
        <UserProfile profile={profile} onLogout={handleLogOut} />
      ) : (
        <LoginButton />
      )}
    </main>
  );
}

export default App;
