import { useEffect } from "react";
import { useParams } from "react-router";
import { useStore } from "../stores/useStore.ts";
import Track from "../components/Track.tsx";
import { FaPlusCircle } from "react-icons/fa";

export default function Album() {
  const { id } = useParams();
  const { fetchAlbum, album } = useStore();

  useEffect(() => {
    if (!id) return;
    fetchAlbum(id);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <img src={album?.images[0].url} />
      <div className="flex">
        <p>{album?.name}</p>
        <button>
          <FaPlusCircle />
        </button>
      </div>
      <ul className="overflow-auto">
        {album?.tracks?.items.map((track) => (
          <li key={track.id} className="flex justify-between">
            <Track track={track} />
          </li>
        ))}
      </ul>
    </div>
  );
}
