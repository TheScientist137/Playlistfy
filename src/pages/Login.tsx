import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const { isLoguedIn, login } = useAuthStore();

  useEffect(() => {
    if (isLoguedIn) navigate("/");
  }, []);

  return (
    <main>
      <h1>Welcome to Playlistfy</h1>
      <button onClick={login} className="cursor-pointer">
        Login
      </button>
    </main>
  );
}
