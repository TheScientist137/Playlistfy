import type { SpotifyTrack } from "../types/spotify";

interface Props {
  tracks: SpotifyTrack[] | null;
}

export default function Tracklist({ tracks }: Props) {
  return (
    <ul>
      {tracks?.map((track) => (
        <li>
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
          />
          <p>{track.name}</p>
          <p>Artist: {track.artists[0]?.name}</p>
        </li>
      ))}
    </ul>
  )
}