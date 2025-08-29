import { useEffect } from "react";
import { Link } from "react-router";
import { useStore } from "../stores/useStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { FaPlayCircle, FaPauseCircle, FaPlusCircle } from "react-icons/fa";
import type { SearchResponse, SearchType, TrackType } from "../types/spotify";
import Track from "../components/Track";
import SearchBar from "../components/SearchBar";

export default function SearchResults() {
  const {
    searchQuery,
    searchType,
    searchOffset,
    searchLimit,
    searchResults,
    loadingSearch,
    setSearchType,
    setSearchOffset,
    fetchSearchResults,
  } = useStore();

  const { playTrack, pause, isPaused, currentTrack } = usePlayerStore();

  // Fetch results depending on query, type and offset
  useEffect(() => {
    if (!searchQuery) return;

    fetchSearchResults(searchQuery, searchType, searchOffset);
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

  // pages/SearchResults.tsx - Agrega logs para debuggear
  // Persist data between renders

  return (
    <div className="h-full flex flex-col justify-between">
      <SearchBar />

      <h2>results for: {searchQuery}</h2>

      <nav>
        {tabs.map((tab) => (
          <button key={tab.value} onClick={() => setSearchType(tab.value)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {loadingSearch && <p>Searching…</p>}

      {!loadingSearch && !searchResults && (
        <p>No results for “{searchQuery}”</p>
      )}

      {searchResults && (
        <div>
          <ul>
            {searchType === "track" &&
              searchResults.tracks?.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <Track track={item} />
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
                  <Link to={`/playlist/${item?.id}`}>{item?.name}</Link>
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
