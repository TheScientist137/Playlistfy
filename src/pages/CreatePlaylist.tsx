import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../stores/useStore";
import { createPlaylist, setPlaylistCover } from "../services/spotifyApi";

export default function CreatePlaylist() {
  const { profile, fetchUserPlaylists } = useStore();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject("Failed to convert file");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return; // Ensure we have user_id

    try {
      const newPlaylist = await createPlaylist(profile.id, name, description);

      if (file) {
        const base64 = await fileToBase64(file);
        await setPlaylistCover(newPlaylist.id, base64);
      }

      await fetchUserPlaylists();

      navigate(`/playlist/${newPlaylist.id}`);
    } catch (error) {
      console.error("Error creating new playlist");
    }
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
