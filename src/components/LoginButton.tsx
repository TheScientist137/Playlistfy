import { redirectToSpotifyLogin } from "../services/pkceAuth";

export default function LoginButton() {
  return (
    <button onClick={() => redirectToSpotifyLogin()}>
      Login
    </button>
  )
}

