import { useStore } from "../stores/useStore";

type Props = {
  trackUri: string;
  onClose: () => void;
};

export default function AddToPlaylistModal({ trackUri, onClose }: Props) {
  const { userPlaylists, addTrackToPlaylist } = useStore();

  const handleAdd = async (playlistId: string) => {
    await addTrackToPlaylist(playlistId, trackUri);
    onClose(); // Close playlist modal
  };

  return (
    <div className="flex flex-col fixed inset-0 bg-black m-12">
      <button onClick={onClose}>close</button>

      <ul className="overflow-auto">
        {userPlaylists?.items.map((playlist) => (
          <li key={playlist.id}>
            <button onClick={() => handleAdd(playlist.id)}>
              <img src={playlist.images?.[0].url} />
              <span>{playlist.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
