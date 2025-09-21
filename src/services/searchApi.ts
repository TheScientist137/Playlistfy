import { useAuthStore } from "../stores/useAuthStore";
import type { SearchResponse } from "../types/spotify";

// -------------------------------------------------------------------------------
// Search for Item => Improve !!
// -------------------------------------------------------------------------------

export const search = async (
  query: string,
  type: string,
  limit: number = 20,
  offset: number = 0,
): Promise<SearchResponse> => {
  const token = await useAuthStore.getState().getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: type,
    market: "ES",
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const res = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
