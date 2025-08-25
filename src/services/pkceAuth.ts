// ---------------------------------------------------------------------------
// Authorization Code with PKCE Flow
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const SCOPES = [
  "streaming",
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// High entropy cryptographic random string to generate code verifier
const generateRandomString = (length: number): string => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (x) => possible[x % possible.length]).join("");
};

// Hash code verifer with SHA256 and base64encode to generate code challenge
const sha256 = async (verifier: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);

  return crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// ---------------------------------------------------------------------------
// Request User Authorization (redirect for login into your spotify account)
// ---------------------------------------------------------------------------

export const redirectToSpotifyLogin = async () => {
  // Generate code verifier
  const codeVerifier = generateRandomString(128);

  // Generate code challenge
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  window.localStorage.setItem("code_verifier", codeVerifier);

  // Build / authorize URL endpoint
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES.join(" "),
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state: generateRandomString(16), // Optional CSRF token
  });

  AUTH_URL.search = new URLSearchParams(params).toString();
  window.location.href = AUTH_URL.toString();
};

// ---------------------------------------------------------------------------
// Exchange authorization_code for access_token, refres_token, expires_in
// ---------------------------------------------------------------------------

export const exchangeCodeForToken = async (code: string) => {
  // Extract code verifier
  const codeVerifier = window.localStorage.getItem("code_verifier");
  if (!codeVerifier) throw new Error("No code_verifier in storage");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.statusText}`);

  const data = await res.json();
  console.log(data);

  // Save access_token and refresh_token on localStorage
  window.localStorage.setItem("access_token", data.access_token);
  window.localStorage.setItem("refresh_token", data.refresh_token);

  // Exact moment when the token expires
  const expiresIn = Date.now() + data.expires_in * 1000;
  window.localStorage.setItem("expires_in", expiresIn.toString());

  // cleanup code_verifier from storage
  window.localStorage.removeItem("code_verifier");

  return data;
};

// ---------------------------------------------------------------------------
// Refresh Access token using refresh_token and expires_in
// ---------------------------------------------------------------------------

const getRefreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refres_token in storage");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  });

  if (!res.ok) throw new Error(`Refresh token failed ${res.statusText}`);
  const data = await res.json();

  // Update access token
  window.localStorage.setItem("access_token", data.access_token);

  // Update refresh_token
  if (data.refresh_token)
    window.localStorage.setItem("refresh_token", data.refresh_token);

  // Update expires_in
  if (data.expires_in) {
    const expiresIn = Date.now() + data.expires_in * 1000;
    window.localStorage.setItem("expires_in", expiresIn.toString());
  }

  return data.access_token;
};

// ---------------------------------------------------------------------------
// Get valid access_token (refresh if expired)
// ---------------------------------------------------------------------------

export const getAccessToken = async (): Promise<string> => {
  const token = window.localStorage.getItem("access_token");
  const expiresIn = window.localStorage.getItem("expires_in");

  if (!token || Date.now() >= Number(expiresIn)) return await getRefreshToken();

  return token;
};

// Create Interfaces for more type syfety
