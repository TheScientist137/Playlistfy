// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
];

// ---------------------------------------------------------------------------
//  helpers
// ---------------------------------------------------------------------------
const generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (x) => possible[x % possible.length]).join("");
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// ---------------------------------------------------------------------------
// Redirect the user to spotify
// ---------------------------------------------------------------------------
export const redirectToSpotifyLogin = async () => {
  // Create code verifier & challenge
  const codeVerifier = generateRandomString(128);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Persist verifier on localStorage for later
  window.localStorage.setItem("spotify_code_verifier", codeVerifier);

  // Build /authorize URL endpoint
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state: generateRandomString(16), // Optional CSRF token
  });

  window.location.href = `${AUTH_URL}?${params.toString()}`;
};

// ---------------------------------------------------------------------------
// Exchange authorization_code for access_token
// ---------------------------------------------------------------------------
export const exchangeCodeForToken = async (code: string) => {
  // Extract code verifier form storage
  const codeVerifier = window.localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) throw new Error("No code_verifier in storage");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.statusText}`);

  const data = await res.json();
  window.localStorage.removeItem('spotify_code_verifier'); // cleanup storage
  return data;
};
