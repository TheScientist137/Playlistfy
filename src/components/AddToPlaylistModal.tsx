import { useEffect, useRef } from "react";
import { useUserStore } from "../stores/useUserStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import Loading from "./Loading";
import { ImSinaWeibo } from "react-icons/im";

interface Props {
  trackUri: string;
  playlistId?: string;
  onClose: () => void;
}

export default function AddToPlaylistModal({
  trackUri,
  playlistId,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { profile } = useUserStore();
  const {
    currentUserPlaylists,
    loadingCurrentUserPlaylists,
    playlistTracksMap,
    fetchCurrentUserPlaylists,
    addItemsToPlaylist,
  } = usePlaylistStore();

  useEffect(() => {
    if (!currentUserPlaylists || currentUserPlaylists.items.length === 0) {
      fetchCurrentUserPlaylists();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickOutside =
        modalRef.current && !modalRef.current.contains(event.target as Node);
      clickOutside && onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => removeEventListener("mousedown", handleClickOutside);
  }, []);

  const playlistsForAdd = currentUserPlaylists?.items.filter((playlist) => {
    const isOwn = playlist.owner.id === profile?.id || playlist.collaborative;
    const isInPlaylist = playlist.id !== playlistId;
    const isTrackInPlaylist = !playlistTracksMap[playlist.id]?.[trackUri];

    return isOwn && isInPlaylist && isTrackInPlaylist;
  });

  const handleAdd = async (playlistId: string) => {
    await addItemsToPlaylist(playlistId, trackUri);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="h-1/2 w-full mx-16 bg-stone-800 flex flex-col rounded-lg"
      >
        <div className="w-full p-4 flex justify-between border-b-2">
          <p>User Playlists</p>
          <button onClick={onClose}>x</button>
        </div>

        {loadingCurrentUserPlaylists && !currentUserPlaylists && <Loading />}

        <ul className="h-full p-4 flex flex-col gap-4 overflow-auto">
          {playlistsForAdd?.map((playlist) => (
            <li key={playlist.id} className="flex items-center gap-2">
              <img src={playlist.images?.[0].url} className="size-18" />
              <span>{playlist.name}</span>
              <button
                onClick={() => handleAdd(playlist.id)}
                className="cursor-pointer"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
