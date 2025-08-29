import { usePlayerStore } from "../stores/usePlayerStore";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";

export default function Player() {
  const { currentTrack, isPaused, playTrack, pause } = usePlayerStore();

  if (!currentTrack) return;
  return (
    <div className="flex p-4 bg-stone-900">
      <div>{currentTrack.name}</div>
      <div className="flex items-center">
        {isPaused ? (
          <button onClick={() => playTrack(currentTrack.uri)}>
            <FaPlayCircle />
          </button>
        ) : (
          <button onClick={() => pause()}>
            <FaPauseCircle />
          </button>
        )}
      </div>
    </div>
  );
}
