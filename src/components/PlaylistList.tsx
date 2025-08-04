import { useState, useEffect } from "react";
import { getCurrentUserPlaylists } from "../services/spotifyApi.ts";
import type { SpotifyPlaylistList } from "../types/spotify.ts";

export default function PlaylistList({ token }) {
  const [playlistList, setPlaylistList] = useState<SpotifyPlaylistList>({});
  const [showPlaylistList, setShowPlaylistList] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getCurrentUserPlaylists(token);
        setPlaylistList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylists();
  }, [token]);

  return (
    <div>
      <button onClick={() => setShowPlaylistList(!showPlaylistList)}>
        Playlists
      </button>

      {showPlaylistList && (
        <div>
          {playlistList.items &&
            playlistList.items.map((item) => <p key={item.id}>{item.name}</p>)}
        </div>
      )}
    </div>
  );
}
