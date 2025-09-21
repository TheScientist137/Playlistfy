import { useEffect } from "react";
import { useParams } from "react-router";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useUserStore } from "../stores/useUserStore";
import Track from "../components/Track";
import Loading from "../components/Loading";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

export default function Playlist() {
  const { id } = useParams();
  const { playlist, loadingPlaylist, fetchPlaylist } = usePlaylistStore();
  const {
    profile,
    followedPlaylistsMap,
    followPlaylist,
    unFollowPlaylist,
    checkCurrentUserFollowsPlaylist,
  } = useUserStore();

  useEffect(() => {
    if (!id) return;
    fetchPlaylist(id);
    checkCurrentUserFollowsPlaylist([id]);
  }, []);

  const handleFollowPlaylist = async (playlistId: string) => {
    const currentlyFollowed = followedPlaylistsMap[playlistId];
    currentlyFollowed
      ? await unFollowPlaylist(playlistId)
      : await followPlaylist(playlistId);
  };

  const isOwner =
    playlist?.owner?.id === profile?.id || playlist?.collaborative || false;

  if (loadingPlaylist || !playlist) return <Loading />;

  return (
    <div className="h-full flex flex-col justify-between items-center">
      <img src={playlist.images?.[0]?.url} />

      <div className="flex gap-2">
        <p>{playlist?.name}</p>

        <button
          onClick={() => handleFollowPlaylist(playlist.id)}
          className="cursor-pointer"
        >
          {followedPlaylistsMap[playlist.id] ? (
            <FiMinusCircle className="size-5 text-green-500" />
          ) : (
            <FiPlusCircle className="size-5" />
          )}
        </button>

        {isOwner && <button>add tracks</button>}
      </div>

      <ul className="overflow-auto p-4 flex flex-col gap-6">
        {/* Ensure every key is unique */}
        {playlist?.tracks?.items?.map((item, index) => (
          <li key={`${item.track.id} - ${index}`}>
            <Track
              track={item.track}
              context="playlist"
              ownPlaylist={isOwner}
              playlistId={playlist.id}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
