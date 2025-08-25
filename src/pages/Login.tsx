import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAccessToken, redirectToSpotifyLogin } from "../services/pkceAuth";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // if token navigate home
        await getAccessToken();
        navigate("/");
      } catch (error) {
        // If no valid token clean storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_in");
      }
    };

    checkAuth();
  }, []);

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      <button onClick={redirectToSpotifyLogin} className="cursor-pointer">
        Login
      </button>
    </main>
  );
}
