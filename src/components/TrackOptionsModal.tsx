import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTrackStore } from "../stores/useTrackStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import { IoMdClose } from "react-icons/io";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { RiAlbumLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import type { TrackType, TrackContext } from "../types/spotify";

interface Props {
  track: TrackType;
  context: TrackContext;
  ownPlaylist?: boolean;
  playlistId?: boolean;
  onRemove: () => void;
  onSave: () => void;
  onAddToPlaylist: () => void;
  onClose: () => void;
}

export default function TrackOptionsModal({
  track,
  context,
  ownPlaylist,
  onSave,
  onRemove,
  onAddToPlaylist,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { savedTracksMap } = useTrackStore();

  // Effect to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickOutside =
        modalRef.current && !modalRef.current.contains(event.target as Node);
      if (clickOutside) onClose();
    };

    // Mount event handler
    document.addEventListener("mousedown", handleClickOutside);
    // Unmount event handler
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-stone-900 text-white rounded-lg p-6 w-60"
      >
        <div className="flex justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">{track.name}</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white cursor-pointer"
          >
            <IoMdClose className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 items-start">
          {/* Save - Follow Options */}
          <button
            onClick={() => onSave()}
            className="flex items-center gap-2 cursor-pointer"
          >
            {savedTracksMap[track.id] ? (
              <FiMinusCircle className="text-green-500 size-5" />
            ) : (
              <FiPlusCircle className="size-5" />
            )}
            <span>{savedTracksMap[track.id] ? "Unsave" : "Save"}</span>
          </button>

          {/* Playlist Options */}
          {ownPlaylist ? (
            <>
              <button
                onClick={() => onAddToPlaylist()}
                className="cursor-pointer flex items-center gap-2"
              >
                <FiPlusCircle className="size-5" />
                <span>Add to another Playlist</span>
              </button>
              <button
                onClick={() => onRemove()}
                className="cursor-pointer flex items-center gap-2"
              >
                <FiMinusCircle className="size-5" />
                <span>Remove from Playlist</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddToPlaylist()}
              className="cursor-pointer flex items-center gap-2"
            >
              <FiPlusCircle className="size-5" />
              <span>Add to Playlist</span>
            </button>
          )}

          {/* Navigate Options */}
          {context !== "album" && (
            <button
              onClick={() => navigate(`/album/${track.album.id}`)}
              className="cursor-pointer flex items-center gap-2"
            >
              <RiAlbumLine className="size-5" />
              <span>Go to Album</span>
            </button>
          )}

          {context !== "artist" && (
            <button
              onClick={() => navigate(`/artist/${track.artists[0].id}`)}
              className="cursor-pointer flex items-center gap-2"
            >
              <HiOutlineUser className="size-5" />
              <span>Go to Artist</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
