import { useEffect } from "react";
import { useParams } from "react-router";
import { useStore } from "../stores/useStore";
import Track from "../components/Track";
import { FaPlusCircle } from "react-icons/fa";
import { IoMdRemoveCircle } from "react-icons/io";

export default function Playlist() {
  const { id } = useParams();
  const {
    fetchPlaylist,
    playlist,
    isFollowing,
    fetchUserFollowsPlaylist,
    followPlaylist,
    unFollowPlaylist,
  } = useStore();

  useEffect(() => {
    if (!id) return;

    fetchPlaylist(id);
    fetchUserFollowsPlaylist(id);
  }, []);

  // Quitar el estado local !!!!!! Manejar con estado de playlist (id)

  const handleFollow = async () => {
    if (!id) return;
    isFollowing ? await unFollowPlaylist(id) : followPlaylist(id);
  };

  return (
    <div className="h-full flex flex-col justify-between items-center">
      <img src={playlist?.images?.[0]?.url} />

      <div className="flex gap-2">
        <p>{playlist?.name}</p>
        <button onClick={handleFollow} className="cursor-pointer">
          {isFollowing ? <IoMdRemoveCircle /> : <FaPlusCircle />}
        </button>
      </div>

      <ul className="overflow-auto p-4">
        {playlist?.tracks?.items?.map((item) => (
          <li key={item.track.id}>
            <Track track={item.track} isInPlaylist={true} />
          </li>
        ))}
      </ul>
    </div>
  );
}
