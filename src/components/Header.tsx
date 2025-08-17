import { Link } from "react-router";
import spotifyLogo from "../assets/spotify-logo.svg";

export default function Header() {
  return (
    <header>
      <div>
        <Link to="/">
          <img src={spotifyLogo} alt="Spotify logo" />
        </Link>
        <Link to="/">Home</Link>
      </div>

      <div>
        <input type="text" placeholder="Search" />
      </div>

      <Link to="/user">
        <img />
        <span></span>
      </Link>
    </header>
  );
}
