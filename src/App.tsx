import { useState, useEffect } from "react";
import {
  redirectToSpotifyLogin,
  exchangeCodeForToken,
} from "./services/pkceAuth";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
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

  const handleLogOut = () => {
    localStorage.clear();
    setToken(null);
  }

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      {token ? (
        <>
          <p>Welcome back! Access token: {token}</p>
          <button onClick={() => handleLogOut()}>Log out</button>
        </>
      ) : (
        <button onClick={() => redirectToSpotifyLogin()}>
          Login with Spotify!
        </button>
      )}
    </main>
  );
}

export default App;
