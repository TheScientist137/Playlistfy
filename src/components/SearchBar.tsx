import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../stores/useStore";
import { FaSearch } from "react-icons/fa";

interface props {
  redirectOnSubmit?: boolean;
}

export default function SearchBar({ redirectOnSubmit }: props) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { setSearchQuery, searchQuery } = useStore();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim(); // Elimina espacios vacios
    if (!trimmed) return;

    setSearchQuery(trimmed);

    if (redirectOnSubmit) {
      navigate(`/search?q=${encodeURIComponent(value)}&type=track&offset=0`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={value}
        placeholder={redirectOnSubmit ? "Search" : searchQuery}
        onChange={(event) => setValue(event.target.value)}
        className="px-4 py-2 rounded-full bg-stone-900 outline-none"
      />
      <button type="submit">
        <FaSearch />
      </button>
    </form>
  );
}
