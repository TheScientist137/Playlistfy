import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export default function Callback() {
  const navigate = useNavigate();
  const { exchange } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      // Get code from url
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      // If no code return to login
      if (!code) return navigate("/login");

      // Exchange code for token - clean url - navigate home
      try {
        await exchange(code);
        window.history.replaceState({}, "", "/");
        navigate("/");
      } catch (error) {
        console.error("error exchanging token", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  // Intentar evitar el parpadeo !!

  return <p>Processing login...</p>;
}
