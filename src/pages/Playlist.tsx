import { useEffect } from "react";
import { useParams } from "react-router";
import { useStore } from "../stores/useStore";
import Track from "../components/Track";
import { FaPlusCircle } from "react-icons/fa";

export default function Playlist() {
  const { id } = useParams();
  const { fetchPlaylist, playlist } = useStore();

  useEffect(() => {
    if (!id) return;
    fetchPlaylist(id);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between items-center">
      <img src={playlist?.images[0].url} />

      <div className="flex gap-2">
        <p>{playlist?.name}</p>
        <button>
          <FaPlusCircle />
        </button>
      </div>

      <ul className="overflow-auto p-4">
        {playlist?.tracks.items.map((item) => (
          <li key={item.track.id}>
            <Track track={item.track} />
          </li>
        ))}
      </ul>
    </div>
  );
}
