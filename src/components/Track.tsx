import { usePlayerStore } from "../stores/usePlayerStore";
import { FaPlayCircle, FaPauseCircle, FaPlusCircle } from "react-icons/fa";

export default function Track({ track }) {
  const { currentTrack, isPaused, playTrack, pause } = usePlayerStore();

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
        <button>
          <FaPlusCircle />
        </button>
      </div>
    </div>
  );
}
