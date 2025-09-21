import { useEffect } from "react";
import { useParams } from "react-router";
import { useAlbumStore } from "../stores/useAlbumStore";
import Track from "../components/Track";
import Loading from "../components/Loading";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

export default function Album() {
  const { id } = useParams();
  const {
    album,
    savedAlbumsMap,
    loadingAlbum,
    fetchAlbum,
    saveAlbums,
    removeSavedAlbums,
    checkSavedAlbums,
  } = useAlbumStore();

  useEffect(() => {
    if (!id) return;
    fetchAlbum(id);
    checkSavedAlbums([id]);
  }, []);

  const handleSaveAlbum = async (albumId: string) => {
    const currentlySaved = savedAlbumsMap[albumId];
    currentlySaved
      ? await removeSavedAlbums(albumId)
      : await saveAlbums(albumId);
  };

  if (loadingAlbum || !album) return <Loading />;

  return (
    <div className="h-full flex flex-col gap-4">
      <img src={album.images[0]?.url} alt={album.name} className="" />

      <div className="flex gap-4">
        <p>{album.artists[0].name}</p>
        <p className="">{album.name}</p>
        <button
          onClick={() => handleSaveAlbum(album.id)}
          className="cursor-pointer"
        >
          {savedAlbumsMap[album.id] ? (
            <FiMinusCircle className="size-5 text-green-500" />
          ) : (
            <FiPlusCircle className="size-5" />
          )}
        </button>
      </div>

      <ul className="overflow-auto flex flex-col gap-6">
        {album.tracks.items.map((track) => (
          <li key={track.id}>
            <Track track={track} context="album" />
          </li>
        ))}
      </ul>
    </div>
  );
}
