import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useUserStore } from "../stores/useUserStore";
import { useAuthStore } from "../stores/useAuthStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { FaHome } from "react-icons/fa";
import spotifyLogo from "../assets/spotify-logo.svg";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { profile } = useUserStore();
  const { logout } = useAuthStore();
  const { logoutPlayer } = usePlayerStore();

  // Reference menu container to detect clicks outside the menu
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Effect to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If the click wasn't inside the menu => close the menu
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Listen to all clicks on the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup => remove listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutPlayer();
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full px-6 py-2 flex items-center gap-4 justify-between bg-stone-900">
      <div className="flex items-center gap-4">
        <img src={spotifyLogo} alt="Spotify logo" className="h-8 w-8" />
        <Link to="/" className="">
          <FaHome size={26} />
        </Link>
      </div>

      <h1 className="text-xl font-semibold">
        <Link to="/">Playlistfy</Link>
      </h1>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="h-8 w-8 rounded-full overflow-hidden cursor-pointer"
        >
          <img
            src={profile?.images[0]?.url}
            className="h-full w-full object-cover"
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 bg-stone-900 p-2 rounded-lg z-50">
            <h3 className="cursor-pointer">{profile?.display_name}</h3>
            <button onClick={handleLogout} className="cursor-pointer">
              logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
