import { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../stores/useUserStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";

export default function CreatePlaylist() {
  const { profile } = useUserStore();
  const { createPlaylist } = usePlaylistStore();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // REHACER => MOVER LA LLAMADA AL STORE
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return; // Ensure we have user_id

    const newPlaylistId = await createPlaylist(
      profile.id,
      name,
      description,
      file,
    );

    if (newPlaylistId) navigate(`/playlist/${newPlaylistId}`);
  };

  return (
    <div className="h-full">
      <h2>Create new Playlist</h2>

      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col jsutify-center"
      >
        <input
          type="file"
          accept="image/jpeg"
          placeholder="Playlist image"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          placeholder="Playlist name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <textarea
          typeof="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">create</button>
      </form>
    </div>
  );
}
