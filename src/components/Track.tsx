import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import AddToPlaylistModal from "./AddToPlaylistModal";
import { FaPlayCircle, FaPauseCircle, FaPlusCircle } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import type { TrackType } from "../types/spotify";

type Props = {
  track: TrackType;
  isInPlaylist: boolean;
  onRemove?: (uri: string) => void;
};

export default function Track({ track, isInPlaylist, onRemove }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { currentTrack, isPaused, playTrack, pause } = usePlayerStore();

  // MEJORAR ISINPLAYLIST FLOW !!!

  return (
    <div className="w-full flex justify-between">
      <div>
        <span>{track.name}</span>
      </div>
      <div>
        <button>
          {!isPaused && currentTrack?.uri === track.uri ? (
            <FaPauseCircle onClick={() => pause()} />
          ) : (
            <FaPlayCircle onClick={() => playTrack(track.uri)} />
          )}
        </button>

        {isInPlaylist ? (
          <button onClick={() => setShowModal(true)}>
            <FaPlusCircle />
          </button>
        ) : (
          <button onClick={() => onRemove?.(track.uri)}>
            <IoIosRemoveCircle />
          </button>
        )}

        {showModal && (
          <AddToPlaylistModal
            trackUri={track.uri}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}
