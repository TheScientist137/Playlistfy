import { useEffect } from "react";
import { useNavigate } from "react-router";
import { exchangeCodeForToken } from "../services/pkceAuth";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Get exchange token
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      // If no code return to login
      if (!code) return navigate("/login");

      // Exchange code for token - clean url - navigate home
      try {
        await exchangeCodeForToken(code);
        window.history.replaceState({}, "", "/");
        navigate("/");
      } catch (error) {
        console.error("error exchanging token", error);
      }
    };

    handleCallback();
  }, []);
  return <p>Processing login...</p>;
}
