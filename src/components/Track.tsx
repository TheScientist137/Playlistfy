import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useTrackStore } from "../stores/useTrackStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { CiMenuKebab } from "react-icons/ci";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import type { TrackType, TrackContext } from "../types/spotify";
import TrackOptionsModal from "./TrackOptionsModal";
import AddToPlaylistModal from "./AddToPlaylistModal";

type Props = {
  track: TrackType;
  context: TrackContext;
  ownPlaylist?: boolean;
  playlistId?: string;
  onRemove?: (uri: string) => void;
};

export default function Track({
  track,
  context,
  ownPlaylist,
  playlistId,
}: Props) {
  const [trackOptionsModal, setTrackOptionsModal] = useState(false);
  const [addToPlaylistModal, setAddToPlaylistModal] = useState(false);
  const { currentTrack, isPaused, playTrack, pause } = usePlayerStore();
  const { savedTracksMap, saveTracks, unSaveTracks } = useTrackStore();
  const { removeItemsFromPlaylist, playlistTracksMap } = usePlaylistStore();

  const handleSave = async () => {
    const currentlySaved = savedTracksMap[track.id];
    currentlySaved
      ? await unSaveTracks(track.id)
      : await saveTracks([track.id]);
  };

  const handleRemove = async () => {
    if (!playlistId) return;

    await removeItemsFromPlaylist(playlistId, track.uri);
    setTrackOptionsModal(false);
  };

  return (
    <div className="w-full flex justify-between items-center gap-8">
      <div
        onClick={() =>
          !isPaused && currentTrack?.uri === track.uri
            ? pause()
            : playTrack(track.uri)
        }
        className="w-full cursor-pointer flex items-center gap-4"
      >
        {/* Track on Album has no image (is already on the album) */}
        {context !== "album" && (
          <img
            src={track.album?.images[0].url}
            className="size-16 rounded-sm"
          />
        )}

        <div className="flex flex-col">
          <span>{track.name}</span>
          <span className="text-stone-400">{track.artists[0].name}</span>
        </div>
      </div>

      <button
        className="cursor-pointer"
        onClick={() => setTrackOptionsModal(true)}
      >
        <CiMenuKebab size={18} />
      </button>

      {context !== "library" && (
        <button onClick={() => handleSave()} className="cursor-pointer">
          {savedTracksMap[track.id] ? (
            <FiMinusCircle className="size-5 text-green-500" />
          ) : (
            <FiPlusCircle className="size-5" />
          )}
        </button>
      )}

      {trackOptionsModal && (
        <TrackOptionsModal
          track={track}
          context={context}
          ownPlaylist={ownPlaylist}
          onClose={() => setTrackOptionsModal(false)}
          onSave={handleSave}
          onRemove={handleRemove}
          onAddToPlaylist={() => {
            setTrackOptionsModal(false);
            setAddToPlaylistModal(true);
          }}
        />
      )}

      {addToPlaylistModal && (
        <AddToPlaylistModal
          trackUri={track.uri}
          playlistId={ownPlaylist ? playlistId : undefined} // 👈 si estamos en una playlist, se pasa
          onClose={() => setAddToPlaylistModal(false)}
        />
      )}
    </div>
  );
}
