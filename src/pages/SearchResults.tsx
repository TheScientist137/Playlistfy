import { useEffect } from "react";
import { useStore } from "../stores/useStore";
import type { SearchResponse, SearchType } from "../types/spotify";

export default function SearchResults() {
  const {
    searchQuery,
    searchType,
    searchOffset,
    searchLimit,
    setSearchType,
    setSearchOffset,
    fetchSearchResults,
    searchResults,
    loadingSearch,
  } = useStore();

  // Fetch results depending on query, type and offset
  useEffect(() => {
    if (!searchQuery) return;

    fetchSearchResults(searchQuery, searchType, searchOffset);
  }, [searchQuery, searchType, searchOffset]);

  // Pagination
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

  // Persist data between renders

  return (
    <div>
      <h2>Search results for: {searchQuery}</h2>

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
                  <span>{item.name}</span>
                  <div className="">
                    <button>Play</button>
                    <button>Add</button>
                  </div>
                </li>
              ))}
            {searchType === "artist" &&
              searchResults.artists?.items.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}

            {searchType === "album" &&
              searchResults.albums?.items.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}

            {searchType === "playlist" &&
              searchResults.playlists?.items?.map((item) => (
                <li key={item?.id}>{item?.name}</li>
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
