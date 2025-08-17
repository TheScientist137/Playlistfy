import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";

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
import { Dashboard } from "./components/Dashboard.tsx";

function App() {
  const [profile, setProfile] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect for authorization with token
  useEffect(() => {
    const init = async () => {
      // Get exchange code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      try {
        // Exchange code for token and clean url
        if (code) {
          await exchangeCodeForToken(code);
          window.history.replaceState({}, "", "/");
        }

        // Get user profile (using token on api)
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // Search handler
  const handleSearch = async (query: string) => {
    if (!query) {
      setTracks([]);

      return;
    }
    try {
      const data = await searchTracks(query);
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
    if (!profile) return;
    try {
      const newPlaylist = await createPlaylist(profile.id, name, description);
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
    setProfile(null);
    setTracks([]);
  };

  if (!profile) return <LoginButton />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

export default App;
