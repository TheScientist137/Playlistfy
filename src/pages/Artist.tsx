import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useArtistStore } from "../stores/useArtistStore";
import { useUserStore } from "../stores/useUserStore";
import Loading from "../components/Loading";

export default function Artist() {
  const { id } = useParams();
  const {
    artist,
    artistAlbums,
    loadingArtist,
    loadingArtistAlbums,
    fetchArtist,
    fetchArtistAlbums,
  } = useArtistStore();
  const {
    followedArtistsMap,
    followArtistOrUser,
    unFollowArtistOrUser,
    checkUserFollowsArtistOrUser,
  } = useUserStore();

  useEffect(() => {
    if (!id) return;
    fetchArtist(id);
    fetchArtistAlbums(id);
    checkUserFollowsArtistOrUser("artist", [id]);
  }, []);

  const handleFollowArtist = async (artistId: string) => {
    const currentlyFollowed = followedArtistsMap[artistId];
    currentlyFollowed
      ? await unFollowArtistOrUser("artist", artistId)
      : await followArtistOrUser("artist", artistId);
  };

  if (!artist || !artistAlbums || loadingArtist || loadingArtistAlbums)
    return <Loading />;

  return (
    <div className="h-full flex flex-col justify-between gap-4">
      <img className="m-auto" src={artist.images?.[0]?.url} />

      <div className="flex gap-4 items-center">
        <p>{artist.name}</p>

        <button
          onClick={() => handleFollowArtist(artist.id)}
          className="border rounded-xl px-3 py-1 border-stone-400 border-2 cursor-pointer"
        >
          {followedArtistsMap[artist.id] ? "unfollow" : "follow"}
        </button>
      </div>

      <p>Albums</p>
      <ul className="overflow-auto flex flex-col gap-4">
        {artistAlbums.items.map((album) => (
          <li key={album.id}>
            <Link to={`/album/${album.id}`} className="flex items-center gap-4">
              <img src={album.images[0].url} className="size-16" />
              <div className="flex flex-col">
                <span>{album.name}</span>
                <span className="text-stone-400">
                  {album.release_date_precision === "year"
                    ? album.release_date
                    : album.release_date.slice(0, 4)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
