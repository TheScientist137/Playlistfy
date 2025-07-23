export const getUserProfile = async (token: string): Promise<any> => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return await res.json();
}