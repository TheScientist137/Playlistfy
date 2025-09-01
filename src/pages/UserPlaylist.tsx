import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useStore } from "../stores/useStore";
import Track from "../components/Track";

export default function UserPlaylist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlist,
    profile,
    fetchPlaylist,
    unFollowPlaylist,
    removeTrackFromPlaylist,
  } = useStore();

  useEffect(() => {
    if (!id) return;
    fetchPlaylist(id);
  }, []);

  const handleRemove = async (uri: string) => {
    if (!id) return;
    await removeTrackFromPlaylist(id, uri);
  };

  const handleUnfollow = async () => {
    if (!id) return;
    await unFollowPlaylist(id);
    navigate("/playlists");
  };

  // Improve - understand better !!!!!!!
  const canAddTracks =
    playlist?.owner?.id === profile?.id || playlist?.collaborative;

  return (
    <div>
      <h2>{playlist?.name}</h2>
      <p>{playlist?.description}</p>
      <img src={playlist?.images?.[0].url} />

      <div className="flex gap-4">
        {canAddTracks && (
          <button onClick={() => navigate("/search")}>Add Items</button>
        )}
        <button onClick={handleUnfollow}>unfollow</button>
      </div>

      <ul className="overflow-auto p-4">
        {playlist?.tracks?.items?.map((item) => (
          <li key={item.track.id}>
            <Track
              track={item.track}
              isInPlaylist={false}
              onRemove={handleRemove}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
