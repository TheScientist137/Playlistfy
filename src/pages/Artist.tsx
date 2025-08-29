import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useStore } from "../stores/useStore";

export default function Artist() {
  const { id } = useParams();
  const { artist, artistAlbums, fetchArtist, fetchArtistAlbums } = useStore();

  useEffect(() => {
    if (!id) return;
    fetchArtist(id);
    fetchArtistAlbums(id);
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <img src={artist?.images[0].url} />
      <p>{artist?.name}</p>
      <p>Albums</p>
      <ul className="overflow-auto">
        {artistAlbums?.items.map((album) => (
          <li key={album.id}>
            <Link to={`/album/${album.id}`}>{album.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
