import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { useStore } from "../stores/useStore";
import Track from "../components/Track";
import SearchBar from "../components/SearchBar";
import type { SearchResponse, SearchType } from "../types/spotify";

export default function SearchResults() {
  const [searchParams] = useSearchParams(); // Read url
  const {
    searchQuery,
    searchType,
    searchOffset,
    searchLimit,
    searchResults,
    loadingSearch,
    setSearchQuery,
    setSearchType,
    setSearchOffset,
    fetchSearchResults,
  } = useStore();

  // Component mounts => read URL => upload store
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const type = (searchParams.get("type") as SearchType) || "track";
    const offset = Number(searchParams.get("offset")) || 0;

    setSearchQuery(q);
    setSearchType(type);
    setSearchOffset(offset);
  }, []);

  // if there is a query => Search => Upload URL with store values
  useEffect(() => {
    if (!searchQuery) return;
    fetchSearchResults(searchQuery, searchType, searchOffset);

    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set("q", searchQuery);
    newParams.set("type", searchType); // no if => There is always a type
    if (searchOffset) newParams.set("offset", String(searchOffset));

    // Change url without a page reload
    window.history.replaceState(null, "", `?${newParams.toString()}`);
  }, [searchQuery, searchType, searchOffset]);

  // Pagination (Reahcer mejorando y entendiendo mejor el proceso)
  const pageType = searchType + "s";
  const results = searchResults?.[pageType as keyof SearchResponse];
  const total = results?.total ?? 0;

  const currentPage = Math.floor(searchOffset / searchLimit) + 1;
  const totalPages = Math.ceil(total / searchLimit);

  const nextOffset = searchOffset + searchLimit;
  const prevOffset = searchOffset - searchLimit;

  const canNext = nextOffset < total;
  const canPrev = searchOffset > 0;

  const nextPage = () => canNext && setSearchOffset(nextOffset);
  const prevPage = () => canPrev && setSearchOffset(prevOffset);

  // Type tabs
  const tabs: { label: string; value: SearchType }[] = [
    { label: "Songs", value: "track" },
    { label: "Albums", value: "album" },
    { label: "Artists", value: "artist" },
    { label: "Playlists", value: "playlist" },
  ];

  return (
    <div className="h-full flex flex-col items-center">
      <SearchBar />

      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSearchType(tab.value)}
            className="p-2 bg-stone-800 rounded-lg cursor-pointer"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {searchQuery && <h2>Results for {searchQuery}</h2>}

      {loadingSearch && <p>Searching…</p>}

      {searchResults && (
        <div>
          <ul>
            {searchType === "track" &&
              searchResults.tracks?.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <Track track={item} isInPlaylist={true} />
                </li>
              ))}

            {searchType === "artist" &&
              searchResults.artists?.items.map((item) => (
                <li key={item.id}>
                  <Link to={`/artist/${item.id}`}>{item.name}</Link>
                </li>
              ))}

            {searchType === "album" &&
              searchResults.albums?.items.map((item) => (
                <li key={item.id}>
                  <Link to={`/album/${item.id}`}>{item.name}</Link>
                </li>
              ))}

            {searchType === "playlist" &&
              searchResults.playlists?.items?.map((item) => (
                <li key={item?.id}>
                  <Link to={`/playlist/public/${item?.id}`}>{item?.name}</Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {total > 0 && (
        <nav>
          <button onClick={prevPage} disabled={!canPrev}>
            prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button onClick={nextPage} disabled={!canNext}>
            next
          </button>
        </nav>
      )}
    </div>
  );
}
