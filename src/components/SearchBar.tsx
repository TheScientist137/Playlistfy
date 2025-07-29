import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    // Prevents for page reload
    e.preventDefault();
    // Do not search is it is empty
    if (!query.trim()) return;
    // Call onSearch with the user query and clean
    onSearch(query.trim());
    setQuery('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tracks ..."
      />
      <button type="submit">Search</button>
    </form>
  )
}